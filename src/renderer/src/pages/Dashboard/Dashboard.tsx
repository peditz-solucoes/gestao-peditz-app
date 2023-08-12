import React from 'react';
import * as S from './styles';
import { Avatar, Button, Image, Typography } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const Dashboard: React.FC = () => {
	return (
		<S.DashboardContainer>
			<div
				style={{
					width: '100%',
					position: 'relative',
				}}
			>
				<Image
					preview={false}
					width={'100%'}
					height={'350px'}
					style={{
						borderRadius: '10px',
						boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
						filter: 'brightness(60%)',
					}}
					src="https://peditz.sfo3.digitaloceanspaces.com/capa.png"
				/>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 30,
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'flex-start',
						gap: '10px',
					}}
				>
					<Title
						level={1}
						style={{
							color: '#fff',
						}}
					>
						Bem vindo ao Peditz
					</Title>
					<Paragraph
						style={{
							color: '#fff',
							fontSize: '1.5rem',
						}}
					>
						Gestão restaurante: eficiência, controle e excelência em um só
						lugar.
					</Paragraph>
					<Button
						type="primary"
						size="large"
						style={{
							height: '60px',
							fontSize: '1.25rem',
							fontWeight: 'bold',
						}}
					>
						Visualizar cardápio
					</Button>
				</div>
			</div>
			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: '20px',
				}}
			>
				<S.Card>
					<div>
						<Avatar
							icon={<DollarOutlined style={{ color: '#2FAA54' }} />}
							style={{ backgroundColor: '#E9EDFC' }}
							size={64}
						/>
					</div>
					<div>
						<Title level={3} style={{ margin: '0' }}>
							R$ 0,00
						</Title>
						<Paragraph
							style={{ margin: '0', fontWeight: 'bold', color: '#a9a9a9' }}
						>
							Valor total de vendas
						</Paragraph>
					</div>
				</S.Card>
				<S.Card>
					<div>
						<Avatar
							icon={<DollarOutlined style={{ color: '#2FAA54' }} />}
							style={{ backgroundColor: '#E9EDFC' }}
							size={64}
						/>
					</div>
					<div>
						<Title level={3} style={{ margin: '0' }}>
							R$ 0,00
						</Title>
						<Paragraph
							style={{ margin: '0', fontWeight: 'bold', color: '#a9a9a9' }}
						>
							Ticket Médio
						</Paragraph>
					</div>
				</S.Card>
				<S.Card>
					<div>
						<Avatar
							icon={<DollarOutlined style={{ color: '#2FAA54' }} />}
							style={{ backgroundColor: '#E9EDFC' }}
							size={64}
						/>
					</div>
					<div>
						<Title level={3} style={{ margin: '0' }}>
							R$ 0,00
						</Title>
						<Paragraph
							style={{ margin: '0', fontWeight: 'bold', color: '#a9a9a9' }}
						>
							Faturamento Total
						</Paragraph>
					</div>
				</S.Card>
				<S.Card>
					<div>
						<Avatar
							icon={<DollarOutlined style={{ color: '#2FAA54' }} />}
							style={{ backgroundColor: '#E9EDFC' }}
							size={64}
						/>
					</div>
					<div>
						<Title level={3} style={{ margin: '0' }}>
							139
						</Title>
						<Paragraph
							style={{ margin: '0', fontWeight: 'bold', color: '#a9a9a9' }}
						>
							Visitas no cardápio
						</Paragraph>
					</div>
				</S.Card>
				<S.Card>
					<div>
						<Avatar
							icon={<DollarOutlined style={{ color: '#2FAA54' }} />}
							style={{ backgroundColor: '#E9EDFC' }}
							size={64}
						/>
					</div>
					<div>
						<Title level={3} style={{ margin: '0' }}>
							R$ 0,00
						</Title>
						<Paragraph
							style={{ margin: '0', fontWeight: 'bold', color: '#a9a9a9' }}
						>
							Gastos com estoque
						</Paragraph>
					</div>
				</S.Card>
			</div>
			{/* <S.SliderContainer>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
					}}
				>
					<Title level={3} style={{ fontWeight: 'bolder', color: '#a9a9a9' }}>
						Top 10º mais vendidos
					</Title>
				</div>
				<Carousel
					autoplay
					style={{
						width: '100%',
						height: '100%',
					}}
				>
					<S.CardProduct>teste</S.CardProduct>
				</Carousel>
			</S.SliderContainer> */}
		</S.DashboardContainer>
	);
};
