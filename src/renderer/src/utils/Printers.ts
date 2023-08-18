import moment from 'moment'
import { formatCurrency } from './formatCurrency'

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
            margin: 10mm 0mm;
            size: 70mm 120mm ;
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
  console.log('tô chegando assim', item)
  let row = ''
  for (let product of item) {
    row += `
    <li style="list-style: none; margin-top: 10px">
      <div style="display: flex; justify-content: space-between">
        <strong>${product.quantity}x ${product.title}</strong>
        <span>${formatCurrency(product.price)}</span>
      </div>
  `

    // if (product.complementItems && product.complementItems.length > 0) {
    //   for (const complement of product.complementItems) {
    //     console.log('eu sou o super complement', complement)
    //     row += `
    //     <ul style="padding: 2px 0 0 5mm">
    //       <li style="list-style: none; display: flex">
    //         <span>${Number(complement.quantity)}x ${complement.title}</span>
    //       </li>
    //     </ul>
    //   `
    //   }
    // }

    row += `
    </li>
  `
  }

  return row
}

export function BillPrinter(props: BillPrinterProps): void {
  console.log(props)

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
          margin: 0mm;
          padding: 0mm;
        }
      </style>
    </head>
    <body>
      <h3 style="margin-bottom: 5px">Atelie do chefe</h3>
      <p style="margin: 0; margin-bottom: 2px">Rua 15 de novembro, 123</p>
      <p style="margin: 0; margin-bottom: 2px">65900-231, centro Imperatriz/MA</p>
      <p style="margin: 0; margin-bottom: 2px">(99) 99194 7191</p>
      <p style="margin: 0; margin-bottom: 2px">ateliedochefe.mkt@gmail.com</p>
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
        <span>${formatCurrency(props.subtotal)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>Taxa de serviço:</strong>
        <span>${formatCurrency(props.serviceTax)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <strong>Total:</strong>
        <span>${formatCurrency(props.total)}</span>
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

  console.log(html)

  window.electronBridge.printLine('massas', html)
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
    }[]
  }[]
  notes: string
  product_title: string
  printer_name?: string
  product_id: string
  quantity: number
}

function addOrderItemInString(i: ItemsOrdersProps): string {
  let row = ''
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
  for (const i of items) {
    if (i.printer_name) {
      window.electronBridge.printLine(
        i.printer_name || '',
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
              margin: 0mm;
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
          ${addOrderItemInString(i)}
          <hr style="border-style: dashed" />
          <div
            style="margin-top: 10px ; font-size: 14px;"
          >
            <strong style="font-size: 14px;">Impressora:</strong>
            <span style="font-size: 14px;">${i.printer_name}</span>
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
    console.log('items', items)
    console.log('restaurant', restaurant)
  }
}
