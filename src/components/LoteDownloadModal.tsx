import React, { useState } from 'react';
import JSZip from 'jszip';
import { X, Download, FileArchive, CheckCircle2, AlertCircle } from 'lucide-react';
import { DocumentoFiscal } from '../types/fiscal';
import { gerarXmlNFe } from '../utils/xmlGenerator';

interface LoteDownloadModalProps {
  documentos: DocumentoFiscal[];
  onClose: () => void;
}

export const LoteDownloadModal: React.FC<LoteDownloadModalProps> = ({ documentos, onClose }) => {
  const [incluirDanfeTxt, setIncluirDanfeTxt] = useState(true);
  const [incluirCsv, setIncluirCsv] = useState(true);
  const [organizarPorUf, setOrganizarPorUf] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [concluido, setConcluido] = useState(false);

  const totalValor = documentos.reduce((acc, doc) => acc + doc.totais.valorNota, 0);

  const handleGerarZip = async () => {
    try {
      setProcessando(true);
      setProgresso(10);

      const zip = new JSZip();
      const nfeFolder = zip.folder('xml_autorizados') || zip;

      // Adiciona cada XML no ZIP
      for (let i = 0; i < documentos.length; i++) {
        const doc = documentos[i];
        const xml = doc.xmlString || gerarXmlNFe(doc);
        const folder = organizarPorUf ? nfeFolder.folder(doc.uf) || nfeFolder : nfeFolder;
        
        folder.file(`${doc.chaveAcesso}-procNFe.xml`, xml);

        if (incluirDanfeTxt) {
          const danfeTxt = `DANFE SIMPLIFICADO - FISCALHUB
Chave de Acesso: ${doc.chaveAcesso}
Modelo: ${doc.modelo} | Série: ${doc.serie} | Número: ${doc.numero}
Emitente: ${doc.emitente.razaoSocial} (CNPJ: ${doc.emitente.cnpj})
Destinatário: ${doc.destinatario.razaoSocial} (Doc: ${doc.destinatario.cpfCnpj})
Data Emissão: ${doc.dataEmissao}
Valor Total: R$ ${doc.totais.valorNota.toFixed(2)}
Protocolo SEFAZ: ${doc.protocoloAutorizacao}
Status: ${doc.statusSefaz.toUpperCase()}
Itens (${doc.itens.length}):
${doc.itens.map(it => `- [${it.codigoProduto}] ${it.descricao}: ${it.quantidade} ${it.unidade} x R$ ${it.valorUnitario.toFixed(2)} = R$ ${it.valorTotal.toFixed(2)}`).join('\n')}`;
          folder.file(`${doc.chaveAcesso}-resumo.txt`, danfeTxt);
        }

        setProgresso(Math.round(10 + ((i + 1) / documentos.length) * 60));
      }

      // Adiciona relatório CSV consolidado
      if (incluirCsv) {
        let csvContent = 'Chave de Acesso;Modelo;Serie;Numero;Data Emissao;UF;Emitente CNPJ;Emitente Razao;Destinatario Doc;Destinatario Razao;Valor Produtos;Valor ICMS;Valor PIS;Valor COFINS;Valor Total;Status SEFAZ;Protocolo\n';
        documentos.forEach((d) => {
          csvContent += `"${d.chaveAcesso}";"${d.modelo}";"${d.serie}";"${d.numero}";"${d.dataEmissao}";"${d.uf}";"${d.emitente.cnpj}";"${d.emitente.razaoSocial}";"${d.destinatario.cpfCnpj}";"${d.destinatario.razaoSocial}";"${d.totais.valorProdutos.toFixed(2)}";"${d.totais.valorIcms.toFixed(2)}";"${d.totais.valorPis.toFixed(2)}";"${d.totais.valorCofins.toFixed(2)}";"${d.totais.valorNota.toFixed(2)}";"${d.statusSefaz}";"${d.protocoloAutorizacao}"\n`;
        });
        zip.file('relatorio_consolidado_fiscal.csv', '\uFEFF' + csvContent);
      }

      // Manifesto JSON
      const manifesto = {
        geradoEm: new Date().toISOString(),
        totalNotas: documentos.length,
        valorTotalGeral: totalValor,
        sistema: 'FiscalHub Enterprise',
        chaves: documentos.map((d) => ({
          chave: d.chaveAcesso,
          modelo: d.modelo,
          numero: d.numero,
          uf: d.uf,
          valor: d.totais.valorNota
        }))
      };
      zip.file('manifesto_lote.json', JSON.stringify(manifesto, null, 2));

      setProgresso(85);
      const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setProgresso(Math.round(85 + (metadata.percent / 100) * 15));
      });

      // Dispara o download
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const fileName = `lote_fiscal_${documentos.length}_xmls_${timestamp}.zip`;
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProcessando(false);
      setConcluido(true);
    } catch (err) {
      console.error('Erro ao gerar ZIP de lote:', err);
      setProcessando(false);
      alert('Ocorreu um erro ao compactar o lote de arquivos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg text-slate-100 flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileArchive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Download em Lote de Documentos Fiscais</div>
              <div className="text-xs text-slate-400">
                Geração de pacote compactado ZIP com XMLs oficiais
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
          {concluido ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Download Concluído com Sucesso!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                O arquivo ZIP contendo {documentos.length} documentos fiscais autorizados foi gerado e salvo em seu computador.
              </p>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Resumo do Lote */}
              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">Resumo da Seleção Atual:</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Total de Notas:</span>
                    <span className="text-white font-mono font-bold text-sm tabular-nums">
                      {documentos.length} documento{documentos.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Valor Financeiro:</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm tabular-nums">
                      R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Opções de Pacote */}
              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-semibold text-slate-300">Opções de Exportação:</div>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organizarPorUf}
                    onChange={(e) => setOrganizarPorUf(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Organizar XMLs em subpastas por Estado (UF)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incluirCsv}
                    onChange={(e) => setIncluirCsv(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Incluir planilha consolidada em CSV para importação em ERPs</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incluirDanfeTxt}
                    onChange={(e) => setIncluirDanfeTxt(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Incluir resumo textual de DANFE para cada documento</span>
                </label>
              </div>

              {processando && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Compactando arquivos XML...</span>
                    <span>{progresso}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={processando}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white rounded border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGerarZip}
                  disabled={processando || documentos.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{processando ? 'Processando Lote...' : 'Baixar Arquivo ZIP'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
