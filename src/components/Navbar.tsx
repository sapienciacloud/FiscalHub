import React from 'react';
import { ShieldCheck, Search, Download, Terminal, LifeBuoy, FileText } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConsulta: () => void;
  onOpenLote: () => void;
  isMfaActive: boolean;
  selectedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConsulta,
  onOpenLote,
  isMfaActive,
  selectedCount
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 backdrop-blur border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <a 
        href="#dashboard" 
        onClick={(e) => { e.preventDefault(); setActiveTab('monitoramento'); }}
        className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
          <FileText className="w-4 h-4" />
        </div>
        <span>FiscalHub</span>
        <span className="text-xs font-mono font-normal text-slate-500">· Nacional</span>
      </a>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('monitoramento')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'monitoramento' ? 'text-white' : ''
          }`}
        >
          Monitoramento
        </button>
        <button
          onClick={() => setActiveTab('documentos')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'documentos' ? 'text-white' : ''
          }`}
        >
          NF-e & NFC-e
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'api' ? 'text-white' : ''
          }`}
        >
          API REST
        </button>
        <button
          onClick={() => setActiveTab('conformidade')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'conformidade' ? 'text-white' : ''
          }`}
        >
          Conformidade Fiscal
        </button>
        <button
          onClick={() => setActiveTab('relatorios')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'relatorios' ? 'text-white' : ''
          }`}
        >
          Relatórios
        </button>
      </nav>

      {/* Zone 3: 1 primary action and contextual controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('seguranca')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors whitespace-nowrap shrink-0"
          title={isMfaActive ? 'Autenticação Multifator Ativa' : 'Configurar MFA'}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${isMfaActive ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span>MFA {isMfaActive ? 'Ativo' : 'Pendente'}</span>
        </button>

        {selectedCount > 0 && (
          <button
            onClick={onOpenLote}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-700/50 hover:bg-emerald-900/60 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Lote ({selectedCount})</span>
          </button>
        )}

        <button
          onClick={onOpenConsulta}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Consultar Nota</span>
        </button>
      </div>
    </header>
  );
};
