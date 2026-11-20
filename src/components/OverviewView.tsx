import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Brain,
  Building2,
  Cpu,
  Download,
  Fingerprint,
  Flame,
  Gavel,
  Globe,
  HeartHandshake,
  Landmark,
  Layers,
  Newspaper,
  Radio,
  RefreshCw,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
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
    sub: 'AI Tool & Synthetic Media',
    leverage: 'L1 — AT CREATION',
    leverageTitle: 'Origin Derivative Vault (Qdrant)',
    leverageDesc:
      'Registers cryptographic SHA-256 + 64-bit dHash of authentic media BEFORE it can be faked. Proves provenance even after screenshots or re-compression (Hamming ≤ 10).',
    targetTab: 'vault' as NavTab,
    color: 'emerald',
  },
  {
    id: 'platform',
    step: '02',
    label: 'Platform & Feeds',
    sub: 'Algorithm Boosts Outrage',
    leverage: 'L0 — EDGE FORENSICS',
    leverageTitle: 'Zero-Cloud Multimodal Gate',
    leverageDesc:
      'Runs Error Level Analysis (ELA), SynthID, C2PA, and 11.2 kHz audio vocoder FFT before broadcast — separating malicious impersonations from benign creative edits.',
    targetTab: 'detect' as NavTab,
    color: 'sky',
  },
  {
    id: 'sharers',
    step: '03',
    label: 'Viral Sharers',
    sub: 'WhatsApp Forwards & Bots',
    leverage: 'L2 — AT AMPLIFICATION',
    leverageTitle: '15s Cognitive Cooling + Outrage Guardrail',
    leverageDesc:
      'Injects behavioral friction before impulsive forwarding, throttles outrage-bait streaks, and suppresses coordinated astroturfing bots to drop R₀ below viral threshold.',
    targetTab: 'dampen' as NavTab,
    color: 'amber',
  },
  {
    id: 'victim',
    step: '04',
    label: 'Targeted Victim',
    sub: 'Anxiety, Shame, Defamation',
    leverage: 'L3 — AT VICTIM',
    leverageTitle: 'Balancing Loop: Heal + Debunk + Law',
    leverageDesc:
      'Gemini Live Hindi/English crisis coach calms panic, auto-generates WhatsApp debunk sticker cards, BSA Sec 63 court dossiers, and Rule 3(2)(b) 24h takedowns.',
    targetTab: 'heal' as NavTab,
    color: 'rose',
  },
];

// Deck slide 3: "AI picks the ONE intervention with maximum harm reduction."
// For a viral WhatsApp forward, breaking amplification (L2) yields the largest reduction
// in the 24h simulator, so it is the default recommendation.
const AI_RECOMMENDED_NODE = 'sharers';

const VERTICAL_SUMMARY: {
  id: DomainId;
  title: string;
  tag: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'fintech',
    title: 'Fintech, Banking & Remote KYC',
    tag: 'KYC & Voice Auth',
    desc: 'Stop face-swapped selfies, AI IDs, virtual-camera injection, and call-center voice clones on wire transfers.',
    icon: Landmark,
  },
  {
    id: 'social',
    title: 'Social, Messaging & Wellbeing',
    tag: 'Virality & Mental Health',
    desc: 'Pre-share labeling, outrage-bait exposure cool-downs, and coordinated bot/astroturfing suppression.',
    icon: Users,
  },
  {
    id: 'enterprise',
    title: 'Enterprise Security & Remote Hiring',
    tag: 'BEC 2.0 & Interviews',
    desc: 'Detect live Zoom/Meet C-suite executive deepfakes and proxy-candidate face-swap interview fraud.',
    icon: Building2,
  },
  {
    id: 'journalism',
    title: 'Journalism, Newsrooms & Civic',
    tag: 'UGC & Elections',
    desc: 'Rapid breaking-news UGC provenance scoring and election/public-figure speech forgery defense.',
    icon: Newspaper,
  },
  {
    id: 'commerce',
    title: 'E-Commerce, Insurance & Gig',
    tag: 'Claims & Liveness',
    desc: 'Catch tampered delivery/insurance damage claims and run fast driver/seller identity re-verification.',
    icon: ShoppingBag,
  },
  {
    id: 'legal',
    title: 'Legal, Compliance & Forensics',
    tag: 'BSA 63 & Takedowns',
    desc: 'Court-ready chain-of-custody validation, Sec 67C CGNAT preservation, and 24h Rule 3(2)(b) notices.',
    icon: Gavel,
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
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1430] via-[#070e24] to-[#050919] p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#10D4A2]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#10D4A2]/30 bg-[#10D4A2]/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#10D4A2]">
              <Sparkles className="h-3.5 w-3.5" />
              {tr.badge}
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {lang === 'en' ? (
                <>
                  Break the{' '}
                  <span className="text-[#10D4A2]">Deepfake Loop.</span>
                </>
              ) : (
                <span className="text-[#10D4A2]">{tr.tagline}</span>
              )}
            </h1>

            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              {tr.subtitle}
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={() => onNavigate('detect')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#10D4A2] px-4 py-2.5 text-sm font-semibold text-[#050919] transition hover:bg-[#00e8ac] cursor-pointer"
              >
                <ScanSearch className="h-4 w-4" />
                {tr.quickActions.scanNow}
              </button>
              <button
                onClick={() => onNavigate('dampen')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#10D4A2]/50 hover:bg-white/10 cursor-pointer"
              >
                <Flame className="h-4 w-4 text-amber-400" />
                {tr.quickActions.simulateSpread}
              </button>
              <button
                onClick={() => onNavigate('heal')}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 cursor-pointer"
              >
                <HeartHandshake className="h-4 w-4 text-rose-400" />
                {tr.quickActions.openHeal}
              </button>
            </div>
          </div>

          {/* Key Metric Proof Strip */}
          <div className="grid grid-cols-2 gap-3 lg:w-80">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-medium text-slate-400">Damage vs Takedown</div>
              <div className="mt-1 font-display text-2xl font-bold text-rose-400 tabular-nums">
                2h <span className="text-sm font-normal text-slate-400">vs</span> 2d
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Why detection alone fails</div>
            </div>
            <div className="rounded-xl border border-[#10D4A2]/25 bg-[#10D4A2]/[0.06] p-4">
              <div className="text-xs font-medium text-slate-300">Edge Latency</div>
              <div className="mt-1 font-display text-2xl font-bold text-[#10D4A2] tabular-nums">
                &lt;2.0s
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Zero cloud cost forensics</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-medium text-slate-400">India Ground Zero</div>
              <div className="mt-1 font-display text-2xl font-bold text-amber-400">
                WhatsApp
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Women &amp; creators most targeted</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-medium text-slate-400">Deployment Ready</div>
              <div className="mt-1 font-display text-2xl font-bold text-sky-400 tabular-nums">
                6 Domains
              </div>
              <div className="mt-1 text-[11px] text-slate-400">KYC, BEC 2.0, Civic, Legal</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Reinforcing Loops (Pitch Slide 2) */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: '1. Virality Loop',
            flow: 'AI Tool → Shocking Fake → Algorithm Boosts → More Shares',
            detail:
              'Outrage-optimized feeds and WhatsApp forwards achieve exponential reach within 2 hours, long before manual moderation.',
            accent: 'border-amber-500/25 bg-amber-500/[0.05]',
            badge: 'text-amber-300',
          },
          {
            title: '2. Mental Health Loop',
            flow: 'Victim Sees Fake → Anxiety / Shame → Withdrawal → Deeper Harm',
            detail:
              'Women, students, and creators suffer acute psychological trauma and silence while non-consensual morphed content spreads.',
            accent: 'border-rose-500/25 bg-rose-500/[0.05]',
            badge: 'text-rose-300',
          },
          {
            title: '3. Trust Collapse Loop',
            flow: 'No One Trusts Media → Real Victims Ignored → Society Divides',
            detail:
              'When synthetic forgery saturates KYC, newsrooms, and courts, both real evidence and institutional trust break down.',
            accent: 'border-sky-500/25 bg-sky-500/[0.05]',
            badge: 'text-sky-300',
          },
        ].map((loop) => (
          <div
            key={loop.title}
            className={`rounded-xl border p-4 ${loop.accent}`}
          >
            <div className={`text-xs font-bold uppercase tracking-wider ${loop.badge}`}>
              Reinforcing Loop
            </div>
            <h3 className="mt-1 font-display text-base font-bold text-white">
              {loop.title}
            </h3>
            <p className="mt-1.5 font-mono text-[11px] text-slate-200">{loop.flow}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{loop.detail}</p>
          </div>
        ))}
      </section>

      {/* Interactive Donella Meadows Causal Graph & Leverage Points */}
      <section className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#10D4A2]">
              <Layers className="h-4 w-4" />
              Donella Meadows Systems Engine — Change the Structure, Not the Symptom
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-white">
              Interactive Causal Intervention Graph
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any node in the causal chain to inspect TruthLens&apos;s intervention
          </span>
        </div>

        {/* Chain Nodes */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CAUSAL_NODES.map((node, idx) => {
            const isSelected = node.id === activeNode.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-[#10D4A2] bg-[#10D4A2]/10 shadow-lg shadow-[#10D4A2]/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#10D4A2]">
                    NODE {node.step}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {node.leverage.split(' — ')[0]}
                  </span>
                </div>
                {node.id === AI_RECOMMENDED_NODE && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    <Sparkles className="h-3 w-3" />
                    AI PICK • MAX HARM REDUCTION
                  </span>
                )}
                <div className="mt-2 font-display text-base font-bold text-white">
                  {node.label}
                </div>
                <div className="text-xs text-slate-400">{node.sub}</div>
                {idx < CAUSAL_NODES.length - 1 && (
                  <ArrowRight className="pointer-events-none absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-500 lg:block" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Node Intervention Detail */}
        <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl border border-[#10D4A2]/25 bg-[#050919]/80 p-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#10D4A2]/20 px-2 py-0.5 font-mono text-xs font-bold text-[#10D4A2]">
                {activeNode.leverage}
              </span>
              <span className="font-display text-base font-bold text-white">
                {activeNode.leverageTitle}
              </span>
            </div>
            <p className="max-w-3xl text-sm text-slate-300">{activeNode.leverageDesc}</p>
          </div>
          <button
            onClick={() => onNavigate(activeNode.targetTab)}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#10D4A2] px-4 py-2.5 text-sm font-semibold text-[#050919] transition hover:bg-[#00e8ac] cursor-pointer"
          >
            Launch Module
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 6 High-Impact Deployment Verticals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Deployable Across 6 High-Impact Domains
            </h2>
            <p className="text-sm text-slate-400">
              Real-time synthetic media forensics, identity liveness, and algorithmic content hygiene.
            </p>
          </div>
          <button
            onClick={() => onNavigate('solutions')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#10D4A2] hover:underline cursor-pointer"
          >
            Open All Interactive Playbooks
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {VERTICAL_SUMMARY.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onOpenDomain(item.id)}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b1229]/80 p-5 text-left transition hover:border-[#10D4A2]/45 hover:bg-[#111b3a]/80 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10D4A2]/10 text-[#10D4A2]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-white group-hover:text-[#10D4A2] transition">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#10D4A2]">
                  Run Live Domain Simulator
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Powered by Google AI + Live Backend Health */}
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Brain className="h-4 w-4" />
            Powered by Google AI • DPDP asia-south1
          </div>
          <h3 className="mt-1 font-display text-lg font-bold text-white">
            Gemini Detects. Our Systems Engine Understands.
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                name: 'Gemini API Multimodal',
                detail: 'Artifacts, lighting azimuth, face-blend seams & metadata mismatch.',
                icon: Sparkles,
              },
              {
                name: 'Nano Banana',
                detail: 'Creates safe synthetic demo fakes to train users & simulate spread.',
                icon: ShieldAlert,
              },
              {
                name: 'Gemini Live Voice Coach',
                detail: 'Hindi & English crisis companion — talks victims out of panic.',
                icon: Radio,
              },
              {
                name: 'Gemma On-Device + Cloud Run',
                detail: 'Private offline edge checks + Vertex AI, Firestore & BigQuery (asia-south1).',
                icon: Cpu,
              },
            ].map((stack) => {
              const Icon = stack.icon;
              return (
                <div
                  key={stack.name}
                  className="rounded-xl border border-white/8 bg-[#050919]/70 p-3.5"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Icon className="h-4 w-4 text-[#10D4A2]" />
                    {stack.name}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{stack.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1229]/90 p-5 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#10D4A2]">
                <Activity className="h-4 w-4" />
                Live Edge Telemetry (/health)
              </div>
              <button
                onClick={onRefreshHealth}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {[
                { label: 'Redis Cache & Cooling Queue', val: health?.services.redis ?? 'ready' },
                { label: 'Postgres Case & Telemetry DB', val: health?.services.postgres ?? 'ready' },
                { label: 'Qdrant Vector Vault (:6333)', val: health?.services.qdrant ?? 'truthlens_vault' },
                { label: 'Multimodal Edge Workers', val: health?.services.edge_workers ?? 'active' },
                { label: 'OpenWA WhatsApp Gateway', val: health?.services.openwa_gateway ?? 'ready (:2785)' },
              ].map((svc) => (
                <div
                  key={svc.label}
                  className="flex items-center justify-between rounded-lg bg-[#050919]/70 px-3 py-2"
                >
                  <span className="text-slate-300">{svc.label}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#10D4A2]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10D4A2]" />
                    {svc.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
            <div className="text-[11px] text-slate-400">
              Team: <span className="text-slate-200">Gaurav Singh &amp; Ankita Sinha</span>
              {apiInfo && <span className="ml-2 font-mono text-[#10D4A2]">v{apiInfo.version}</span>}
            </div>
            <a
              href={`${baseUrl}/download/truthlens.apk`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#10D4A2]/30 bg-[#10D4A2]/10 px-3 py-1.5 text-xs font-semibold text-[#10D4A2] hover:bg-[#10D4A2]/20"
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
