import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Lock,
  History,
  QrCode as QrCodeIcon,
  ShieldAlert
} from 'lucide-react';
import { AuditSecurityLog } from '../types/fiscal';

interface SegurancaMFAProps {
  isMfaActive: boolean;
  onToggleMfa: (active: boolean) => void;
  auditLogs: AuditSecurityLog[];
}

export const SegurancaMFA: React.FC<SegurancaMFAProps> = ({
  isMfaActive,
  onToggleMfa,
  auditLogs
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [chaveSecreta] = useState('KZXW65TBNUQW2Z3C');
  const [copiado, setCopiado] = useState(false);
  const [backupCodes] = useState([
    '9821-4401', '3310-8952', '7412-0091', '1209-6634',
    '5523-9014', '8841-2309', '4410-7782', '6291-3400'
  ]);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleCopiarChave = () => {
    navigator.clipboard.writeText(chaveSecreta);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleConfirmarToken = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (tokenInput.length !== 6 || !/^\d+$/.test(tokenInput)) {
      setErro('Informe o código numérico de 6 dígitos gerado pelo seu aplicativo autenticador.');
      return;
    }

    onToggleMfa(true);
    setMensagemSucesso('Autenticação Multifator (MFA/2FA) ativada com sucesso! Sua conta e dados fiscais agora estão protegidos por uma camada extra de segurança.');
    setTokenInput('');
  };

  const handleDesativar = () => {
    if (confirm('Tem certeza que deseja desativar a autenticação de 2 fatores? Isso reduzirá a segurança dos dados fiscais.')) {
      onToggleMfa(false);
      setMensagemSucesso('MFA foi desativado temporariamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Segurança & Controle de Acesso
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Autenticação Multifator (MFA / 2FA) & Auditoria de Acessos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Proteção de dados fiscais sensíveis, certificados digitais e emissão de notas contra acessos não autorizados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-semibold px-3 py-1.5 rounded border ${
              isMfaActive
                ? 'bg-emerald-950/70 border-emerald-800/40 text-emerald-400'
                : 'bg-amber-950/70 border-amber-800/40 text-amber-400'
            }`}>
              {isMfaActive ? 'MFA ATIVO (Protegido)' : 'MFA PENDENTE DE ATIVAÇÃO'}
            </span>
          </div>
        </div>
      </div>

      {mensagemSucesso && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{mensagemSucesso}</span>
          </div>
          <button onClick={() => setMensagemSucesso(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Grid de Configuração do MFA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: QR Code e Configuração TOTP */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Configuração do Aplicativo Autenticador
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Vincular Google Authenticator, Microsoft Authenticator ou Authy
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start p-4 bg-slate-950 rounded-lg border border-slate-800">
            {/* Visual QR Code Display */}
            <div className="p-3 bg-white rounded-lg shadow-inner shrink-0 text-center">
              <QrCodeIcon className="w-28 h-28 text-slate-950 mx-auto" />
              <span className="text-[9px] font-mono text-slate-700 font-bold block mt-1">
                FISCALHUB 2FA
              </span>
            </div>

            <div className="space-y-3 text-xs flex-1">
              <p className="text-slate-300 leading-relaxed">
                1. Abra o aplicativo autenticador no seu celular e aponte a câmera para escanear o QR Code ao lado.
              </p>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">
                  Ou insira a chave secreta manualmente:
                </span>
                <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-emerald-400">
                  <span className="tracking-wider">{chaveSecreta}</span>
                  <button
                    onClick={handleCopiarChave}
                    className="ml-auto text-slate-400 hover:text-white transition-colors"
                    title="Copiar chave secreta"
                  >
                    {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Formulário de Verificação */}
              <form onSubmit={handleConfirmarToken} className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-slate-300 font-medium block">
                  2. Digite o código de 6 dígitos gerado no aplicativo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-36 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-center text-sm font-mono tracking-widest text-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors"
                  >
                    Verificar e Ativar
                  </button>
                </div>
                {erro && <p className="text-rose-400 text-[11px]">{erro}</p>}
              </form>
            </div>
          </div>

          {isMfaActive && (
            <div className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-500/30 rounded text-xs">
              <span className="text-slate-300">
                Sua conta está com proteção MFA ativa em todos os logins e ações críticas de emissão de notas.
              </span>
              <button
                onClick={handleDesativar}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-mono shrink-0 ml-3"
              >
                Desativar MFA
              </button>
            </div>
          )}
        </div>

        {/* Painel Direito: Códigos de Emergência */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Chaves de Recuperação de Emergência
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Códigos de Backup de Uso Único
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Caso perca acesso ao seu dispositivo móvel, utilize um destes códigos de recuperação para acessar o painel fiscal corporativo. Cada código só pode ser usado uma vez.
          </p>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 font-mono text-xs text-slate-300">
            {backupCodes.map((code, idx) => (
              <div key={idx} className="p-1.5 bg-slate-900 rounded border border-slate-800/60 text-center tracking-wider text-emerald-400/90">
                {code}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            Guarde estes códigos em local seguro, fora do alcance de terceiros.
          </div>
        </div>
      </div>

      {/* Auditoria de Acessos Recentes */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Trilha de Auditoria de Segurança (Compliance Fiscal)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Retenção de 5 anos conforme legislação SPED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2.5 px-3">Data e Hora</th>
                <th className="py-2.5 px-3">Usuário</th>
                <th className="py-2.5 px-3">Evento Realizado</th>
                <th className="py-2.5 px-3">IP de Origem</th>
                <th className="py-2.5 px-3">Localização</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-slate-200">{log.usuario}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200 font-medium">{log.evento}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.ip}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{log.localizacao}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'sucesso'
                        ? 'text-emerald-400 bg-emerald-950'
                        : 'text-rose-400 bg-rose-950'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans truncate max-w-[220px]" title={log.detalhes}>
                    {log.detalhes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
