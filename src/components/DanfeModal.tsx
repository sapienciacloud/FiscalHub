import React from 'react';
import { X, Printer, Download, Copy, Check, QrCode as QrCodeIcon, ShieldCheck } from 'lucide-react';
import { DocumentoFiscal } from '../types/fiscal';
import { formatarChaveAcesso, formatarCpfCnpj } from '../utils/chaveAcesso';
import { gerarXmlNFe, downloadArquivo } from '../utils/xmlGenerator';

interface DanfeModalProps {
  documento: DocumentoFiscal;
  onClose: () => void;
}

export const DanfeModal: React.FC<DanfeModalProps> = ({ documento, onClose }) => {
  const [copiado, setCopiado] = React.useState(false);

  const handleCopiarChave = () => {
    navigator.clipboard.writeText(documento.chaveAcesso);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleBaixarXml = () => {
    const xml = gerarXmlNFe(documento);
    downloadArquivo(xml, `${documento.chaveAcesso}-procNFe.xml`);
  };

  const isNFCe = documento.modelo === '65';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl text-slate-100 flex flex-col shadow-2xl overflow-hidden my-auto max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">
              {isNFCe ? 'DANFCE - Cupom Fiscal Eletrônico' : 'DANFE - Documento Auxiliar da Nota Fiscal Eletrônica'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Mod. {documento.modelo} · Série {documento.serie} · Nº {documento.numero}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopiarChave}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded border border-slate-700 transition-colors"
              title="Copiar chave de acesso"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiado ? 'Copiada' : 'Copiar Chave'}</span>
            </button>

            <button
              onClick={handleBaixarXml}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar XML</span>
            </button>

            <button
              onClick={handleImprimir}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DANFE Document Printable Area */}
        <div className="p-6 overflow-y-auto bg-white text-black font-sans text-xs">
          {!isNFCe ? (
            /* DANFE MODELO 55 */
            <div className="max-w-[800px] mx-auto border-2 border-black p-3 space-y-2 select-text">
              {/* Canhoto de Recebimento */}
              <div className="border border-black p-2 text-[10px] space-y-1">
                <div className="flex justify-between border-b border-black pb-1">
                  <span>RECEBEMOS DE {documento.emitente.razaoSocial} OS PRODUTOS/SERVIÇOS CONSTANTES NA NOTA FISCAL INDICADA AO LADO</span>
                  <span className="font-bold text-center pl-2">NF-e Nº {documento.numero} SÉRIE {documento.serie}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="border-r border-black pr-2">DATA DE RECEBIMENTO: ___/___/______</div>
                  <div className="col-span-3">IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR: _____________________________________________</div>
                </div>
              </div>
              <div className="border-b-2 border-dashed border-black my-1" />

              {/* Cabeçalho Emitente e Identificação da NF-e */}
              <div className="grid grid-cols-12 border border-black">
                {/* Dados do Emitente */}
                <div className="col-span-5 p-2 border-r border-black flex flex-col justify-between">
                  <div>
                    <h1 className="font-bold text-xs uppercase">{documento.emitente.razaoSocial}</h1>
                    <p className="text-[10px] text-gray-700">{documento.emitente.nomeFantasia}</p>
                    <p className="text-[10px] mt-1">{documento.emitente.endereco.logradouro}, {documento.emitente.endereco.numero} - {documento.emitente.endereco.bairro}</p>
                    <p className="text-[10px]">{documento.emitente.endereco.municipio} - {documento.emitente.endereco.uf} · CEP: {documento.emitente.endereco.cep}</p>
                  </div>
                  <div className="mt-2 text-[10px] font-mono">
                    <span className="font-bold">CNPJ: </span>{documento.emitente.cnpj}
                  </div>
                </div>

                {/* Bloco DANFE central */}
                <div className="col-span-3 p-2 border-r border-black text-center flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-sm block">DANFE</span>
                    <span className="text-[9px] block">Documento Auxiliar da Nota Fiscal Eletrônica</span>
                    <div className="mt-1 flex justify-center gap-3 text-[10px]">
                      <span>0 - ENTRADA</span>
                      <span className="font-bold border border-black px-1.5">{documento.tipo === 'emitida' ? '1' : '0'}</span>
                      <span>1 - SAÍDA</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold">
                    <div>Nº {documento.numero}</div>
                    <div>SÉRIE {documento.serie}</div>
                    <div className="text-[9px] font-normal">FOLHA 1/1</div>
                  </div>
                </div>

                {/* Código de Barras e Chave de Acesso */}
                <div className="col-span-4 p-2 flex flex-col justify-between">
                  {/* Visual Barcode Simulator */}
                  <div className="h-10 w-full flex items-center justify-between px-1 bg-black/5 overflow-hidden">
                    {Array.from({ length: 44 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full ${
                          i % 3 === 0 ? 'w-1 bg-black' : i % 2 === 0 ? 'w-0.5 bg-black' : 'w-1.5 bg-black'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-2 text-[10px]">
                    <span className="font-bold block">CHAVE DE ACESSO:</span>
                    <span className="font-mono text-[9px] block tracking-tighter">
                      {formatarChaveAcesso(documento.chaveAcesso)}
                    </span>
                  </div>

                  <div className="text-[9px] text-gray-700 mt-1">
                    Consulta de autenticidade no portal nacional da NF-e www.nfe.fazenda.gov.br ou no site da Sefaz Autorizadora.
                  </div>
                </div>
              </div>

              {/* Protocolo de Autorização */}
              <div className="grid grid-cols-12 border border-black text-[10px]">
                <div className="col-span-7 p-1 border-r border-black">
                  <span className="font-bold">NATUREZA DA OPERAÇÃO:</span> {documento.naturezaOperacao}
                </div>
                <div className="col-span-5 p-1">
                  <span className="font-bold">PROTOCOLO DE AUTORIZAÇÃO:</span> {documento.protocoloAutorizacao} · {documento.dataAutorizacao.replace('T', ' ').substring(0, 19)}
                </div>
              </div>

              {/* Destinatário / Remetente */}
              <div className="border border-black">
                <div className="bg-gray-200 px-1 font-bold text-[9px] uppercase border-b border-black">
                  Destinatário / Remetente
                </div>
                <div className="p-1 space-y-1 text-[10px]">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-8">
                      <span className="font-bold">NOME / RAZÃO SOCIAL: </span>{documento.destinatario.razaoSocial}
                    </div>
                    <div className="col-span-4">
                      <span className="font-bold">CNPJ/CPF: </span>{formatarCpfCnpj(documento.destinatario.cpfCnpj)}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-7">
                      <span className="font-bold">ENDEREÇO: </span>{documento.destinatario.endereco.logradouro}, {documento.destinatario.endereco.numero}
                    </div>
                    <div className="col-span-3">
                      <span className="font-bold">BAIRRO: </span>{documento.destinatario.endereco.bairro}
                    </div>
                    <div className="col-span-2">
                      <span className="font-bold">CEP: </span>{documento.destinatario.endereco.cep}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <span className="font-bold">MUNICÍPIO: </span>{documento.destinatario.endereco.municipio}
                    </div>
                    <div className="col-span-2">
                      <span className="font-bold">UF: </span>{documento.destinatario.endereco.uf}
                    </div>
                    <div className="col-span-5">
                      <span className="font-bold">INSCRIÇÃO ESTADUAL: </span>{documento.destinatario.inscricaoEstadual || 'ISENTO'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cálculo do Imposto */}
              <div className="border border-black">
                <div className="bg-gray-200 px-1 font-bold text-[9px] uppercase border-b border-black">
                  Cálculo do Imposto
                </div>
                <div className="grid grid-cols-6 border-b border-black text-[9px] text-center divide-x divide-black">
                  <div className="p-1">
                    <div className="text-gray-600">BASE DE CÁLCULO ICMS</div>
                    <div className="font-bold font-mono">R$ {documento.totais.baseCalculoIcms.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">VALOR DO ICMS</div>
                    <div className="font-bold font-mono">R$ {documento.totais.valorIcms.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">BASE CÁLC. ICMS S.T.</div>
                    <div className="font-bold font-mono">R$ {documento.totais.baseCalculoIcmsSt.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">VALOR DO ICMS S.T.</div>
                    <div className="font-bold font-mono">R$ {documento.totais.valorIcmsSt.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">VALOR TOTAL PRODUTOS</div>
                    <div className="font-bold font-mono">R$ {documento.totais.valorProdutos.toFixed(2)}</div>
                  </div>
                  <div className="p-1 bg-gray-50">
                    <div className="text-gray-600 font-bold">VALOR TOTAL DA NOTA</div>
                    <div className="font-bold font-mono text-xs">R$ {documento.totais.valorNota.toFixed(2)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-6 text-[9px] text-center divide-x divide-black">
                  <div className="p-1">
                    <div className="text-gray-600">VALOR DO FRETE</div>
                    <div className="font-mono">R$ {documento.totais.valorFrete.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">VALOR DO SEGURO</div>
                    <div className="font-mono">R$ {documento.totais.valorSeguro.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">DESCONTO</div>
                    <div className="font-mono">R$ {documento.totais.valorDesconto.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">OUTRAS DESPESAS</div>
                    <div className="font-mono">R$ {documento.totais.outrasDespesas.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">VALOR DO IPI</div>
                    <div className="font-mono">R$ {documento.totais.valorIpi.toFixed(2)}</div>
                  </div>
                  <div className="p-1">
                    <div className="text-gray-600">PIS / COFINS</div>
                    <div className="font-mono">R$ {(documento.totais.valorPis + documento.totais.valorCofins).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Dados dos Itens */}
              <div className="border border-black">
                <div className="bg-gray-200 px-1 font-bold text-[9px] uppercase border-b border-black">
                  Dados dos Produtos / Serviços
                </div>
                <table className="w-full text-[9px] border-collapse">
                  <thead>
                    <tr className="border-b border-black bg-gray-50 text-left font-mono">
                      <th className="p-1">CÓD.</th>
                      <th className="p-1">DESCRIÇÃO DOS PRODUTOS</th>
                      <th className="p-1">NCM</th>
                      <th className="p-1">CFOP</th>
                      <th className="p-1">UN</th>
                      <th className="p-1 text-right">QTD</th>
                      <th className="p-1 text-right">V. UNIT</th>
                      <th className="p-1 text-right">V. TOTAL</th>
                      <th className="p-1 text-right">BC ICMS</th>
                      <th className="p-1 text-right">ALIQ</th>
                      <th className="p-1 text-right">V. ICMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/30 font-mono">
                    {documento.itens.map((item) => (
                      <tr key={item.numeroItem}>
                        <td className="p-1">{item.codigoProduto}</td>
                        <td className="p-1 font-sans">{item.descricao}</td>
                        <td className="p-1">{item.ncm}</td>
                        <td className="p-1">{item.cfop}</td>
                        <td className="p-1">{item.unidade}</td>
                        <td className="p-1 text-right">{item.quantidade}</td>
                        <td className="p-1 text-right">{item.valorUnitario.toFixed(2)}</td>
                        <td className="p-1 text-right font-bold">{item.valorTotal.toFixed(2)}</td>
                        <td className="p-1 text-right">{item.baseCalculoIcms.toFixed(2)}</td>
                        <td className="p-1 text-right">{item.aliquotaIcms}%</td>
                        <td className="p-1 text-right">{item.valorIcms.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dados Adicionais */}
              <div className="border border-black p-1 text-[9px]">
                <div className="font-bold uppercase text-[8px] text-gray-700">DADOS ADICIONAIS / INFORMAÇÕES COMPLEMENTARES</div>
                <p className="mt-0.5">{documento.informacoesComplementares || 'Em conformidade com a legislação tributária vigente.'}</p>
              </div>
            </div>
          ) : (
            /* DANFCE MODELO 65 (NFC-e / Cupom de Venda) */
            <div className="max-w-[420px] mx-auto border-2 border-black p-4 space-y-3 font-mono text-[11px] select-text">
              <div className="text-center space-y-0.5 border-b border-black pb-2">
                <div className="font-bold text-sm font-sans">{documento.emitente.razaoSocial}</div>
                <div>CNPJ: {documento.emitente.cnpj}</div>
                <div>{documento.emitente.endereco.logradouro}, {documento.emitente.endereco.numero} - {documento.emitente.endereco.municipio}/{documento.emitente.endereco.uf}</div>
                <div className="font-bold text-xs uppercase pt-1">
                  DANFE NFC-e - Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica
                </div>
                <div className="text-[9px]">Não permite aproveitamento de crédito de ICMS</div>
              </div>

              {/* Itens do Cupom */}
              <div className="border-b border-black pb-2 space-y-1">
                <div className="flex justify-between font-bold text-[10px] border-b border-black/40 pb-0.5">
                  <span>QTD x UNIT</span>
                  <span>TOTAL (R$)</span>
                </div>
                {documento.itens.map((item) => (
                  <div key={item.numeroItem} className="space-y-0.5">
                    <div className="font-bold text-[10px] truncate">{item.numeroItem}. {item.descricao}</div>
                    <div className="flex justify-between text-[10px]">
                      <span>{item.quantidade} {item.unidade} x R$ {item.valorUnitario.toFixed(2)}</span>
                      <span className="font-bold">R$ {item.valorTotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totais do Cupom */}
              <div className="space-y-1 border-b border-black pb-2 text-[10px]">
                <div className="flex justify-between">
                  <span>Qtd. Total de Itens:</span>
                  <span>{documento.itens.reduce((acc, i) => acc + i.quantidade, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor dos Produtos:</span>
                  <span>R$ {documento.totais.valorProdutos.toFixed(2)}</span>
                </div>
                {documento.totais.valorDesconto > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Descontos:</span>
                    <span>- R$ {documento.totais.valorDesconto.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-black/30">
                  <span>VALOR TOTAL:</span>
                  <span>R$ {documento.totais.valorNota.toFixed(2)}</span>
                </div>
              </div>

              {/* Consumidor e Identificação */}
              <div className="text-[10px] space-y-0.5 border-b border-black pb-2">
                <div>CONSUMIDOR: {documento.destinatario.razaoSocial}</div>
                <div>CPF: {documento.destinatario.cpfCnpj}</div>
                <div className="pt-1">NFC-e Nº {documento.numero} · Série {documento.serie} · Emissão: {documento.dataEmissao.substring(0, 10)}</div>
                <div>Protocolo: {documento.protocoloAutorizacao}</div>
              </div>

              {/* QR Code de Consulta Oficial */}
              <div className="text-center pt-1 space-y-2">
                <div className="text-[10px] font-bold">Consulte pela Chave de Acesso em:</div>
                <div className="text-[9px] break-all">{formatarChaveAcesso(documento.chaveAcesso)}</div>
                <div className="flex justify-center py-1">
                  <div className="p-3 border-2 border-black inline-block bg-white">
                    <QrCodeIcon className="w-24 h-24 mx-auto text-black" />
                    <div className="text-[8px] mt-1 font-bold">QR CODE SEFAZ {documento.uf}</div>
                  </div>
                </div>
                <div className="text-[9px] text-gray-700">Consulta via leitor de QR Code homologado no portal SEFAZ-{documento.uf}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
