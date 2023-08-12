import { Button, Form, Input, InputNumber, Modal, Switch } from 'antd';
import React from 'react';
import api from '../../services/api';
import { AxiosError } from 'axios';
import { errorActions } from '../../utils/errorActions';

interface CreateTableProps {
	visible: boolean;
	onCancel: () => void;
	onFetch: () => void;
}

export const CreateTable: React.FC<CreateTableProps> = ({
	onCancel,
	onFetch,
	visible,
}) => {
	const [form] = Form.useForm();
	const [title, setTitle] = React.useState<string>('');
	const [isLoad, setIsLoad] = React.useState<boolean>(false);

	function onFinish() {
		registerTable();
	}

	function registerTable() {
		setIsLoad(true);
		api
			.post('/tables/', form.getFieldsValue())
			.then(() => {
				onFetch();
				onCancel();
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {
				setIsLoad(false);
			});
	}

	return (
		<Modal
			title="Criar Categoria"
			onCancel={onCancel}
			open={visible}
			footer={null}
		>
			<Form layout="vertical" onFinish={onFinish} name="table_edit" form={form}>
				<Form.Item
					label="Nome da mesa"
					name="title"
					tooltip="O nome da mesa pode ser expresso em palavras ou numeros"
				>
					<Input
						placeholder="Nome da mesa"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</Form.Item>
				<Form.Item label="Descrição" name="description">
					<Input.TextArea
						placeholder="Descrição"
						rows={3}
						style={{
							resize: 'none',
						}}
					/>
				</Form.Item>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '20px',
					}}
				>
					<Form.Item
						label="Order"
						name="order"
						initialValue={0}
						tooltip="Mostra a capacidade de pessoas que podem ocupar a mesa"
					>
						<InputNumber placeholder="Ordem" defaultValue={0} />
					</Form.Item>
					<Form.Item
						label="Capacidade da mesa"
						name="capacity"
						initialValue={4}
					>
						<InputNumber placeholder="capacidade" defaultValue={4} />
					</Form.Item>
					<Form.Item
						label="Mesa ativa"
						name="active"
						tooltip="Se a mesa não estiver ativa, não será exibida para os colaboradores"
						initialValue={true}
					>
						<Switch checkedChildren="sim" unCheckedChildren="não" checked />
					</Form.Item>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						gap: '10px',
					}}
				>
					<Form.Item style={{ flex: 1 }}>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
							style={{ flex: 1, width: '100%' }}
							disabled={title.length === 0 ? true : false}
							loading={isLoad}
						>
							Salvar Alterações
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);
};
