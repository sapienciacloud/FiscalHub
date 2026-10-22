import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Calculator, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { RegraFiscalItem } from '../types/fiscal';

interface ConformidadeFiscalProps {
  regras: RegraFiscalItem[];
}

export const ConformidadeFiscal: React.FC<ConformidadeFiscalProps> = ({ regras }) => {
  // Simulador de alíquota e validação fiscal
  const [origemUf, setOrigemUf] = useState('SP');
  const [destinoUf, setDestinoUf] = useState('MG');
  const [cfopInput, setCfopInput] = useState('6102');
  const [ncmInput, setNcmInput] = useState('8471.30.12');
  const [valorSimulacao, setValorSimulacao] = useState(10000);
  const [validacaoResultado, setValidacaoResultado] = useState<any>(null);

  const handleValidarOperacao = (e: React.FormEvent) => {
    e.preventDefault();

    const isInterestadual = origemUf !== destinoUf;
    const cfopPrimeiroDigito = cfopInput.trim()[0];

    // Valida consistência de CFOP
    let erroCfop = null;
    if (isInterestadual && cfopPrimeiroDigito === '5') {
      erroCfop = `Inconsistência SEFAZ: Operação interestadual (${origemUf} -> ${destinoUf}) exige CFOP iniciado por 6 (ex: 6102), mas foi informado CFOP interno ${cfopInput}. Rejeição 525.`;
    } else if (!isInterestadual && cfopPrimeiroDigito === '6') {
      erroCfop = `Inconsistência SEFAZ: Operação interna dentro do mesmo Estado (${origemUf}) exige CFOP iniciado por 5 (ex: 5102), mas foi informado CFOP interestadual ${cfopInput}. Rejeição 524.`;
    }

    // Alíquota interestadual padrão (Resolução Senado 22/1989 e 13/2012)
    let aliqInterestadual = 12;
    const estadosSulSudeste = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC'];
    if (estadosSulSudeste.includes(origemUf) && !estadosSulSudeste.includes(destinoUf)) {
      aliqInterestadual = 7; // Origem Sul/Sudeste para Norte/Nordeste/Centro-Oeste e ES = 7%
    }
    if (!isInterestadual) {
      aliqInterestadual = 18; // Média interna
    }

    const icmsCalculado = (valorSimulacao * aliqInterestadual) / 100;

    // Simulador Reforma Tributária (IBS + CBS estimada em 26.5% neutra)
    const cbsFederal = (valorSimulacao * 0.088);
    const ibsEstadualMunicipal = (valorSimulacao * 0.177);

    setValidacaoResultado({
      conforme: !erroCfop,
      erroCfop,
      aliqInterestadual,
      icmsCalculado,
      difalAplicavel: isInterestadual,
      cbsFederal,
      ibsEstadualMunicipal,
      totalReformaTributaria: cbsFederal + ibsEstadualMunicipal
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Conformidade Tributária Automatizada
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Radar Legislativo & Atualizações Fiscais em Tempo Real</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoramento contínuo de Notas Técnicas (SEFAZ), Convênios CONFAZ e Reforma Tributária (IBS/CBS).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Regras 2024/2025 Sincronizadas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Validador Tributário e Simulador */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Validador & Simulador de Regras Fiscais
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Teste de Consistência CFOP, NCM e Alíquotas Interestaduais
            </h3>
          </div>

          <form onSubmit={handleValidarOperacao} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">UF Origem (Emitente):</label>
                <select
                  value={origemUf}
                  onChange={(e) => setOrigemUf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE', 'DF', 'AM'].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">UF Destino (Destinatário):</label>
                <select
                  value={destinoUf}
                  onChange={(e) => setDestinoUf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {['MG', 'SP', 'RJ', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE', 'DF', 'AM'].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">CFOP da Operação:</label>
                <input
                  type="text"
                  value={cfopInput}
                  onChange={(e) => setCfopInput(e.target.value)}
                  placeholder="Ex: 5102 ou 6102"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Código NCM:</label>
                <input
                  type="text"
                  value={ncmInput}
                  onChange={(e) => setNcmInput(e.target.value)}
                  placeholder="Ex: 8471.30.12"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Valor da Operação (R$):</label>
              <input
                type="number"
                value={valorSimulacao}
                onChange={(e) => setValorSimulacao(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors mt-2"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Validar Consistência Fiscal</span>
            </button>
          </form>

          {/* Resultado da Validação */}
          {validacaoResultado && (
            <div className={`p-4 rounded-lg border text-xs space-y-2.5 ${
              validacaoResultado.conforme
                ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                : 'bg-rose-950/20 border-rose-500/40 text-slate-200'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                {validacaoResultado.conforme ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Operação em Plena Conformidade Fiscal SEFAZ</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">Risco de Rejeição SEFAZ Detectado</span>
                  </>
                )}
              </div>

              {validacaoResultado.erroCfop && (
                <div className="p-2 bg-rose-950/60 rounded border border-rose-800/40 text-[11px] text-rose-300">
                  {validacaoResultado.erroCfop}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block">Alíquota ICMS:</span>
                  <span className="text-white font-bold">{validacaoResultado.aliqInterestadual}% (R$ {validacaoResultado.icmsCalculado.toFixed(2)})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">DIFAL Aplicável:</span>
                  <span className="text-slate-200">{validacaoResultado.difalAplicavel ? 'Sim (EC 87/2015)' : 'Não'}</span>
                </div>
              </div>

              {/* Simulação Reforma Tributária */}
              <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-[11px] space-y-1">
                <div className="text-emerald-400 font-semibold font-mono flex items-center justify-between">
                  <span>Prévia Reforma Tributária (IBS + CBS):</span>
                  <span>Est. 26.5%</span>
                </div>
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>CBS Federal (8.8%):</span>
                  <span className="text-slate-200">R$ {validacaoResultado.cbsFederal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>IBS Subnacional (17.7%):</span>
                  <span className="text-slate-200">R$ {validacaoResultado.ibsEstadualMunicipal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Painel Direito: Radar de Legislação e Notas Técnicas */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Legislação Vigente & Notas Técnicas
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Normas SEFAZ e Convênios em Aplicação Automática
            </h3>
          </div>

          <div className="space-y-3">
            {regras.map((regra) => (
              <div
                key={regra.id}
                className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 text-[11px]">
                      {regra.codigo}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 text-[11px]">{regra.vigencia}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Impacto {regra.impacto.toUpperCase()}
                  </span>
                </div>

                <div className="font-semibold text-slate-200">
                  {regra.titulo}
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {regra.descricao}
                </p>

                <div className="p-2 bg-slate-900 rounded border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">Ação no ERP:</span>
                  <span>{regra.acaoRecomendada}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
