import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { Navigation } from './routes/Routes';
import { HashRouter as Router } from 'react-router-dom';
import GlobalStyle from './theme/GlobalStyles';
import { ConfigProvider, message } from 'antd';
import { BillProvider, ProductsProvider } from './hooks';

function App() {
	const [, contextHolder] = message.useMessage();

	return (
		<Router>
			{contextHolder}
			<ConfigProvider
				theme={{
					token: theme.tokens,
				}}
			>
				<ThemeProvider theme={theme}>
					<GlobalStyle />
					<ProductsProvider>
						<BillProvider>
							<Navigation />
						</BillProvider>
					</ProductsProvider>
				</ThemeProvider>
			</ConfigProvider>
		</Router>
	);
}

export default App;
