# Backend API Requests — TruthLens Frontend → Backend

**To:** Gaurav Singh (Backend)
**From:** Ankita Sinha (Frontend)
**Re:** What the React app needs from the FastAPI backend (v2.2.0 → v2.3.0)

The React app (`src/lib/api.ts`) calls every endpoint in the v2.2.0 API doc. Several screens still run on **client-side simulation only**, because there's no backend endpoint for them yet. Below are (A) fixes to existing endpoints and (B) new endpoints, in priority order.

---

## A. Changes to existing endpoints

### A1. Publish response schemas (P0 — blocking)
The API doc only describes **request** payloads. The frontend currently *guesses* response field names and falls back to defaults if they're missing. Please add Pydantic `response_model`s so `/openapi.json` shows the exact shapes. The frontend currently expects these fields:

| Endpoint | Fields the frontend reads |
|---|---|
| `GET /health` | `status`, `version`, `services.{redis, postgres, qdrant, edge_workers}` |
| `GET /api/info` | `name`, `version`, `leverage_points[] {id, stage, title, mechanism}`, `supported_modalities[]`, `architecture` |
| `POST /api/detect` | `verdict` (`REAL` \| `AI_GENERATED` \| `MANIPULATED`), `confidence` (0–100), `manipulation_score` (0–100), `dhash`, `sha256`, `ela_heatmap_base64` (PNG), `ela_mean_error`, `ela_peak_zones[]`, `notes[]` |
| `POST /api/detect/watermark` | `synthid_detected`, `synthid_confidence` (0–1), `c2pa_present`, `c2pa_issuer`, `iptc_ai_flag`, `iptc_digital_source_type`, `summary` |
| `POST /api/detect/audio` | `verdict` (`HUMAN_VOICE` \| `SYNTHETIC_CLONE` \| `SUSPICIOUS_VOCODER`), `confidence`, `vocoder_shelf_khz`, `cutoff_detected`, `glottal_kurtosis`, `glottal_skewness`, `crest_factor_db`, `waveform[]`, **`spectrum_bins[] {freqKhz, magnitudeDb}`** *(new — needed for the FFT chart)*, `explanation` |
| `POST /api/vault/register` | `id`, `sha256`, `dhash`, `registered_at` |
| `POST /api/vault/verify` | `match_found`, `query_dhash`, `query_sha256`, `hamming_distance`, `matched_record {id, owner_id, title, sha256, dhash, registered_at}` |
| `POST /api/amplify/pre-share-check` | `check_id`, `friction_triggered`, `cooling_delay_seconds`, `risk_level` (`LOW` \| `ELEVATED` \| `CRITICAL_VIRAL`), `velocity_score`, `projected_24h_reach`, `warning_headline`, `warning_body` |
| `GET /api/amplify/telemetry` | `total_interventions`, `abandoned_count`, `shared_anyway_count`, `abandonment_rate` (%), `dampening_factor`, `avg_pause_seconds` |
| `POST /api/simulate` | `r0_unmitigated`, `r0_dampened`, `peak_unmitigated`, `peak_dampened`, `harm_prevented_pct`, `curve[] {hour, unmitigated_reach, dampened_reach, active_sharers_unmitigated, active_sharers_dampened}` |
| `POST /api/debunk/sticker-card` | `sticker_png_base64`, `counter_narrative` (EN), **`counter_narrative_hi`** *(new)*, `dhash` |
| `POST /api/legal/evidence-dossier` | `case_reference`, `sha256`, `dhash`, `generated_at`, `section_63_bsa_certificate`, `cyber_cell_complaint`, `section_67c_preservation_notice` |
| `POST /api/takedown/generate` | `notice_id`, `platform`, `deadline_iso`, `legal_basis`, `notice_text` |

If your current field names differ, either rename them or send me the actual schema and I'll update the mapping in `api.ts`.

### A2. Takedown JSON body (P0)
The doc says "victim details, infringing URL". The frontend sends:
```json
{ "victim_name": "", "victim_email": "", "platform": "", "infringing_url": "", "description": "", "sha256": "" }
```
Please confirm or correct these field names.

### A3. CORS (P0)
Add `CORSMiddleware` allowing the frontend origins: `http://localhost:5173`, plus the production domain once it's deployed. (Local dev uses a Vite proxy, so this matters for the deployed build.)

### A4. HTTPS (P1)
If the frontend is deployed over HTTPS (Firebase Hosting / Cloud Run), browsers will block calls to `http://100.70.108.107:8000` as mixed content. We need an HTTPS endpoint, e.g. Cloud Run, or Tailscale Funnel / a reverse proxy with TLS.

### A5. Consistent error format (P1)
Return errors as `{ "error": { "code": "STRING", "message": "human readable" } }` with correct HTTP status codes (400 bad input, 413 file too large, 415 unsupported type, 503 dependency down). Also please document the upload size limits.

---

## B. New endpoints needed

These are screens in the app that currently use **frontend-only simulated logic**. They're listed by pitch impact.

### B1. `POST /api/detect/liveness` — KYC / video-call liveness (P0)
**Used by:** Fintech KYC, Gig driver re-verification, Remote interview verification.
**Request:** multipart `file` (short video clip, or a burst of 3–5 frames) + optional `reference_dhash` (from the vault).
**Response:**
```json
{
  "verdict": "LIVE | SPOOF | INJECTED",
  "confidence": 0.0,
  "virtual_camera_detected": false,
  "face_swap_score": 0.0,
  "micro_saccade_ok": true,
  "sensor_noise_consistent": true,
  "identity_hamming_distance": 0,
  "reasons": ["..."]
}
```

### B2. `POST /api/detect/video` — video deepfake detection (P0)
**Used by:** Newsroom UGC verification, election clips, insurance claim videos.
**Request:** multipart `file` (`.mp4` / `.webm`, ≤ 50 MB).
**Response:** `verdict`, `confidence`, `frames_analyzed`, `suspicious_frames[] {t_sec, score, reason}`, `av_sync_drift_ms`, `audio` (same shape as `/api/detect/audio`), `dhash_keyframes[]`.

### B3. `POST /api/coach/chat` — Gemini crisis coach (P0)
**Used by:** the Heal & Legal → Crisis Coach screen. **Right now it returns hard-coded replies.**
**Request:**
```json
{ "session_id": "", "language": "en | hi", "message": "", "history": [{ "role": "user | coach", "text": "" }] }
```
**Response:** `{ "reply": "", "suggested_actions": ["open_dossier", "open_takedown", "call_1930"], "risk_flag": "NONE | SELF_HARM | IMMINENT_DANGER" }`
**Note:** if `risk_flag` ≠ `NONE`, the frontend will show helplines prominently. Please use Gemini safety settings plus a trauma-informed system prompt.
*Optional:* `WS /api/coach/live` for Gemini Live voice streaming.

### B4. `GET /api/vault/items` — list vault records (P1)
**Used by:** the Origin Vault registry table, which currently only shows items registered in the current browser session.
**Query:** `owner_id` (optional), `limit`, `offset`.
**Response:** `{ "items": [{ "id", "owner_id", "title", "sha256", "dhash", "registered_at" }], "total": 0 }`

### B5. `POST /api/wellbeing/exposure-check` — outrage-bait streak guardrail (P1)
**Used by:** the Virality & Wellbeing → Outrage-Bait Throttling panel.
**Request:** `{ "user_id": "", "recent_items": [{ "media_hash": "", "manipulation_score": 0, "arousal_score": 0, "ts": "" }] }`
**Response:** `{ "streak": 0, "cooldown_triggered": false, "cooldown_minutes": 15, "action": "NONE | CONTEXT_OVERLAY | PAUSE_AUTOPLAY" }`

### B6. `POST /api/amplify/coordination-score` — bot / astroturfing suppression (P1)
**Used by:** the Coordinated Bot & Astroturfing panel.
**Request:** `{ "media_hash": "", "forgery_score": 0, "accounts": [{ "account_id": "", "verified": false, "age_days": 0, "posts_last_hour": 0 }] }`
**Response:** `{ "coordination_risk": 0, "cluster_size": 0, "action": "ALLOW_WITH_LABEL | THROTTLE_WITH_CONTEXT | DOWNRANK_QUARANTINE", "reasons": [] }`

### B7. `POST /api/demo/nano-banana` — safe demo fake generation (P2)
**Used by:** the Nano Banana preset buttons, which currently draw placeholder images on canvas.
**Request:** `{ "preset": "kyc-faceswap | election-deepfake | damage-claim | authentic-portrait" }`
**Response:** `{ "image_base64": "", "is_synthetic": true, "synthid_embedded": true }`

### B8. `POST /api/detect/url` — analyze by link (P1)
**Used by:** the Edge Forensics "Or paste an image link" box (deck slide 4: *"Upload image/link"*). Browsers can't download most third-party images because of CORS, so the server needs to fetch them.
**Request:** `{ "url": "https://..." }`
**Response:** same shape as `POST /api/detect`, plus `source_url` and `content_type`.
**Note:** block private IPs and `file://` URLs (SSRF protection), and cap the download size.

### B9. Multi-language support (P2)
The deck promises **Hindi + 8 Indian languages**. The frontend has EN and HI today. Please accept `language` (ISO code: `en`, `hi`, `bn`, `ta`, `te`, `mr`, `gu`, `kn`, `ml`) on `/api/coach/chat`, `/api/debunk/sticker-card` (returns `counter_narrative` in that language) and `/api/amplify/pre-share-check` (returns `warning_headline` and `warning_body` in that language).

### B10. `POST /api/simulate` — add `seed_sharers` (P2)
The deck says the simulator *"shows 24h harm if 100 people share"*. Please accept an optional `seed_sharers` (default `100`) in the request body. The frontend now sends it.

---

## Summary checklist

- [ ] A1 Response schemas in `/openapi.json`
- [ ] A2 Confirm takedown JSON field names
- [ ] A3 CORS middleware
- [ ] A4 HTTPS endpoint for the deployed frontend
- [ ] A5 Standard error format + upload limits
- [ ] B1 `POST /api/detect/liveness`
- [ ] B2 `POST /api/detect/video`
- [ ] B3 `POST /api/coach/chat` (+ optional `WS /api/coach/live`)
- [ ] B4 `GET /api/vault/items`
- [ ] B5 `POST /api/wellbeing/exposure-check`
- [ ] B6 `POST /api/amplify/coordination-score`
- [ ] B7 `POST /api/demo/nano-banana`
- [ ] B8 `POST /api/detect/url`
- [ ] B9 `language` param (Hindi + 8 Indian languages)
- [ ] B10 `seed_sharers` on `/api/simulate`

Once any of these ship, ping me with the Swagger link and I'll wire them into `src/lib/api.ts`. Every call already falls back to the Edge Demo engine, so nothing in the UI will break while these are in progress.
