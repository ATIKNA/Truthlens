# TruthLens — Break the Deepfake Loop

> **Systems Thinking + Google Gemini AI to stop deepfake virality, protect mental health, and restore institutional trust.**
>
> Built for **Google AI Startup Buildathon 2026 (India • Hypothetica)** by **Gaurav Singh (Jaipur)** & **Ankita Sinha (Bengaluru - Remote)**.

---

## Why TruthLens?

Deepfakes do not fail because of a missing classifier — they ride **three reinforcing feedback loops** where damage goes viral in **2 hours** while manual takedowns take **2 days**:

1. **Virality Loop:** AI Tool → Shocking Fake → Algorithm Boosts → More Shares
2. **Mental Health Loop:** Victim Sees Fake → Anxiety / Shame → Withdrawal → Deeper Harm
3. **Trust Collapse Loop:** No One Trusts Media → Real Victims Ignored → Society Divides

Guided by **Donella Meadows' Leverage Points**, TruthLens intervenes across the entire causal graph (`Creator → Platform → Sharers → Victim`) rather than playing detection whack-a-mole:

| Leverage Point | Stage | Mechanism |
| --- | --- | --- |
| **L0 — Edge Forensics** | Pre-Broadcast / Zero Cloud Cost | Error Level Analysis (ELA) heatmap, 64-bit dHash, Google SynthID, C2PA, IPTC AI metadata, and SciPy 11.2 kHz FFT voice vocoder shelf + glottal pulse kurtosis. |
| **L1 — At Creation** | Protect Originals | **Origin Derivative Vault** (Qdrant Vector DB `truthlens_vault`) seals SHA-256 + 64-bit dHash before media is faked, matching cropped/re-encoded derivatives within Hamming distance `≤ 10`. |
| **L2 — At Amplification** | Dampen Virality & Outrage | **15-second Cognitive Cooling** WhatsApp pre-share friction, Donella Meadows 24h stock-and-flow virality simulator, outrage-bait exposure streak guardrails, and coordinated bot/astroturfing downranking. |
| **L3 — At Victim** | Heal, Debunk & Enforce | **Gemini Live Crisis Coach** (English & हिंदी), 512×512 WhatsApp warning sticker cards, court-ready **Section 63 BSA 2023** dossier + **Section 67C IT Act / Sec 94 BNSS** CGNAT preservation notice, and **Rule 3(2)(b) IT Rules 2021** 24-hour intermediary takedowns. |

---

## 6 High-Impact Deployment Domains

TruthLens operates at the intersection of real-time synthetic media forensics, identity liveness, and algorithmic content hygiene across six verticals:

1. **Fintech, Banking & Remote KYC Onboarding** — Synthetic identity & virtual-camera injection defense during passive liveness checks; real-time voice-clone & video impersonation gating for high-value wire transfers, SIM swaps, and account recovery.
2. **Social Media, Messaging & Consumer Wellbeing** — Pre-share deepfake labeling (malicious impersonation vs. benign AI creative edits), outrage-bait streak cool-downs, and coordinated bot/astroturfing suppression.
3. **Enterprise Security & Remote Hiring** — Live video-conferencing Executive Impersonation Protection (BEC 2.0 on Zoom/Meet/Teams) and remote interview proxy-candidate face-swap/prompting verification.
4. **Journalism, Newsrooms & Civic Integrity** — Sub-2-second breaking-news UGC provenance verification (ELA + C2PA + SynthID) and election/public-figure speech defense.
5. **E-Commerce, Insurance & Gig Marketplaces** — Fraudulent delivery/insurance damage claim tamper detection and low-friction driver/seller Qdrant perceptual identity re-verification.
6. **Legal, Compliance & Digital Forensics** — Auditable evidentiary chain-of-custody validation, Section 63 BSA 2023 certification, Section 67C / Section 94 BNSS telecom preservation, and 24-hour Rule 3(2)(b) takedowns.

---

## Powered by Google AI

- **Gemini API Multimodal:** Artifact, lighting azimuth, face-blend boundary, and metadata mismatch reasoning.
- **Nano Banana:** Generates safe, zero-PII demo fakes to train users and simulate viral spread.
- **Gemini Live:** Bilingual Hindi/English voice crisis companion that guides victims out of panic.
- **Gemma On-Device:** Private, zero-cloud local forensic verification where photos never leave the user's device.
- **Google Cloud (`asia-south1` DPDP Compliant):** Cloud Run, Vertex AI, Firestore, and BigQuery.

---

## TruthLens API Reference (v2.2.0)

Default backend base URL: `http://100.70.108.107:8000` (configurable inside the app's **API & Gateway** tab, with automatic **Edge Demo Fallback** so every module works offline/on-stage with real client-side ELA, SHA-256, 64-bit dHash, and simulation math).

| Category | Method | Endpoint |
| --- | --- | --- |
| System & PWA | `GET` | `/demo`, `/download/truthlens.apk`, `/manifest.json`, `/sw.js`, `/health`, `/api/info` |
| Edge Forensics | `POST` | `/api/detect`, `/api/detect/watermark`, `/api/detect/audio` |
| Origin Vault (Qdrant) | `POST` | `/api/vault/register`, `/api/vault/verify` |
| Virality & Cooling | `POST` / `GET` | `/api/amplify/pre-share-check`, `/api/amplify/log-decision`, `/api/amplify/telemetry`, `/api/simulate` |
| Debunk & Legal | `POST` | `/api/debunk/sticker-card`, `/api/legal/evidence-dossier`, `/api/takedown/generate` |

**Connected Gateways:**

- Swagger UI: `http://100.70.108.107:8000/docs`
- OpenWA Gateway: `http://100.70.108.107:2785`
- Mixpost Hub: `http://100.70.108.107:9000/mixpost`
- Qdrant Vector DB: `http://100.70.108.107:6333`

---

## Quick Start

### Prerequisites

- Node.js 20+ and npm

### Install & Run Locally

```bash
npm install
npm run dev
```

Open **<http://localhost:5173>** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```text
├── public/
│   ├── manifest.json          # Standalone PWA manifest
│   └── sw.js                  # Offline shell Service Worker
├── src/
│   ├── components/
│   │   ├── OverviewView.tsx   # Systems Map, 3 Loops, Causal Graph & Health
│   │   ├── ForensicsView.tsx  # ELA Split Viewer, SynthID/C2PA & 11.2 kHz Audio FFT
│   │   ├── VaultView.tsx      # Qdrant Origin Vault & 64-bit Hamming Matrix
│   │   ├── DampenView.tsx     # 15s Cognitive Cooling, 24h Simulator & Wellbeing
│   │   ├── HealLegalView.tsx  # Crisis Coach, WhatsApp Sticker, BSA 63 & Rule 3(2)(b)
│   │   ├── SolutionsView.tsx  # 6 Industry Verticals & Live Policy Gate Simulators
│   │   └── SystemApiView.tsx  # Live 16-Endpoint API Probe Console & Gateways
│   ├── lib/
│   │   ├── api.ts             # TruthLens v2.2.0 Client (Live API + Edge Fallback)
│   │   ├── forensics.ts       # Client-side ELA, dHash, SHA-256, Sticker & Legal Engine
│   │   └── i18n.ts            # English & Hindi (हिंदी) localization
│   ├── types/truthlens.ts     # Strict TypeScript domain & API contracts
│   ├── App.tsx                # Responsive Sidebar + Mobile Material 3 Shell
│   └── main.tsx               # App entry & Service Worker registration
└── package.json
```

---

## Team

- **Gaurav Singh** (Jaipur) — `acad.grv97@gmail.com`
- **Ankita Sinha** (Bengaluru - Remote)
