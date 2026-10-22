import React from 'react';
import { 
  Activity, 
  FileSpreadsheet, 
  DownloadCloud, 
  Code2, 
  Scale, 
  BarChart3, 
  KeyRound, 
  ShieldCheck, 
  Headphones,
  Radio,
  Server
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documentosCount: number;
  sefazInstavel: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  documentosCount,
  sefazInstavel
}) => {
  const navItems = [
    {
      id: 'monitoramento',
      label: 'Painel Geral',
      icon: Activity,
      count: null
    },
    {
      id: 'documentos',
      label: 'Documentos Fiscais',
      icon: FileSpreadsheet,
      count: documentosCount
    },
    {
      id: 'lote',
      label: 'Download em Lote',
      icon: DownloadCloud,
      count: null
    },
    {
      id: 'api',
      label: 'API & Integrações ERP',
      icon: Code2,
      count: null
    },
    {
      id: 'conformidade',
      label: 'Conformidade Fiscal',
      icon: Scale,
      count: null
    },
    {
      id: 'relatorios',
      label: 'Relatórios Analíticos',
      icon: BarChart3,
      count: null
    },
    {
      id: 'sefaz',
      label: 'Certificados & SEFAZ',
      icon: Server,
      badge: sefazInstavel ? 'Alerta' : null
    },
    {
      id: 'seguranca',
      label: 'Segurança & MFA (2FA)',
      icon: ShieldCheck,
      count: null
    },
    {
      id: 'suporte',
      label: 'Suporte Técnico',
      icon: Headphones,
      count: null
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 min-h-[calc(100vh-57px)]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 mb-2">
            Navegação do Sistema
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[10px] font-mono text-amber-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick SEFAZ status summary */}
        <div className="px-3 py-3 rounded-md bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300 font-medium">Ambiente Fiscal</span>
            <span className="text-emerald-400">Produção (Nacional)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>UFs Monitoradas</span>
            <span className="text-slate-200 tabular-nums">27 / 27</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Contingência SVC</span>
            <span className="text-slate-300">Em Prontidão</span>
          </div>
        </div>
      </div>

      {/* Account / SLA Footer */}
      <div className="pt-4 border-t border-slate-800 px-3 text-xs text-slate-500 space-y-1">
        <div className="text-slate-300 font-medium truncate">LOGIX SISTEMAS CORPORATIVOS</div>
        <div className="text-[11px] font-mono">CNPJ: 08.123.456/0001-78</div>
        <div className="text-[11px] text-emerald-400/90 font-mono">Plano Enterprise SLA 99.95%</div>
      </div>
    </aside>
  );
};
