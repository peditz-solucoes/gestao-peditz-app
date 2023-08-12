import React from 'react';
import * as S from './styles';
import { Button, Input, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

interface DataType {
	key: string;
	name: string;
	amount: number;
	minimumAmount: number;
	ean: string;
	unitMeasure: string;
}

const columns: ColumnsType<DataType> = [
	{
		title: 'Nome',
		dataIndex: 'name',
		key: 'name',
		align: 'center',
	},
	{
		title: 'Quantidade',
		dataIndex: 'amount',
		key: 'amount',
		align: 'center',
	},
	{
		title: 'Quantidade mínima',
		dataIndex: 'minimumAmount',
		key: 'minimumAmount',
		align: 'center',
	},
	{
		title: 'EAN',
		dataIndex: 'ean',
		key: 'ean',
		align: 'center',
	},
	{
		title: 'Unidade de medida',
		dataIndex: 'unitMeasure',
		key: 'unitMeasure',
		align: 'center',
	},
	{
		title: 'Ações',
		key: 'action',
		align: 'center',
		render: () => (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '8px',
					justifyContent: 'center',
				}}
			>
				<Button type="primary" size="small">
					Editar
				</Button>
				<Button type="primary" danger size="small">
					Excluir
				</Button>
			</div>
		),
	},
];

const data: DataType[] = [
	{
		key: '1',
		name: 'Arroz',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '2',
		name: 'Feijão',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '3',
		name: 'Macarrão',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '4',
		name: 'Açúcar',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '5',
		name: 'Sal',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '6',
		name: 'Óleo',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '7',
		name: 'Farinha de trigo',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '8',
		name: 'Farinha de mandioca',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'kg',
	},
	{
		key: '9',
		name: 'Café',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '10',
		name: 'Leite em pó',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '11',
		name: 'Leite condensado',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '12',
		name: 'Creme de leite',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '13',
		name: 'Molho de tomate',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '14',
		name: 'Extrato de tomate',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '15',
		name: 'Milho verde em conserva',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '16',
		name: 'Ervilha em conserva',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
	{
		key: '17',
		name: 'Sardinha em conserva',
		amount: 10,
		minimumAmount: 5,
		ean: '123456789',
		unitMeasure: 'g',
	},
];

export const Stocks: React.FC = () => {
	return (
		<S.Container>
			<S.Header>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '16px',
					}}
				>
					<Button type="primary" size="large" icon={<PlusOutlined />}>
						Adicionar estoque
					</Button>
					<Input.Search placeholder="Nome do estoque" size="large" />
				</div>
			</S.Header>
			<Table
				columns={columns}
				dataSource={data}
				pagination={false}
				scroll={{ y: 700 }}
			/>
		</S.Container>
	);
};
