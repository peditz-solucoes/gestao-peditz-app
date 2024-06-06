import moment from 'moment'
import { formatCurrency } from './formatCurrency'
import { formatPhoneNumber } from './formatPhone'

interface StatsProps {
  id: string
  open: boolean
  identifier: string
  initial_value: string
  opened_by_name: string
  closed_by_name: string
  created: string
  modified: string
  closed_at: string
  cancelation_reasons: {
    title: string
    reason: string
    created: string
    id: string
    type: string
    operator_name: string
    product_title: string
    quantity: string
    bill_number: number
  }[]
  payment_groups: {
    id: string
    payments: {
      payment_method_title: string
      value: string
      note: string
      created: string
      id: string
      type: string
    }[]
    bills: {
      id: string
      number: number
    }[]
    created: string
    modified: string
    type: string
    tip: string
    total: string
    cashier: string
  }[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function renderReasosn(reasons: StatsProps['cancelation_reasons']) {
  let reasonsHTML = ''

  for (const reason of reasons) {
    reasonsHTML += `
      <div style="display: flex;">
        <strong>${reason.title}</strong>
      </div>
    `
    reasonsHTML += `
    <div style="display: flex; flex-direction: column">
      <strong>Responsável: ${reason.operator_name}</strong>
    </div>
    `
    if (reason.type === 'ORDER') {
      reasonsHTML += `
      <div style="display: flex; margin-bottom: 10px; flex-direction: column">
        <strong>${reason.quantity}x ${reason.product_title}</strong>
        <span>${reason.reason}</span>
        ${reason.bill_number ? `<span>Comanda: ${reason.bill_number}</span>` : ''}
      </div>
    `
    } else {
      reasonsHTML += `
      <div style="display: flex; margin-bottom: 10px; flex-direction: column">
        <strong>Comanda: ${reason.bill_number}</strong>
        <span>${reason.reason}</span>
      </div>
    `
    }
    reasonsHTML += `
      <hr/>
      `
  }

  return reasonsHTML
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function resumPayments(payments: StatsProps['payment_groups'][0]['payments']) {
  // return object payments types and values like {"type": "pix", "value": 100.00}
  const agrupado = payments.reduce((acc, payment) => {
    if (!acc[payment.payment_method_title]) {
      acc[payment.payment_method_title] = 0
    }
    acc[payment.payment_method_title] += Number(payment.value)
    return acc
  }, {} as { [key: string]: number })

  const agrupadoArray = Object.entries(agrupado).map(([key, value]) => {
    return { type: key, value }
  })

  let resumHtml = ''

  for (const payment of agrupadoArray) {
    resumHtml += `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
        <strong>${payment.type}</strong>
        <strong>${formatCurrency(payment.value)}</strong>
      </div>
    `
  }
  resumHtml += `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
        <strong>Total: </strong>
        <strong>${formatCurrency(agrupadoArray.reduce((acc, curr) => acc + curr.value, 0))}</strong>
      </div>
    `
  return resumHtml
}

export function printStats(props: StatsProps): void {
  const restaurant = JSON.parse(localStorage.getItem('restaurant-info') || '{}')
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Impressão</title>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
        }
        @page {
          size: 80mm auto;
          margin: 6mm;
          padding: 0mm;
        }
      </style>
    </head>
    <body>
      <div style="display: flex; margin-bottom: 10px">
        <strong>Aberto por: </strong>
        <strong>${props.opened_by_name}</strong>
      </div>
      <div style="display: flex;   margin-bottom: 10px">
        <strong>Aberto em: </strong>
        <strong>${moment(props.created).format('DD/MM/YYYY HH:mm:ss')}</strong>
      </div>
      <div style="display: flex;   margin-bottom: 10px">
        <strong>Caixa: </strong>
        <strong>${props.identifier}</strong>
      </div>
      <h3 style="margin-bottom: 5px">${restaurant?.title}</h3>
      <center>
        <h3 style="margin-bottom: 5px">Relatório de caixa</h3>
      </center>
      <hr style="border-style: dashed" />
      <center>
        <h3 style="margin-bottom: 5px">Cancelamentos</h3>
      </center>
      <ul style="padding: 0; list-style: none">
        ${renderReasosn(props.cancelation_reasons)}
      </ul>
      <hr style="border-style: dashed" />
      <center>
        <h3 style="margin-bottom: 5px">Resumo</h3>
      </center>
      <ul style="padding: 0; list-style: none">
        ${resumPayments(props.payment_groups.map((pg) => pg.payments).flat())}
      </ul>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
        <strong>Saldo inicial:</strong>
        <strong>${formatCurrency(Number(props.initial_value))}</strong>
      </div>
      <h4 style="margin: 0">DATA DE IMPRESSÃO: ${new Date().toLocaleString()}</h4>
      <ul style="padding: 0">
      </ul>
      <br>
      <br>
      <p style="margin: 0; text-align: center; font-size: 12px;">
        Desenvolvido por @peditz.br
      </p>
      <p style="margin: 0; text-align: center; font-size: 12px;">
        wwww.peditz.com.br
      </p>
    </body>
  </html>`
  window.electronBridge.printLine('caixa', html)
}

interface OpenCashierProps {
  data: {
    initial_value: string
    restaurant: {
      id: string
      title: string
    }
    opened_by_name: string
  }
  printerName: string
}

export function OpenCashier(props: OpenCashierProps): void {
  window.electronBridge.printLine(
    props.printerName,
    `
      <html>
      <head>
        <title>Impressão</title>
        <style>
          * {
            font-family: sans-serif;
            font-size: 14px;
          }
          @page {
            size: 80mm 270mm;
            margin: 10mm 10mm;
          }
        </style>
      </head>
      <body style="max-width: 80mm">
        <br>
        <h3 style="margin-bottom: 5px; text-transform: uppercase; text-align: center;">${
          props.data.restaurant
        }</h3>
        <h3 style="margin-bottom: 5px; text-transform: uppercase; text-align: center;">Comprovante de abertura de caixa</h3>
        <hr style="border-style: dashed" />
        <br>

        <h4 style="margin: 0">ABERTO POR:</h4>
        <p style="margin: 0; font-size: 16px;">
            ${props.data.opened_by_name}
        </p>
        <h4 style="margin: 10px 0 0">DATA DE ABERTURA:</h4>
        <p style="margin: 0; font-size: 16px;">
            ${new Date().toLocaleString()}
        </p>
        <h4 style="margin: 10px 0 0">VALOR INICIAL:</h4>
        <p style="margin: 0; font-size: 16px;">
            ${formatCurrency(Number(props.data.initial_value))}
        </p>
        <br>
        <hr style="border-style: dashed" />
        <br>
        <p style="margin: 0; text-align: center; font-size: 12px;">
            ....
        </p>
      </body>
    </html>
  `
  )
}

interface TestPrintProps {
  printerName: string
}

export function TestPrint(props: TestPrintProps): void {
  window.electronBridge.printLine(
    props.printerName,
    `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Teste de impressão</title>
      <style>
        @page{
            margin: 0mm 0mm;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            max-width: 70mm;
        }
        .title {
            font-size: 1rem;
            font-weight: bold;
            text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="title">Página de Teste da impressora ${props.printerName}</div>
      <p>------------------------------------------------</p>
      <br />
      <br />
      <p class="title">Você instalou corretamente a impressora do ${props.printerName}</p>
      <br />
      <br />
      <p>------------------------------------------------</p>
      <p style="text-align: center; font-weight: bold">Peditz Soluções</p>
      <p style="text-align: center">www.peditz.com.br</p>
    </body>
  </html>

  `
  )
}

export function ClosedCashier(): void {
  window.electronBridge.printLine(
    '',
    `
      <html>
      <head>
        <title>Impressão</title>
        <style>
          * {
            font-family: sans-serif;
            font-size: 14px;
          }
          @page {
            size: 80mm 270mm;
            margin: 10mm 10mm;
          }
        </style>
      </head>
      <body style="max-width: 80mm">
        <br>
        <h3 style="margin-bottom: 5px; text-transform: uppercase; text-align: center;">Atelie do chef</h3>
        <h3 style="margin-bottom: 5px; text-transform: uppercase; text-align: center; font-size: 13px;">Comprovante de Fechamento de caixa</h3>
        <hr style="border-style: dashed" />
        <br>

        <h4 style="margin: 0">ABERTO POR:</h4>
        <p style="margin: 0; font-size: 16px;">
            Estefania da silva
        </p>
        <h4 style="margin: 10px 0 0">DATA DE ABERTURA:</h4>
        <p style="margin: 0; font-size: 16px;">
            28/02/2023 12:23:32
        </p>
        <h4 style="margin: 10px 0 0">VALOR INICIAL:</h4>
        <p style="margin: 0; font-size: 16px;">
            R$ 200,00
        </p>
        <h4 style="margin: 10px 0 0">FECHADO POR:</h4>
        <p style="margin: 0; font-size: 16px;">
            GILBERTO JUNIOR
        </p>
        <h4 style="margin: 10px 0 0">DATA DE FECHAMENTO:</h4>
        <p style="margin: 0; font-size: 16px;">
            28/02/2023 12:23:32
        </p>
        <h4 style="margin: 10px 0 0">VALOR FINAL:</h4>
        <p style="margin: 0; font-size: 16px;">
            R$ 3.200,00
        </p>
        <br>
        <hr style="border-style: dashed" />
        <br>
        <p style="margin: 0; text-align: center; font-size: 12px;">
            ....
        </p>
      </body>
    </html>
  `
  )
}

interface BillPrinterProps {
  discount: number
  number: string
  subtotal: number
  serviceTax: number
  total: number
  permanenceTime: string
  products: {
    title: string
    quantity: number
    price: number
    complementItems?: {
      title: string
      quantity: number
    }[]
  }[]
}

function aux(
  item: {
    title: string
    quantity: number
    price: number
    complementItems?: {
      title: string
      quantity: number
    }[]
  }[]
) {
  let row = ''
  for (const product of item) {
    row += `
    <li style="list-style: none; margin-top: 10px">
      <div style="display: flex; justify-content: space-between">
        <strong>${product.quantity}x ${product.title}</strong>
        <span>${formatCurrency(product.price)}</span>
      </div>
  `

    row += `
    </li>
  `
  }

  return row
}

export function BillPrinter(props: BillPrinterProps): void {
  const restaurant = JSON.parse(localStorage.getItem('restaurant-info') || '{}')
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Impressão</title>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
        }
        @page {
          size: 80mm auto;
          margin: 6mm;
          padding: 0mm;
        }
      </style>
    </head>
    <body>
      <h3 style="margin-bottom: 5px">${restaurant?.title}</h3>
      <p style="margin: 0; margin-bottom: 2px">${restaurant?.street}, ${restaurant?.number}</p>
      <p style="margin: 0; margin-bottom: 2px">${restaurant?.zip_code}, ${restaurant?.complement} ${
    restaurant?.city
  }/${restaurant?.state}</p>
      <p style="margin: 0; margin-bottom: 2px">${formatPhoneNumber(restaurant.phone)}</p>
      <p style="margin: 0; margin-bottom: 2px">${restaurant?.email}</p>
      <hr style="border-style: dashed" />

      <h4 style="margin: 0">Nº DA COMANDA: ${props.number}</h4>
      <h4 style="margin: 0">DATA DE IMPRESSÃO: ${new Date().toLocaleString()}</h4>
      <h4 style="margin-top: 10px">RESUMO</h4>
      <ul style="padding: 0">
        ${aux(props.products)}
      </ul>

      <hr style="border-style: dashed" />
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>SubTotal:</strong>
        <span>${formatCurrency(props.total)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>Taxa de serviço:</strong>
        <span>${formatCurrency(props.serviceTax)}</span>
      </div>
      ${
        props.discount > 0 &&
        `<div style="display: flex; justify-content: space-between; margin-top: 10px;">
         <strong>Desconto:</strong>
         <span>${formatCurrency(props.discount)}</span>
       </div>`
      }
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>Total:</strong>
        <span>${formatCurrency(props.subtotal)}</span>
      </div>
      <hr style="border-style: dashed" />

      <br>
      <br>
      <p style="margin: 0; text-align: center; font-size: 12px;">
        Desenvolvido por @peditz.br
      </p>
      <p style="margin: 0; text-align: center; font-size: 12px;">
        wwww.peditz.com.br
      </p>
    </body>
  </html>`
  console.log('cheguei')
  window.electronBridge.printLine('caixa', html)
}
// <div style="display: flex; justify-content: flex-end; margin-top: 10px; gap: 5px;">
// <strong>Permanencia: </strong>
// <span> ${formattedDifference} </span>
// </div>

interface ItemsOrdersProps {
  items: {
    complement_id: string
    complement_title: string
    items: {
      item_title: string
      quantity: number
      item_id: string
      price?: string
    }[]
  }[]
  product_price?: string
  notes: string
  product_title: string
  printer_name?: string
  product_id: string
  quantity: number
}

function addOrderItemInString(itens: ItemsOrdersProps[]): string {
  let row = ''
  for (const i of itens) {
    row += `<li style="list-style: none">
    <div style="font-size: 24px">
      <strong style="font-size: 24px">${i.quantity}x ${i.product_title}</strong>
    </div>
    ${
      i.notes
        ? `<div style="padding: 2px 0 0 5mm">
      <span style="font-size: 24px">${i.notes}</span>
    </div>`
        : ''
    }
    `
    if (i.items.length > 0) {
      for (const j of i.items) {
        row += `<ul style="padding: 2px 0 0 5mm">`
        for (const k of j.items) {
          row += `<li style="list-style: none; display: flex">`
          row += `<span style="font-size: 24px">- ${k.item_title}</span>`
          row += `</li>`
        }
        row += `</ul>`
      }
    }
    row += `</li>`
  }
  return row
}
function addOrderItemInStringDelivery(itens: ItemsOrdersProps[]): string {
  let row = ''
  for (const i of itens) {
    row += `<li style="list-style: none">
    <div style="font-size: 13px; display: flex; width: 100%; justify-content: space-between;">
      <strong style="font-size: 13px">${i.quantity}x ${i.product_title}</strong>
      <strong style="font-size: 13px">${i.product_price}</strong>
    </div>
    ${
      i.notes
        ? `<div style="padding: 2px 0 0 5mm">
      <span style="font-size: 16px">${i.notes}</span>
    </div>`
        : ''
    }
    `
    if (i.items.length > 0) {
      for (const j of i.items) {
        row += `<ul style="padding: 2px 0 0 5mm">`
        for (const k of j.items) {
          row += `<li style="list-style: none; display: flex; width: 100%; justify-content: space-between;">`
          row += `<span style="font-size: 13px">- ${k.item_title}</span>`
          row += `<span style="font-size: 13px">${k.price}</span>`
          row += `</li>`
        }
        row += `</ul>`
      }
    }
    row += `</li>`
  }
  return row
}

export function Order(
  restaurant: string,
  table: string,
  command: string,
  items: ItemsOrdersProps[],
  operator: string,
  date: string
): void {
  // console.log(items)
  const grouped: { [key: string]: ItemsOrdersProps[] } = {}
  for (const i of items) {
    const printerName = i.printer_name || 'caixa'
    if (printerName !== null) {
      if (!grouped[printerName]) {
        grouped[printerName] = []
      }
      grouped[printerName].push(i)
    }
  }
  for (const i in grouped) {
    window.electronBridge.printLine(
      i,
      `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo pedido</title>
          <style>
            * {
              font-family: sans-serif;
              font-size: 18px;
            }
            @page {
              size: 80mm auto;
              margin: 6mm;
              padding: 0mm,
            }
          </style>
        </head>
        <body>
          <h2
            style="
              margin-bottom: 5px;
              text-transform: uppercase;
              font-size: 24px;
              text-align: center;
            "
          >
            Novo pedido!
          </h2>
          <hr style="border-style: dashed" />
          <h4 style="margin: 0; text-align: center;">${moment(date).format(
            'DD/MM/YYYY HH:mm:ss'
          )}</h4>
          <h4 style="margin: 0; text-align: center; margin-top: 5px">COMANDA ${command}</h4>
          <h4 style="margin: 0; text-align: center; margin-top: 5px">MESA ${table}</h4>
          <h4 style="margin: 0; text-align: center; margin-top: 5px">Responsável ${operator}</h4>
          <hr style="border-style: dashed" />
          <ul style="padding: 0; font-size: 24px">
          ${addOrderItemInString(grouped[i])}
          <hr style="border-style: dashed" />
          <div
            style="margin-top: 10px ; font-size: 14px;"
          >
            <strong style="font-size: 14px;">Impressora:</strong>
            <span style="font-size: 14px;">${i}</span>
          </div>
          <br>
          <p style="margin: 0; text-align: center; font-size: 12px">
            ${restaurant}
          </p>
        </body>
      </html>
    `
    )
  }
}

export function OrderTakeOut(
  restaurant: string,
  code: string,
  items: ItemsOrdersProps[],
  obs: string,
  operator: string,
  date: string
): void {
  // console.log(items)
  const grouped: { [key: string]: ItemsOrdersProps[] } = {}
  for (const i of items) {
    const printerName = i.printer_name || 'caixa'
    if (printerName !== null) {
      if (!grouped[printerName]) {
        grouped[printerName] = []
      }
      grouped[printerName].push(i)
    }
  }
  for (const i in grouped) {
    window.electronBridge.printLine(
      i,
      `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo pedido</title>
          <style>
            * {
              font-family: sans-serif;
              font-size: 18px;
            }
            @page {
              size: 80mm auto;
              margin: 6mm;
              padding: 0mm,
            }
          </style>
        </head>
        <body>
          <h2
            style="
              margin-bottom: 5px;
              text-transform: uppercase;
              font-size: 24px;
              text-align: center;
            "
          >
            Novo pedido!
          </h2>
          <hr style="border-style: dashed" />
          <h4 style="margin: 0; text-align: center;">${moment(date).format(
            'DD/MM/YYYY HH:mm:ss'
          )}</h4>
          <h4 style="margin: 0; text-align: center; margin-top: 5px">SENHA ${code}</h4>
          <h4 style="margin: 0; text-align: center; margin-top: 5px">Responsável ${operator}</h4>
          <hr style="border-style: dashed" />
          <ul style="padding: 0; font-size: 24px">
          ${addOrderItemInString(grouped[i])}
          </ul>
          <p>${obs}</p>
          <hr style="border-style: dashed" />
          <div
            style="margin-top: 10px ; font-size: 14px;"
          >
            <strong style="font-size: 14px;">Impressora:</strong>
            <span style="font-size: 14px;">${i}</span>
          </div>
          <br>
          <p style="margin: 0; text-align: center; font-size: 12px">
            ${restaurant}
          </p>
        </body>
      </html>
    `
    )
  }
}

interface ResumTakeOutProps {
  number: string
  code: string
  date: string
  total: number
  recebido: string
  payment: string
  atendente: string
  items: ItemsOrdersProps[]
}

function renderTKItem(item: ItemsOrdersProps[]) {
  let row = ''
  for (const product of item) {
    row += `
    <li style="list-style: none; margin-top: 10px">
      <div style="display: flex; justify-content: space-between">
        <strong>${product.quantity}x ${product.product_title}</strong>
        <span>${formatCurrency(Number(product?.product_price) * product.quantity || 0)}</span>
      </div>
  `

    row += `
    </li>
  `
  }

  return row
}

export function ResumTakeout(props: ResumTakeOutProps): void {
  const restaurant = JSON.parse(localStorage.getItem('restaurant-info') || '{}')
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Impressão</title>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
        }
        @page {
          size: 80mm auto;
          margin: 0 3mm;
          padding: 0mm;
        }
      </style>
    </head>
    <body>
      <h3 style="margin-bottom: 5px">${restaurant?.title}</h3>
      <p style="margin: 0; margin-bottom: 2px">${restaurant?.street}, ${restaurant?.number}</p>
      <p style="margin: 0; margin-bottom: 2px">${restaurant?.zip_code}, ${restaurant?.complement} ${
    restaurant?.city
  }/${restaurant?.state}</p>
      <p style="margin: 0; margin-bottom: 2px">${formatPhoneNumber(restaurant.phone)}</p>
      <p style="margin: 0; margin-bottom: 2px">${restaurant?.email}</p>
      <hr style="border-style: dashed" />

      <h4 style="margin: 0">Nº DO PEDIDO: ${props.number}</h4>
      <h4 style="margin: 0">DATA DE IMPRESSÃO: ${new Date().toLocaleString()}</h4>
      <h4 style="margin-top: 10px">RESUMO</h4>
      <ul style="padding: 0">
        ${renderTKItem(props.items)}
      </ul>

      <hr style="border-style: dashed" />
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>TOTAL:</strong>
        <span>${formatCurrency(props.total)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>VALOR RECEBIDO:</strong>
        <span>${props.recebido}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>FORMA DE PAGAMENTO:</strong>
        <span>${props.payment}</span>
      </div>
      <hr style="border-style: dashed" />
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>SENHA:</strong>
        <span>${props.code}</span>
      </div>
      <hr style="border-style: dashed" />
      <br>
      <br>
      <p style="margin: 0; text-align: center; font-size: 12px;">
        Desenvolvido por @peditz.br
      </p>
      <p style="margin: 0; text-align: center; font-size: 12px;">
        wwww.peditz.com.br
      </p>
    </body>
  </html>`
  window.electronBridge.printLine('caixa', html)
}

export function OrderDelivery(
  restaurant: string,
  numeroPedido: string,
  forma_pagamento: string,
  items: ItemsOrdersProps[],
  total: string,
  date: string,
  client_name: string,
  client: {
    phone: string
    adress: string
    complement: string
    city: string
    cep: string
    district: string
  },
  total_items,
  total_frete
): void {
  window.electronBridge.printLine(
    'caixa',
    `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo pedido delivery</title>
          <style>
            * {
              font-family: sans-serif;
              font-size: 14px;
            }
            @page {
              margin: 0mm 1.5mm;
              padding: 0mm,
            }
          </style>
        </head>
        <body>
          <h2
            style="
              margin-bottom: 5px;
              text-transform: uppercase;
              font-size: 14px;
              text-align: center;
            "
          >
            Pedido Delivery - #${numeroPedido}
          </h2>
          <hr style="border-style: dashed" />
          <h6 style="margin: 0; margin-top: 5px; font-size: 12px;">Restaurante: ${restaurant}</h6>
          <h6 style="margin: 0; margin-top: 5px; font-size: 12px;">Data: ${moment(date).format(
            'DD/MM/YYYY HH:mm:ss'
          )}</h6>
          <br>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">Dados do cliente</h6>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">Nome: ${client_name}</h6>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">Telefone: ${client.phone}</h6>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">Endereço: ${client.adress}</h6>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">Bairro: ${client.district}</h6>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">Comp: ${client.complement}</h6>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">Cidade: ${client.city}</h6>
          <h6 style="margin: 0; margin-top: 6px; font-size: 13px;">CEP: ${client.cep}</h6>
          <br>
          <h6 style="margin: 0; margin-top: 12px; font-size: 14px;">Items</h6>
          <hr style="border-style: dashed" />
          <ul style="padding: 0; font-size: 24px">
          ${addOrderItemInStringDelivery(items)}

          </ul>
          <div style="font-size: 13px; display: flex; width: 100%; justify-content: space-between;">
        <strong style="font-size: 13px">Total</strong>
        <strong style="font-size: 13px">${total_items}</strong>
      </div>
      <div style="font-size: 13px; display: flex; width: 100%; justify-content: space-between;">
        <strong style="font-size: 13px">Taxa de entrega</strong>
        <strong style="font-size: 13px">${total_frete}</strong>
      </div>
          <hr style="border-style: dashed" />
          <h6 style="margin: 0; margin-top: 14px; font-size: 14px;">Forma de pagamento: ${forma_pagamento}</h6>
          <h6 style="margin: 0; margin-top: 5px; font-size: 14px;">Valor para receber: ${total}</h6>
          <div
            style="margin-top: 10px ; font-size: 14px; text-align: center; "
          >
            <strong style="font-size: 10px;">Impressora: caixa</strong>
          </div>
          <br>
          <h6 style="text-align: center; font-size: 12px;">www.peditz.com 🛵</h6>
        </body>
      </html>
    `
  )
}
