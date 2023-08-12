import { Button, Drawer, Form, Input, Select, Space, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { useProducts } from '../../hooks';

interface DrawerFilterProps {
	visible: boolean;
	onClose: () => void;
	products: Product[];
}

export const DrawerFilterProducts: React.FC<DrawerFilterProps> = ({
	visible,
	onClose,
}) => {
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm();
	const { filteredProducts, fetchCategories, categories } = useProducts();

	useEffect(() => {
		fetchCategories();
		setOpen(visible);
	}, [visible]);

	const onFinish = (values: any) => {
		console.log('Success:', values);
		filteredProducts({
			productCategoryId: values.category,
			active: values.active,
			listed: values.listed,
		});
	};

	function resetForm() {
		form.resetFields();
	}

	return (
		<Drawer
			title="Filtre por Produtos"
			placement={'right'}
			closable={true}
			onClose={() => {
				onClose();
				resetForm();
			}}
			open={open}
			key={'right'}
			destroyOnClose
		>
			<Form
				form={form}
				name="filterProducts"
				layout="vertical"
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
				}}
				onFinish={onFinish}
			>
				<div>
					<Form.Item label="Nome do Produto" name="title">
						<Input placeholder="nome" />
					</Form.Item>

					<Form.Item label="Categoria" name="category">
						<Select
							showSearch
							style={{ width: '100%' }}
							placeholder="Selecione uma categoria"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.label ?? '').includes(input)
							}
							filterSort={(optionA, optionB) =>
								(optionA?.label ?? '')
									.toLowerCase()
									.localeCompare((optionB?.label ?? '').toLowerCase())
							}
							options={categories.map((category) => {
								return {
									value: category.id,
									label: category.title,
								};
							})}
						/>
					</Form.Item>

					<Space
						direction="horizontal"
						style={{
							display: 'flex',
							gap: '20px',
						}}
					>
						<Form.Item label="Ativo" name="active" initialValue={true}>
							<Switch
								checkedChildren="Sim"
								unCheckedChildren="Não"
								defaultChecked={true}
							/>
						</Form.Item>

						<Form.Item label="Listado" name="listed" initialValue={true}>
							<Switch
								checkedChildren="Sim"
								unCheckedChildren="Não"
								defaultChecked={true}
							/>
						</Form.Item>
					</Space>
					<Form.Item label="impressoras" name="printers">
						<Select
							showSearch
							style={{ width: '100%' }}
							placeholder="Selecione uma categoria"
							optionFilterProp="children"
							filterOption={(input, option) =>
								(option?.label ?? '').includes(input)
							}
							filterSort={(optionA, optionB) =>
								(optionA?.label ?? '')
									.toLowerCase()
									.localeCompare((optionB?.label ?? '').toLowerCase())
							}
							options={[
								{
									value: '1',
									label: 'Impressora 1',
								},
								{
									value: '2',
									label: 'Impressora 2',
								},
								{
									value: '3',
									label: 'Impressora 3',
								},
							]}
						/>
					</Form.Item>
				</div>
				<div>
					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
							Buscar
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Drawer>
	);
};
