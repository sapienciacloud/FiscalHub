import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldAlert, FileText, Send } from 'lucide-react';
import { DocumentoFiscal, TipoManifestacao } from '../types/fiscal';

interface ManifestacaoModalProps {
  documento: DocumentoFiscal;
  onClose: () => void;
  onSalvar: (id: string, tipo: TipoManifestacao, justificativa?: string) => void;
}

export const ManifestacaoModal: React.FC<ManifestacaoModalProps> = ({
  documento,
  onClose,
  onSalvar
}) => {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoManifestacao>(
    documento.manifestacaoDestinatario === 'sem_manifestacao'
      ? 'confirmada'
      : documento.manifestacaoDestinatario
  );
  const [justificativa, setJustificativa] = useState(documento.justificativaManifestacao || '');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [protocoloEvento, setProtocoloEvento] = useState('');

  const opcoes = [
    {
      tipo: 'confirmada' as TipoManifestacao,
      codigo: '210200',
      titulo: 'Confirmação da Operação',
      descricao: 'Confirma o recebimento físico da mercadoria e valida o negócio jurídico com efeitos fiscais plenos.',
      requerJustificativa: false
    },
    {
      tipo: 'ciencia' as TipoManifestacao,
      codigo: '210210',
      titulo: 'Ciência da Emissão',
      descricao: 'Declara que a empresa tomou conhecimento da emissão da nota, permitindo o download do XML completo na SEFAZ.',
      requerJustificativa: false
    },
    {
      tipo: 'desconhecida' as TipoManifestacao,
      codigo: '210220',
      titulo: 'Desconhecimento da Operação',
      descricao: 'Informa à SEFAZ que a empresa destinatária desconhece a operação mercantil (fraude ou emissão indevida contra seu CNPJ).',
      requerJustificativa: false
    },
    {
      tipo: 'nao_realizada' as TipoManifestacao,
      codigo: '210240',
      titulo: 'Operação não Realizada',
      descricao: 'Informa que a operação estava prevista mas não se concretizou (devolução, avaria no frete, sinistro, cancelamento do pedido).',
      requerJustificativa: true
    }
  ];

  const handleEnviar = () => {
    if (tipoSelecionado === 'nao_realizada' && justificativa.trim().length < 15) {
      alert('A justificativa da SEFAZ deve conter no mínimo 15 caracteres.');
      return;
    }

    setEnviando(true);
    setTimeout(() => {
      const protocolo = '135240' + Math.floor(100000000 + Math.random() * 900000000);
      setProtocoloEvento(protocolo);
      setEnviando(false);
      setSucesso(true);
      onSalvar(documento.id, tipoSelecionado, justificativa);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl text-slate-100 flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Manifestação do Destinatário (DFe)</div>
              <div className="text-xs font-mono text-slate-400">
                NF-e Nº {documento.numero} · {documento.emitente.razaoSocial}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {sucesso ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Evento Homologado na SEFAZ</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                O evento de manifestação foi assinado digitalmente pelo certificado e registrado na SEFAZ com validade fiscal.
              </p>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-300">
                Protocolo do Evento: <span className="text-emerald-400 font-bold">{protocoloEvento}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 rounded bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Chave: {documento.chaveAcesso.substring(0, 20)}...</span>
                  <span className="text-slate-300">Valor: R$ {documento.totais.valorNota.toFixed(2)}</span>
                </div>
                <div className="text-slate-300">Emitente: {documento.emitente.razaoSocial} ({documento.emitente.cnpj})</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Selecione o Tipo de Evento SEFAZ:
                </label>
                <div className="space-y-2">
                  {opcoes.map((opcao) => {
                    const isSelected = tipoSelecionado === opcao.tipo;
                    return (
                      <div
                        key={opcao.tipo}
                        onClick={() => setTipoSelecionado(opcao.tipo)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="manifestacao"
                              checked={isSelected}
                              onChange={() => setTipoSelecionado(opcao.tipo)}
                              className="text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                            />
                            <span className="text-xs font-medium">{opcao.titulo}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            Evento {opcao.codigo}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 pl-5">
                          {opcao.descricao}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {tipoSelecionado === 'nao_realizada' && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Justificativa Obrigatória (mínimo 15 caracteres):
                  </label>
                  <textarea
                    rows={2}
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    placeholder="Ex: Mercadoria recusada no ato da entrega por avaria no transporte."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="text-[10px] text-slate-500 text-right font-mono">
                    {justificativa.length} caracteres
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white rounded border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEnviar}
                  disabled={enviando}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{enviando ? 'Homologando na SEFAZ...' : 'Registrar Manifestação'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
