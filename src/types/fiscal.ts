export type ModeloFiscal = '55' | '65'; // 55: NF-e, 65: NFC-e
export type TipoDocumento = 'emitida' | 'recebida'; // Entrada / Saída
export type StatusSEFAZ = 'autorizada' | 'cancelada' | 'denegada' | 'processamento';
export type TipoManifestacao = 'sem_manifestacao' | 'ciencia' | 'confirmada' | 'desconhecida' | 'nao_realizada';

export interface ItemNotaFiscal {
  numeroItem: number;
  codigoProduto: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  baseCalculoIcms: number;
  valorIcms: number;
  aliquotaIcms: number;
  valorIpi?: number;
  aliquotaIpi?: number;
  valorPis: number;
  aliquotaPis: number;
  valorCofins: number;
  aliquotaCofins: number;
}

export interface DocumentoFiscal {
  id: string;
  chaveAcesso: string;
  modelo: ModeloFiscal;
  numero: string;
  serie: string;
  tipo: TipoDocumento;
  dataEmissao: string;
  dataAutorizacao: string;
  uf: string;
  naturezaOperacao: string;
  tipoEmissao: number; // 1=Normal, 2=Contingência, etc.
  
  emitente: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
    inscricaoEstadual: string;
    endereco: {
      logradouro: string;
      numero: string;
      bairro: string;
      municipio: string;
      uf: string;
      cep: string;
    };
  };

  destinatario: {
    cpfCnpj: string;
    razaoSocial: string;
    inscricaoEstadual?: string;
    endereco: {
      logradouro: string;
      numero: string;
      bairro: string;
      municipio: string;
      uf: string;
      cep: string;
    };
  };

  totais: {
    valorProdutos: number;
    baseCalculoIcms: number;
    valorIcms: number;
    baseCalculoIcmsSt: number;
    valorIcmsSt: number;
    valorFrete: number;
    valorSeguro: number;
    valorDesconto: number;
    outrasDespesas: number;
    valorIpi: number;
    valorPis: number;
    valorCofins: number;
    valorNota: number;
  };

  transporte?: {
    modalidadeFrete: string;
    transportadora?: {
      cnpjCpf: string;
      razaoSocial: string;
      inscricaoEstadual?: string;
      uf: string;
    };
    volumes?: {
      quantidade: number;
      especie: string;
      pesoBruto: number;
      pesoLiquido: number;
    };
  };

  itens: ItemNotaFiscal[];
  statusSefaz: StatusSEFAZ;
  protocoloAutorizacao: string;
  manifestacaoDestinatario: TipoManifestacao;
  dataManifestacao?: string;
  justificativaManifestacao?: string;
  nsu: string;
  consultadoComCertificado: boolean;
  xmlString?: string;
  informacoesComplementares?: string;
  qrCodeUrl?: string; // Para NFC-e
}

export interface ChaveDecodificada {
  cUF: string;
  ufSigla: string;
  aamm: string;
  dataAproximada: string;
  cnpjEmitente: string;
  cnpjFormatado: string;
  modelo: ModeloFiscal;
  modeloNome: string;
  serie: string;
  nNF: string;
  tpEmis: string;
  tpEmisNome: string;
  cNF: string;
  cDV: string;
  dvCalculado: string;
  valida: boolean;
}

export interface StatusSefazUF {
  uf: string;
  nome: string;
  servidor: string; // Ex: SVRS, SVAN, Própria
  status: 'operacional' | 'instavel' | 'indisponivel';
  tempoRespostaMs: number;
  autorizador: boolean;
  retornoAutorizacao: boolean;
  consultaProtocolo: boolean;
  distribuicaoDFe: boolean;
  ultimaVerificacao: string;
  contingenciaAtiva: boolean;
  tipoContingencia?: 'SVC-AN' | 'SVC-RS' | 'EPEC';
}

export interface ApiKeyItem {
  id: string;
  nome: string;
  chaveMascarada: string;
  chaveCompleta: string;
  ambiente: 'producao' | 'homologacao';
  permissoes: ('consulta' | 'manifestacao' | 'download_lote' | 'admin')[];
  criadaEm: string;
  ultimoUso?: string;
  ativa: boolean;
}

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  metodo: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  statusCode: number;
  tempoRespostaMs: number;
  ipOrigem: string;
  ambiente: string;
  payloadResumo: string;
}

export interface CertificadoDigitalInfo {
  instalado: boolean;
  tipo: 'A1' | 'A3';
  nomeTitular: string;
  cnpj: string;
  emissor: string;
  validoDe: string;
  validoAte: string;
  diasRestantes: number;
  status: 'valido' | 'proximo_vencimento' | 'expirado' | 'nao_configurado';
  sha256Thumbprint: string;
}

export interface AuditSecurityLog {
  id: string;
  timestamp: string;
  usuario: string;
  evento: string;
  categoria: 'auth' | 'sefaz' | 'api' | 'download' | 'sistema';
  ip: string;
  localizacao: string;
  status: 'sucesso' | 'bloqueado' | 'aviso';
  detalhes: string;
}

export interface RegraFiscalItem {
  id: string;
  codigo: string;
  titulo: string;
  tipo: 'NT' | 'CONFAZ' | 'REFORMA_TRIBUTARIA' | 'SINIEF';
  vigencia: string;
  status: 'obrigatoria' | 'em_adaptacao' | 'futura';
  impacto: 'alto' | 'medio' | 'baixo';
  descricao: string;
  acaoRecomendada: string;
}
