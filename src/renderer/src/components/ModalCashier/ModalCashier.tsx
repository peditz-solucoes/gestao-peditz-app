import { Button, Form, Input, InputNumber, Modal } from 'antd';
import React, { useState } from 'react';
import api from '../../services/api';
import { AxiosError } from 'axios';
import { errorActions } from '../../utils/errorActions';

interface ModalTradingBoxProps {
	open: boolean;
	cashierId?: string;
	onClose: () => void;
	onFetch: () => void;
	type: 'close' | 'open';
}

export const ModalCashier: React.FC<ModalTradingBoxProps> = ({
	onClose,
	onFetch,
	open,
	type,
	cashierId,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();
	const onFinish = (values: any) => {
		if (type === 'open') {
			handleOpenCashier(values);
		} else {
			handleCloseCashier(values.password);
		}
	};

	const onResetForm = () => form.resetFields();

	function handleCloseCashier(password: string) {
		console.log(password);
		setIsLoading(true);
		api
			.patch(`/cashier/${cashierId}/`, { open: false, password })
			.then(() => {
				onFetch();
				onClose();
				onResetForm();
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => setIsLoading(false));
	}

	function handleOpenCashier(data: {
		initial_value: number;
		identifier: string;
		password: string;
	}) {
		setIsLoading(true);
		api
			.post('/cashier/', { ...data, open: true })
			.then(() => {
				onFetch();
				onClose();
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => setIsLoading(false));
	}

	return (
		<Modal
			title={type === 'open' ? <h3>Abrir Caixa</h3> : <h3>Fechar Caixa</h3>}
			open={open}
			footer={null}
			onCancel={onClose}
		>
			{type === 'open' && (
				<div
					style={{
						width: '100%',
						marginTop: '30px',
					}}
				>
					<Form
						name="trading_box"
						layout="vertical"
						form={form}
						onFinish={onFinish}
						style={{
							fontWeight: 'bold',
						}}
					>
						<div
							style={{
								display: 'flex',
								gap: '5px',
								flexDirection: 'column',
							}}
						>
							<Form.Item
								name="initial_value"
								label="Valor de entrada"
								tooltip="Informa o valor que o caixa possui no momento de abertura"
								rules={[
									{
										required: true,
										message:
											'É necessário informar o valor de entrada, mesmo que o mesmo seja 0!',
									},
								]}
							>
								<InputNumber
									type="number"
									style={{ width: '100%' }}
									size="large"
									placeholder="Valor inicial do Caixa"
								/>
							</Form.Item>
							<Form.Item
								name="identifier"
								label="Identificador do caixa"
								tooltip="Este campo serve para identificar o caixa aberto, por exemplo: 'Almoço' ou 'jantar'"
							>
								<Input
									size="large"
									placeholder="Informe algo que indentifique o seu caixa"
								/>
							</Form.Item>
							<Form.Item
								name="password"
								label="Senha do operador"
								rules={[
									{
										required: true,
										message: 'É necessário informar a senha do operador!',
									},
								]}
							>
								<Input.Password
									size="large"
									placeholder="Senha"
									visibilityToggle
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
										Abrir caixa
									</Button>
								</Form.Item>
							</div>
						</div>
					</Form>
				</div>
			)}
			{type === 'close' && (
				<div
					style={{
						width: '100%',
						marginTop: '30px',
					}}
				>
					<Form name="trading_box" layout="vertical" onFinish={onFinish}>
						<div
							style={{
								display: 'flex',
								gap: '5px',
								flexDirection: 'column',
							}}
						>
							<Form.Item
								name="password"
								label="Senha do operador"
								rules={[
									{
										required: true,
										message: 'É necessário informar a senha do operador!',
									},
								]}
							>
								<Input.Password
									size="large"
									placeholder="Senha"
									visibilityToggle
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
									<Button type="default" onClick={onClose} size="large">
										Cancelar
									</Button>
								</Form.Item>
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										size="large"
										danger
										loading={isLoading}
									>
										Fechar Caixa
									</Button>
								</Form.Item>
							</div>
						</div>
					</Form>
				</div>
			)}
		</Modal>
	);
};
