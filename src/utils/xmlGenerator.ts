import { DocumentoFiscal } from '../types/fiscal';

/**
 * Gera o XML oficial no layout SEFAZ v4.00 a partir dos dados do Documento Fiscal
 */
export function gerarXmlNFe(doc: DocumentoFiscal): string {
  const itensXml = doc.itens
    .map(
      (item) => `      <det nItem="${item.numeroItem}">
        <prod>
          <cProd>${item.codigoProduto}</cProd>
          <cEAN>SEM GTIN</cEAN>
          <xProd>${escapeXml(item.descricao)}</xProd>
          <NCM>${item.ncm.replace(/\D/g, '')}</NCM>
          <CFOP>${item.cfop.replace(/\D/g, '')}</CFOP>
          <uCom>${item.unidade}</uCom>
          <qCom>${item.quantidade.toFixed(4)}</qCom>
          <vUnCom>${item.valorUnitario.toFixed(4)}</vUnCom>
          <vProd>${item.valorTotal.toFixed(2)}</vProd>
          <cEANTrib>SEM GTIN</cEANTrib>
          <uTrib>${item.unidade}</uTrib>
          <qTrib>${item.quantidade.toFixed(4)}</qTrib>
          <vUnTrib>${item.valorUnitario.toFixed(4)}</vUnTrib>
          <indTot>1</indTot>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <modBC>3</modBC>
              <vBC>${item.baseCalculoIcms.toFixed(2)}</vBC>
              <pICMS>${item.aliquotaIcms.toFixed(2)}</pICMS>
              <vICMS>${item.valorIcms.toFixed(2)}</vICMS>
            </ICMS00>
          </ICMS>
          <PIS>
            <PISAliq>
              <CST>01</CST>
              <vBC>${item.valorTotal.toFixed(2)}</vBC>
              <pPIS>${item.aliquotaPis.toFixed(2)}</pPIS>
              <vPIS>${item.valorPis.toFixed(2)}</vPIS>
            </PISAliq>
          </PIS>
          <COFINS>
            <COFINSAliq>
              <CST>01</CST>
              <vBC>${item.valorTotal.toFixed(2)}</vBC>
              <pCOFINS>${item.aliquotaCofins.toFixed(2)}</pCOFINS>
              <vCOFINS>${item.valorCofins.toFixed(2)}</vCOFINS>
            </COFINSAliq>
          </COFINS>
        </imposto>
      </det>`
    )
    .join('\n');

  const emitenteCnpj = doc.emitente.cnpj.replace(/\D/g, '');
  const destDoc = doc.destinatario.cpfCnpj.replace(/\D/g, '');
  const destTag = destDoc.length === 11 ? `<CPF>${destDoc}</CPF>` : `<CNPJ>${destDoc}</CNPJ>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
    <infNFe Id="NFe${doc.chaveAcesso}" versao="4.00">
      <ide>
        <cUF>${doc.chaveAcesso.substring(0, 2)}</cUF>
        <cNF>${doc.chaveAcesso.substring(35, 43)}</cNF>
        <natOp>${escapeXml(doc.naturezaOperacao)}</natOp>
        <mod>${doc.modelo}</mod>
        <serie>${doc.serie}</serie>
        <nNF>${parseInt(doc.numero, 10)}</nNF>
        <dhEmi>${doc.dataEmissao}</dhEmi>
        <dhSaiEnt>${doc.dataEmissao}</dhSaiEnt>
        <tpNF>${doc.tipo === 'emitida' ? '1' : '0'}</tpNF>
        <idDest>1</idDest>
        <cMunFG>3550308</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>${doc.tipoEmissao}</tpEmis>
        <cDV>${doc.chaveAcesso.substring(43, 44)}</cDV>
        <tpAmb>1</tpAmb>
        <finNFe>1</finNFe>
        <indFinal>1</indFinal>
        <indPres>1</indPres>
        <procEmi>0</procEmi>
        <verProc>FiscalHub-v4.2</verProc>
      </ide>
      <emit>
        <CNPJ>${emitenteCnpj}</CNPJ>
        <xNome>${escapeXml(doc.emitente.razaoSocial)}</xNome>
        <xFant>${escapeXml(doc.emitente.nomeFantasia || doc.emitente.razaoSocial)}</xFant>
        <enderEmit>
          <xLgr>${escapeXml(doc.emitente.endereco.logradouro)}</xLgr>
          <nro>${escapeXml(doc.emitente.endereco.numero)}</nro>
          <xBairro>${escapeXml(doc.emitente.endereco.bairro)}</xBairro>
          <cMun>3550308</cMun>
          <xMun>${escapeXml(doc.emitente.endereco.municipio)}</xMun>
          <UF>${doc.emitente.endereco.uf}</UF>
          <CEP>${doc.emitente.endereco.cep.replace(/\D/g, '')}</CEP>
          <cPais>1058</cPais>
          <xPais>BRASIL</xPais>
        </enderEmit>
        <IE>${doc.emitente.inscricaoEstadual.replace(/\D/g, '')}</IE>
        <CRT>3</CRT>
      </emit>
      <dest>
        ${destTag}
        <xNome>${escapeXml(doc.destinatario.razaoSocial)}</xNome>
        <enderDest>
          <xLgr>${escapeXml(doc.destinatario.endereco.logradouro)}</xLgr>
          <nro>${escapeXml(doc.destinatario.endereco.numero)}</nro>
          <xBairro>${escapeXml(doc.destinatario.endereco.bairro)}</xBairro>
          <cMun>3550308</cMun>
          <xMun>${escapeXml(doc.destinatario.endereco.municipio)}</xMun>
          <UF>${doc.destinatario.endereco.uf}</UF>
          <CEP>${doc.destinatario.endereco.cep.replace(/\D/g, '')}</CEP>
          <cPais>1058</cPais>
          <xPais>BRASIL</xPais>
        </enderDest>
        <indIEDest>1</indIEDest>
        ${doc.destinatario.inscricaoEstadual ? `<IE>${doc.destinatario.inscricaoEstadual.replace(/\D/g, '')}</IE>` : '<indIEDest>9</indIEDest>'}
      </dest>
${itensXml}
      <total>
        <ICMSTot>
          <vBC>${doc.totais.baseCalculoIcms.toFixed(2)}</vBC>
          <vICMS>${doc.totais.valorIcms.toFixed(2)}</vICMS>
          <vICMSDeson>0.00</vICMSDeson>
          <vFCPUFDest>0.00</vFCPUFDest>
          <vICMSUFDest>0.00</vICMSUFDest>
          <vICMSUFFem>0.00</vICMSUFFem>
          <vFCP>0.00</vFCP>
          <vBCST>${doc.totais.baseCalculoIcmsSt.toFixed(2)}</vBCST>
          <vST>${doc.totais.valorIcmsSt.toFixed(2)}</vST>
          <vFCPST>0.00</vFCPST>
          <vFCPSTRet>0.00</vFCPSTRet>
          <vProd>${doc.totais.valorProdutos.toFixed(2)}</vProd>
          <vFrete>${doc.totais.valorFrete.toFixed(2)}</vFrete>
          <vSeg>${doc.totais.valorSeguro.toFixed(2)}</vSeg>
          <vDesc>${doc.totais.valorDesconto.toFixed(2)}</vDesc>
          <vII>0.00</vII>
          <vIPI>${doc.totais.valorIpi.toFixed(2)}</vIPI>
          <vIPIDevol>0.00</vIPIDevol>
          <vPIS>${doc.totais.valorPis.toFixed(2)}</vPIS>
          <vCOFINS>${doc.totais.valorCofins.toFixed(2)}</vCOFINS>
          <vOutro>${doc.totais.outrasDespesas.toFixed(2)}</vOutro>
          <vNF>${doc.totais.valorNota.toFixed(2)}</vNF>
        </ICMSTot>
      </total>
      <transp>
        <modFrete>${doc.transporte?.modalidadeFrete || '0'}</modFrete>
      </transp>
      <infAdic>
        <infCpl>${escapeXml(doc.informacoesComplementares || 'Documento emitido em conformidade com as diretrizes do SPED Fiscal.')}</infCpl>
      </infAdic>
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>1</tpAmb>
      <verAplic>SP_NFE_PL_009</verAplic>
      <chNFe>${doc.chaveAcesso}</chNFe>
      <dhRecbto>${doc.dataAutorizacao}</dhRecbto>
      <nProt>${doc.protocoloAutorizacao}</nProt>
      <digVal>Fk9A23d5a4G+H8kXo9Yt3zX8z7g=</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;

  return xml;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Faz download de um texto em formato de arquivo no navegador
 */
export function downloadArquivo(conteudo: string, nomeArquivo: string, tipoMime: string = 'text/xml'): void {
  const blob = new Blob([conteudo], { type: `${tipoMime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
