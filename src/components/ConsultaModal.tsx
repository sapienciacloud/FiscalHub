import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Key, 
  ShieldCheck, 
  ShieldOff, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  FileText,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DocumentoFiscal, ChaveDecodificada } from '../types/fiscal';
import { decodificarChaveAcesso, formatarChaveAcesso, formatarCpfCnpj } from '../utils/chaveAcesso';

interface ConsultaModalProps {
  onClose: () => void;
  onAdicionarNota: (novaNota: DocumentoFiscal) => void;
  onAbrirDanfe: (nota: DocumentoFiscal) => void;
  documentosExistentes: DocumentoFiscal[];
}

export const ConsultaModal: React.FC<ConsultaModalProps> = ({
  onClose,
  onAdicionarNota,
  onAbrirDanfe,
  documentosExistentes
}) => {
  const [chaveInput, setChaveInput] = useState('');
  const [usarCertificado, setUsarCertificado] = useState(true);
  const [consultando, setConsultando] = useState(false);
  const [resultado, setResultado] = useState<DocumentoFiscal | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Decodificação em tempo real
  const chaveLimpa = chaveInput.replace(/\D/g, '');
  const chaveInfo: ChaveDecodificada | null = chaveLimpa.length === 44 ? decodificarChaveAcesso(chaveLimpa) : null;

  const handleConsultar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErro(null);

    if (chaveLimpa.length !== 44) {
      setErro('A chave de acesso da NF-e / NFC-e deve conter exatamente 44 dígitos numéricos.');
      return;
    }

    if (chaveInfo && !chaveInfo.valida) {
      setErro(`Dígito verificador inválido. O DV informado foi ${chaveInfo.cDV}, mas o cálculo do Módulo 11 da SEFAZ resultou em ${chaveInfo.dvCalculado}.`);
      return;
    }

    setConsultando(true);

    // Simula consulta aos webservices da SEFAZ estadual
    setTimeout(() => {
      setConsultando(false);

      // Verifica se a nota já existe no mock
      const existente = documentosExistentes.find((d) => d.chaveAcesso === chaveLimpa);

      if (existente) {
        setResultado({ ...existente, consultadoComCertificado: usarCertificado });
        return;
      }

      // Se não existir, gera o documento fiscal completo decodificado da SEFAZ
      const uf = chaveInfo?.ufSigla || 'SP';
      const modelo = chaveInfo?.modelo || '55';
      const numero = chaveInfo?.nNF || '12345';
      const serie = chaveInfo?.serie || '001';
      const cnpjEmit = chaveInfo?.cnpjEmitente || '45997418000153';

      const novaNota: DocumentoFiscal = {
        id: 'nfe-' + Math.random().toString(36).substring(2, 9),
        chaveAcesso: chaveLimpa,
        modelo,
        numero,
        serie,
        tipo: 'recebida',
        dataEmissao: new Date().toISOString(),
        dataAutorizacao: new Date().toISOString(),
        uf,
        naturezaOperacao: modelo === '65' ? 'VENDA A CONSUMIDOR' : 'VENDA DE MERCADORIAS',
        tipoEmissao: 1,
        emitente: {
          cnpj: chaveInfo?.cnpjFormatado || cnpjEmit,
          razaoSocial: `EMPRESA CONSULTADA SEFAZ ${uf} LTDA`,
          inscricaoEstadual: '112.334.556.789',
          endereco: {
            logradouro: 'Av. Brasil Central',
            numero: '500',
            bairro: 'Centro',
            municipio: uf === 'SP' ? 'São Paulo' : uf === 'RJ' ? 'Rio de Janeiro' : 'Capital',
            uf,
            cep: '01001-000'
          }
        },
        destinatario: {
          cpfCnpj: '08.123.456/0001-78',
          razaoSocial: 'LOGIX SISTEMAS E LOGISTICA CORPORATIVA LTDA',
          inscricaoEstadual: '209.876.543.210',
          endereco: {
            logradouro: 'Rua do Comércio',
            numero: '800',
            bairro: 'Vila Olímpia',
            municipio: 'São Paulo',
            uf: 'SP',
            cep: '04548-000'
          }
        },
        totais: {
          valorProdutos: 12500.00,
          baseCalculoIcms: 12500.00,
          valorIcms: 1500.00,
          baseCalculoIcmsSt: 0.00,
          valorIcmsSt: 0.00,
          valorFrete: 250.00,
          valorSeguro: 0.00,
          valorDesconto: 0.00,
          outrasDespesas: 0.00,
          valorIpi: 625.00,
          valorPis: 206.25,
          valorCofins: 950.00,
          valorNota: 13375.00
        },
        itens: [
          {
            numeroItem: 1,
            codigoProduto: 'PROD-CONSULTA-01',
            descricao: 'LOTE DE MERCADORIAS HOMOLOGADAS SEFAZ NACIONAL',
            ncm: '8471.30.12',
            cfop: '5102',
            unidade: 'UN',
            quantidade: 10,
            valorUnitario: 1250.00,
            valorTotal: 12500.00,
            baseCalculoIcms: 12500.00,
            valorIcms: 1500.00,
            aliquotaIcms: 12.00,
            valorIpi: 625.00,
            valorPis: 206.25,
            aliquotaPis: 1.65,
            valorCofins: 950.00,
            aliquotaCofins: 7.60
          }
        ],
        statusSefaz: 'autorizada',
        protocoloAutorizacao: '1' + (chaveInfo?.cUF || '35') + '24' + Math.floor(100000000 + Math.random() * 900000000),
        manifestacaoDestinatario: 'sem_manifestacao',
        nsu: '000000000109999',
        consultadoComCertificado: usarCertificado,
        informacoesComplementares: `Consulta realizada com sucesso via SEFAZ-${uf} em ${new Date().toLocaleDateString('pt-BR')}. Documento fiscal válido para crédito e apuração fiscal.`
      };

      onAdicionarNota(novaNota);
      setResultado(novaNota);
    }, 700);
  };

  const handleCarregarExemplo = () => {
    // Chave de teste real de SP
    const exemplo = documentosExistentes[0]?.chaveAcesso || '35241045997418000153550010000104521000000000';
    setChaveInput(exemplo);
    setErro(null);
  };

  const handleUploadXml = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const xml = event.target?.result as string;
      if (!xml) return;

      // Extrai chave de acesso do XML
      const chaveMatch = xml.match(/chNFe>(\d{44})</) || xml.match(/Id="NFe(\d{44})"/);
      if (chaveMatch && chaveMatch[1]) {
        setChaveInput(chaveMatch[1]);
        setErro(null);
        setTimeout(() => handleConsultar(), 200);
      } else {
        setErro('Não foi possível localizar a chave de acesso de 44 dígitos no arquivo XML enviado.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl text-slate-100 flex flex-col shadow-2xl overflow-hidden my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Consulta Nacional de NF-e & NFC-e</div>
              <div className="text-xs text-slate-400">
                Consulta unificada para qualquer Estado brasileiro (26 UFs + DF / SEFAZ Nacional)
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Alternância: Com vs Sem Certificado Digital */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setUsarCertificado(true)}
              className={`p-3 rounded-md flex items-start gap-2.5 transition-colors text-left ${
                usarCertificado
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 mt-0.5 shrink-0 ${usarCertificado ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-semibold text-xs">Com Certificado Digital (A1/A3)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Download completo do XML com assinatura, dados de transporte e manifestação do destinatário.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUsarCertificado(false)}
              className={`p-3 rounded-md flex items-start gap-2.5 transition-colors text-left ${
                !usarCertificado
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldOff className={`w-4 h-4 mt-0.5 shrink-0 ${!usarCertificado ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-semibold text-xs">Sem Certificado Digital (Pública)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Consulta pública direta via chave de acesso de 44 dígitos (resumo DFe e DANFE para qualquer UF).
                </div>
              </div>
            </button>
          </div>

          {/* Campo da Chave de Acesso */}
          <form onSubmit={handleConsultar} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Chave de Acesso da NF-e ou NFC-e (44 dígitos):
                </label>
                <button
                  type="button"
                  onClick={handleCarregarExemplo}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Usar Chave Exemplo</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={44}
                  value={chaveInput}
                  onChange={(e) => {
                    setChaveInput(e.target.value.replace(/\D/g, ''));
                    setErro(null);
                  }}
                  placeholder="Ex: 35241045997418000153550010000104521000000000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 tracking-wider"
                />
                <span className="absolute right-3 top-2.5 text-[11px] font-mono text-slate-500">
                  {chaveLimpa.length}/44
                </span>
              </div>
            </div>

            {/* Decodificação Anatômica da Chave */}
            {chaveInfo && (
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chave Decodificada pela SEFAZ-{chaveInfo.ufSigla}</span>
                  </span>
                  <span className={`text-[11px] font-mono ${chaveInfo.valida ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {chaveInfo.valida ? 'Dígito Verificador Válido (Módulo 11)' : 'Dígito Verificador Inválido'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block">UF Emissora:</span>
                    <span className="text-slate-200">{chaveInfo.ufSigla} (Cód {chaveInfo.cUF})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Modelo Fiscal:</span>
                    <span className="text-slate-200">{chaveInfo.modeloNome}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Emissão Aprox:</span>
                    <span className="text-slate-200">{chaveInfo.dataAproximada}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CNPJ Emitente:</span>
                    <span className="text-slate-200">{chaveInfo.cnpjFormatado}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Série / Número:</span>
                    <span className="text-slate-200">Série {chaveInfo.serie} · Nº {chaveInfo.nNF}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tipo Emissão:</span>
                    <span className="text-slate-200">{chaveInfo.tpEmisNome}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem de Erro */}
            {erro && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{erro}</span>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>Importar arquivo XML local</span>
                <input
                  type="file"
                  accept=".xml"
                  onChange={handleUploadXml}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={consultando || chaveLimpa.length !== 44}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-md shadow-sm transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{consultando ? 'Consultando SEFAZ...' : 'Consultar Documento'}</span>
              </button>
            </div>
          </form>

          {/* Resultado da Consulta */}
          {resultado && (
            <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white">
                    Documento Fiscal Autorizado na SEFAZ-{resultado.uf}
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  Protocolo {resultado.protocoloAutorizacao}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Emitente:</span>
                  <span className="text-slate-200 font-medium">{resultado.emitente.razaoSocial}</span>
                  <span className="text-slate-400 font-mono text-[11px] block">{resultado.emitente.cnpj}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Destinatário:</span>
                  <span className="text-slate-200 font-medium">{resultado.destinatario.razaoSocial}</span>
                  <span className="text-slate-400 font-mono text-[11px] block">{formatarCpfCnpj(resultado.destinatario.cpfCnpj)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Valor Total: </span>
                  <span className="text-white font-mono font-bold">
                    R$ {resultado.totais.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onAbrirDanfe(resultado);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Visualizar DANFE</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
