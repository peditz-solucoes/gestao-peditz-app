import { formatCurrency } from "./formatCurrency"

interface OpenCashierProps {
    initial_value: string
    restaurant: {
        id: string,
        title: string
    }
    opened_by_name: string

}

export function OpenCashier(props: OpenCashierProps) {
    window.electronBridge.printLine(`
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
            <p><b>Valor inicial:</b> ${formatCurrency(Number(props?.initial_value))}</p>
            <p><b>Operador:</b>${props?.restaurant?.title}</p>
            <p><b>Id Caixa:</b>${props?.opened_by_name}</p>
            <p><b>Abertura:</b>${new Date().toLocaleString()}</p>
        </body>
    </html>
    `)
}