import { Button, Layout, Tabs, TabsProps, Typography, Image } from 'antd';
import React from 'react';
import { theme } from '../../theme';
import { BillComponent } from './components/billComponent/BillComponent';
import { useTerminal } from '../../hooks/useTerminal';
import { Products } from './components/products/Products';
import { useNavigate } from 'react-router-dom';

export const Terminal: React.FC = () => {
	const { currentTab, setCurrentTab } = useTerminal();
	const navigate = useNavigate();

	const items: TabsProps['items'] = [
		{
			key: '1',
			label: `Escolha a comanda`,
			children: <BillComponent />,
		},
		{
			key: '2',
			label: `Escolha o categoria`,
			children: <Products />,
			disabled: currentTab === '1',
		},
	];

	return (
		<Layout
			style={{
				flex: 1,
				height: '100vh',
			}}
		>
			<div
				style={{
					background: theme.tokens.colorPrimary,
					padding: '1rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Button
					size="large"
					type="ghost"
					onClick={() => navigate('/comandas/')}
				>
					Voltar
				</Button>
				<Image src="logo-branca.png" width={130} preview={false} />
				<Typography.Title level={4} style={{ color: 'white' }}>
					Terminal
				</Typography.Title>
			</div>
			<Tabs
				style={{
					paddingLeft: '1rem',
				}}
				size="large"
				defaultActiveKey="1"
				activeKey={currentTab}
				items={items}
				onTabClick={(key) => {
					setCurrentTab(key);
				}}
			/>
		</Layout>
	);
};
