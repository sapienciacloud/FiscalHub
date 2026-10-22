import { ChaveDecodificada, ModeloFiscal } from '../types/fiscal';

export const CODIGOS_UF: Record<string, string> = {
  '11': 'RO',
  '12': 'AC',
  '13': 'AM',
  '14': 'RR',
  '15': 'PA',
  '16': 'AP',
  '17': 'TO',
  '21': 'MA',
  '22': 'PI',
  '23': 'CE',
  '24': 'RN',
  '25': 'PB',
  '26': 'PE',
  '27': 'AL',
  '28': 'SE',
  '29': 'BA',
  '31': 'MG',
  '32': 'ES',
  '33': 'RJ',
  '35': 'SP',
  '41': 'PR',
  '42': 'SC',
  '43': 'RS',
  '50': 'MS',
  '51': 'MT',
  '52': 'GO',
  '53': 'DF'
};

export const SIGLA_PARA_CODIGO_UF: Record<string, string> = Object.entries(CODIGOS_UF).reduce(
  (acc, [cod, sigla]) => {
    acc[sigla] = cod;
    return acc;
  },
  {} as Record<string, string>
);

export const TIPOS_EMISSAO: Record<string, string> = {
  '1': 'Normal',
  '2': 'Contingência FS-IA',
  '3': 'Contingência SCAN',
  '4': 'Contingência DPEC',
  '5': 'Contingência FS-DA',
  '6': 'Contingência SVC-AN',
  '7': 'Contingência SVC-RS',
  '9': 'Contingência off-line (NFC-e)'
};

/**
 * Calcula o Dígito Verificador da Chave de Acesso da NF-e / NFC-e usando Módulo 11
 * Multiplicadores de 2 a 9 da direita para a esquerda
 */
export function calcularDigitoVerificador(chave43: string): string {
  if (chave43.length !== 43) {
    return '0';
  }

  let soma = 0;
  let peso = 2;

  for (let i = 42; i >= 0; i--) {
    const digito = parseInt(chave43[i], 10);
    if (isNaN(digito)) return '0';
    soma += digito * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }

  const resto = soma % 11;
  const dv = 11 - resto;

  if (dv === 0 || dv === 1 || dv > 9) {
    return '0';
  }
  return dv.toString();
}

/**
 * Formata CNPJ: 00.000.000/0000-00
 */
export function formatarCnpj(cnpj: string): string {
  const limpo = cnpj.replace(/\D/g, '');
  if (limpo.length !== 14) return cnpj;
  return limpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF ou CNPJ dependendo do tamanho
 */
export function formatarCpfCnpj(doc: string): string {
  const limpo = doc.replace(/\D/g, '');
  if (limpo.length === 11) {
    return limpo.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  if (limpo.length === 14) {
    return formatarCnpj(limpo);
  }
  return doc;
}

/**
 * Formata Chave de Acesso em grupos de 4 dígitos: 0000 0000 0000 ...
 */
export function formatarChaveAcesso(chave: string): string {
  const limpo = chave.replace(/\D/g, '');
  return limpo.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Decodifica e valida uma chave de acesso da NF-e / NFC-e (44 dígitos)
 */
export function decodificarChaveAcesso(chave: string): ChaveDecodificada | null {
  const limpa = chave.replace(/\D/g, '');
  if (limpa.length !== 44) {
    return null;
  }

  const cUF = limpa.substring(0, 2);
  const aamm = limpa.substring(2, 6);
  const cnpjEmitente = limpa.substring(6, 20);
  const modelo = limpa.substring(20, 22) as ModeloFiscal;
  const serie = limpa.substring(22, 25);
  const nNF = limpa.substring(25, 34);
  const tpEmis = limpa.substring(34, 35);
  const cNF = limpa.substring(35, 43);
  const cDV = limpa.substring(43, 44);

  const dvCalculado = calcularDigitoVerificador(limpa.substring(0, 43));
  const valida = cDV === dvCalculado;

  const ano = '20' + aamm.substring(0, 2);
  const mes = aamm.substring(2, 4);

  return {
    cUF,
    ufSigla: CODIGOS_UF[cUF] || 'BR',
    aamm,
    dataAproximada: `${mes}/${ano}`,
    cnpjEmitente,
    cnpjFormatado: formatarCnpj(cnpjEmitente),
    modelo: modelo === '65' ? '65' : '55',
    modeloNome: modelo === '65' ? 'NFC-e (Nota de Consumidor Eletrônica)' : 'NF-e (Nota Fiscal Eletrônica)',
    serie,
    nNF: parseInt(nNF, 10).toString(),
    tpEmis,
    tpEmisNome: TIPOS_EMISSAO[tpEmis] || 'Desconhecido',
    cNF,
    cDV,
    dvCalculado,
    valida
  };
}

/**
 * Gera uma chave de acesso válida com base nos parâmetros
 */
export function gerarChaveValida(params: {
  uf: string;
  anoMes: string; // Ex: '2410'
  cnpj: string;
  modelo: '55' | '65';
  serie: string;
  numero: number;
  tipoEmissao?: string;
  codigoAleatorio?: string;
}): string {
  const cUF = (SIGLA_PARA_CODIGO_UF[params.uf] || '35').padStart(2, '0');
  const aamm = params.anoMes.replace(/\D/g, '').padStart(4, '0').slice(0, 4);
  const cnpj = params.cnpj.replace(/\D/g, '').padStart(14, '0').slice(0, 14);
  const mod = params.modelo;
  const serie = params.serie.replace(/\D/g, '').padStart(3, '0').slice(0, 3);
  const nNF = params.numero.toString().padStart(9, '0').slice(0, 9);
  const tpEmis = params.tipoEmissao || '1';
  const cNF = (params.codigoAleatorio || Math.floor(10000000 + Math.random() * 90000000).toString()).slice(0, 8);

  const chave43 = `${cUF}${aamm}${cnpj}${mod}${serie}${nNF}${tpEmis}${cNF}`;
  const dv = calcularDigitoVerificador(chave43);
  return `${chave43}${dv}`;
}
