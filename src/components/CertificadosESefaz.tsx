import React, { useState } from 'react';
import { 
  Server, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  Key, 
  Radio, 
  Upload, 
  FileKey
} from 'lucide-react';
import { StatusSefazUF, CertificadoDigitalInfo } from '../types/fiscal';
import { CONTINGENCIAS_DISPONIVEIS } from '../utils/sefazSimulator';

interface CertificadosESefazProps {
  servidores: StatusSefazUF[];
  onAtualizarStatus: () => void;
  certificado: CertificadoDigitalInfo;
  onSalvarCertificado: (cert: CertificadoDigitalInfo) => void;
}

export const CertificadosESefaz: React.FC<CertificadosESefazProps> = ({
  servidores,
  onAtualizarStatus,
  certificado,
  onSalvarCertificado
}) => {
  const [atualizando, setAtualizando] = useState(false);
  const [modalUploadCert, setModalUploadCert] = useState(false);
  const [senhaCert, setSenhaCert] = useState('');
  const [nomeArquivo, setNomeArquivo] = useState('');

  const handleRefresh = () => {
    setAtualizando(true);
    setTimeout(() => {
      onAtualizarStatus();
      setAtualizando(false);
    }, 800);
  };

  const handleSimularUploadCertificado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhaCert) return;

    onSalvarCertificado({
      instalado: true,
      tipo: 'A1',
      nomeTitular: 'LOGIX SISTEMAS E LOGISTICA CORPORATIVA LTDA',
      cnpj: '08.123.456/0001-78',
      emissor: 'AC VALID RFB v5 (ICP-Brasil)',
      validoDe: new Date().toISOString().substring(0, 10),
      validoAte: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      diasRestantes: 365,
      status: 'valido',
      sha256Thumbprint: 'A4:1F:90:3E:7B:62:C8:10:99:EE:41:20:8D:12:FA:B1'
    });

    setModalUploadCert(false);
    setSenhaCert('');
    setNomeArquivo('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Infraestrutura & Criptografia Fiscal
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Certificados Digitais & Monitor Nacional SEFAZ</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Validação de certificados padrão ICP-Brasil e status em tempo real dos autorizadores estaduais.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalUploadCert(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            >
              <FileKey className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gerenciar Certificado A1/A3</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={atualizando}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded shadow-sm transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${atualizando ? 'animate-spin' : ''}`} />
              <span>Sondar Servidores SEFAZ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card do Certificado Digital Ativo */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Certificado Digital Corporativo ({certificado.tipo})</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                  {certificado.status === 'valido' ? 'ICP-Brasil Válido' : 'Atenção'}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Utilizado para assinatura de XMLs, manifestação e sincronização por NSU
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-emerald-400 font-bold block tabular-nums">
              {certificado.diasRestantes} dias restantes
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Expira em: {certificado.validoAte}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Titular:</span>
            <span className="text-slate-200 font-semibold truncate block" title={certificado.nomeTitular}>
              {certificado.nomeTitular}
            </span>
            <span className="text-slate-400 text-[11px] mt-0.5 block">CNPJ: {certificado.cnpj}</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Autoridade Certificadora:</span>
            <span className="text-slate-200 font-semibold">{certificado.emissor}</span>
            <span className="text-slate-400 text-[11px] mt-0.5 block">Algoritmo SHA-256 / RSA 2048</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Thumbprint SHA-256:</span>
            <span className="text-slate-400 text-[10px] truncate block" title={certificado.sha256Thumbprint}>
              {certificado.sha256Thumbprint}
            </span>
            <span className="text-emerald-400 text-[10px] mt-0.5 block">Cadeia v5 Homologada</span>
          </div>
        </div>
      </div>

      {/* Grid de Servidores SEFAZ Estaduais */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Monitor de Disponibilidade SEFAZ por Estado (27 UFs)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latência média e status dos autorizadores da NF-e e NFC-e
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Latência Média Nacional: ~180ms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {servidores.map((servidor) => {
            const isInstavel = servidor.status === 'instavel';
            return (
              <div
                key={servidor.uf}
                className={`p-3 rounded-lg border text-xs space-y-1.5 transition-colors ${
                  isInstavel
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-100">{servidor.uf}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 text-[11px] truncate max-w-[90px]">{servidor.nome}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isInstavel ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isInstavel ? 'Instável' : 'Normal'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Latência:</span>
                  <span className={`tabular-nums ${isInstavel ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                    {servidor.tempoRespostaMs}ms
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Autorizador:</span>
                  <span className="text-emerald-400">Online</span>
                </div>

                {servidor.contingenciaAtiva && (
                  <div className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded text-center">
                    Contingência {servidor.tipoContingencia} Ativa
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contingências Nacionais SVC-AN / SVC-RS */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Servidores Virtuais de Contingência em Prontidão
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONTINGENCIAS_DISPONIVEIS.map((c) => (
            <div key={c.sigla} className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-emerald-400">{c.sigla}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                  Pronto
                </span>
              </div>
              <div className="font-medium text-slate-200 text-[11px]">{c.nome}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{c.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Upload Certificado */}
      {modalUploadCert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md text-slate-100 p-6 space-y-4 my-auto shadow-2xl">
            <h3 className="text-sm font-bold text-white">Instalar / Atualizar Certificado Digital A1 (.pfx)</h3>

            <form onSubmit={handleSimularUploadCertificado} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Arquivo do Certificado (.pfx ou .p12):</label>
                <input
                  type="file"
                  accept=".pfx,.p12"
                  onChange={(e) => setNomeArquivo(e.target.files?.[0]?.name || '')}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Senha de Proteção da Chave Privada:</label>
                <input
                  type="password"
                  value={senhaCert}
                  onChange={(e) => setSenhaCert(e.target.value)}
                  placeholder="Digite a senha do certificado..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                A chave privada é criptografada e armazenada em hardware security module (HSM) conforme diretrizes da ICP-Brasil e LGPD.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setModalUploadCert(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white rounded border border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!senhaCert}
                  className="px-3.5 py-1.5 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded"
                >
                  Instalar Certificado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
