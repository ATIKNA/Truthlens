import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Layers,
  Maximize2,
  Presentation,
  Sparkles,
} from 'lucide-react';
import type { Language, NavTab } from '../types/truthlens';

interface PitchDeckViewProps {
  lang: Language;
  onNavigate: (tab: NavTab) => void;
}

const SLIDES = [
  {
    id: 1,
    title: 'Break the Deepfake Loop',
    subtitle: 'Systems Thinking + Gemini AI to stop virality, protect mental health, and restore trust.',
    badge: 'Cover • Buildathon 2026',
    image: '/deck/slide1.png',
    keyPoints: [
      'Team: Gaurav Singh (Jaipur) & Ankita Sinha (Remote Mac) — acad.grv97@gmail.com',
      'Methodologies: Causal Inference (Erica) • Systems Dynamics (Schemo) • Gemini',
      'Theme: Buildathon 2026 • India • Hypothetica',
    ],
    actionTab: 'overview' as NavTab,
    actionLabel: 'Explore Systems Map',
  },
  {
    id: 2,
    title: 'The Problem is a System',
    subtitle: 'Deepfakes ride 3 reinforcing loops. Detection alone is too late.',
    badge: '3 Reinforcing Loops',
    image: '/deck/slide2.png',
    keyPoints: [
      'Virality Loop: AI Tool > Shocking Fake > Algorithm Boosts > More Shares',
      'Mental Health Loop: Victim sees fake > Anxiety/Shame > Withdrawal > Deeper harm',
      'Trust Collapse Loop: No one trusts photos > Real victims ignored > Society divides',
      'Critical Asymmetry: Damage goes viral in 2 hours. Takedown takes 2 days.',
      'India is ground zero: WhatsApp forwards, women & creators most targeted.',
    ],
    actionTab: 'dampen' as NavTab,
    actionLabel: 'Simulate Virality & Cooling',
  },
  {
    id: 3,
    title: 'Leverage Points, Not Whack-a-Mole',
    subtitle: 'Donella Meadows: Change the structure, not the symptom.',
    badge: 'Leverage Points Architecture',
    image: '/deck/slide3.png',
    keyPoints: [
      'L1 - AT CREATION: My Real Vault proves what is REAL before it is faked',
      'L2 - AT AMPLIFICATION: Warn BEFORE you share - break the virality loop',
      'L3 - AT VICTIM: Balancing loop - calm, evidence, takedown, counselor',
      'Every fake mapped as Causal Graph: Creator -> Platform -> Sharers -> Victim',
      'AI picks the ONE intervention with maximum harm reduction.',
    ],
    actionTab: 'overview' as NavTab,
    actionLabel: 'Inspect Causal Graph',
  },
  {
    id: 4,
    title: 'Solution: Detect + Protect + Heal',
    subtitle: 'One platform, three systems interventions.',
    badge: 'Platform Solutions',
    image: '/deck/slide4.png',
    keyPoints: [
      'DETECT: Upload image/link - Real / AI / Manipulated score in 2 sec + heatmap',
      'PROTECT: Invisible fingerprint - prove YOUR photo is the original',
      'HEAL: AI companion + evidence kit + takedown draft + counselor connect',
      'SIMULATE: What if I share this? shows 24h harm if 100 people share',
      'Delivery: WhatsApp-first, Chrome extension, Hindi + 8 Indian languages.',
    ],
    actionTab: 'detect' as NavTab,
    actionLabel: 'Try Live Detect & Heatmap',
  },
  {
    id: 5,
    title: 'Powered by Google AI',
    subtitle: 'Gemini detects. Our Systems Engine understands.',
    badge: 'Google AI Stack',
    image: '/deck/slide5.png',
    keyPoints: [
      'Gemini API Multimodal: artifacts, lighting, face-blend, metadata mismatch',
      'Nano Banana: creates safe demo fakes to train users + simulate spread',
      'Gemini Live: voice crisis coach in Hindi/English - talks you out of panic',
      'Gemma On-Device: private offline check, photo never leaves your phone',
      'Cloud Architecture: Cloud Run + Vertex AI + Firestore + BigQuery | asia-south1 for DPDP',
    ],
    actionTab: 'system' as NavTab,
    actionLabel: 'View Architecture & APIs',
  },
];

export const PitchDeckView: React.FC<PitchDeckViewProps> = ({ lang, onNavigate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slide = SLIDES[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#10D4A2]">
            <Presentation className="h-4 w-4" />
            Buildathon 2026 • Official Presentation Deck
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            TruthLens — Pitch Deck &amp; Systems Strategy
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/deck/truthlens_pitch_deck.pdf"
            download="TruthLens_Pitch_Deck_2026.pdf"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#10D4A2]" />
            Download PDF
          </a>
          <a
            href="/deck/truthlens_pitch_deck.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#10D4A2] px-3.5 py-2 text-xs font-bold text-[#050919] hover:bg-[#00e8ac] transition"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Tab
          </a>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-4 sm:p-6 shadow-2xl space-y-4">
        {/* Slide navigation controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#10D4A2]/15 px-3 py-1 font-mono text-xs font-bold text-[#10D4A2]">
              Slide {slide.id} of {SLIDES.length}
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-300">
              {slide.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1))}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-[#050919] text-slate-300 hover:text-white hover:border-white/20 transition cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5 px-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentSlideIndex ? 'w-6 bg-[#10D4A2]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0))}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-[#050919] text-slate-300 hover:text-white hover:border-white/20 transition cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slide Display */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-[#050919]">
          <img
            src={slide.image}
            alt={`Slide ${slide.id}: ${slide.title}`}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Slide Breakdown and Quick Navigation to App Feature */}
        <div className="grid gap-4 sm:grid-cols-12 items-center rounded-xl border border-white/10 bg-[#050919]/70 p-4">
          <div className="sm:col-span-8 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-white">{slide.title}</span>
            </div>
            <p className="text-xs text-slate-300">{slide.subtitle}</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              {slide.keyPoints.slice(0, 3).map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#10D4A2]" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-4 sm:text-right">
            <button
              onClick={() => onNavigate(slide.actionTab)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#10D4A2] px-4 py-2.5 text-xs font-bold text-[#050919] hover:bg-[#00e8ac] transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {slide.actionLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#10D4A2]" /> All 5 Pitch Slides
          </span>
          <span>Click any thumbnail to preview</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SLIDES.map((s, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`group relative overflow-hidden rounded-xl border text-left transition cursor-pointer ${
                  isActive
                    ? 'border-[#10D4A2] ring-2 ring-[#10D4A2]/40 bg-[#10D4A2]/10'
                    : 'border-white/10 bg-[#0b1229] hover:border-white/30'
                }`}
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/40">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-2">
                  <div className="font-mono text-[10px] text-[#10D4A2]">Slide {s.id}</div>
                  <div className="font-display text-xs font-semibold text-white truncate">
                    {s.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
