import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Fingerprint,
  Flame,
  Globe,
  HeartHandshake,
  LayoutDashboard,
  ScanSearch,
  Server,
  Wifi,
} from 'lucide-react';
import type {
  ApiInfoResponse,
  DomainId,
  ExecutionMode,
  HealthResponse,
  Language,
  NavTab,
  SharedMediaContext,
} from './types/truthlens';
import { DEFAULT_BASE_URL, TruthLensClient } from './lib/api';
import { t } from './lib/i18n';
import { OverviewView } from './components/OverviewView';
import { ForensicsView } from './components/ForensicsView';
import { VaultView } from './components/VaultView';
import { DampenView } from './components/DampenView';
import { HealLegalView } from './components/HealLegalView';
import { SolutionsView } from './components/SolutionsView';
import { SystemApiView } from './components/SystemApiView';

const NAV_ITEMS: {
  id: NavTab;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'overview', icon: LayoutDashboard },
  { id: 'detect', icon: ScanSearch },
  { id: 'vault', icon: Fingerprint },
  { id: 'dampen', icon: Flame },
  { id: 'heal', icon: HeartHandshake },
  { id: 'solutions', icon: Briefcase },
  { id: 'system', icon: Server },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [lang, setLang] = useState<Language>('en');
  const [baseUrl, setBaseUrl] = useState<string>(DEFAULT_BASE_URL);
  const [mode, setMode] = useState<ExecutionMode>('edge-demo');
  const [selectedDomain, setSelectedDomain] = useState<DomainId>('fintech');
  const [autoPresetId, setAutoPresetId] = useState<string | null>(null);

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [apiInfo, setApiInfo] = useState<ApiInfoResponse | null>(null);

  const [sharedMedia, setSharedMedia] = useState<SharedMediaContext>({
    file: null,
    previewUrl: null,
    filename: '',
  });

  const client = useMemo(() => new TruthLensClient(baseUrl, mode), [baseUrl, mode]);
  const tr = t(lang);

  const refreshHealth = useCallback(async () => {
    const [h, info] = await Promise.all([client.getHealth(), client.getApiInfo()]);
    setHealth(h);
    setApiInfo(info);
  }, [client]);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  const handleOpenDomain = (domain: DomainId) => {
    setSelectedDomain(domain);
    setActiveTab('solutions');
  };

  const handleLaunchPresetInForensics = (presetId: string) => {
    setAutoPresetId(presetId);
    setActiveTab('detect');
  };

  return (
    <div className="min-h-screen bg-[#050919] bg-forensic-grid text-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 border-r border-white/10 bg-[#060b1f]/95 backdrop-blur-xl z-30">
        {/* Brand Emblem matching Pitch Deck */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10D4A2] text-[#050919] font-display text-xl font-extrabold shadow-lg shadow-[#10D4A2]/25">
            T
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-wider text-white">
              TRUTHLENS
            </div>
            <div className="font-mono text-[10px] text-[#10D4A2]">
              v2.2.0 • SYSTEMS ENGINE
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition cursor-pointer ${
                  active
                    ? 'bg-[#10D4A2]/15 text-white border border-[#10D4A2]/40'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 border border-transparent'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? 'text-[#10D4A2]' : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{tr.nav[item.id]}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {tr.navSub[item.id]}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Team & Status Footer */}
        <div className="border-t border-white/10 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Engine Mode</span>
            <button
              onClick={() => setMode((m) => (m === 'live' ? 'edge-demo' : 'live'))}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold cursor-pointer ${
                mode === 'live'
                  ? 'bg-[#10D4A2]/20 text-[#10D4A2]'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              <Wifi className="h-3 w-3" />
              {mode === 'live' ? tr.liveMode : tr.edgeDemoMode}
            </button>
          </div>
          <div className="text-[10px] text-slate-500">
            Team: Gaurav Singh (Jaipur) &amp; Ankita Sinha
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-68 flex flex-col min-h-screen">
        {/* Top Utility Bar */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050919]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            {/* Mobile Brand */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10D4A2] text-[#050919] font-display text-base font-extrabold">
                T
              </div>
              <span className="font-display text-sm font-bold tracking-wider text-white">
                TRUTHLENS
              </span>
            </div>

            {/* Active Module Breadcrumb (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#10D4A2]" />
              <span className="font-semibold text-white">{tr.nav[activeTab]}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{tr.navSub[activeTab]}</span>
            </div>

            {/* Right Utility Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode((m) => (m === 'live' ? 'edge-demo' : 'live'))}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  mode === 'live'
                    ? 'border-[#10D4A2]/40 bg-[#10D4A2]/10 text-[#10D4A2]'
                    : 'border-amber-400/35 bg-amber-400/10 text-amber-300'
                }`}
                title="Toggle between live backend server and zero-latency local Edge Demo engine"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    mode === 'live' ? 'bg-[#10D4A2]' : 'bg-amber-400'
                  }`}
                />
                {mode === 'live' ? tr.liveMode : tr.edgeDemoMode}
              </button>

              <button
                onClick={() => setLang((l) => (l === 'en' ? 'hi' : 'en'))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 cursor-pointer"
                title="Switch between English and Hindi"
              >
                <Globe className="h-3.5 w-3.5 text-[#10D4A2]" />
                {lang === 'en' ? 'हिंदी' : 'EN'}
              </button>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-10">
          {activeTab === 'overview' && (
            <OverviewView
              lang={lang}
              health={health}
              apiInfo={apiInfo}
              baseUrl={baseUrl}
              onRefreshHealth={refreshHealth}
              onNavigate={setActiveTab}
              onOpenDomain={handleOpenDomain}
            />
          )}

          {activeTab === 'detect' && (
            <ForensicsView
              client={client}
              sharedMedia={sharedMedia}
              onUpdateSharedMedia={setSharedMedia}
              onNavigate={setActiveTab}
              autoPresetId={autoPresetId}
              onConsumedPreset={() => setAutoPresetId(null)}
            />
          )}

          {activeTab === 'vault' && (
            <VaultView client={client} sharedMedia={sharedMedia} />
          )}

          {activeTab === 'dampen' && (
            <DampenView client={client} sharedMedia={sharedMedia} />
          )}

          {activeTab === 'heal' && (
            <HealLegalView
              client={client}
              lang={lang}
              sharedMedia={sharedMedia}
            />
          )}

          {activeTab === 'solutions' && (
            <SolutionsView
              selectedDomain={selectedDomain}
              onSelectDomain={setSelectedDomain}
              onLaunchPresetInForensics={handleLaunchPresetInForensics}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'system' && (
            <SystemApiView
              client={client}
              baseUrl={baseUrl}
              mode={mode}
              onChangeBaseUrl={setBaseUrl}
              onChangeMode={setMode}
            />
          )}
        </main>
      </div>

      {/* Mobile Material 3 Bottom Navigation Bar (matching GET /demo PWA spec) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#060b1f]/95 backdrop-blur-lg lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-6 gap-0.5 px-1 py-1.5">
          {NAV_ITEMS.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 text-[10px] font-medium transition cursor-pointer ${
                  active ? 'bg-[#10D4A2]/15 text-[#10D4A2]' : 'text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span className="truncate max-w-[56px]">{tr.nav[item.id].split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
