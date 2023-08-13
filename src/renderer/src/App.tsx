import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { Navigation } from './routes/Routes'
import { HashRouter as Router } from 'react-router-dom'
import GlobalStyle from './theme/GlobalStyles'
import { ConfigProvider, FloatButton, message } from 'antd'
import { BillProvider, PrinterProvider, ProductsProvider } from './hooks'
import { QuestionCircleOutlined } from '@ant-design/icons'

function App() {
  const [, contextHolder] = message.useMessage()

  return (
    <Router>
      {contextHolder}
      <ConfigProvider
        theme={{
          token: theme.tokens
        }}
      >
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <ProductsProvider>
            <PrinterProvider>
              <BillProvider>
                <Navigation />
                <FloatButton
                  icon={<QuestionCircleOutlined />}
                  type="primary"
                  style={{ right: 24 }}
                />
              </BillProvider>
            </PrinterProvider>
          </ProductsProvider>
        </ThemeProvider>
      </ConfigProvider>
    </Router>
  )
}

export default App
