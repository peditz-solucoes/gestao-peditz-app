import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  //configurações padrão

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.02);
  }

  ::-webkit-scrollbar-thumb {
    background-color: #2FAA54;
    border-radius: 5px;
  }

  .ant-menu.ant-menu-sub{
    background: transparent !important;
  }

}

html {

}

#root{
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  height: 100%;
  overflow: hidden;
}
`
export default GlobalStyle