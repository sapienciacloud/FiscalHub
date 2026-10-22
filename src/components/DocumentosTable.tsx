import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Copy, 
  Check, 
  Send,
  ArrowUpDown,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { DocumentoFiscal, ModeloFiscal, TipoDocumento, StatusSEFAZ, TipoManifestacao } from '../types/fiscal';
import { formatarChaveAcesso, formatarCpfCnpj } from '../utils/chaveAcesso';

interface DocumentosTableProps {
  documentos: DocumentoFiscal[];
  onAbrirDanfe: (doc: DocumentoFiscal) => void;
  onAbrirXml: (doc: DocumentoFiscal) => void;
  onAbrirManifestacao: (doc: DocumentoFiscal) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

export const DocumentosTable: React.FC<DocumentosTableProps> = ({
  documentos,
  onAbrirDanfe,
  onAbrirXml,
  onAbrirManifestacao,
  selectedIds,
  onToggleSelect,
  onSelectAll
}) => {
  const [busca, setBusca] = useState('');
  const [filtroModelo, setFiltroModelo] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroUf, setFiltroUf] = useState<string>('todas');
  const [filtroManifestacao, setFiltroManifestacao] = useState<string>('todas');
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  // Lista única de UFs presentes
  const ufsDisponiveis = Array.from(new Set(documentos.map((d) => d.uf))).sort();

  // Filtragem
  const documentosFiltrados = documentos.filter((doc) => {
    // Busca textual
    const termo = busca.toLowerCase();
    const bateTexto =
      !busca ||
      doc.chaveAcesso.includes(termo) ||
      doc.numero.includes(termo) ||
      doc.emitente.razaoSocial.toLowerCase().includes(termo) ||
      doc.destinatario.razaoSocial.toLowerCase().includes(termo) ||
      doc.emitente.cnpj.includes(termo) ||
      doc.naturezaOperacao.toLowerCase().includes(termo);

    const bateModelo = filtroModelo === 'todos' || doc.modelo === filtroModelo;
    const bateTipo = filtroTipo === 'todos' || doc.tipo === filtroTipo;
    const bateUf = filtroUf === 'todas' || doc.uf === filtroUf;
    const bateManifestacao =
      filtroManifestacao === 'todas' || doc.manifestacaoDestinatario === filtroManifestacao;

    return bateTexto && bateModelo && bateTipo && bateUf && bateManifestacao;
  });

  const handleCopiarChave = (chave: string, id: string) => {
    navigator.clipboard.writeText(chave);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const todosFiltradosSelecionados =
    documentosFiltrados.length > 0 &&
    documentosFiltrados.every((d) => selectedIds.includes(d.id));

  const handleToggleSelectAll = () => {
    if (todosFiltradosSelecionados) {
      onSelectAll([]);
    } else {
      onSelectAll(documentosFiltrados.map((d) => d.id));
    }
  };

  const getManifestacaoBadge = (manifestacao: TipoManifestacao) => {
    switch (manifestacao) {
      case 'confirmada':
        return (
          <span className="text-[11px] font-mono text-emerald-400">
            Confirmada
          </span>
        );
      case 'ciencia':
        return (
          <span className="text-[11px] font-mono text-cyan-400">
            Ciência
          </span>
        );
      case 'desconhecida':
        return (
          <span className="text-[11px] font-mono text-rose-400">
            Desconhecida
          </span>
        );
      case 'nao_realizada':
        return (
          <span className="text-[11px] font-mono text-amber-400">
            Não Realizada
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-500">
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros e Busca */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por chave de 44 dígitos, número, razão social ou CNPJ..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Segmented Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Modelo */}
          <select
            value={filtroModelo}
            onChange={(e) => setFiltroModelo(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="todos">Todos os Modelos</option>
            <option value="55">NF-e (Mod. 55)</option>
            <option value="65">NFC-e (Mod. 65)</option>
          </select>

          {/* Tipo / Direção */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="todos">Entrada & Saída</option>
            <option value="recebida">Recebidas (Entrada)</option>
            <option value="emitida">Emitidas (Saída)</option>
          </select>

          {/* UF */}
          <select
            value={filtroUf}
            onChange={(e) => setFiltroUf(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="todas">Todas as UFs</option>
            {ufsDisponiveis.map((uf) => (
              <option key={uf} value={uf}>
                UF: {uf}
              </option>
            ))}
          </select>

          {/* Manifestação */}
          <select
            value={filtroManifestacao}
            onChange={(e) => setFiltroManifestacao(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="todas">Todas Manifestações</option>
            <option value="confirmada">Confirmadas</option>
            <option value="ciencia">Ciência</option>
            <option value="sem_manifestacao">Pendentes</option>
            <option value="desconhecida">Desconhecidas</option>
            <option value="nao_realizada">Não Realizadas</option>
          </select>
        </div>
      </div>

      {/* Info bar / Contador */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>Mostrando <span className="font-mono text-slate-200 tabular-nums">{documentosFiltrados.length}</span> de <span className="font-mono text-slate-200 tabular-nums">{documentos.length}</span> documentos fiscais</span>
          {selectedIds.length > 0 && (
            <span className="text-emerald-400 font-mono">
              · {selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''} para lote
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Validação SEFAZ Nacional · Assinatura ICP-Brasil
        </div>
      </div>

      {/* Tabela de Alta Densidade */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="p-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={todosFiltradosSelecionados}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                </th>
                <th className="p-3">Doc / Chave</th>
                <th className="p-3">UF / Modelo</th>
                <th className="p-3">Emitente</th>
                <th className="p-3">Destinatário</th>
                <th className="p-3 text-right">Valor Total</th>
                <th className="p-3 text-center">Status SEFAZ</th>
                <th className="p-3 text-center">Manifestação</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {documentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    Nenhum documento fiscal encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                documentosFiltrados.map((doc) => {
                  const isSelected = selectedIds.includes(doc.id);
                  const isCopiado = copiadoId === doc.id;

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(doc.id)}
                          className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Doc / Chave */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <span>Nº {doc.numero}</span>
                          <span className="text-[11px] font-mono text-slate-400">· S.{doc.serie}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]" title={doc.chaveAcesso}>
                            {doc.chaveAcesso.substring(0, 16)}...
                          </span>
                          <button
                            onClick={() => handleCopiarChave(doc.chaveAcesso, doc.id)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                            title="Copiar chave completa"
                          >
                            {isCopiado ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* UF / Modelo */}
                      <td className="p-3">
                        <div className="font-mono text-xs font-medium text-slate-300">
                          {doc.uf} · {doc.modelo === '55' ? 'NF-e (55)' : 'NFC-e (65)'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {doc.dataEmissao.substring(0, 10)}
                        </div>
                      </td>

                      {/* Emitente */}
                      <td className="p-3 max-w-[180px]">
                        <div className="font-medium text-slate-200 truncate" title={doc.emitente.razaoSocial}>
                          {doc.emitente.razaoSocial}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 truncate">
                          {doc.emitente.cnpj}
                        </div>
                      </td>

                      {/* Destinatário */}
                      <td className="p-3 max-w-[180px]">
                        <div className="font-medium text-slate-200 truncate" title={doc.destinatario.razaoSocial}>
                          {doc.destinatario.razaoSocial}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 truncate">
                          {formatarCpfCnpj(doc.destinatario.cpfCnpj)}
                        </div>
                      </td>

                      {/* Valor Total */}
                      <td className="p-3 text-right">
                        <div className="font-mono font-semibold text-slate-100 tabular-nums">
                          R$ {doc.totais.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          ICMS: R$ {doc.totais.valorIcms.toFixed(2)}
                        </div>
                      </td>

                      {/* Status SEFAZ */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] font-mono text-emerald-400 capitalize">
                            {doc.statusSefaz}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Prot: {doc.protocoloAutorizacao.substring(0, 8)}...
                        </div>
                      </td>

                      {/* Manifestação */}
                      <td className="p-3 text-center">
                        {getManifestacaoBadge(doc.manifestacaoDestinatario)}
                        {doc.tipo === 'recebida' && (
                          <div>
                            <button
                              onClick={() => onAbrirManifestacao(doc)}
                              className="text-[10px] text-slate-400 hover:text-emerald-400 hover:underline transition-colors mt-0.5 block mx-auto"
                            >
                              Alterar
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
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
                            title="Ver e Baixar XML"
                          >
                            <FileCode className="w-4 h-4" />
                          </button>

                          {doc.tipo === 'recebida' && (
                            <button
                              onClick={() => onAbrirManifestacao(doc)}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                              title="Manifestar Destinatário"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
