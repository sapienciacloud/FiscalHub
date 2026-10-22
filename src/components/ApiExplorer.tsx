import React, { useState } from 'react';
import { 
  Code2, 
  Key, 
  Play, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Terminal, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ApiKeyItem, ApiRequestLog } from '../types/fiscal';

interface ApiExplorerProps {
  apiKeys: ApiKeyItem[];
  onCriarApiKey: (nome: string, ambiente: 'producao' | 'homologacao', permissoes: ('consulta' | 'manifestacao' | 'download_lote' | 'admin')[]) => void;
  onRevogarApiKey: (id: string) => void;
  apiLogs: ApiRequestLog[];
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({
  apiKeys,
  onCriarApiKey,
  onRevogarApiKey,
  apiLogs
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'consultar' | 'distribuicao' | 'manifestar' | 'lote' | 'erp'>('consultar');
  const [activeLang, setActiveLang] = useState<'curl' | 'nodejs' | 'python' | 'php' | 'csharp'>('curl');
  const [executando, setExecutando] = useState(false);
  const [copiadoKeyId, setCopiadoKeyId] = useState<string | null>(null);
  const [copiadoSnippet, setCopiadoSnippet] = useState(false);
  const [respostaApi, setRespostaApi] = useState<any>(null);
  const [latenciaMs, setLatenciaMs] = useState<number | null>(null);

  // Modal nova chave
  const [modalNovaChave, setModalNovaChave] = useState(false);
  const [nomeChave, setNomeChave] = useState('');
  const [ambienteChave, setAmbienteChave] = useState<'producao' | 'homologacao'>('producao');

  const activeKey = apiKeys[0]?.chaveCompleta || 'fh_live_default_token_key_12345';

  const endpoints = [
    {
      id: 'consultar' as const,
      metodo: 'POST',
      url: '/api/v1/nfe/consultar',
      titulo: 'Consulta por Chave de Acesso',
      descricao: 'Consulta NF-e / NFC-e para qualquer UF com ou sem certificado digital.',
      payloadPadrao: JSON.stringify({
        chaveAcesso: '35241045997418000153550010000104521000000000',
        usarCertificado: true,
        baixarXmlCompleto: true
      }, null, 2)
    },
    {
      id: 'distribuicao' as const,
      metodo: 'POST',
      url: '/api/v1/nfe/distribuicao-dfe',
      titulo: 'Distribuição DFe (Por NSU)',
      descricao: 'Sincronização automática contínua de notas fiscais emitidas contra o CNPJ da empresa.',
      payloadPadrao: JSON.stringify({
        cnpj: '08123456000178',
        ultNSU: '000000000109400',
        limiteDocumentos: 50
      }, null, 2)
    },
    {
      id: 'manifestar' as const,
      metodo: 'POST',
      url: '/api/v1/nfe/manifestar',
      titulo: 'Manifestação do Destinatário',
      descricao: 'Envia evento fiscal de confirmação, ciência, desconhecimento ou não realização.',
      payloadPadrao: JSON.stringify({
        chaveAcesso: '35241045997418000153550010000104521000000000',
        evento: '210200',
        descricaoEvento: 'Confirmacao da Operacao',
        nSeqEvento: 1
      }, null, 2)
    },
    {
      id: 'lote' as const,
      metodo: 'POST',
      url: '/api/v1/nfe/lote-download',
      titulo: 'Download em Lote de XMLs',
      descricao: 'Recupera pacote zip compactado ou lista estruturada de XMLs validados.',
      payloadPadrao: JSON.stringify({
        chaves: [
          '35241045997418000153550010000104521000000000',
          '31241018234567000192550020000048921000000000'
        ],
        formato: 'zip_base64',
        incluirRelatorioCsv: true
      }, null, 2)
    },
    {
      id: 'erp' as const,
      metodo: 'POST',
      url: '/api/v1/erp/sincronizar',
      titulo: 'Sincronização com ERPs (TOTVS / SAP / Omie)',
      descricao: 'Dispara webhooks e sincronização direta no plano de contas do ERP contábil.',
      payloadPadrao: JSON.stringify({
        erpDestino: 'TOTVS_PROTHEUS',
        empresaFilial: '01/01',
        periodo: '2024-10',
        webhookCallbackUrl: 'https://erp.empresa.com.br/api/fiscal/callback'
      }, null, 2)
    }
  ];

  const currentEndpoint = endpoints.find((e) => e.id === selectedEndpoint) || endpoints[0];
  const [payloadInput, setPayloadInput] = useState(currentEndpoint.payloadPadrao);

  const handleSelectEndpoint = (id: typeof selectedEndpoint) => {
    setSelectedEndpoint(id);
    const ep = endpoints.find((e) => e.id === id);
    if (ep) {
      setPayloadInput(ep.payloadPadrao);
      setRespostaApi(null);
      setLatenciaMs(null);
    }
  };

  const handleExecutarRequest = () => {
    setExecutando(true);
    const start = performance.now();

    setTimeout(() => {
      const duration = Math.round(performance.now() - start + 120);
      setLatenciaMs(duration);
      setExecutando(false);

      if (selectedEndpoint === 'consultar') {
        setRespostaApi({
          status: 'sucesso',
          codigoSefaz: 100,
          motivo: 'Autorizado o uso da NF-e',
          ambiente: 'Produção Nacional',
          documento: {
            chave: '35241045997418000153550010000104521000000000',
            protocolo: '135240189345612',
            dhAutorizacao: new Date().toISOString(),
            valorTotal: 50875.00,
            icmsTotal: 8730.00,
            statusManifestacao: 'confirmada',
            xmlDisponivel: true,
            xmlTamanhoBytes: 14820
          }
        });
      } else if (selectedEndpoint === 'distribuicao') {
        setRespostaApi({
          status: 'sucesso',
          codigoSefaz: 138,
          motivo: 'Documento localizado para o destinatário',
          ultNSU: '000000000109489',
          maxNSU: '000000000109489',
          loteDocumentos: [
            { nsu: '000000000109420', tipoSchema: 'resNFe', emitente: 'TECH STEEL S/A', valor: 50875.00 },
            { nsu: '000000000109435', tipoSchema: 'procNFe', emitente: 'MINAS MAQ LTDA', valor: 143500.00 }
          ]
        });
      } else if (selectedEndpoint === 'manifestar') {
        setRespostaApi({
          status: 'sucesso',
          codigoSefaz: 135,
          motivo: 'Evento registrado e vinculado a NF-e',
          protocoloEvento: '135240' + Math.floor(100000000 + Math.random() * 900000000),
          dhRegistro: new Date().toISOString()
        });
      } else if (selectedEndpoint === 'lote') {
        setRespostaApi({
          status: 'sucesso',
          totalProcessados: 2,
          tamanhoZipBytes: 28490,
          sha256: '9f82c3...d019ba',
          downloadUrl: 'https://api.fiscalhub.com.br/download/lote_4920a.zip'
        });
      } else {
        setRespostaApi({
          status: 'sucesso',
          integrador: 'TOTVS Protheus v12',
          notasImportadas: 8,
          divergenciasFiscais: 0,
          statusIntegracao: 'SINCRONIZADO_EM_CONFORMIDADE'
        });
      }
    }, 600);
  };

  const getCodeSnippet = () => {
    const epUrl = `https://api.fiscalhub.com.br${currentEndpoint.url}`;

    switch (activeLang) {
      case 'curl':
        return `curl -X ${currentEndpoint.metodo} "${epUrl}" \\
  -H "Authorization: Bearer ${activeKey}" \\
  -H "Content-Type: application/json" \\
  -d '${payloadInput.replace(/\n\s*/g, ' ')}'`;

      case 'nodejs':
        return `import axios from 'axios';

const response = await axios.post('${epUrl}', ${payloadInput}, {
  headers: {
    'Authorization': 'Bearer ${activeKey}',
    'Content-Type': 'application/json'
  }
});

console.log('Status SEFAZ:', response.data.codigoSefaz);
console.log('Dados do Documento:', response.data);`;

      case 'python':
        return `import requests

url = "${epUrl}"
headers = {
    "Authorization": "Bearer ${activeKey}",
    "Content-Type": "application/json"
}
payload = ${payloadInput}

response = requests.post(url, json=payload, headers=headers)
print("SEFAZ Status:", response.json().get("codigoSefaz"))
print(response.json())`;

      case 'php':
        return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${epUrl}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => '${payloadInput.replace(/\n\s*/g, ' ')}',
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer ${activeKey}",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`;

      case 'csharp':
        return `using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer ${activeKey}");

var content = new StringContent(@"${payloadInput.replace(/"/g, '""')}", Encoding.UTF8, "application/json");
var response = await client.PostAsync("${epUrl}", content);
var result = await response.Content.ReadAsStringAsync();

Console.WriteLine(result);`;
    }
  };

  const handleCopiarKey = (chave: string, id: string) => {
    navigator.clipboard.writeText(chave);
    setCopiadoKeyId(id);
    setTimeout(() => setCopiadoKeyId(null), 2000);
  };

  const handleCopiarSnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiadoSnippet(true);
    setTimeout(() => setCopiadoSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header com Gerenciamento de Chaves */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Chaves de API & Credenciais para Integração com ERP</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tokens Bearer para automação contínua de download de XMLs, consulta e manifestação via Web Services.
            </p>
          </div>

          <button
            onClick={() => setModalNovaChave(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gerar Nova API Key</span>
          </button>
        </div>

        {/* Tabela de Chaves */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2.5 px-3">Nome / Sistema Integrado</th>
                <th className="py-2.5 px-3">Ambiente</th>
                <th className="py-2.5 px-3">Token Bearer</th>
                <th className="py-2.5 px-3">Permissões</th>
                <th className="py-2.5 px-3">Último Uso</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {apiKeys.map((key) => {
                const isCopiado = copiadoKeyId === key.id;
                return (
                  <tr key={key.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      {key.nome}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-mono ${key.ambiente === 'producao' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {key.ambiente.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>{key.chaveMascarada}</span>
                        <button
                          onClick={() => handleCopiarKey(key.chaveCompleta, key.id)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copiar token completo"
                        >
                          {isCopiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] font-mono text-slate-400">
                      {key.permissoes.join(' · ')}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">
                      {key.ultimoUso || 'Nunca'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onRevogarApiKey(key.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Revogar chave"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Console Interativo de API (Swagger / Playground) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Seletor de Endpoint e Request Body */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Console REST Interativo
            </div>
            <h3 className="text-sm font-semibold text-white">
              Testador de Requisições SEFAZ em Tempo Real
            </h3>
          </div>

          {/* Endpoints Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep.id)}
                className={`px-2.5 py-1.5 text-xs font-mono rounded transition-colors ${
                  selectedEndpoint === ep.id
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ep.url.replace('/api/v1/nfe/', '')}
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-950/60 rounded border border-slate-800 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                {currentEndpoint.metodo}
              </span>
              <span className="font-mono text-xs text-slate-200">
                {currentEndpoint.url}
              </span>
            </div>
            <p className="text-xs text-slate-400 pt-1">{currentEndpoint.descricao}</p>
          </div>

          {/* Editor de Payload JSON */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">Request Payload (JSON):</span>
              <span className="text-[11px] font-mono text-slate-500">application/json</span>
            </div>
            <textarea
              rows={9}
              value={payloadInput}
              onChange={(e) => setPayloadInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 font-mono text-xs text-emerald-300 leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Botão de Disparo */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">
              Auth: Bearer {activeKey.substring(0, 14)}...
            </div>
            <button
              onClick={handleExecutarRequest}
              disabled={executando}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded shadow-sm transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{executando ? 'Executando SEFAZ...' : 'Enviar Requisição'}</span>
            </button>
          </div>
        </div>

        {/* Coluna Direita: Response da API & Snippets em Código */}
        <div className="lg:col-span-6 space-y-4">
          {/* Box de Resposta */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Resposta do Servidor SEFAZ</span>
              </span>
              {latenciaMs !== null && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">200 OK</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300 tabular-nums">{latenciaMs}ms</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto min-h-[140px] max-h-[220px]">
              {respostaApi ? (
                <pre className="text-emerald-300/90 whitespace-pre">
                  {JSON.stringify(respostaApi, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs py-8">
                  Clique em "Enviar Requisição" para testar a chamada via API.
                </div>
              )}
            </div>
          </div>

          {/* Snippets em Código */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">
                Exemplos de Implementação Corporativa
              </span>
              <button
                onClick={handleCopiarSnippet}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors"
              >
                {copiadoSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiadoSnippet ? 'Copiado' : 'Copiar Código'}</span>
              </button>
            </div>

            {/* Linguagens */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 text-xs">
              {(['curl', 'nodejs', 'python', 'php', 'csharp'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                    activeLang === lang
                      ? 'bg-slate-800 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'csharp' ? 'C#' : lang}
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[180px]">
              <pre className="whitespace-pre">{getCodeSnippet()}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Recentes de Chamadas da API */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Log de Requisições da API em Tempo Real
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Monitoramento de Tráfego & Auditoria Fiscal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Método</th>
                <th className="py-2 px-3">Endpoint</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Latência</th>
                <th className="py-2 px-3">IP de Origem</th>
                <th className="py-2 px-3">Payload Resumo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {apiLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2 px-3 text-emerald-400 font-bold">{log.metodo}</td>
                  <td className="py-2 px-3 text-slate-200">{log.endpoint}</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">{log.statusCode} OK</td>
                  <td className="py-2 px-3 text-slate-300 tabular-nums">{log.tempoRespostaMs}ms</td>
                  <td className="py-2 px-3 text-slate-400">{log.ipOrigem}</td>
                  <td className="py-2 px-3 text-slate-500 truncate max-w-[200px]" title={log.payloadResumo}>
                    {log.payloadResumo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar Nova Chave */}
      {modalNovaChave && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md text-slate-100 p-6 space-y-4 my-auto shadow-2xl">
            <h3 className="text-sm font-bold text-white">Gerar Nova Chave de API</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Nome do Sistema / ERP:</label>
                <input
                  type="text"
                  value={nomeChave}
                  onChange={(e) => setNomeChave(e.target.value)}
                  placeholder="Ex: Integração SAP S/4HANA Fiscal"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Ambiente:</label>
                <select
                  value={ambienteChave}
                  onChange={(e) => setAmbienteChave(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="producao">Produção (SEFAZ Nacional)</option>
                  <option value="homologacao">Homologação (Testes / Sandbox)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 text-xs">
              <button
                onClick={() => setModalNovaChave(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white rounded border border-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!nomeChave) return;
                  onCriarApiKey(nomeChave, ambienteChave, ['consulta', 'manifestacao', 'download_lote']);
                  setNomeChave('');
                  setModalNovaChave(false);
                }}
                disabled={!nomeChave}
                className="px-3.5 py-1.5 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded"
              >
                Gerar Chave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
