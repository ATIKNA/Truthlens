import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Gavel,
  HeartHandshake,
  PhoneCall,
  Send,
  ShieldAlert,
  Sparkles,
  Sticker,
  Volume2,
  Wind,
} from 'lucide-react';
import type {
  DebunkStickerResult,
  EvidenceDossierResult,
  Language,
  SharedMediaContext,
  TakedownNoticeResult,
} from '../types/truthlens';
import type { TruthLensClient } from '../lib/api';
import { t } from '../lib/i18n';

interface HealLegalViewProps {
  client: TruthLensClient;
  lang: Language;
  sharedMedia: SharedMediaContext;
  initialSubTab?: HealSubTab;
}

type HealSubTab = 'coach' | 'debunk' | 'dossier' | 'takedown';

interface CoachMessage {
  role: 'coach' | 'user';
  text: string;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const HealLegalView: React.FC<HealLegalViewProps> = ({
  client,
  lang,
  sharedMedia,
  initialSubTab = 'coach',
}) => {
  const tr = t(lang);
  const [activeTab, setActiveTab] = useState<HealSubTab>(initialSubTab);

  // Crisis Coach state
  const [messages, setMessages] = useState<CoachMessage[]>([
    { role: 'coach', text: tr.crisisWelcome },
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [breathingActive, setBreathingActive] = useState(false);

  // Debunk Sticker state
  const [stickerLoading, setStickerLoading] = useState(false);
  const [stickerResult, setStickerResult] = useState<DebunkStickerResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Legal Evidence Dossier state
  const [victimName, setVictimName] = useState('Ankita Sinha');
  const [suspectIdentifier, setSuspectIdentifier] = useState('+91-98XXXXXX42 / @fake_viral_handle');
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossier, setDossier] = useState<EvidenceDossierResult | null>(null);
  const [dossierDocTab, setDossierDocTab] = useState<'bsa63' | 'cybercell' | 'sec67c'>('bsa63');

  // Takedown Notice state
  const [tdEmail, setTdEmail] = useState('ankita.sinha@example.in');
  const [tdPlatform, setTdPlatform] = useState('WhatsApp / Meta India');
  const [tdUrl, setTdUrl] = useState('https://instagram.com/p/C9xFakeMorphedClipDemo');
  const [tdDesc, setTdDesc] = useState(
    'Non-consensual AI face-swapped / morphed image circulated in groups causing severe reputational and mental distress.'
  );
  const [tdLoading, setTdLoading] = useState(false);
  const [takedown, setTakedown] = useState<TakedownNoticeResult | null>(null);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const speakCoachReply = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utter.rate = 0.94;
    window.speechSynthesis.speak(utter);
  };

  const sendCoachMessage = (promptText?: string) => {
    const text = (promptText ?? coachInput).trim();
    if (!text) return;
    setCoachInput('');

    let reply: string;
    const lower = text.toLowerCase();
    if (lang === 'hi') {
      if (lower.includes('शांत') || lower.includes('घबरा')) {
        reply =
          'आप बिल्कुल अकेले नहीं हैं। मेरे साथ 4 सेकंड सांस अंदर लें, 4 सेकंड रोकें, और 6 सेकंड धीरे बाहर छोड़ें। इसके बाद हम "Debunk Sticker" और "BSA 63 Dossier" टैब से तुरंत क़ानूनी सबूत सुरक्षित कर लेंगे।';
      } else {
        reply =
          'यह आपकी गलती नहीं है। 3 तुरंत कदम उठाएं: (1) स्क्रीनशॉट या मीडिया सुरक्षित रखें — डिलीट न करें; (2) TruthLens से Section 63 BSA प्रमाणपत्र और Rule 3(2)(b) 24-घंटे का टेकडाउन नोटिस बनाएं; (3) राष्ट्रीय साइबर हेल्पलाइन 1930 या cybercrime.gov.in पर तुरंत दर्ज करें।';
      }
    } else {
      if (lower.includes('calm') || lower.includes('panic')) {
        reply =
          'Pause everything for 15 seconds. Drop your shoulders and follow the breathing ring beside me: inhale 4s, hold 4s, exhale 6s. Your reputation is not defined by a synthetic file — we have cryptographic proof and statutory 24-hour Indian takedown law on your side.';
      } else if (lower.includes('cyber') || lower.includes('complaint') || lower.includes('file')) {
        reply =
          'Here is your fastest action path: (1) Open the "BSA 63 Dossier" tab to seal the SHA-256 hash and generate your Cyber Cell complaint + Sec 67C CGNAT preservation notice; (2) Call 1930 or file on cybercrime.gov.in; (3) Send the Rule 3(2)(b) 24-hour removal notice to the platform Grievance Officer.';
      } else {
        reply =
          'First, this is NOT your fault. Do not engage or pay extortion demands. Keep the original file/URL intact, generate a high-contrast WhatsApp Debunk Sticker to stop group rumors immediately, and build your court-ready BSA 2023 Section 63 dossier in one click.';
      }
    }

    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'coach', text: reply }]);
  };

  const handleGenerateSticker = async () => {
    setStickerLoading(true);
    try {
      const res = await client.generateDebunkSticker(sharedMedia.file, sharedMedia.dhash);
      setStickerResult(res);
    } finally {
      setStickerLoading(false);
    }
  };

  const handleGenerateDossier = async () => {
    setDossierLoading(true);
    try {
      const res = await client.generateEvidenceDossier({
        file: sharedMedia.file,
        victimName,
        suspectIdentifier,
        dhash: sharedMedia.dhash,
        sha256: sharedMedia.sha256,
      });
      setDossier(res);
    } finally {
      setDossierLoading(false);
    }
  };

  const handleGenerateTakedown = async () => {
    setTdLoading(true);
    try {
      const res = await client.generateTakedown({
        victimName,
        victimEmail: tdEmail,
        platform: tdPlatform,
        infringingUrl: tdUrl,
        description: tdDesc,
        sha256: sharedMedia.sha256,
      });
      setTakedown(res);
    } finally {
      setTdLoading(false);
    }
  };

  const activeDossierText = dossier
    ? dossierDocTab === 'bsa63'
      ? dossier.section_63_bsa_certificate
      : dossierDocTab === 'cybercell'
        ? dossier.cyber_cell_complaint
        : dossier.section_67c_preservation_notice
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
            <HeartHandshake className="h-4 w-4" />
            L3 — At Victim • Mental Health Balancing Loop, Grassroots Debunk &amp; Court-Ready Law
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Heal, Debunk in Groups &amp; Enforce 24-Hour Indian Legal Takedowns
          </h2>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#0b1229] p-1">
          {[
            { id: 'coach' as HealSubTab, label: 'Gemini Crisis Coach', icon: HeartHandshake },
            { id: 'debunk' as HealSubTab, label: 'WhatsApp Sticker', icon: Sticker },
            { id: 'dossier' as HealSubTab, label: 'BSA 63 Dossier', icon: FileText },
            { id: 'takedown' as HealSubTab, label: '24h Takedown', icon: Gavel },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#10D4A2] text-[#050919]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: GEMINI LIVE CRISIS COACH */}
      {activeTab === 'coach' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-7 flex flex-col justify-between min-h-[440px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="font-display text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#10D4A2]" />
                    Gemini Live Crisis Companion ({lang === 'hi' ? 'हिंदी' : 'English'})
                  </div>
                  <div className="text-xs text-slate-400">
                    Trauma-informed voice &amp; text companion to break the Anxiety/Shame loop
                  </div>
                </div>
                <button
                  onClick={() => speakCoachReply(messages[messages.length - 1]?.text ?? tr.crisisWelcome)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#10D4A2]/30 bg-[#10D4A2]/10 px-3 py-1.5 text-xs font-semibold text-[#10D4A2] hover:bg-[#10D4A2]/20 cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Speak Aloud
                </button>
              </div>

              <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-3 text-xs leading-relaxed ${
                      m.role === 'coach'
                        ? 'border border-[#10D4A2]/25 bg-[#10D4A2]/[0.07] text-slate-100'
                        : 'ml-8 border border-white/10 bg-white/5 text-slate-200'
                    }`}
                  >
                    <div className="mb-1 font-mono text-[10px] uppercase text-slate-400">
                      {m.role === 'coach' ? 'TruthLens Crisis Coach' : 'You'}
                    </div>
                    {m.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {tr.crisisPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendCoachMessage(p)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 hover:border-[#10D4A2]/50 hover:text-white cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendCoachMessage()}
                  placeholder={
                    lang === 'hi'
                      ? 'अपनी बात लिखें — हम साथ मिलकर हल निकालेंगे...'
                      : 'Type what happened — we will walk through it calmly...'
                  }
                  className="flex-1 rounded-xl border border-white/10 bg-[#050919] px-3.5 py-2.5 text-xs text-white"
                />
                <button
                  onClick={() => sendCoachMessage()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#10D4A2] px-4 py-2.5 text-xs font-bold text-[#050919] hover:bg-[#00e8ac] cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Grounding Breathing Ring + Verified India Helplines */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-[#10D4A2]/25 bg-[#0b1229]/90 p-5 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10D4A2]">
                <Wind className="h-4 w-4" />
                Guided 4-4-6 Grounding Breath
              </div>
              <div className="my-5 flex justify-center">
                <div
                  className={`flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#10D4A2]/60 bg-[#10D4A2]/10 ${
                    breathingActive ? 'animate-breathe' : ''
                  }`}
                >
                  <span className="font-display text-xs font-bold text-[#10D4A2]">
                    {breathingActive ? 'Breathe Slowly' : 'Tap to Calm'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setBreathingActive((b) => !b)}
                className="rounded-xl border border-[#10D4A2]/40 bg-[#10D4A2]/15 px-4 py-2 text-xs font-semibold text-[#10D4A2] hover:bg-[#10D4A2]/25 cursor-pointer"
              >
                {breathingActive ? 'Pause Breathing Guide' : 'Start 60s Calm Breathing'}
              </button>
            </div>

            <div className="rounded-2xl border border-rose-500/25 bg-rose-950/20 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300">
                  <PhoneCall className="h-4 w-4" />
                  National Cyber Crime Reporting &amp; Crisis Helplines
                </div>
                <span className="text-[10px] font-mono text-[#10D4A2] bg-[#10D4A2]/10 px-2 py-0.5 rounded-full border border-[#10D4A2]/30">
                  24x7 Active
                </span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: 'National Cyber Crime Helpline',
                    detail: 'Dial 1930',
                    actionLabel: 'Call 1930',
                    href: 'tel:1930',
                    desc: 'Direct call to Indian National Cyber Crime coordinator (immediate bank freeze & emergency IO dispatch)',
                    color: 'border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
                  },
                  {
                    name: 'NCRP Cyber Crime Portal',
                    detail: 'cybercrime.gov.in',
                    actionLabel: 'Open NCRP Portal',
                    href: 'https://cybercrime.gov.in',
                    desc: 'Ministry of Home Affairs official portal for women/child non-consensual deepfake complaints',
                    color: 'border-[#10D4A2]/40 bg-[#10D4A2]/10 text-[#10D4A2] hover:bg-[#10D4A2]/20',
                  },
                  {
                    name: 'Tele-MANAS Mental Health',
                    detail: 'Dial 14416',
                    actionLabel: 'Call 14416',
                    href: 'tel:14416',
                    desc: 'Free 24x7 trauma counselors across Hindi, English, and 20 Indian languages',
                    color: 'border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20',
                  },
                  {
                    name: 'iCall Psychosocial Helpline',
                    detail: '9152987821',
                    actionLabel: 'Call Helpline',
                    href: 'tel:9152987821',
                    desc: 'Tata Institute of Social Sciences (TISS) trauma counseling for online harassment victims',
                    color: 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
                  },
                ].map((h) => (
                  <div
                    key={h.name}
                    className="rounded-xl border border-white/10 bg-[#050919]/90 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{h.name}</span>
                      <a
                        href={h.href}
                        target={h.href.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition ${h.color}`}
                      >
                        {h.actionLabel}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="font-mono text-[11px] text-[#10D4A2]">{h.detail}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WHATSAPP DEBUNK STICKER CARD */}
      {activeTab === 'debunk' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">
                Grassroots WhatsApp Debunk Sticker
              </h3>
              <code className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#10D4A2]">
                POST /api/debunk/sticker-card
              </code>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Auto-generates a high-contrast 512×512 WhatsApp Warning Sticker PNG + bilingual
              1-tap counter-narrative text snippet so families and group admins can neutralize a
              viral deepfake inside the exact chat where it spread.
            </p>
            <div className="rounded-xl bg-[#050919] p-3 text-xs text-slate-300">
              Active Media:{' '}
              <span className="font-mono text-[#10D4A2]">
                {sharedMedia.filename || 'Default flagged viral demo frame'}
              </span>
            </div>
            <button
              onClick={handleGenerateSticker}
              disabled={stickerLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#10D4A2] px-4 py-3 text-sm font-bold text-[#050919] hover:bg-[#00e8ac] cursor-pointer"
            >
              <Sticker className="h-4 w-4" />
              {stickerLoading ? 'Rendering Warning Sticker...' : 'Generate High-Contrast Sticker Card'}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-7">
            {stickerResult ? (
              <div className="grid gap-5 sm:grid-cols-2 items-start">
                <div className="space-y-3">
                  <img
                    src={stickerResult.sticker_png_data_url}
                    alt="WhatsApp Debunk Warning Sticker"
                    className="w-full rounded-xl border border-white/15 shadow-xl"
                  />
                  <a
                    href={stickerResult.sticker_png_data_url}
                    download="truthlens-debunk-sticker.png"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#10D4A2]/40 bg-[#10D4A2]/15 px-3 py-2 text-xs font-semibold text-[#10D4A2] hover:bg-[#10D4A2]/25"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download 512×512 PNG Sticker
                  </a>
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/10 bg-[#050919] p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>English Counter-Narrative</span>
                      <button
                        onClick={() => copyText('en', stickerResult.counter_narrative_en)}
                        className="inline-flex items-center gap-1 text-[#10D4A2] cursor-pointer"
                      >
                        {copiedId === 'en' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === 'en' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {stickerResult.counter_narrative_en}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#050919] p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>हिंदी काउंटर-नैरेटिव (WhatsApp Ready)</span>
                      <button
                        onClick={() => copyText('hi', stickerResult.counter_narrative_hi)}
                        className="inline-flex items-center gap-1 text-[#10D4A2] cursor-pointer"
                      >
                        {copiedId === 'hi' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === 'hi' ? 'कॉपी हुआ' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {stickerResult.counter_narrative_hi}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-xs text-slate-400">
                <Sticker className="h-10 w-10 text-slate-600 mb-2" />
                Click <strong className="text-white">Generate High-Contrast Sticker Card</strong>{' '}
                to build a shareable WhatsApp warning sticker + counter-narrative.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COURT-READY LEGAL EVIDENCE DOSSIER */}
      {activeTab === 'dossier' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white">
                Court-Ready Evidence Kit
              </h3>
              <code className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-rose-300">
                /legal/evidence-dossier
              </code>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300">Victim / Complainant Full Name</label>
                <input
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#050919] px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300">Suspect Identifier (Phone / Handle / URL)</label>
                <input
                  value={suspectIdentifier}
                  onChange={(e) => setSuspectIdentifier(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#050919] px-3 py-2 text-white"
                />
              </div>
              <div className="rounded-xl bg-[#050919] p-3 font-mono text-[11px] text-slate-400 space-y-1">
                <div>Exhibit: {sharedMedia.filename || 'forensic_exhibit.png'}</div>
                <div>dHash: {sharedMedia.dhash || 'Auto-computed on generate'}</div>
                <div className="text-[#10D4A2] pt-1">Target Authority: Cyber Crime Police Station / NCRP</div>
              </div>
              
              <button
                onClick={handleGenerateDossier}
                disabled={dossierLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-600 transition shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4" />
                {dossierLoading ? 'Compiling 3 Statutory Docs...' : 'Generate Official Cyber Cell Complaint Kit'}
              </button>

              <div className="rounded-xl border border-sky-500/25 bg-sky-950/20 p-3 space-y-2">
                <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Direct Online Filing Portal
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  After generating the dossier below, copy or download the complaint and submit it directly to the official government portal:
                </p>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#10D4A2]/40 bg-[#10D4A2]/15 px-3 py-2 text-xs font-bold text-[#10D4A2] hover:bg-[#10D4A2]/25 transition"
                >
                  Go to cybercrime.gov.in (NCRP)
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-8 space-y-3">
            {dossier ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'bsa63' as const, label: 'Sec 63 BSA 2023 Cert' },
                      { id: 'cybercell' as const, label: 'Cyber Cell Complaint' },
                      { id: 'sec67c' as const, label: 'Sec 67C / Sec 94 BNSS CGNAT' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDossierDocTab(d.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                          dossierDocTab === d.id
                            ? 'bg-[#10D4A2] text-[#050919]'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyText('dossier', activeDossierText)}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 cursor-pointer"
                    >
                      {copiedId === 'dossier' ? <Check className="h-3.5 w-3.5 text-[#10D4A2]" /> : <Copy className="h-3.5 w-3.5" />}
                      Copy
                    </button>
                    <button
                      onClick={() =>
                        downloadTextFile(`${dossier.case_reference}-${dossierDocTab}.txt`, activeDossierText)
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-[#10D4A2]/15 px-2.5 py-1.5 text-xs font-semibold text-[#10D4A2] hover:bg-[#10D4A2]/25 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download .txt
                    </button>
                  </div>
                </div>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#050919] p-4 font-mono text-xs leading-relaxed text-slate-200">
                  {activeDossierText}
                </pre>
              </>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center text-center text-xs text-slate-400">
                <FileText className="h-10 w-10 text-slate-600 mb-2" />
                Generates court-admissible <strong className="text-white">Section 63 BSA 2023</strong>{' '}
                certificate, Cyber Cell complaint, and{' '}
                <strong className="text-white">Sec 67C IT Act / Sec 94 BNSS</strong> CGNAT &amp;
                Cell Tower preservation notice targeting Jamtara/Mewat syndicates.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: RULE 3(2)(b) 24-HOUR TAKEDOWN */}
      {activeTab === 'takedown' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white">
                Rule 3(2)(b) 24h Takedown Notice
              </h3>
              <code className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#10D4A2]">
                POST /api/takedown/generate
              </code>
            </div>

            <div>
              <label className="text-slate-300">Victim Name</label>
              <input
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#050919] px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300">Victim Contact Email</label>
              <input
                value={tdEmail}
                onChange={(e) => setTdEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#050919] px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300">Target Intermediary Platform</label>
              <select
                value={tdPlatform}
                onChange={(e) => setTdPlatform(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#050919] px-3 py-2 text-white"
              >
                <option>WhatsApp / Meta India</option>
                <option>Instagram / Meta India</option>
                <option>X (Twitter) India</option>
                <option>YouTube / Google India</option>
                <option>Telegram Messenger</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300">Infringing URL / Group / Handle</label>
              <input
                value={tdUrl}
                onChange={(e) => setTdUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#050919] px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300">Harm Description</label>
              <textarea
                rows={2}
                value={tdDesc}
                onChange={(e) => setTdDesc(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#050919] px-3 py-2 text-white"
              />
            </div>

            <button
              onClick={handleGenerateTakedown}
              disabled={tdLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#10D4A2] px-4 py-2.5 text-sm font-bold text-[#050919] hover:bg-[#00e8ac] cursor-pointer"
            >
              <Gavel className="h-4 w-4" />
              {tdLoading ? 'Drafting Statutory Notice...' : 'Generate 24-Hour Takedown Notice'}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-7 space-y-3">
            {takedown ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs text-[#10D4A2]">
                      {takedown.notice_id} • {takedown.legal_basis}
                    </div>
                    <div className="text-[11px] text-rose-300">
                      Mandatory 24h Removal Deadline: {new Date(takedown.deadline_iso).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyText('td', takedown.notice_text)}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 cursor-pointer"
                    >
                      {copiedId === 'td' ? <Check className="h-3.5 w-3.5 text-[#10D4A2]" /> : <Copy className="h-3.5 w-3.5" />}
                      Copy
                    </button>
                    <button
                      onClick={() => downloadTextFile(`${takedown.notice_id}.txt`, takedown.notice_text)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#10D4A2]/15 px-2.5 py-1.5 text-xs font-semibold text-[#10D4A2] cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#050919] p-4 font-mono text-xs leading-relaxed text-slate-200">
                  {takedown.notice_text}
                </pre>
              </>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center text-center text-xs text-slate-400">
                <Gavel className="h-10 w-10 text-slate-600 mb-2" />
                Generates formal <strong className="text-white">Rule 3(2)(b) IT Rules 2021</strong>{' '}
                24-hour removal notice citing Section 79 safe-harbor obligations for Indian Resident
                Grievance Officers.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
