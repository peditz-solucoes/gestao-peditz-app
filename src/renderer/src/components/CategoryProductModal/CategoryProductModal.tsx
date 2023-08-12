import { Button, Form, Input, InputNumber, Modal, Spin } from 'antd';
import React, { useEffect } from 'react';
import api from '../../services/api';
import { AxiosError } from 'axios';
import { errorActions } from '../../utils/errorActions';

interface CategoryProductModalProps {
	open: boolean;
	onClose: () => void;
	onUpdate: () => void;
	type: 'create' | 'edit';
	categoryId?: string;
}

export const CategoryProductModal: React.FC<CategoryProductModalProps> = ({
	type,
	categoryId,
	open,
	onClose,
	onUpdate,
}) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [spinner, setSpinner] = React.useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		resetForm();
		if (type === 'edit' && categoryId) {
			setSpinner(true);
			api
				.get(`/product-category/${categoryId}/`)
				.then((response) => {
					form.setFieldsValue({
						title: response.data.title,
						order: response.data.order,
					});
				})
				.catch((error: AxiosError) => {
					errorActions(error);
				})
				.finally(() => {
					setSpinner(false);
				});
		}
	}, [categoryId, open]);

	const resetForm = () => {
		form.resetFields(); // Reset the form fields to initial or empty values
	};

	const onFinish = (values: any) => {
		if (type === 'edit' && categoryId) {
			fetchUpdateCategory(values.title, values.order);
		}
		if (type === 'create') {
			fetchCreateCategory(values.title, values.order);
		}
	};

	function fetchCreateCategory(title: string, order: number) {
		setIsLoading(true);
		api
			.post('/product-category/', {
				title,
				order,
			})
			.then(() => {
				onClose();
				onUpdate();
			})
			.catch((error) => {
				errorActions(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function fetchUpdateCategory(title: string, order: number) {
		setIsLoading(true);
		api
			.patch(`/product-category/${categoryId}/`, {
				title,
				order,
			})
			.then(() => {
				onClose();
				onUpdate();
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	return (
		<Modal
			title={
				type === 'edit' && categoryId ? (
					<h3>Editar Categoria</h3>
				) : (
					<h3>Criar Categoria</h3>
				)
			}
			okText={type === 'edit' && categoryId ? 'Editar' : 'Criar'}
			open={open}
			onCancel={() => {
				resetForm();
				onClose();
			}}
			footer={null}
		>
			<div
				style={{
					width: '100%',
					marginTop: '30px',
				}}
			>
				<Spin spinning={spinner}>
					<Form
						form={form}
						name="product_category"
						layout="vertical"
						onFinish={onFinish}
					>
						<div
							style={{
								display: 'flex',
								gap: '5px',
								flexDirection: 'column',
							}}
						>
							<Form.Item
								name="title"
								label="Nome da categoria"
								rules={[
									{
										required: true,
										message: 'O nome da categoria é obrigatório!',
									},
								]}
							>
								<Input size="large" placeholder="nome da categoria" />
							</Form.Item>
							<Form.Item
								name="order"
								label="Ordem de exibição"
								initialValue={0}
							>
								<InputNumber
									defaultValue={0}
									size="large"
									placeholder="ordem"
									style={{ width: '100%' }}
								/>
							</Form.Item>

							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<Form.Item>
									<Button type="default" danger onClick={onClose} size="large">
										Cancelar
									</Button>
								</Form.Item>
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										size="large"
										loading={isLoading}
									>
										{type === 'edit' && categoryId
											? 'Editar Categoria'
											: 'Criar Categoria'}
									</Button>
								</Form.Item>
							</div>
						</div>
					</Form>
				</Spin>
			</div>
		</Modal>
	);
};
