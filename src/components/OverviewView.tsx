import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  Cpu,
  Download,
  Eye,
  Fingerprint,
  Flame,
  Gavel,
  Globe,
  HeartHandshake,
  Landmark,
  Layers,
  Lock,
  MessageSquare,
  Newspaper,
  Radio,
  RefreshCw,
  ScanSearch,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  Users,
  Zap,
} from 'lucide-react';
import type {
  ApiInfoResponse,
  DomainId,
  HealthResponse,
  Language,
  NavTab,
} from '../types/truthlens';
import { t } from '../lib/i18n';

interface OverviewViewProps {
  lang: Language;
  health: HealthResponse | null;
  apiInfo: ApiInfoResponse | null;
  baseUrl: string;
  onRefreshHealth: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenDomain: (domain: DomainId) => void;
}

const CAUSAL_NODES = [
  {
    id: 'creator',
    step: '01',
    label: 'Creator / Forger',
    sub: 'AI Tools & Synthetic Audio/Video',
    icon: Lock,
    leverage: 'L1 — AT CREATION',
    leverageTitle: 'Origin Derivative Vault (Qdrant)',
    leverageDesc:
      'Registers cryptographic SHA-256 + 64-bit dHash of authentic media BEFORE it can be faked. Proves provenance even after screenshots or re-compression (Hamming ≤ 10).',
    targetTab: 'vault' as NavTab,
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-[#10D4A2]',
    glowColor: 'hover:shadow-[0_0_25px_rgba(16,212,162,0.25)]',
  },
  {
    id: 'platform',
    step: '02',
    label: 'Platform & Feeds',
    sub: 'Algorithm Boosts Sensational Outrage',
    icon: Eye,
    leverage: 'L0 — EDGE FORENSICS',
    leverageTitle: 'Zero-Cloud Multimodal Gate',
    leverageDesc:
      'Runs Error Level Analysis (ELA), SynthID, C2PA, and 11.2 kHz audio vocoder FFT before broadcast — separating malicious impersonations from benign creative edits.',
    targetTab: 'detect' as NavTab,
    badgeColor: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    glowColor: 'hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]',
  },
  {
    id: 'sharers',
    step: '03',
    label: 'Viral Sharers',
    sub: 'WhatsApp Forwards & Bot Farms',
    icon: Flame,
    leverage: 'L2 — AT AMPLIFICATION',
    leverageTitle: '15s Cognitive Cooling + Outrage Guardrail',
    leverageDesc:
      'Injects behavioral friction before impulsive forwarding, throttles outrage-bait streaks, and suppresses coordinated astroturfing bots to drop R₀ below viral threshold.',
    targetTab: 'dampen' as NavTab,
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    glowColor: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'victim',
    step: '04',
    label: 'Targeted Victim',
    sub: 'Anxiety, Shame, Extortion',
    icon: HeartHandshake,
    leverage: 'L3 — AT VICTIM',
    leverageTitle: 'Balancing Loop: Heal + Debunk + Law',
    leverageDesc:
      'Gemini Live Hindi/English crisis coach calms panic, auto-generates WhatsApp debunk sticker cards, BSA Sec 63 court dossiers, and Rule 3(2)(b) 24h takedowns.',
    targetTab: 'heal' as NavTab,
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    glowColor: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]',
  },
];

const AI_RECOMMENDED_NODE = 'sharers';

const VERTICAL_SUMMARY: {
  id: DomainId;
  title: string;
  tag: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  badgeBg: string;
}[] = [
  {
    id: 'fintech',
    title: 'Fintech, Banking & Remote KYC',
    tag: 'KYC & Voice Auth',
    desc: 'Stop face-swapped selfies, AI IDs, virtual-camera injection, and call-center voice clones on wire transfers.',
    icon: Landmark,
    accent: 'text-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,212,162,0.3)]',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  {
    id: 'social',
    title: 'Social, Messaging & Wellbeing',
    tag: 'Virality & Mental Health',
    desc: 'Pre-share labeling, outrage-bait exposure cool-downs, and coordinated bot/astroturfing suppression.',
    icon: Users,
    accent: 'text-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Security & Hiring',
    tag: 'BEC 2.0 & Interviews',
    desc: 'Detect live Zoom/Meet C-suite executive deepfakes and proxy-candidate face-swap interview fraud.',
    icon: Building2,
    accent: 'text-sky-400 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
  {
    id: 'journalism',
    title: 'Journalism, Newsrooms & Civic',
    tag: 'UGC & Elections',
    desc: 'Rapid breaking-news UGC provenance scoring and election/public-figure speech forgery defense.',
    icon: Newspaper,
    accent: 'text-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  },
  {
    id: 'commerce',
    title: 'E-Commerce, Insurance & Gig',
    tag: 'Claims & Liveness',
    desc: 'Catch tampered delivery/insurance damage claims and run fast driver/seller identity re-verification.',
    icon: ShoppingBag,
    accent: 'text-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
  {
    id: 'legal',
    title: 'Legal, Compliance & Forensics',
    tag: 'BSA 63 & Takedowns',
    desc: 'Court-ready chain-of-custody validation, Sec 67C CGNAT preservation, and 24h Rule 3(2)(b) notices.',
    icon: Gavel,
    accent: 'text-rose-400 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  },
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  lang,
  health,
  apiInfo,
  baseUrl,
  onRefreshHealth,
  onNavigate,
  onOpenDomain,
}) => {
  const tr = t(lang);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('sharers');
  const activeNode = CAUSAL_NODES.find((n) => n.id === selectedNodeId) ?? CAUSAL_NODES[2];

  return (
    <div className="space-y-8">
      {/* Hero Master Showcase */}
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0c1538] via-[#070e28] to-[#030718] p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] animate-border-glow">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#10D4A2]/15 blur-3xl animate-pulse-ring" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#10D4A2]/40 bg-[#10D4A2]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#10D4A2] shadow-[0_0_15px_rgba(16,212,162,0.2)]">
              <Sparkles className="h-4 w-4 animate-spin text-[#10D4A2]" style={{ animationDuration: '6s' }} />
              {tr.badge}
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1]">
              {lang === 'en' ? (
                <>
                  Break the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10D4A2] via-[#00e8ac] to-sky-400 text-glow-emerald">
                    Deepfake Loop.
                  </span>
                </>
              ) : (
                <span className="text-[#10D4A2] text-glow-emerald">{tr.tagline}</span>
              )}
            </h1>

            <p className="text-base leading-relaxed text-slate-300 sm:text-xl font-normal max-w-xl">
              {tr.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('detect')}
                className="btn-neon-emerald inline-flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm cursor-pointer"
              >
                <ScanSearch className="h-4 w-4 text-[#030715]" />
                {tr.quickActions.scanNow}
              </button>
              <button
                onClick={() => onNavigate('dampen')}
                className="inline-flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-500/20 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
              >
                <Flame className="h-4 w-4 text-amber-400" />
                {tr.quickActions.simulateSpread}
              </button>
              <button
                onClick={() => onNavigate('heal')}
                className="inline-flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-200 transition hover:bg-rose-500/20 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)] cursor-pointer"
              >
                <HeartHandshake className="h-4 w-4 text-rose-400" />
                {tr.quickActions.openHeal}
              </button>
            </div>
          </div>

          {/* Key Metric Live Proof Strip */}
          <div className="grid grid-cols-2 gap-3.5 lg:w-88">
            <div className="glass-panel rounded-2xl p-4.5 transition hover:scale-105 duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                <span>Damage Asymmetry</span>
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              </div>
              <div className="mt-2 font-display text-3xl font-extrabold text-rose-400 tabular-nums text-glow-rose">
                2h <span className="text-sm font-normal text-slate-400">vs</span> 2d
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Viral spike vs takedown speed</div>
            </div>

            <div className="glass-panel-glow rounded-2xl p-4.5 transition hover:scale-105 duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-[#10D4A2]">
                <span>Edge Latency</span>
                <Zap className="h-4 w-4 text-[#10D4A2]" />
              </div>
              <div className="mt-2 font-display text-3xl font-extrabold text-[#10D4A2] tabular-nums text-glow-emerald">
                &lt;2.0s
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Zero cloud cost forensics</div>
            </div>

            <div className="glass-panel rounded-2xl p-4.5 transition hover:scale-105 duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                <span>Ground Zero</span>
                <MessageSquare className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 font-display text-2xl font-extrabold text-amber-300">
                WhatsApp
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Women &amp; creators targeted</div>
            </div>

            <div className="glass-panel rounded-2xl p-4.5 transition hover:scale-105 duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-sky-300">
                <span>Live Verticals</span>
                <ShieldCheck className="h-4 w-4 text-sky-400" />
              </div>
              <div className="mt-2 font-display text-3xl font-extrabold text-sky-400 tabular-nums text-glow-cyan">
                6 Domains
              </div>
              <div className="mt-1 text-[11px] text-slate-400">KYC, BEC 2.0, Civic, Legal</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Reinforcing Loops (Pitch Slide 2) */}
      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            title: '1. Virality Loop',
            icon: Flame,
            flow: 'AI Tool → Shocking Fake → Algorithm Boosts → More Shares',
            detail:
              'Outrage-optimized feeds and WhatsApp forwards achieve exponential reach within 2 hours, long before manual moderation can respond.',
            accent: 'border-amber-500/35 bg-gradient-to-b from-amber-950/20 to-[#0b1229]/80 shadow-[0_0_20px_rgba(245,158,11,0.08)]',
            badge: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
            iconColor: 'text-amber-400',
          },
          {
            title: '2. Mental Health Loop',
            icon: HeartHandshake,
            flow: 'Victim Sees Fake → Anxiety / Shame → Withdrawal → Deeper Harm',
            detail:
              'Women, students, and creators suffer acute psychological trauma and silence while non-consensual morphed content circulates.',
            accent: 'border-rose-500/35 bg-gradient-to-b from-rose-950/20 to-[#0b1229]/80 shadow-[0_0_20px_rgba(244,63,94,0.08)]',
            badge: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
            iconColor: 'text-rose-400',
          },
          {
            title: '3. Trust Collapse Loop',
            icon: ShieldAlert,
            flow: 'No One Trusts Media → Real Victims Ignored → Society Divides',
            detail:
              'When synthetic forgery saturates KYC, newsrooms, and courts, both real evidence and institutional trust break down.',
            accent: 'border-sky-500/35 bg-gradient-to-b from-sky-950/20 to-[#0b1229]/80 shadow-[0_0_20px_rgba(56,189,248,0.08)]',
            badge: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
            iconColor: 'text-sky-400',
          },
        ].map((loop) => {
          const Icon = loop.icon;
          return (
            <div
              key={loop.title}
              className={`rounded-2xl border p-5 transition hover:scale-[1.02] duration-200 ${loop.accent}`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${loop.badge}`}>
                  <Icon className="h-3 w-3" />
                  Reinforcing Loop
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-white flex items-center gap-2">
                <Icon className={`h-5 w-5 ${loop.iconColor}`} />
                {loop.title}
              </h3>
              <div className="mt-2 rounded-lg bg-black/40 p-2.5 font-mono text-[11px] text-slate-200 border border-white/5">
                {loop.flow}
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">{loop.detail}</p>
            </div>
          );
        })}
      </section>

      {/* Interactive Donella Meadows Causal Graph & Leverage Points */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10D4A2]">
              <Layers className="h-4 w-4" />
              Donella Meadows Systems Engine — Change the Structure, Not the Symptom
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Interactive Causal Intervention Graph
            </h2>
          </div>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            Click any node in the causal chain to inspect TruthLens&apos;s intervention
          </span>
        </div>

        {/* Chain Nodes */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAUSAL_NODES.map((node, idx) => {
            const isSelected = node.id === activeNode.id;
            const Icon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`group relative flex flex-col items-start rounded-2xl border p-5 text-left transition duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#10D4A2] bg-[#10D4A2]/15 shadow-[0_0_25px_rgba(16,212,162,0.3)] scale-[1.02]'
                    : `border-white/10 bg-[#050919]/60 hover:border-white/30 hover:bg-white/[0.04] ${node.glowColor}`
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#10D4A2] flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    NODE {node.step}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${node.badgeColor}`}>
                    {node.leverage.split(' — ')[0]}
                  </span>
                </div>
                {node.id === AI_RECOMMENDED_NODE && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    <Sparkles className="h-3 w-3" />
                    AI PICK • MAX HARM REDUCTION
                  </span>
                )}
                <div className="mt-2.5 font-display text-lg font-bold text-white">
                  {node.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{node.sub}</div>
                {idx < CAUSAL_NODES.length - 1 && (
                  <ArrowRight className="pointer-events-none absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-slate-500 lg:block z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Node Intervention Detail */}
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-[#10D4A2]/30 bg-gradient-to-r from-[#07132a] via-[#050919] to-[#07132a] p-5 sm:flex-row sm:items-center shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-[#10D4A2]/20 border border-[#10D4A2]/40 px-2.5 py-1 font-mono text-xs font-bold text-[#10D4A2]">
                {activeNode.leverage}
              </span>
              <span className="font-display text-lg font-bold text-white">
                {activeNode.leverageTitle}
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-300">{activeNode.leverageDesc}</p>
          </div>
          <button
            onClick={() => onNavigate(activeNode.targetTab)}
            className="btn-neon-emerald shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm cursor-pointer"
          >
            Launch Module
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 6 High-Impact Deployment Verticals */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#10D4A2] flex items-center gap-1.5">
              <Building2 className="h-4 w-4" /> Real-World Impact
            </div>
            <h2 className="mt-0.5 font-display text-2xl font-bold text-white">
              Deployable Across 6 High-Impact Domains
            </h2>
            <p className="text-sm text-slate-400">
              Real-time synthetic media forensics, identity liveness, and algorithmic content hygiene.
            </p>
          </div>
          <button
            onClick={() => onNavigate('solutions')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-[#10D4A2] hover:bg-white/10 transition cursor-pointer"
          >
            Open All 6 Interactive Playbooks
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {VERTICAL_SUMMARY.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onOpenDomain(item.id)}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b1229]/80 p-5.5 text-left transition hover:border-[#10D4A2]/50 hover:bg-[#111b3a]/90 hover:scale-[1.02] duration-200 cursor-pointer shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition ${item.accent}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${item.badgeBg}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-3.5 font-display text-lg font-bold text-white group-hover:text-[#10D4A2] transition">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 inline-flex items-center gap-2 text-xs font-bold text-[#10D4A2]">
                  Run Live Domain Simulator
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Powered by Google AI + Live Backend Health */}
      <section className="grid gap-5 lg:grid-cols-12">
        <div className="glass-panel rounded-3xl p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <Brain className="h-4 w-4" />
            Powered by Google AI • DPDP asia-south1
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            Gemini Detects. Our Systems Engine Understands.
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            {[
              {
                name: 'Gemini API Multimodal',
                detail: 'Artifacts, lighting azimuth, face-blend seams & metadata mismatch.',
                icon: Sparkles,
                color: 'text-amber-400',
              },
              {
                name: 'Nano Banana',
                detail: 'Creates safe synthetic demo fakes to train users & simulate spread.',
                icon: ShieldAlert,
                color: 'text-rose-400',
              },
              {
                name: 'Gemini Live Voice Coach',
                detail: 'Hindi & English crisis companion — talks victims out of panic.',
                icon: Radio,
                color: 'text-sky-400',
              },
              {
                name: 'Gemma On-Device + Cloud Run',
                detail: 'Private offline edge checks + Vertex AI, Firestore & BigQuery (asia-south1).',
                icon: Cpu,
                color: 'text-[#10D4A2]',
              },
            ].map((stack) => {
              const Icon = stack.icon;
              return (
                <div
                  key={stack.name}
                  className="rounded-2xl border border-white/10 bg-[#050919]/70 p-4 transition hover:border-white/20"
                >
                  <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                    <Icon className={`h-4.5 w-4.5 ${stack.color}`} />
                    {stack.name}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{stack.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10D4A2]">
                <Activity className="h-4 w-4 text-[#10D4A2]" />
                Live Edge Telemetry (/health)
              </div>
              <button
                onClick={onRefreshHealth}
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              {[
                { label: 'Redis Cache & Cooling Queue', val: health?.services.redis ?? 'ready' },
                { label: 'Postgres Case & Telemetry DB', val: health?.services.postgres ?? 'ready' },
                { label: 'Qdrant Vector Vault (:6333)', val: health?.services.qdrant ?? 'truthlens_vault' },
                { label: 'Multimodal Edge Workers', val: health?.services.edge_workers ?? 'active' },
                { label: 'OpenWA WhatsApp Gateway', val: health?.services.openwa_gateway ?? 'ready (:2785)' },
              ].map((svc) => (
                <div
                  key={svc.label}
                  className="flex items-center justify-between rounded-xl bg-[#050919]/80 px-3.5 py-2.5 border border-white/5"
                >
                  <span className="text-slate-300 font-medium">{svc.label}</span>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] text-[#10D4A2]">
                    <span className="h-2 w-2 rounded-full bg-[#10D4A2] animate-pulse" />
                    {svc.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
            <div className="text-[11px] text-slate-400">
              Team: <span className="text-slate-200 font-semibold">Gaurav Singh &amp; Ankita Sinha</span>
              {apiInfo && <span className="ml-2 font-mono text-[#10D4A2]">v{apiInfo.version}</span>}
            </div>
            <a
              href={`${baseUrl}/download/truthlens.apk`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#10D4A2]/40 bg-[#10D4A2]/15 px-3 py-1.5 text-xs font-bold text-[#10D4A2] hover:bg-[#10D4A2]/25"
            >
              <Download className="h-3.5 w-3.5" />
              {tr.downloadApk}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
