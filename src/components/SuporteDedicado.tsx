import React, { useState } from 'react';
import { 
  Headphones, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  FileQuestion,
  LifeBuoy,
  MessageSquare
} from 'lucide-react';

export const SuporteDedicado: React.FC = () => {
  const [assunto, setAssunto] = useState('');
  const [prioridade, setPrioridade] = useState<'critico' | 'alto' | 'medio'>('alto');
  const [ambiente, setAmbiente] = useState('producao');
  const [chaveAssociada, setChaveAssociada] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [protocoloChamado, setProtocoloChamado] = useState('');

  const rejeicoesComuns = [
    {
      codigo: 'Rejeição 204',
      titulo: 'Duplicidade de NF-e',
      causa: 'Tentativa de autorização de NF-e com o mesmo número, série e modelo já autorizada anteriormente na SEFAZ.',
      solucao: 'Consulte a chave de acesso já existente para obter o XML protocolado ou incremente o número da nota caso seja uma nova operação.'
    },
    {
      codigo: 'Rejeição 215',
      titulo: 'Falha de Schema XML',
      causa: 'O XML gerado contém tags inválidas, fora de ordem ou caracteres especiais não permitidos segundo o XSD v4.00.',
      solucao: 'Utilize o gerador de XML integrado do FiscalHub para sanitizar tags e validar tipos de dados antes do envio.'
    },
    {
      codigo: 'Rejeição 610',
      titulo: 'Total da NF difere do somatório dos itens',
      causa: 'O campo <vNF> não corresponde exatamente à soma de <vProd> - <vDesc> + <vFrete> + <vST> + <vIPI>.',
      solucao: 'Revise o arredondamento de centavos dos itens tributados para garantir paridade matemática exata.'
    },
    {
      codigo: 'Rejeição 928',
      titulo: 'Informado motivo de desoneração indevido',
      causa: 'A Nota Técnica 2024.001 exige correspondência exata entre CST de ICMS e o motivo da desoneração.',
      solucao: 'Ajuste os campos de benefício fiscal conforme a tabela padrão do Estado emitente.'
    }
  ];

  const handleSubmitChamado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assunto || !descricao) return;

    const protocolo = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    setProtocoloChamado(protocolo);
    setEnviado(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Atendimento Corporativo & Engenharia Fiscal
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>Suporte Técnico Dedicado & Central de SLA</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Equipe especializada em mensageria SEFAZ, contingência e implementação rápida em ERPs.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500">SLA Crítico: </span>
              <span className="text-emerald-400 font-bold">&le; 15 min</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Disponibilidade: </span>
              <span className="text-slate-200 font-bold">24/7/365</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Abertura de Chamado */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Canal Prioritário
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Abrir Chamado com Engenharia Fiscal
            </h3>
          </div>

          {enviado ? (
            <div className="p-6 bg-slate-950 rounded-lg border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Chamado Técnico Registrado!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Sua solicitação foi roteada para a fila de engenharia de integração com prioridade máxima.
              </p>
              <div className="p-2.5 bg-slate-900 rounded font-mono text-xs text-slate-300">
                Protocolo: <span className="text-emerald-400 font-bold">{protocoloChamado}</span>
              </div>
              <button
                onClick={() => {
                  setEnviado(false);
                  setAssunto('');
                  setDescricao('');
                  setChaveAssociada('');
                }}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded border border-slate-700"
              >
                Abrir Novo Chamado
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitChamado} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Assunto da Solicitação:</label>
                <input
                  type="text"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  placeholder="Ex: Falha na validação de certificado A1 ou Rejeição SEFAZ"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Prioridade / Severidade:</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="critico">Crítico (Emissão/Faturamento Parado - 15min)</option>
                    <option value="alto">Alto (Instabilidade de Integração - 1h)</option>
                    <option value="medio">Médio (Dúvida Técnica / Parametrização - 4h)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Ambiente Afetado:</label>
                  <select
                    value={ambiente}
                    onChange={(e) => setAmbiente(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="producao">Produção Nacional</option>
                    <option value="homologacao">Homologação / Sandbox</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Chave de Acesso Relacionada (opcional):</label>
                <input
                  type="text"
                  maxLength={44}
                  value={chaveAssociada}
                  onChange={(e) => setChaveAssociada(e.target.value.replace(/\D/g, ''))}
                  placeholder="44 dígitos da nota para diagnóstico do retorno SEFAZ"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Descrição do Problema / Log de Erro:</label>
                <textarea
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o comportamento inesperado, código de erro retornado pela SEFAZ ou dúvida de parametrização no ERP..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Solicitação para Engenharia</span>
              </button>
            </form>
          )}
        </div>

        {/* Painel Direito: Base de Conhecimento e Diagnóstico SEFAZ */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Diagnóstico Imediato
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Guia Rápido de Resolução de Rejeições SEFAZ
            </h3>
          </div>

          <div className="space-y-3">
            {rejeicoesComuns.map((rej) => (
              <div
                key={rej.codigo}
                className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    {rej.codigo}: {rej.titulo}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <span className="text-slate-300 font-semibold">Causa: </span>
                  {rej.causa}
                </p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-bold">Solução: </span>
                  {rej.solucao}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
