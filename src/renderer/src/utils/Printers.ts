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
  <!DOCTYPE html>
  <html>
      <head>
          <title>Document</title>
          <style>
              @page{
                  margin: 10mm 0mm;
                  size: 70mm 120mm ;
              }

              body {
                  font-family: Arial, Helvetica, sans-serif;
                  max-width: 70mm;
                  font-size: 14px;
              }
              .title {
                  font-size: 1rem;
                  font-weight: bold;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="title">ABERTURA DE CAIXA</div>
          <p>---------------------------------</p>
          <br>
          <br>
          <p><b>Valor inicial:</b> ${formatCurrency(Number(props?.data.initial_value))}</p>
          <p><b>Operador:</b>${props?.data.restaurant?.title}</p>
          <p><b>Id Caixa:</b>${props?.data.opened_by_name}</p>
          <p><b>Abertura:</b>${new Date().toLocaleString()}</p>
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
