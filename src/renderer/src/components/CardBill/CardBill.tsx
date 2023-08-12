import React from 'react';
import * as S from './styles';
import { Bill } from '../../types';
import { Avatar, Divider, Typography } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface CardBillProps {
	data: Bill;
}

export const CardBill: React.FC<CardBillProps> = (props: CardBillProps) => {
	const navigate = useNavigate();
	return (
		<S.Container onClick={() => navigate(`/comandas/${props.data.id}`)}>
			<S.InfoBill>
				<div>
					<Avatar
						size={48}
						style={{
							backgroundColor: '#F5F7FC',
						}}
						icon={<DollarOutlined style={{ color: '#2FAA54' }} />}
					/>
				</div>
				<Title level={3}>{props.data.number}</Title>
				<Text strong style={{ fontSize: '18px' }}>
					{' '}
					Mesa: {props.data.table_datail.title}
				</Text>
				{props.data.client_name && (
					<Text strong style={{ fontSize: '18px' }}>
						<Text underline style={{ fontSize: '18px' }}>
							Cliente:
						</Text>{' '}
						{props.data.client_name.split(' ').length > 2
							? `${props.data.client_name.split(' ')[0]} ${
									props.data.client_name.split(' ')[1]
							  }`
							: `${props.data.client_name}`}
					</Text>
				)}
				{props.data.opened_by_name && (
					<Text strong style={{ fontSize: '18px' }}>
						Aberto por: {props.data.opened_by_name}
					</Text>
				)}
			</S.InfoBill>
			<Divider style={{ margin: '0' }} />
			<S.FinanceBill>
				<S.BoxFinance>
					<Title level={5} style={{ color: '#ECA63E' }}>
						SubTotal
					</Title>
					<Text strong italic style={{ fontSize: '18px' }}>
						{formatCurrency(12.9)}
					</Text>
				</S.BoxFinance>
				<Divider
					type="vertical"
					style={{ height: '100%', margin: '0' }}
					orientation="center"
				/>
				<S.BoxFinance>
					<Title level={5} style={{ color: '#2FAA54' }}>
						Total
					</Title>
					<Text strong italic style={{ fontSize: '18px' }}>
						{formatCurrency(12.9)}
					</Text>
				</S.BoxFinance>
			</S.FinanceBill>
		</S.Container>
	);
};
