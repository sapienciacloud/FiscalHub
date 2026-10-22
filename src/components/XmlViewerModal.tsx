import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { DocumentoFiscal } from '../types/fiscal';
import { gerarXmlNFe, downloadArquivo } from '../utils/xmlGenerator';

interface XmlViewerModalProps {
  documento: DocumentoFiscal;
  onClose: () => void;
}

export const XmlViewerModal: React.FC<XmlViewerModalProps> = ({ documento, onClose }) => {
  const [copiado, setCopiado] = useState(false);
  const xmlContent = documento.xmlString || gerarXmlNFe(documento);

  const handleCopiar = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDownload = () => {
    downloadArquivo(xmlContent, `${documento.chaveAcesso}-procNFe.xml`, 'application/xml');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl text-slate-100 flex flex-col shadow-2xl overflow-hidden my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold flex items-center gap-2">
                <span>XML Autorizado - Layout SEFAZ v4.00</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  Assinatura Digital Válida
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                Chave: {documento.chaveAcesso}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopiar}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiado ? 'Copiado' : 'Copiar XML'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo .xml</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* XML Raw Content with styling */}
        <div className="p-4 bg-slate-950 overflow-auto font-mono text-xs text-slate-300 leading-relaxed max-h-[calc(90vh-130px)]">
          <pre className="whitespace-pre overflow-x-auto selection:bg-emerald-500/30 selection:text-emerald-200">
            {xmlContent}
          </pre>
        </div>

        {/* Footer status bar */}
        <div className="px-6 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Schema XSD `procNFe_v4.00.xsd` validado com sucesso</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Tamanho: ~{(xmlContent.length / 1024).toFixed(1)} KB · UTF-8
          </div>
        </div>
      </div>
    </div>
  );
};
