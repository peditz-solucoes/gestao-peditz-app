import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { Navigation } from './routes/Routes'
import { HashRouter as Router } from 'react-router-dom'
import GlobalStyle from './theme/GlobalStyles'
import { ConfigProvider, message } from 'antd'
import { BillProvider, PrinterProvider, ProductsProvider, TakeoutProvider } from './hooks'
import { CashierProvider } from './hooks'
import { SocketProvider } from './hooks/useSocket'

function App(): JSX.Element {
  const [, contextHolder] = message.useMessage()

  return (
    <Router>
      {contextHolder}
      <ConfigProvider
        theme={{
          token: theme.tokens
        }}
      >
        <SocketProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <CashierProvider>
              <ProductsProvider>
                <PrinterProvider>
                  <BillProvider>
                    <TakeoutProvider>
                      <Navigation />
                    </TakeoutProvider>
                  </BillProvider>
                </PrinterProvider>
              </ProductsProvider>
            </CashierProvider>
          </ThemeProvider>
        </SocketProvider>
      </ConfigProvider>
    </Router>
  )
}

export default App
