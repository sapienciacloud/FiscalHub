import React from 'react';
import { 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  FileCode, 
  Download, 
  Search, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Server,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DocumentoFiscal, StatusSefazUF } from '../types/fiscal';
import { formatarChaveAcesso, formatarCpfCnpj } from '../utils/chaveAcesso';

interface MonitoramentoGeralProps {
  documentos: DocumentoFiscal[];
  servidores: StatusSefazUF[];
  onOpenConsulta: () => void;
  onOpenLote: () => void;
  onAbrirDanfe: (doc: DocumentoFiscal) => void;
  onAbrirXml: (doc: DocumentoFiscal) => void;
  onAbrirManifestacao: (doc: DocumentoFiscal) => void;
  onNavigateTab: (tab: string) => void;
}

export const MonitoramentoGeral: React.FC<MonitoramentoGeralProps> = ({
  documentos,
  servidores,
  onOpenConsulta,
  onOpenLote,
  onAbrirDanfe,
  onAbrirXml,
  onAbrirManifestacao,
  onNavigateTab
}) => {
  const totalEmitidas = documentos.filter((d) => d.tipo === 'emitida');
  const totalRecebidas = documentos.filter((d) => d.tipo === 'recebida');

  const valorTotal = documentos.reduce((acc, d) => acc + d.totais.valorNota, 0);
  const valorEmitidas = totalEmitidas.reduce((acc, d) => acc + d.totais.valorNota, 0);
  const valorRecebidas = totalRecebidas.reduce((acc, d) => acc + d.totais.valorNota, 0);

  const pendentesManifestacao = totalRecebidas.filter(
    (d) => d.manifestacaoDestinatario === 'sem_manifestacao'
  );

  // Servidores com instabilidade
  const instaveis = servidores.filter((s) => s.status === 'instavel');

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-Vindas e Status Geral */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Painel Administrativo em Tempo Real
            </div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Controle Fiscal Unificado de NF-e e NFC-e</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Monitoramento ativo de documentos fiscais emitidos e recebidos em todos os 26 Estados e Distrito Federal, sincronização contínua com ERPs e download automático em lote.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenLote}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baixar XMLs em Lote</span>
            </button>

            <button
              onClick={onOpenConsulta}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Nova Consulta SEFAZ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Financeiro */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-medium">Faturamento Total Monitorado</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>{documentos.length} documentos</span>
            <span className="text-emerald-400">100% Homologados</span>
          </div>
        </div>

        {/* KPI 2: Notas Emitidas (Saída) */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">Documentos Emitidos (Saídas)</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            R$ {valorEmitidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>{totalEmitidas.length} emitidas</span>
            <span>NF-e + NFC-e</span>
          </div>
        </div>

        {/* KPI 3: Notas Recebidas (Entrada) */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">Documentos Recebidos (Entradas)</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
            R$ {valorRecebidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>{totalRecebidas.length} recebidas</span>
            <span>Créditos de ICMS</span>
          </div>
        </div>

        {/* KPI 4: Manifestações Pendentes */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-medium">Manifestação do Destinatário</div>
          <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {pendentesManifestacao.length} Pendentes
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>Evite autuações fiscais</span>
            <button
              onClick={() => onNavigateTab('documentos')}
              className="text-amber-400 hover:underline"
            >
              Resolver &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Monitor SEFAZ & Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Documentos Recentes com Ações Rápidas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Fluxo Recente de Documentos Fiscais
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">
                Sincronização Ativa
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('documentos')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Ver Todos ({documentos.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {documentos.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-slate-950/70 hover:bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 font-mono">
                      {doc.modelo === '55' ? 'NF-e' : 'NFC-e'} Nº {doc.numero}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">{doc.uf}</span>
                    <span className="text-slate-500">·</span>
                    <span className={`text-[11px] font-mono ${doc.tipo === 'emitida' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {doc.tipo === 'emitida' ? 'Saída' : 'Entrada'}
                    </span>
                  </div>
                  <div className="text-slate-300 truncate max-w-sm">
                    {doc.tipo === 'emitida' ? `Dest: ${doc.destinatario.razaoSocial}` : `Emit: ${doc.emitente.razaoSocial}`}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Chave: {doc.chaveAcesso.substring(0, 24)}...
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-bold text-white text-xs tabular-nums">
                      R$ {doc.totais.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {doc.dataEmissao.substring(0, 10)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
                    <button
                      onClick={() => onAbrirDanfe(doc)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                      title="Visualizar DANFE"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAbrirXml(doc)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                      title="Ver XML"
                    >
                      <FileCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel Direito: Status SEFAZ & Integração ERP */}
        <div className="lg:col-span-4 space-y-4">
          {/* Status SEFAZ Resumo */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Status SEFAZ Nacional</span>
              </span>
              <button
                onClick={() => onNavigateTab('sefaz')}
                className="text-xs text-slate-400 hover:text-emerald-400 font-mono"
              >
                Detalhes &rarr;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 font-mono">
                <span className="text-slate-300">Ambiente Nacional (RFB)</span>
                <span className="text-emerald-400 font-bold">Operacional</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 font-mono">
                <span className="text-slate-300">SVRS (Sul / Sudeste)</span>
                <span className="text-emerald-400 font-bold">110ms</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 font-mono">
                <span className="text-slate-300">SEFAZ-SP (Própria)</span>
                <span className="text-emerald-400 font-bold">142ms</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 font-mono">
                <span className="text-slate-300">SEFAZ-MG (Própria)</span>
                <span className="text-emerald-400 font-bold">185ms</span>
              </div>
            </div>

            {instaveis.length > 0 && (
              <div className="p-2.5 bg-amber-950/40 border border-amber-800/40 rounded text-amber-300 text-xs flex items-start gap-2">
                <span className="text-[11px]">
                  Alerta: SEFAZ-{instaveis[0].uf} com tempo de resposta elevado ({instaveis[0].tempoRespostaMs}ms). Contingência SVC em prontidão.
                </span>
              </div>
            )}
          </div>

          {/* Integração ERP Ativa */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Integração com ERP Contábil
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sincronização bidirecional configurada com TOTVS Protheus e SAP S/4HANA via API REST segura.
            </p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Webhook ERP:</span>
                <span className="text-emerald-400">Ativo</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Último sync:</span>
                <span>Há 4 minutos</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('api')}
              className="w-full py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              Gerenciar Chaves & Webhooks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
