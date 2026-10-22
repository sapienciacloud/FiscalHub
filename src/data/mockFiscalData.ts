import { DocumentoFiscal, RegraFiscalItem, ApiKeyItem, ApiRequestLog, AuditSecurityLog, CertificadoDigitalInfo } from '../types/fiscal';
import { gerarChaveValida } from '../utils/chaveAcesso';

// Gera chaves válidas de acesso reais com cálculo do módulo 11
const chave1 = gerarChaveValida({ uf: 'SP', anoMes: '2410', cnpj: '45997418000153', modelo: '55', serie: '001', numero: 10452 });
const chave2 = gerarChaveValida({ uf: 'MG', anoMes: '2410', cnpj: '18234567000192', modelo: '55', serie: '002', numero: 4892 });
const chave3 = gerarChaveValida({ uf: 'RS', anoMes: '2410', cnpj: '92837465000111', modelo: '65', serie: '001', numero: 89341 });
const chave4 = gerarChaveValida({ uf: 'RJ', anoMes: '2410', cnpj: '33491823000104', modelo: '55', serie: '001', numero: 15420 });
const chave5 = gerarChaveValida({ uf: 'PR', anoMes: '2410', cnpj: '76543210000188', modelo: '55', serie: '003', numero: 23104 });
const chave6 = gerarChaveValida({ uf: 'BA', anoMes: '2410', cnpj: '15926374000155', modelo: '65', serie: '001', numero: 32014 });
const chave7 = gerarChaveValida({ uf: 'SC', anoMes: '2410', cnpj: '83726194000122', modelo: '55', serie: '001', numero: 7421 });
const chave8 = gerarChaveValida({ uf: 'GO', anoMes: '2410', cnpj: '01928374000166', modelo: '55', serie: '002', numero: 1899 });

export const DOCUMENTOS_FISCAIS_INICIAIS: DocumentoFiscal[] = [
  {
    id: 'nfe-001',
    chaveAcesso: chave1,
    modelo: '55',
    numero: '10452',
    serie: '001',
    tipo: 'recebida',
    dataEmissao: '2024-10-21T14:32:00-03:00',
    dataAutorizacao: '2024-10-21T14:32:45-03:00',
    uf: 'SP',
    naturezaOperacao: 'COMPRA PARA INDUSTRIALIZACAO',
    tipoEmissao: 1,
    emitente: {
      cnpj: '45.997.418/0001-53',
      razaoSocial: 'TECH STEEL INDUSTRIA METALURGICA S/A',
      nomeFantasia: 'TECH STEEL BRASIL',
      inscricaoEstadual: '110.456.789.112',
      endereco: {
        logradouro: 'Av. das Indústrias',
        numero: '1450',
        bairro: 'Distrito Industrial',
        municipio: 'Campinas',
        uf: 'SP',
        cep: '13082-010'
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
      valorProdutos: 48500.00,
      baseCalculoIcms: 48500.00,
      valorIcms: 8730.00,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 450.00,
      valorSeguro: 0.00,
      valorDesconto: 500.00,
      outrasDespesas: 0.00,
      valorIpi: 2425.00,
      valorPis: 790.55,
      valorCofins: 3647.20,
      valorNota: 50875.00
    },
    transporte: {
      modalidadeFrete: '0 - Emitente (CIF)',
      transportadora: {
        cnpjCpf: '12.345.678/0001-90',
        razaoSocial: 'EXPRESS CARGAS PESADAS S/A',
        uf: 'SP'
      },
      volumes: {
        quantidade: 12,
        especie: 'PALLETS',
        pesoBruto: 4200.5,
        pesoLiquido: 4100.0
      }
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'STL-8840',
        descricao: 'BOBINA DE ACO LAMINADO A FRIO 1.5MM X 1200MM',
        ncm: '7209.16.00',
        cfop: '1101',
        unidade: 'KG',
        quantidade: 2500,
        valorUnitario: 12.00,
        valorTotal: 30000.00,
        baseCalculoIcms: 30000.00,
        valorIcms: 5400.00,
        aliquotaIcms: 18.00,
        valorIpi: 1500.00,
        aliquotaIpi: 5.00,
        valorPis: 495.00,
        aliquotaPis: 1.65,
        valorCofins: 2280.00,
        aliquotaCofins: 7.60
      },
      {
        numeroItem: 2,
        codigoProduto: 'STL-9912',
        descricao: 'PERFIL TUBULAR RETANGULAR ESTRUTURAL 50X30',
        ncm: '7306.61.00',
        cfop: '1101',
        unidade: 'BARRA',
        quantidade: 150,
        valorUnitario: 123.33,
        valorTotal: 18500.00,
        baseCalculoIcms: 18500.00,
        valorIcms: 3330.00,
        aliquotaIcms: 18.00,
        valorIpi: 925.00,
        aliquotaIpi: 5.00,
        valorPis: 305.25,
        aliquotaPis: 1.65,
        valorCofins: 1406.00,
        aliquotaCofins: 7.60
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '135240189345612',
    manifestacaoDestinatario: 'confirmada',
    dataManifestacao: '2024-10-21T16:15:00-03:00',
    nsu: '000000000109420',
    consultadoComCertificado: true,
    informacoesComplementares: 'Trib aprox R$ 6.840,00 Federal e R$ 8.730,00 Estadual fonte IBPT. Pedido de Compra PC-9402.'
  },
  {
    id: 'nfe-002',
    chaveAcesso: chave2,
    modelo: '55',
    numero: '4892',
    serie: '002',
    tipo: 'emitida',
    dataEmissao: '2024-10-22T09:12:00-03:00',
    dataAutorizacao: '2024-10-22T09:12:30-03:00',
    uf: 'MG',
    naturezaOperacao: 'VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS',
    tipoEmissao: 1,
    emitente: {
      cnpj: '18.234.567/0001-92',
      razaoSocial: 'MINAS DISTRIBUIDORA DE MAQUINAS LTDA',
      nomeFantasia: 'MINAS MAQ',
      inscricaoEstadual: '062.334.455.001',
      endereco: {
        logradouro: 'Rodovia Fernão Dias',
        numero: 'KM 490',
        bairro: 'Jardim Riacho',
        municipio: 'Contagem',
        uf: 'MG',
        cep: '32280-000'
      }
    },
    destinatario: {
      cpfCnpj: '22.333.444/0001-55',
      razaoSocial: 'CONSTRUTORA HORIZONTE S/A',
      inscricaoEstadual: '001.992.834.120',
      endereco: {
        logradouro: 'Av. Afonso Pena',
        numero: '3100',
        bairro: 'Funcionários',
        municipio: 'Belo Horizonte',
        uf: 'MG',
        cep: '30130-009'
      }
    },
    totais: {
      valorProdutos: 142000.00,
      baseCalculoIcms: 142000.00,
      valorIcms: 17040.00,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 1200.00,
      valorSeguro: 300.00,
      valorDesconto: 0.00,
      outrasDespesas: 0.00,
      valorIpi: 0.00,
      valorPis: 2343.00,
      valorCofins: 10792.00,
      valorNota: 143500.00
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'CAT-320D',
        descricao: 'GERADOR DIESEL SILENCIADO TRIFASICO 150KVA',
        ncm: '8502.12.90',
        cfop: '5102',
        unidade: 'UN',
        quantidade: 1,
        valorUnitario: 142000.00,
        valorTotal: 142000.00,
        baseCalculoIcms: 142000.00,
        valorIcms: 17040.00,
        aliquotaIcms: 12.00,
        valorPis: 2343.00,
        aliquotaPis: 1.65,
        valorCofins: 10792.00,
        aliquotaCofins: 7.60
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '131240098451234',
    manifestacaoDestinatario: 'ciencia',
    dataManifestacao: '2024-10-22T10:00:00-03:00',
    nsu: '000000000109435',
    consultadoComCertificado: true,
    informacoesComplementares: 'Garantia de 24 meses do fabricante. Pagamento via boleto bancário 30/60/90 dias.'
  },
  {
    id: 'nfce-003',
    chaveAcesso: chave3,
    modelo: '65',
    numero: '89341',
    serie: '001',
    tipo: 'emitida',
    dataEmissao: '2024-10-22T11:05:00-03:00',
    dataAutorizacao: '2024-10-22T11:05:12-03:00',
    uf: 'RS',
    naturezaOperacao: 'VENDA A CONSUMIDOR FINAL',
    tipoEmissao: 1,
    emitente: {
      cnpj: '92.837.465/0001-11',
      razaoSocial: 'SUPERMERCADOS SUL S/A',
      nomeFantasia: 'SUPER SUL HIPER',
      inscricaoEstadual: '096.012.345.678',
      endereco: {
        logradouro: 'Av. Ipiranga',
        numero: '6681',
        bairro: 'Partenon',
        municipio: 'Porto Alegre',
        uf: 'RS',
        cep: '90619-900'
      }
    },
    destinatario: {
      cpfCnpj: '012.345.678-90',
      razaoSocial: 'CONSUMIDOR FINAL RS',
      endereco: {
        logradouro: 'Av. Praia de Belas',
        numero: '1181',
        bairro: 'Praia de Belas',
        municipio: 'Porto Alegre',
        uf: 'RS',
        cep: '90110-001'
      }
    },
    totais: {
      valorProdutos: 384.90,
      baseCalculoIcms: 220.00,
      valorIcms: 37.40,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 0.00,
      valorSeguro: 0.00,
      valorDesconto: 15.00,
      outrasDespesas: 0.00,
      valorIpi: 0.00,
      valorPis: 5.10,
      valorCofins: 23.50,
      valorNota: 369.90
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'CAFE-GOU-500',
        descricao: 'CAFE ESPECIAL EM GRAOS TORRADO 500G SUL',
        ncm: '0901.21.00',
        cfop: '5102',
        unidade: 'PCT',
        quantidade: 4,
        valorUnitario: 39.90,
        valorTotal: 159.60,
        baseCalculoIcms: 159.60,
        valorIcms: 27.13,
        aliquotaIcms: 17.00,
        valorPis: 2.63,
        aliquotaPis: 1.65,
        valorCofins: 12.13,
        aliquotaCofins: 7.60
      },
      {
        numeroItem: 2,
        codigoProduto: 'CHOC-ART-80',
        descricao: 'CHOCOLATE ARTESANAL DA SERRA 80% CACAU',
        ncm: '1806.32.10',
        cfop: '5102',
        unidade: 'UN',
        quantidade: 15,
        valorUnitario: 15.02,
        valorTotal: 225.30,
        baseCalculoIcms: 60.40,
        valorIcms: 10.27,
        aliquotaIcms: 17.00,
        valorPis: 2.47,
        aliquotaPis: 1.65,
        valorCofins: 11.37,
        aliquotaCofins: 7.60
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '143240058129048',
    manifestacaoDestinatario: 'sem_manifestacao',
    nsu: '000000000109489',
    consultadoComCertificado: false,
    qrCodeUrl: `https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?chNFe=${chave3}&nVersao=100&tpAmb=1`,
    informacoesComplementares: 'Emissão via PDV Caixa 04. Venda a Consumidor NFC-e sem necessidade de certificado do tomador.'
  },
  {
    id: 'nfe-004',
    chaveAcesso: chave4,
    modelo: '55',
    numero: '15420',
    serie: '001',
    tipo: 'recebida',
    dataEmissao: '2024-10-20T17:40:00-03:00',
    dataAutorizacao: '2024-10-20T17:40:55-03:00',
    uf: 'RJ',
    naturezaOperacao: 'REMESSA DE MATERIAIS PARA DEMONSTRACAO',
    tipoEmissao: 1,
    emitente: {
      cnpj: '33.491.823/0001-04',
      razaoSocial: 'TELECOM RIO INFRAESTRUTURA OPTICA S/A',
      nomeFantasia: 'RIO FIBRA',
      inscricaoEstadual: '86.120.449',
      endereco: {
        logradouro: 'Av. Presidente Vargas',
        numero: '2000',
        bairro: 'Centro',
        municipio: 'Rio de Janeiro',
        uf: 'RJ',
        cep: '20210-031'
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
      valorProdutos: 18900.00,
      baseCalculoIcms: 0.00,
      valorIcms: 0.00,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 250.00,
      valorSeguro: 0.00,
      valorDesconto: 0.00,
      outrasDespesas: 0.00,
      valorIpi: 0.00,
      valorPis: 0.00,
      valorCofins: 0.00,
      valorNota: 19150.00
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'OPT-SWITCH-48',
        descricao: 'SWITCH GERENCIAVEL 48 PORTAS SFP+ 10GBE L3',
        ncm: '8517.62.49',
        cfop: '5912',
        unidade: 'UN',
        quantidade: 3,
        valorUnitario: 6300.00,
        valorTotal: 18900.00,
        baseCalculoIcms: 0.00,
        valorIcms: 0.00,
        aliquotaIcms: 0.00,
        valorPis: 0.00,
        aliquotaPis: 0.00,
        valorCofins: 0.00,
        aliquotaCofins: 0.00
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '133240081273941',
    manifestacaoDestinatario: 'sem_manifestacao',
    nsu: '000000000109490',
    consultadoComCertificado: true,
    informacoesComplementares: 'Mercadoria remetida para demonstração no prazo de 60 dias. Suspensão do ICMS conforme Art. 52 Convênio ICMS.'
  },
  {
    id: 'nfe-005',
    chaveAcesso: chave5,
    modelo: '55',
    numero: '23104',
    serie: '003',
    tipo: 'recebida',
    dataEmissao: '2024-10-19T10:20:00-03:00',
    dataAutorizacao: '2024-10-19T10:21:02-03:00',
    uf: 'PR',
    naturezaOperacao: 'VENDA DE INSUMOS AGRICOLAS E FERTILIZANTES',
    tipoEmissao: 1,
    emitente: {
      cnpj: '76.543.210/0001-88',
      razaoSocial: 'AGRO PARANA NUTRICAO VEGETAL S/A',
      nomeFantasia: 'AGRO PARANA',
      inscricaoEstadual: '901.884.231.00',
      endereco: {
        logradouro: 'Av. Brasil',
        numero: '4500',
        bairro: 'Zona Industrial',
        municipio: 'Maringá',
        uf: 'PR',
        cep: '87050-000'
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
      valorProdutos: 87600.00,
      baseCalculoIcms: 87600.00,
      valorIcms: 10512.00,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 1400.00,
      valorSeguro: 200.00,
      valorDesconto: 1000.00,
      outrasDespesas: 0.00,
      valorIpi: 0.00,
      valorPis: 1428.90,
      valorCofins: 6581.60,
      valorNota: 88200.00
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'NPK-04-14-08',
        descricao: 'FERTILIZANTE MINERAL MISTO NPK 04-14-08 BAG 1000KG',
        ncm: '3105.20.00',
        cfop: '6102',
        unidade: 'TON',
        quantidade: 24,
        valorUnitario: 3650.00,
        valorTotal: 87600.00,
        baseCalculoIcms: 87600.00,
        valorIcms: 10512.00,
        aliquotaIcms: 12.00,
        valorPis: 1428.90,
        aliquotaPis: 1.65,
        valorCofins: 6581.60,
        aliquotaCofins: 7.60
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '141240061298450',
    manifestacaoDestinatario: 'desconhecida',
    dataManifestacao: '2024-10-20T08:30:00-03:00',
    justificativaManifestacao: 'Operação não reconhecida pelo setor de suprimentos.',
    nsu: '000000000109405',
    consultadoComCertificado: true,
    informacoesComplementares: 'ICMS com alíquota interestadual PR -> SP 12%.'
  },
  {
    id: 'nfce-006',
    chaveAcesso: chave6,
    modelo: '65',
    numero: '32014',
    serie: '001',
    tipo: 'emitida',
    dataEmissao: '2024-10-22T08:15:00-03:00',
    dataAutorizacao: '2024-10-22T08:15:20-03:00',
    uf: 'BA',
    naturezaOperacao: 'VENDA A CONSUMIDOR',
    tipoEmissao: 1,
    emitente: {
      cnpj: '15.926.374/0001-55',
      razaoSocial: 'DROGARIAS BAHIA SAUDE LTDA',
      nomeFantasia: 'BAHIA SAUDE',
      inscricaoEstadual: '048.912.834',
      endereco: {
        logradouro: 'Av. Tancredo Neves',
        numero: '1200',
        bairro: 'Caminho das Árvores',
        municipio: 'Salvador',
        uf: 'BA',
        cep: '41820-020'
      }
    },
    destinatario: {
      cpfCnpj: '987.654.321-00',
      razaoSocial: 'CONSUMIDOR IDENTIFICADO',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '45',
        bairro: 'Barra',
        municipio: 'Salvador',
        uf: 'BA',
        cep: '40140-110'
      }
    },
    totais: {
      valorProdutos: 145.80,
      baseCalculoIcms: 0.00,
      valorIcms: 0.00,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 0.00,
      valorSeguro: 0.00,
      valorDesconto: 10.00,
      outrasDespesas: 0.00,
      valorIpi: 0.00,
      valorPis: 0.00,
      valorCofins: 0.00,
      valorNota: 135.80
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'MED-DIP-500',
        descricao: 'DIPIRONA SODICA 500MG GTS 20ML',
        ncm: '3004.90.99',
        cfop: '5405',
        unidade: 'UN',
        quantidade: 2,
        valorUnitario: 14.90,
        valorTotal: 29.80,
        baseCalculoIcms: 0.00,
        valorIcms: 0.00,
        aliquotaIcms: 0.00,
        valorPis: 0.00,
        aliquotaPis: 0.00,
        valorCofins: 0.00,
        aliquotaCofins: 0.00
      },
      {
        numeroItem: 2,
        codigoProduto: 'VIT-C-EFE-10',
        descricao: 'VITAMINA C EFERVESCENTE 1G COM 10 COMPRIMIDOS',
        ncm: '3004.50.90',
        cfop: '5405',
        unidade: 'TB',
        quantidade: 3,
        valorUnitario: 38.67,
        valorTotal: 116.00,
        baseCalculoIcms: 0.00,
        valorIcms: 0.00,
        aliquotaIcms: 0.00,
        valorPis: 0.00,
        aliquotaPis: 0.00,
        valorCofins: 0.00,
        aliquotaCofins: 0.00
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '129240078129044',
    manifestacaoDestinatario: 'sem_manifestacao',
    nsu: '000000000109401',
    consultadoComCertificado: false,
    qrCodeUrl: `https://nfe.sefaz.ba.gov.br/servicos/nfce/qrcode.aspx?p=${chave6}`,
    informacoesComplementares: 'ICMS recolhido por Substituição Tributária (ST) no Estado da Bahia.'
  },
  {
    id: 'nfe-007',
    chaveAcesso: chave7,
    modelo: '55',
    numero: '7421',
    serie: '001',
    tipo: 'recebida',
    dataEmissao: '2024-10-18T16:00:00-03:00',
    dataAutorizacao: '2024-10-18T16:01:10-03:00',
    uf: 'SC',
    naturezaOperacao: 'TRANSFERENCIA ENTRE FILIAIS',
    tipoEmissao: 1,
    emitente: {
      cnpj: '83.726.194/0001-22',
      razaoSocial: 'CATARINA MOVEIS CORPORATIVOS S/A',
      nomeFantasia: 'CATARINA WORK',
      inscricaoEstadual: '254.912.834',
      endereco: {
        logradouro: 'Rua Blumenau',
        numero: '1500',
        bairro: 'América',
        municipio: 'Joinville',
        uf: 'SC',
        cep: '89204-251'
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
      valorProdutos: 32400.00,
      baseCalculoIcms: 32400.00,
      valorIcms: 3888.00,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 800.00,
      valorSeguro: 0.00,
      valorDesconto: 0.00,
      outrasDespesas: 0.00,
      valorIpi: 1620.00,
      valorPis: 528.00,
      valorCofins: 2432.40,
      valorNota: 34820.00
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'CAD-ERGO-01',
        descricao: 'CADEIRA ERGONOMICA PRESIDENTE COM APOIO DE CABECA',
        ncm: '9401.30.90',
        cfop: '6152',
        unidade: 'UN',
        quantidade: 24,
        valorUnitario: 1350.00,
        valorTotal: 32400.00,
        baseCalculoIcms: 32400.00,
        valorIcms: 3888.00,
        aliquotaIcms: 12.00,
        valorIpi: 1620.00,
        aliquotaIpi: 5.00,
        valorPis: 528.00,
        aliquotaPis: 1.65,
        valorCofins: 2432.40,
        aliquotaCofins: 7.60
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '142240091823455',
    manifestacaoDestinatario: 'confirmada',
    dataManifestacao: '2024-10-19T09:10:00-03:00',
    nsu: '000000000109390',
    consultadoComCertificado: true,
    informacoesComplementares: 'Nota Fiscal emitida para transferência em conformidade com o ADC 49 STF.'
  },
  {
    id: 'nfe-008',
    chaveAcesso: chave8,
    modelo: '55',
    numero: '1899',
    serie: '002',
    tipo: 'emitida',
    dataEmissao: '2024-10-17T11:45:00-03:00',
    dataAutorizacao: '2024-10-17T11:46:00-03:00',
    uf: 'GO',
    naturezaOperacao: 'VENDA DE GRAOS E CEREAIS',
    tipoEmissao: 1,
    emitente: {
      cnpj: '01.928.374/0001-66',
      razaoSocial: 'CERRADO GRAOS DO BRASIL LTDA',
      nomeFantasia: 'CERRADO GRAOS',
      inscricaoEstadual: '10.928.374-1',
      endereco: {
        logradouro: 'Anel Viário Sul',
        numero: 'S/N',
        bairro: 'Setor Agroindustrial',
        municipio: 'Rio Verde',
        uf: 'GO',
        cep: '75901-970'
      }
    },
    destinatario: {
      cpfCnpj: '11.222.333/0001-44',
      razaoSocial: 'MOINHO PAULISTA DE TRIGO S/A',
      inscricaoEstadual: '112.983.746.001',
      endereco: {
        logradouro: 'Av. do Estado',
        numero: '5400',
        bairro: 'Mooca',
        municipio: 'São Paulo',
        uf: 'SP',
        cep: '03105-000'
      }
    },
    totais: {
      valorProdutos: 210000.00,
      baseCalculoIcms: 210000.00,
      valorIcms: 25200.00,
      baseCalculoIcmsSt: 0.00,
      valorIcmsSt: 0.00,
      valorFrete: 4500.00,
      valorSeguro: 500.00,
      valorDesconto: 0.00,
      outrasDespesas: 0.00,
      valorIpi: 0.00,
      valorPis: 3465.00,
      valorCofins: 15960.00,
      valorNota: 215000.00
    },
    itens: [
      {
        numeroItem: 1,
        codigoProduto: 'SOJA-GRAO-01',
        descricao: 'SOJA EM GRAO PADRAO EXPORTACAO SAFRA 24/25',
        ncm: '1201.90.00',
        cfop: '6102',
        unidade: 'SC',
        quantidade: 1500,
        valorUnitario: 140.00,
        valorTotal: 210000.00,
        baseCalculoIcms: 210000.00,
        valorIcms: 25200.00,
        aliquotaIcms: 12.00,
        valorPis: 3465.00,
        aliquotaPis: 1.65,
        valorCofins: 15960.00,
        aliquotaCofins: 7.60
      }
    ],
    statusSefaz: 'autorizada',
    protocoloAutorizacao: '152240081923481',
    manifestacaoDestinatario: 'confirmada',
    dataManifestacao: '2024-10-18T08:00:00-03:00',
    nsu: '000000000109355',
    consultadoComCertificado: true,
    informacoesComplementares: 'Produto destinado a industrialização. ICMS 12% interestadual GO -> SP.'
  }
];

export const CERTIFICADO_CONFIG_INICIAL: CertificadoDigitalInfo = {
  instalado: true,
  tipo: 'A1',
  nomeTitular: 'LOGIX SISTEMAS E LOGISTICA CORPORATIVA LTDA',
  cnpj: '08.123.456/0001-78',
  emissor: 'AC SERASA RFB v5 (ICP-Brasil)',
  validoDe: '2024-03-15',
  validoAte: '2025-03-15',
  diasRestantes: 144,
  status: 'valido',
  sha256Thumbprint: '9B:4F:72:1C:8A:E3:44:91:D5:F2:66:30:19:AC:8E:B4'
};

export const API_KEYS_INICIAIS: ApiKeyItem[] = [
  {
    id: 'key-01',
    nome: 'Integração ERP SAP S/4HANA',
    chaveMascarada: 'fh_live_89a7••••••••••••••••34ef',
    chaveCompleta: 'fh_live_89a741bc829910d540291ba273819434ef',
    ambiente: 'producao',
    permissoes: ['consulta', 'manifestacao', 'download_lote', 'admin'],
    criadaEm: '2024-08-10',
    ultimoUso: 'Há 4 minutos',
    ativa: true
  },
  {
    id: 'key-02',
    nome: 'Robô Fiscal TOTVS Protheus',
    chaveMascarada: 'fh_live_31cc••••••••••••••••99ab',
    chaveCompleta: 'fh_live_31cc772189ae44021bbcf10948123099ab',
    ambiente: 'producao',
    permissoes: ['consulta', 'download_lote'],
    criadaEm: '2024-09-02',
    ultimoUso: 'Há 18 minutos',
    ativa: true
  },
  {
    id: 'key-03',
    nome: 'Ambiente de Testes / Sandbox Contábil',
    chaveMascarada: 'fh_test_90fe••••••••••••••••55aa',
    chaveCompleta: 'fh_test_90fe4433221199008877665544332255aa',
    ambiente: 'homologacao',
    permissoes: ['consulta', 'manifestacao', 'download_lote'],
    criadaEm: '2024-10-01',
    ultimoUso: 'Ontem às 18:22',
    ativa: true
  }
];

export const API_LOGS_INICIAIS: ApiRequestLog[] = [
  {
    id: 'log-01',
    timestamp: '2024-10-22 15:20:11',
    metodo: 'POST',
    endpoint: '/api/v1/nfe/consultar',
    statusCode: 200,
    tempoRespostaMs: 142,
    ipOrigem: '177.136.24.90',
    ambiente: 'Produção',
    payloadResumo: 'chave: 35241045997418000153550010000104521000000000, cert: true'
  },
  {
    id: 'log-02',
    timestamp: '2024-10-22 15:18:44',
    metodo: 'POST',
    endpoint: '/api/v1/nfe/distribuicao-dfe',
    statusCode: 200,
    tempoRespostaMs: 285,
    ipOrigem: '177.136.24.90',
    ambiente: 'Produção',
    payloadResumo: 'ultNSU: 000000000109400, cnpj: 08123456000178'
  },
  {
    id: 'log-03',
    timestamp: '2024-10-22 15:14:02',
    metodo: 'POST',
    endpoint: '/api/v1/nfe/manifestar',
    statusCode: 200,
    tempoRespostaMs: 310,
    ipOrigem: '189.40.112.5',
    ambiente: 'Produção',
    payloadResumo: 'evento: 210200 (Confirmacao), nSeqEvento: 1'
  },
  {
    id: 'log-04',
    timestamp: '2024-10-22 15:02:30',
    metodo: 'POST',
    endpoint: '/api/v1/nfe/lote-download',
    statusCode: 200,
    tempoRespostaMs: 512,
    ipOrigem: '177.136.24.90',
    ambiente: 'Produção',
    payloadResumo: 'chaves: [8 itens], formato: zip_xml'
  },
  {
    id: 'log-05',
    timestamp: '2024-10-22 14:55:19',
    metodo: 'GET',
    endpoint: '/api/v1/nfe/status-sefaz?uf=SP',
    statusCode: 200,
    tempoRespostaMs: 118,
    ipOrigem: '189.40.112.5',
    ambiente: 'Produção',
    payloadResumo: 'uf: SP, modelo: 55'
  }
];

export const REGRAS_FISCAIS: RegraFiscalItem[] = [
  {
    id: 'reg-01',
    codigo: 'NT 2024.001 v1.10',
    titulo: 'Novos Campos de Tributação e Desoneração do ICMS',
    tipo: 'NT',
    vigencia: 'Vigente em Produção',
    status: 'obrigatoria',
    impacto: 'alto',
    descricao: 'Exige o preenchimento obrigatório do grupo de informações de desoneração do ICMS e validação das regras G20 e W16.',
    acaoRecomendada: 'Sincronizar regras do emissor para evitar rejeição 928 (Informado motivo de desoneração indevido).'
  },
  {
    id: 'reg-02',
    codigo: 'EC 132/2023',
    titulo: 'Reforma Tributária - Simulador Transição IBS & CBS',
    tipo: 'REFORMA_TRIBUTARIA',
    vigencia: 'Início Piloto 2026',
    status: 'em_adaptacao',
    impacto: 'alto',
    descricao: 'Substituição gradual do PIS/COFINS pelo CBS Federal e do ICMS/ISS pelo IBS dos Estados e Municípios.',
    acaoRecomendada: 'Habilitar o módulo de prévia de impacto de alíquotas neutras no fechamento contábil.'
  },
  {
    id: 'reg-03',
    codigo: 'NT 2023.004 v1.20',
    titulo: 'Validação de Tributação Monofásica de Combustíveis e Gás',
    tipo: 'NT',
    vigencia: 'Vigente em Produção',
    status: 'obrigatoria',
    impacto: 'medio',
    descricao: 'Aplicação do ICMS Monofásico ad rem (valor fixo por unidade de medida) e validação dos CSTs 02, 15 e 53.',
    acaoRecomendada: 'Verificar cadastros de itens de frotas e insumos com NCM do capítulo 27.'
  },
  {
    id: 'reg-04',
    codigo: 'Convênio ICMS 178/2023',
    titulo: 'Transferência de Mercadorias entre Filiais (ADC 49 STF)',
    tipo: 'CONFAZ',
    vigencia: 'Vigente',
    status: 'obrigatoria',
    impacto: 'alto',
    descricao: 'Não incidência do ICMS na saída de mercadorias de um estabelecimento para outro do mesmo titular, assegurada a manutenção dos créditos.',
    acaoRecomendada: 'Ajustar emissão de NF-e nas operações interestaduais com CFOPs 5152/6152.'
  }
];

export const AUDIT_LOGS_INICIAIS: AuditSecurityLog[] = [
  {
    id: 'sec-01',
    timestamp: '2024-10-22 15:20:00',
    usuario: 'carlos.fiscal@logix.com.br',
    evento: 'Login com Autenticação Multifator (TOTP)',
    categoria: 'auth',
    ip: '177.136.24.90',
    localizacao: 'São Paulo, SP - Brasil',
    status: 'sucesso',
    detalhes: 'Código de 6 dígitos verificado com sucesso via Google Authenticator'
  },
  {
    id: 'sec-02',
    timestamp: '2024-10-22 14:50:12',
    usuario: 'sistema.erp@logix.com.br',
    evento: 'Consulta de DFe em Lote via API Key',
    categoria: 'api',
    ip: '189.40.112.5',
    localizacao: 'Belo Horizonte, MG - Brasil',
    status: 'sucesso',
    detalhes: 'API Key "Robô Fiscal TOTVS Protheus" autenticada com escopo [consulta, download_lote]'
  },
  {
    id: 'sec-03',
    timestamp: '2024-10-22 13:10:44',
    usuario: 'marina.contabil@logix.com.br',
    evento: 'Download em Lote de 24 XMLs',
    categoria: 'download',
    ip: '177.136.24.90',
    localizacao: 'São Paulo, SP - Brasil',
    status: 'sucesso',
    detalhes: 'Pacote ZIP gerado contendo XMLs autorizados do período 01 a 22 de Outubro'
  },
  {
    id: 'sec-04',
    timestamp: '2024-10-22 11:05:00',
    usuario: 'ip:185.220.101.44',
    evento: 'Tentativa de Acesso Inválido Bloqueada',
    categoria: 'auth',
    ip: '185.220.101.44',
    localizacao: 'Frankfurt, Alemanha (VPN / Tor)',
    status: 'bloqueado',
    detalhes: 'Bloqueio preventivo pelo firewall: geolocalização não autorizada e ausência de 2FA'
  }
];
