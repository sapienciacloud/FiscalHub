import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  FileSpreadsheet, 
  PieChart, 
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { DocumentoFiscal } from '../types/fiscal';
import { downloadArquivo } from '../utils/xmlGenerator';

interface RelatoriosAnaliticosProps {
  documentos: DocumentoFiscal[];
}

export const RelatoriosAnaliticos: React.FC<RelatoriosAnaliticosProps> = ({ documentos }) => {
  const [periodoFiltro, setPeriodoFiltro] = useState<'7d' | '30d' | 'mes' | 'todos'>('todos');

  // Cálculos consolidados
  const totalEmitidas = documentos.filter((d) => d.tipo === 'emitida');
  const totalRecebidas = documentos.filter((d) => d.tipo === 'recebida');

  const valorTotalGeral = documentos.reduce((acc, d) => acc + d.totais.valorNota, 0);
  const valorEmitidas = totalEmitidas.reduce((acc, d) => acc + d.totais.valorNota, 0);
  const valorRecebidas = totalRecebidas.reduce((acc, d) => acc + d.totais.valorNota, 0);

  // Crédito de ICMS das notas de entrada
  const icmsCreditoRecuperavel = totalRecebidas.reduce((acc, d) => acc + d.totais.valorIcms, 0);
  const pisCofinsTotal = documentos.reduce((acc, d) => acc + d.totais.valorPis + d.totais.valorCofins, 0);
  const ticketMedio = documentos.length > 0 ? valorTotalGeral / documentos.length : 0;

  // Agrupamento por UF
  const agrupamentoUf = documentos.reduce((acc, d) => {
    acc[d.uf] = (acc[d.uf] || 0) + d.totais.valorNota;
    return acc;
  }, {} as Record<string, number>);

  const ufsOrdenadas = Object.entries(agrupamentoUf).sort((a, b) => b[1] - a[1]);
  const maiorValorUf = ufsOrdenadas[0] ? ufsOrdenadas[0][1] : 1;

  // Modelo 55 vs 65
  const countMod55 = documentos.filter((d) => d.modelo === '55').length;
  const countMod65 = documentos.filter((d) => d.modelo === '65').length;

  const handleExportarCsv = () => {
    let csv = 'Chave;Modelo;Serie;Numero;Data;Tipo;UF;Emitente;Destinatario;Valor_Total;ICMS;PIS;COFINS;Status\n';
    documentos.forEach((d) => {
      csv += `"${d.chaveAcesso}";"${d.modelo}";"${d.serie}";"${d.numero}";"${d.dataEmissao}";"${d.tipo}";"${d.uf}";"${d.emitente.razaoSocial}";"${d.destinatario.razaoSocial}";"${d.totais.valorNota.toFixed(2)}";"${d.totais.valorIcms.toFixed(2)}";"${d.totais.valorPis.toFixed(2)}";"${d.totais.valorCofins.toFixed(2)}";"${d.statusSefaz}"\n`;
    });
    downloadArquivo('\uFEFF' + csv, `relatorio_analitico_fiscal_${new Date().toISOString().substring(0, 10)}.csv`, 'text/csv');
  };

  const handleExportarSped = () => {
    // Relatório sintético no padrão do Guia Prático do SPED Fiscal (EFD ICMS IPI - Bloco C)
    let sped = `|0000|018|0|${new Date().toISOString().substring(0, 10).replace(/-/g, '')}|${new Date().toISOString().substring(0, 10).replace(/-/g, '')}|LOGIX SISTEMAS CORPORATIVOS|08123456000178|SP|209876543210|3550308||A|1|\n`;
    documentos.forEach((d) => {
      const indOper = d.tipo === 'emitida' ? '1' : '0';
      const indEmit = d.tipo === 'emitida' ? '0' : '1';
      sped += `|C100|${indOper}|${indEmit}|${d.destinatario.cpfCnpj.replace(/\D/g, '')}|${d.modelo}|01|${d.serie}|${d.numero}|${d.chaveAcesso}|${d.dataEmissao.substring(0, 10).replace(/-/g, '')}|${d.dataEmissao.substring(0, 10).replace(/-/g, '')}|${d.totais.valorNota.toFixed(2)}|1|${d.totais.valorDesconto.toFixed(2)}|0.00|${d.totais.valorProdutos.toFixed(2)}|0|${d.totais.valorFrete.toFixed(2)}|${d.totais.valorSeguro.toFixed(2)}|${d.totais.outrasDespesas.toFixed(2)}|${d.totais.baseCalculoIcms.toFixed(2)}|${d.totais.valorIcms.toFixed(2)}|${d.totais.baseCalculoIcmsSt.toFixed(2)}|${d.totais.valorIcmsSt.toFixed(2)}|${d.totais.valorIpi.toFixed(2)}|${d.totais.valorPis.toFixed(2)}|${d.totais.valorCofins.toFixed(2)}|0.00|0.00|\n`;
    });
    downloadArquivo(sped, `sped_fiscal_bloco_c_${new Date().toISOString().substring(0, 10)}.txt`, 'text/plain');
  };

  return (
    <div className="space-y-6">
      {/* Header com Ações de Exportação */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Painéis de Controle Personalizados
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Relatórios Analíticos Fiscais & Fechamento Contábil</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consolidação de fluxo financeiro, apuração de créditos tributários e exportação para ERPs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportarSped}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exportar SPED Bloco C</span>
            </button>

            <button
              onClick={handleExportarCsv}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Relatório CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de KPIs Financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Geral Movimentado */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-medium">Volume Total Transacionado</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            R$ {valorTotalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {documentos.length} notas processadas
          </div>
        </div>

        {/* Crédito ICMS Recuperável */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-medium">Crédito de ICMS Recuperável</div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            R$ {icmsCreditoRecuperavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-emerald-500">
            {totalRecebidas.length} notas de entrada (compras)
          </div>
        </div>

        {/* PIS / COFINS */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-medium">PIS & COFINS Apurado</div>
          <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
            R$ {pisCofinsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Regime Não Cumulativo
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-medium">Ticket Médio por Nota</div>
          <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
            R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Média ponderada do período
          </div>
        </div>
      </div>

      {/* Gráficos e Distribuições */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribuição por Estado (UF) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Faturamento & Movimentação por UF (Top Estados)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {ufsOrdenadas.length} Estados Ativos
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {ufsOrdenadas.map(([uf, valor]) => {
              const porcentagem = Math.round((valor / maiorValorUf) * 100);
              return (
                <div key={uf} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-semibold">{uf}</span>
                    <span className="text-slate-200 tabular-nums">
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composição por Direção e Modelo */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Composição do Fluxo de Documentos
          </h3>

          {/* Emitidas vs Recebidas */}
          <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="text-slate-400 font-medium">Fluxo de Direção (Entradas vs Saídas):</div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Emitidas (Saída)</span>
                </div>
                <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                  R$ {valorEmitidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {totalEmitidas.length} notas
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Recebidas (Entrada)</span>
                </div>
                <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                  R$ {valorRecebidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {totalRecebidas.length} notas
                </div>
              </div>
            </div>
          </div>

          {/* Modelo 55 vs 65 */}
          <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="text-slate-400 font-medium">Proporção por Modelo Fiscal:</div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="font-mono text-slate-300 font-semibold">NF-e (Modelo 55)</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">
                  {countMod55} docs
                </div>
                <div className="text-[11px] text-slate-500">Operações B2B / Indústria</div>
              </div>

              <div>
                <div className="font-mono text-slate-300 font-semibold">NFC-e (Modelo 65)</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">
                  {countMod65} docs
                </div>
                <div className="text-[11px] text-slate-500">Consumidor Final / PDV</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
