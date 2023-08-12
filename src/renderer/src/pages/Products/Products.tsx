import React, { useEffect } from 'react';
import * as S from './styles';
import { Button, Col, Divider, Row, Table } from 'antd';
import {
	AppstoreOutlined,
	BarsOutlined,
	FilterOutlined,
	ShoppingOutlined,
} from '@ant-design/icons';
import { CardProducts } from '../../components/CardProducts/CardProducts';
import { DrawerFilterProducts } from '../../components/DrawerFilterProducts/DrawerFilterProducts';
import { DrawerProduct } from '../../components/DrawerProduct/DrawerProduct';
import { Product } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { formatCurrency } from '../../utils';
import { useProducts } from '../../hooks';

type CategoryGroup = {
	category: string;
	products: Product[];
};

const columns: ColumnsType<Product> = [
	{
		title: 'Nome',
		dataIndex: 'title',
		align: 'center',
		key: 'name',
	},
	{
		title: 'Categoria',
		dataIndex: 'category',
		align: 'center',
		sorter: (a, b) => {
			return a.category.title.localeCompare(b.category.title);
		},
		render: (category: { title: string }) => category.title,
		sortDirections: ['descend'],
		key: 'category',
	},
	{
		title: 'Preço',
		dataIndex: 'price',
		align: 'center',
		key: 'price',
		render: (price: string) => formatCurrency(Number(price)),
	},
	{
		title: 'Ações',
		key: 'action',
		align: 'center',
		render: (record: Product) => (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '8px',
					justifyContent: 'center',
				}}
			>
				<Button
					type="primary"
					size="small"
					onClick={() => console.log(record.id)}
				>
					Editar
				</Button>
				<Button
					type="primary"
					danger
					size="small"
					onClick={() => console.log(record.id)}
				>
					Excluir
				</Button>
			</div>
		),
	},
];

export const Products: React.FC = () => {
	const [visibleFilter, setVisibleFilter] = React.useState(false);
	const [visibleCardProduct, setVisibleCardProduct] = React.useState(false);
	const [visibleDrawerProduct, setVisibleDrawerProduct] = React.useState(false);
	const { products, fetchProducts, setSelectedProduct } = useProducts();

	useEffect(() => {
		fetchProducts();
	}, []);

	function groupProductsByCategory(): CategoryGroup[] {
		const categoryGroups: { [key: string]: CategoryGroup } = {};

		products.forEach((Product) => {
			const category = Product.category.title;
			if (!categoryGroups[category]) {
				categoryGroups[category] = { category, products: [] };
			}
			categoryGroups[category].products.push(Product);
		});

		return Object.values(categoryGroups);
	}
	return (
		<>
			<S.Container>
				<S.Header>
					<Button
						type="primary"
						style={{
							backgroundColor: '#2FAA54',
						}}
						onClick={() => setVisibleDrawerProduct(true)}
					>
						<ShoppingOutlined /> Criar um produto
					</Button>
					<Button
						type="default"
						onClick={() => setVisibleCardProduct(!visibleCardProduct)}
					>
						{visibleCardProduct ? <AppstoreOutlined /> : <BarsOutlined />}
					</Button>
					<Button onClick={() => setVisibleFilter(!visibleFilter)}>
						<FilterOutlined />
					</Button>
				</S.Header>
				<div
					style={{
						overflow: 'auto',
						overflowX: 'hidden',
						height: 'calc(100vh - 140px)',
						display: 'flex',
						marginTop: '20px',
						flexDirection: 'column',
						gap: '40px',
					}}
				>
					{!visibleCardProduct &&
						groupProductsByCategory().map((category, k) => {
							return (
								<div key={k}>
									<S.TitleCategory>
										{category.category} <Divider type="horizontal" />
									</S.TitleCategory>
									<Row
										gutter={[24, 24]}
										style={{
											padding: '0 40px',
										}}
									>
										{category.products.map((Product) => {
											return (
												<Col span={4} key={Product.id}>
													<CardProducts
														key={Product.id}
														data={Product}
														onUpdate={fetchProducts}
														onEditClick={(product) => {
															setVisibleDrawerProduct(true);
															setSelectedProduct(product);
														}}
													/>
												</Col>
											);
										})}
									</Row>
								</div>
							);
						})}
					{visibleCardProduct && (
						<div
							style={{
								padding: '0 40px',
							}}
						>
							<Table columns={columns} dataSource={products} />
						</div>
					)}
				</div>
			</S.Container>
			<DrawerFilterProducts
				visible={visibleFilter}
				onClose={() => setVisibleFilter(false)}
				products={products}
			/>
			<DrawerProduct
				visible={visibleDrawerProduct}
				onClose={() => setVisibleDrawerProduct(false)}
			/>
		</>
	);
};
