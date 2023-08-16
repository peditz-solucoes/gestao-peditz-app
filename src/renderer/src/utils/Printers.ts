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

export function OpenCashier(props: OpenCashierProps) {
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

export function TestPrint(props: TestPrintProps) {
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

export function ClosedCashier() {
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

export function BillPrinter() {
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
      <h3 style="margin-bottom: 5px">Atelie do chefe</h3>
      <p style="margin: 0; margin-bottom: 2px">Rua 15 de novembro, 123</p>
      <p style="margin: 0; margin-bottom: 2px">65900-231, centro Imperatriz/MA</p>
      <p style="margin: 0; margin-bottom: 2px">(99) 99194-7191</p>
      <p style="margin: 0; margin-bottom: 2px">ateliedochefe.mkt@gmail.com</p>
      <hr style="border-style: dashed" />

      <h4 style="margin: 0">N DA COMANDA: 12</h4>
      <h4 style="margin: 0">DATA DE IMPRESSÃO: 12/12/2023 12:12</h4>
      <h4 style="margin-top: 10px">RESUMO</h4>
      <ul style="padding: 0">
        <li style="list-style: none">
          <div style="display: flex; justify-content: space-between">
            <strong>1x Pizza Grande</strong>
            <span>R$ 50,00</span>
          </div>
          <ul style="padding: 2px 0 0 5mm">
            <li
              style="
                list-style: none;
                display: flex;
                justify-content: space-between;
              "
            >
              <span>1x Calabresa</span>
            </li>
            <li
              style="
                list-style: none;
                display: flex;
                justify-content: space-between;
              "
            >
              <span>1x Frango</span>
            </li>
          </ul>
        </li>
        <li style="list-style: none; margin-top: 10px">
          <div style="display: flex; justify-content: space-between">
            <strong>2x Refrigerante Lata</strong>
            <span>R$ 12,00</span>
          </div>
        </li>
      </ul>

      <hr style="border-style: dashed" />
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <strong>SubTotal:</strong>
          <span>R$ 62,00</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <strong>Taxa de serviço:</strong>
          <span>R$ 6,20</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <strong>Total:</strong>
          <span>R$ 68,20</span>
      </div>
      <hr style="border-style: dashed" />
      <div style="display: flex; justify-content: flex-end; margin-top: 10px; gap: 5px;">
          <strong>Permanencia: </strong>
          <span> 2 horas 15 min </span>
      </div>
      <br>
      <br>
      <p style="margin: 0; text-align: center; font-size: 12px;">
          Desenvolvido por @peditz.br
      </p>
      <p style="margin: 0; text-align: center; font-size: 12px;">
          wwww.peditz.com.br
      </p>
      <br>
      <br>
      <p style="margin: 0; text-align: center; font-size: 12px;">
          ....
      </p>


    </body>
  </html>
  `
  )
}

export function Order() {
  window.electronBridge.printLine(
    '',
    `
      <html>
      <head>
        <title>Impressão</title>
        <style>
          * {
            font-family: sans-serif;
            font-size: 18px;
          }
          @page {
            size: 80mm 270mm;
            margin: 10mm 10mm;
          }
        </style>
      </head>
      <body style="max-width: 80mm">
        <br />
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
        <h4 style="margin: 0; text-align: center">12/12/2023 12:12</h4>
        <h4 style="margin: 0; text-align: center; margin-top: 5px">COMANDA 12</h4>
        <h4 style="margin: 0; text-align: center; margin-top: 5px">MESA 4</h4>
        <hr style="border-style: dashed" />
        <ul style="padding: 0; font-size: 24px">
          <li style="list-style: none">
            <div style="font-size: 24px">
              <strong style="font-size: 24px">1x Pizza Grande</strong>
            </div>
            <ul style="padding: 2px 0 0 5mm">
              <li style="list-style: none; display: flex">
                <span style="font-size: 24px">1x Calabresa</span>
              </li>
              <li
                style="
                  list-style: none;
                  display: flex;
                  justify-content: space-between;
                "
              >
                <span style="font-size: 24px">1x Frango</span>
              </li>
            </ul>
          </li>
          <li style="list-style: none; margin-top: 10px">
            <div>
              <strong style="font-size: 24px">2x Refrigerante Lata</strong>
            </div>
          </li>
        </ul>

        <hr style="border-style: dashed" />
        <div
          style="margin-top: 10px ; font-size: 14px;"
        >
          <strong style="font-size: 14px;">Impressora:</strong>
          <span style="font-size: 14px;">cozinha</span>
        </div>
        <br>
        <p style="margin: 0; text-align: center; font-size: 12px">
          Atelie do chefe
        </p>
        <br />
        <p style="margin: 0; text-align: center; font-size: 12px">....</p>
      </body>
    </html>
  `
  )
}
