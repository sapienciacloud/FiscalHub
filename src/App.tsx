import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MonitoramentoGeral } from './components/MonitoramentoGeral';
import { DocumentosTable } from './components/DocumentosTable';
import { ApiExplorer } from './components/ApiExplorer';
import { ConformidadeFiscal } from './components/ConformidadeFiscal';
import { RelatoriosAnaliticos } from './components/RelatoriosAnaliticos';
import { CertificadosESefaz } from './components/CertificadosESefaz';
import { SegurancaMFA } from './components/SegurancaMFA';
import { SuporteDedicado } from './components/SuporteDedicado';
import { DanfeModal } from './components/DanfeModal';
import { XmlViewerModal } from './components/XmlViewerModal';
import { ManifestacaoModal } from './components/ManifestacaoModal';
import { LoteDownloadModal } from './components/LoteDownloadModal';
import { ConsultaModal } from './components/ConsultaModal';

import { 
  DocumentoFiscal, 
  StatusSefazUF, 
  ApiKeyItem, 
  ApiRequestLog, 
  AuditSecurityLog, 
  CertificadoDigitalInfo,
  TipoManifestacao 
} from './types/fiscal';

import { 
  DOCUMENTOS_FISCAIS_INICIAIS, 
  CERTIFICADO_CONFIG_INICIAL, 
  API_KEYS_INICIAIS, 
  API_LOGS_INICIAIS, 
  REGRAS_FISCAIS, 
  AUDIT_LOGS_INICIAIS 
} from './data/mockFiscalData';

import { SERVIDORES_SEFAZ_INICIAIS } from './utils/sefazSimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('monitoramento');
  const [documentos, setDocumentos] = useState<DocumentoFiscal[]>(DOCUMENTOS_FISCAIS_INICIAIS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMfaActive, setIsMfaActive] = useState<boolean>(true);
  const [certificado, setCertificado] = useState<CertificadoDigitalInfo>(CERTIFICADO_CONFIG_INICIAL);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(API_KEYS_INICIAIS);
  const [apiLogs, setApiLogs] = useState<ApiRequestLog[]>(API_LOGS_INICIAIS);
  const [auditLogs, setAuditLogs] = useState<AuditSecurityLog[]>(AUDIT_LOGS_INICIAIS);
  const [servidores, setServidores] = useState<StatusSefazUF[]>(SERVIDORES_SEFAZ_INICIAIS);

  // Modais
  const [danfeDoc, setDanfeDoc] = useState<DocumentoFiscal | null>(null);
  const [xmlDoc, setXmlDoc] = useState<DocumentoFiscal | null>(null);
  const [manifestacaoDoc, setManifestacaoDoc] = useState<DocumentoFiscal | null>(null);
  const [modalConsultaOpen, setModalConsultaOpen] = useState(false);
  const [modalLoteOpen, setModalLoteOpen] = useState(false);

  // Seleção de itens
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  // Adicionar nota após consulta SEFAZ
  const handleAdicionarNota = (novaNota: DocumentoFiscal) => {
    setDocumentos((prev) => {
      const idx = prev.findIndex((d) => d.chaveAcesso === novaNota.chaveAcesso);
      if (idx >= 0) {
        const atualizado = [...prev];
        atualizado[idx] = novaNota;
        return atualizado;
      }
      return [novaNota, ...prev];
    });

    // Registra log de auditoria
    const novoAudit: AuditSecurityLog = {
      id: 'sec-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuario: 'carlos.fiscal@logix.com.br',
      evento: `Consulta SEFAZ ${novaNota.uf} (${novaNota.modelo === '55' ? 'NF-e' : 'NFC-e'})`,
      categoria: 'sefaz',
      ip: '177.136.24.90',
      localizacao: 'São Paulo, SP - Brasil',
      status: 'sucesso',
      detalhes: `Chave ${novaNota.chaveAcesso} consultada ${novaNota.consultadoComCertificado ? 'com' : 'sem'} certificado digital`
    };
    setAuditLogs((prev) => [novoAudit, ...prev]);
  };

  // Salvar manifestação
  const handleSalvarManifestacao = (id: string, tipo: TipoManifestacao, justificativa?: string) => {
    setDocumentos((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            manifestacaoDestinatario: tipo,
            justificativaManifestacao: justificativa,
            dataManifestacao: new Date().toISOString()
          };
        }
        return doc;
      })
    );

    // Registra auditoria
    const docAlvo = documentos.find((d) => d.id === id);
    const novoAudit: AuditSecurityLog = {
      id: 'sec-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuario: 'carlos.fiscal@logix.com.br',
      evento: `Manifestação: ${tipo.toUpperCase()}`,
      categoria: 'sefaz',
      ip: '177.136.24.90',
      localizacao: 'São Paulo, SP - Brasil',
      status: 'sucesso',
      detalhes: `NF-e Nº ${docAlvo?.numero || ''} protocolada com evento ${tipo}`
    };
    setAuditLogs((prev) => [novoAudit, ...prev]);
  };

  // Criar nova API key
  const handleCriarApiKey = (
    nome: string,
    ambiente: 'producao' | 'homologacao',
    permissoes: ('consulta' | 'manifestacao' | 'download_lote' | 'admin')[]
  ) => {
    const rawRandom = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const prefix = ambiente === 'producao' ? 'fh_live_' : 'fh_test_';
    const nova: ApiKeyItem = {
      id: 'key-' + Date.now(),
      nome,
      chaveMascarada: `${prefix}${rawRandom.substring(0, 4)}••••••••••••••••${rawRandom.substring(28)}`,
      chaveCompleta: `${prefix}${rawRandom}`,
      ambiente,
      permissoes,
      criadaEm: new Date().toISOString().substring(0, 10),
      ultimoUso: 'Nunca',
      ativa: true
    };
    setApiKeys((prev) => [nova, ...prev]);
  };

  const handleRevogarApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  // Atualizar sondagem dos servidores SEFAZ
  const handleAtualizarServidores = () => {
    setServidores((prev) =>
      prev.map((s) => ({
        ...s,
        tempoRespostaMs: Math.max(80, Math.round(s.tempoRespostaMs + (Math.random() * 40 - 20))),
        ultimaVerificacao: 'Agora mesmo'
      }))
    );
  };

  // Documentos a exportar no lote
  const documentosParaLote =
    selectedIds.length > 0
      ? documentos.filter((d) => selectedIds.includes(d.id))
      : documentos;

  const sefazInstavel = servidores.some((s) => s.status === 'instavel');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConsulta={() => setModalConsultaOpen(true)}
        onOpenLote={() => setModalLoteOpen(true)}
        isMfaActive={isMfaActive}
        selectedCount={selectedIds.length}
      />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            documentosCount={documentos.length}
            sefazInstavel={sefazInstavel}
          />
        </div>

        {/* Main Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-hidden">
          {activeTab === 'monitoramento' && (
            <MonitoramentoGeral
              documentos={documentos}
              servidores={servidores}
              onOpenConsulta={() => setModalConsultaOpen(true)}
              onOpenLote={() => setModalLoteOpen(true)}
              onAbrirDanfe={(doc) => setDanfeDoc(doc)}
              onAbrirXml={(doc) => setXmlDoc(doc)}
              onAbrirManifestacao={(doc) => setManifestacaoDoc(doc)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'documentos' && (
            <DocumentosTable
              documentos={documentos}
              onAbrirDanfe={(doc) => setDanfeDoc(doc)}
              onAbrirXml={(doc) => setXmlDoc(doc)}
              onAbrirManifestacao={(doc) => setManifestacaoDoc(doc)}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
            />
          )}

          {activeTab === 'lote' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <h2 className="text-sm font-bold text-white mb-1">Download em Lote de Documentos Fiscais</h2>
                <p className="text-xs text-slate-400">
                  Exporte os XMLs oficiais com assinatura digital e relatórios fiscais consolidados para importação contábil.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setModalLoteOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors"
                  >
                    Abrir Gerador de Pacote ZIP ({documentosParaLote.length} notas prontas)
                  </button>
                </div>
              </div>
              <DocumentosTable
                documentos={documentos}
                onAbrirDanfe={(doc) => setDanfeDoc(doc)}
                onAbrirXml={(doc) => setXmlDoc(doc)}
                onAbrirManifestacao={(doc) => setManifestacaoDoc(doc)}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            </div>
          )}

          {activeTab === 'api' && (
            <ApiExplorer
              apiKeys={apiKeys}
              onCriarApiKey={handleCriarApiKey}
              onRevogarApiKey={handleRevogarApiKey}
              apiLogs={apiLogs}
            />
          )}

          {activeTab === 'conformidade' && (
            <ConformidadeFiscal regras={REGRAS_FISCAIS} />
          )}

          {activeTab === 'relatorios' && (
            <RelatoriosAnaliticos documentos={documentos} />
          )}

          {activeTab === 'sefaz' && (
            <CertificadosESefaz
              servidores={servidores}
              onAtualizarStatus={handleAtualizarServidores}
              certificado={certificado}
              onSalvarCertificado={setCertificado}
            />
          )}

          {activeTab === 'seguranca' && (
            <SegurancaMFA
              isMfaActive={isMfaActive}
              onToggleMfa={setIsMfaActive}
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'suporte' && (
            <SuporteDedicado />
          )}
        </main>
      </div>

      {/* Modais Globais */}
      {danfeDoc && (
        <DanfeModal
          documento={danfeDoc}
          onClose={() => setDanfeDoc(null)}
        />
      )}

      {xmlDoc && (
        <XmlViewerModal
          documento={xmlDoc}
          onClose={() => setXmlDoc(null)}
        />
      )}

      {manifestacaoDoc && (
        <ManifestacaoModal
          documento={manifestacaoDoc}
          onClose={() => setManifestacaoDoc(null)}
          onSalvar={handleSalvarManifestacao}
        />
      )}

      {modalLoteOpen && (
        <LoteDownloadModal
          documentos={documentosParaLote}
          onClose={() => setModalLoteOpen(false)}
        />
      )}

      {modalConsultaOpen && (
        <ConsultaModal
          onClose={() => setModalConsultaOpen(false)}
          onAdicionarNota={handleAdicionarNota}
          onAbrirDanfe={(doc) => setDanfeDoc(doc)}
          documentosExistentes={documentos}
        />
      )}
    </div>
  );
}
