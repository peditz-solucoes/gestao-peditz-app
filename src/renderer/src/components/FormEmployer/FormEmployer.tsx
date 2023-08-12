import React, { useEffect } from 'react';
import * as S from './styles';
import {
	Button,
	Divider,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Select,
	Spin,
	Switch,
	message,
} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AxiosError } from 'axios';
import { errorActions } from '../../utils/errorActions';
import { formatPhoneNumber } from '../../utils/formatPhone';

// const tagRender = (props: CustomTagProps) => {
// 	const { label, value, closable, onClose } = props;
// 	const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
// 		event.preventDefault();
// 		event.stopPropagation();
// 	};
// 	return (
// 		<Tag
// 			color={value}
// 			onMouseDown={onPreventMouseDown}
// 			closable={closable}
// 			onClose={onClose}
// 			style={{ marginRight: 10, fontSize: 16 }}
// 		>
// 			{label}
// 		</Tag>
// 	);
// };

// const options = [
// 	{ label: 'Dashboard', value: 'red' },
// 	{ label: 'Caixa', value: 'green' },
// 	{ label: 'Produtos', value: 'blue' },
// 	{ label: 'Comandas', value: 'yellow' },
// 	{ label: 'Mesas', value: 'orange' },
// 	{ label: 'Estoque', value: 'purple' },
// 	{ label: 'Relatórios', value: 'cyan' },
// 	{ label: 'Aplicativos', value: 'magenta' },
// 	{ label: 'Integrações', value: 'geekblue' },
// ];

interface FormEmployerProps {
	type: 'create' | 'edit';
	employerId?: string;
}

export const FormEmployer: React.FC<FormEmployerProps> = ({
	type,
	employerId,
}) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [switchValue, setSwitchValue] = React.useState(false);

	useEffect(() => {
		if (type === 'edit' && employerId) {
			fetchEmployer();
		}
	}, []);

	function fetchEmployer() {
		setIsLoading(true);
		api
			.get(`/employer/${employerId}/`)
			.then((response) => {
				setSwitchValue(response.data.active);
				form.setFieldsValue(response.data);
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function createEmployer(values: any) {
		setIsLoading(true);
		api
			.post('/employer/', values)
			.then(() => {
				message.success('Colaborador criado com sucesso!');
				navigate('/colaboradores/');
			})
			.catch((error: AxiosError) => {
				message.error('Erro ao criar colaborador');
				errorActions(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function editEmployer(values: any) {
		api
			.patch(`/employer/${employerId}/`, values)
			.then(() => {
				message.success('Colaborador editado com sucesso!');
				navigate('/colaboradores/');
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	const onFinish = (values: any) => {
		// console.log(values);
		if (type === 'create') {
			values.phone = '+55' + values.phone.replace(/\D/g, '');
			createEmployer(values);
		} else {
			editEmployer(values);
		}
	};

	const handleSwitchChange = (value: any) => {
		setSwitchValue(value);
		form.setFieldValue('active', value);
	};

	const confirm = () => {
		navigate('/colaboradores/');
		message.success('Cancelou cadastro');
	};

	return (
		<S.Container>
			<Spin spinning={isLoading}>
				<Form layout="vertical" onFinish={onFinish} form={form}>
					<Divider orientation="left">Dados do colaborador</Divider>
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '20px',
						}}
					>
						<Form.Item label="Nome" name="first_name" style={{ width: '100%' }}>
							<Input
								type="text"
								placeholder="Nome do colaborador"
								size="large"
							/>
						</Form.Item>
						<Form.Item
							label="Sobrenome"
							name="last_name"
							style={{ width: '100%' }}
						>
							<Input
								type="text"
								placeholder="Sobrenome do colaborador"
								size="large"
							/>
						</Form.Item>
					</div>
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '20px',
						}}
					>
						<Form.Item
							name="email"
							label="E-mail"
							rules={[
								{
									type: 'email',
									message: 'The input is not valid E-mail!',
								},
							]}
							style={{ width: '100%' }}
						>
							<Input size="large" placeholder="Email do colaborador" />
						</Form.Item>
						<Form.Item label="CPF" name="cpf" style={{ width: '100%' }}>
							<Input placeholder="Digite um CPF válido" size="large" />
						</Form.Item>
					</div>
					<Form.Item label="Endereço" name="address" style={{ width: '100%' }}>
						<Input placeholder="Digite um endereço válido" size="large" />
					</Form.Item>

					<Divider orientation="left">Dados de registro</Divider>

					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '20px',
						}}
					>
						<Form.Item
							label="Competência"
							name="role"
							tooltip="A competência define as suas atividades"
							style={{ width: '100%' }}
						>
							<Select
								placeholder="Escolha uma competência"
								size="large"
								options={[
									{
										value: 'GERENTE',
										label: 'Gerente',
									},
									{
										value: 'FUNCIONARIO',
										label: 'funcionário',
									},
								]}
							/>
						</Form.Item>
						<Form.Item
							label="Cargo"
							name="office"
							tooltip="O cargo define o papel do colaborador"
							style={{ width: '100%' }}
						>
							<Select
								placeholder="Escolha um cargo"
								size="large"
								options={[
									{
										value: 'Gerente',
										label: 'Gerente',
									},
									{
										value: 'Garçom',
										label: 'Garçom',
									},
									{
										value: 'Cozinheiro',
										label: 'Cozinheiro',
									},
									{
										value: 'Auxiliar de cozinha',
										label: 'Auxiliar de cozinha',
									},
									{
										value: 'Auxiliar de limpeza',
										label: 'Auxiliar de limpeza',
									},
									{
										value: 'Auxiliar de serviços gerais',
										label: 'Auxiliar de serviços gerais',
									},
									{
										value: 'Atendente',
										label: 'Atendente',
									},
									{
										value: 'Recepcionista',
										label: 'Recepcionista',
									},
									{
										value: 'Caixa',
										label: 'Caixa',
									},
									{
										value: 'Auxiliar de caixa',
										label: 'Auxiliar de caixa',
									},
									{
										value: 'Auxiliar de bar',
										label: 'Auxiliar de bar',
									},
									{
										value: 'Auxiliar de salão',
										label: 'Auxiliar de salão',
									},
									{
										value: 'Auxiliar de atendimento',
										label: 'Auxiliar de atendimento',
									},
									{
										value: 'Barman',
										label: 'Barman',
									},
									{
										value: 'Pizzaiolo',
										label: 'Pizzaiolo',
									},
									{
										value: 'Chapeiro',
										label: 'Chapeiro',
									},
									{
										value: 'Auxiliar de chapeiro',
										label: 'Auxiliar de chapeiro',
									},
									{
										value: 'Auxiliar de pizzaiolo',
										label: 'Auxiliar de pizzaiolo',
									},
									{
										value: 'Copeiro/Lavador de Louças',
										label: 'Copeiro/Lavador de Louças',
									},
									{
										value: 'Sous Chef',
										label: 'Sous Chef',
									},
									{
										value: 'Chef de Cozinha',
										label: 'Chef de Cozinha',
									},
									{
										value: 'Gerente de Turno',
										label: 'Gerente de Turno',
									},
									{
										value: 'Proprietário/Dono',
										label: 'Proprietário/Dono',
									},
									{
										label: 'Gerente Geral',
										value: 'Gerente Geral',
									},
									{
										label: 'Outros',
										value: 'Outros',
									},
								]}
							/>
						</Form.Item>
					</div>
					{/* <Form.Item
						name="sidebar_permissions"
						label="Quais Permissões o colaborador poderá acessar?"
						tooltip="As permissões que um colaborador terá em um ambiente de trabalho dependem do cargo que ele ocupa e das responsabilidades associadas a esse cargo"
					>
						<Select
							mode="multiple"
							size="large"
							tagRender={tagRender}
							style={{ width: '100%' }}
							options={options}
						/>
					</Form.Item> */}
					<Form.Item
						name="phone"
						label="Número de telefone"
						getValueFromEvent={(e) => formatPhoneNumber(e.target.value)}
					>
						<Input
							prefix={type === 'create' ? '+55' : null}
							placeholder="Digite o número de telefone"
							size="large"
							style={{ width: '100%' }}
						/>
					</Form.Item>
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '20px',
						}}
					>
						<Form.Item
							label=" O colaborador está ativo ?"
							name="active"
							style={{ width: '30%' }}
						>
							<Switch
								size="default"
								checkedChildren={<CheckOutlined />}
								unCheckedChildren={<CloseOutlined />}
								checked={switchValue}
								onChange={handleSwitchChange}
							/>
						</Form.Item>
						<Form.Item label="Salário" name="sallary" style={{ width: '100%' }}>
							<InputNumber
								controls={false}
								style={{ width: '100%' }}
								size="large"
								placeholder="Salário do colaborador"
								type="number"
							/>
						</Form.Item>

						<Form.Item
							label="Codigo operacional"
							tooltip="O código operacional é um código único que identifica o colaborador"
							name="code"
							style={{ width: '100%' }}
						>
							<InputNumber
								controls={false}
								style={{ width: '100%' }}
								size="large"
								placeholder="Codigo operacional do colaborador"
								type="number"
							/>
						</Form.Item>
					</div>
					{type === 'create' && (
						<Form.Item
							label="Senha do colaborador"
							name="password"
							style={{ width: '100%' }}
						>
							<Input.Password placeholder="Senha do colaborador" size="large" />
						</Form.Item>
					)}
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '20px',
						}}
					>
						<Form.Item style={{ width: '100%' }}>
							<Popconfirm
								title="Cancelar o cadastro do colaborador?"
								description="Ao cancelar o cadastro do colaborador, todas as informações inseridas serão perdidas."
								onConfirm={() => confirm()}
								// onCancel={cancel}
								okText="Sim"
								cancelText="Não"
							>
								<Button danger size="large" style={{ width: '100%' }}>
									Cancelar
								</Button>
							</Popconfirm>
						</Form.Item>
						<Form.Item style={{ width: '100%' }}>
							<Button
								type="primary"
								htmlType="submit"
								size="large"
								style={{ width: '100%' }}
							>
								{type === 'create' ? 'Cadastrar' : 'Salvar'}
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Spin>
		</S.Container>
	);
};
