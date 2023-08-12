import React, { useEffect } from 'react';
import * as S from './styles';
import { Button, Input, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Employer } from '../../types';
import api from '../../services/api';
import { AxiosError } from 'axios';
import { errorActions } from '../../utils/errorActions';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

export const EmployersPage: React.FC = () => {
	const [search, setSearch] = React.useState('');
	const [employers, setEmployers] = React.useState<Employer[]>([]);
	const [loading, setLoading] = React.useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		fetchEmployers();
	}, []);

	function fetchEmployers() {
		setLoading(true);
		api
			.get('/employer/')
			.then((response) => {
				setEmployers(response.data);
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => setLoading(false));
	}

	function deleteEmployer(id: string) {
		setLoading(true);
		api
			.delete(`/employer/${id}/`)
			.then(() => {
				fetchEmployers();
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => setLoading(false));
	}

	const columns: ColumnsType<Employer> = [
		{
			title: 'Nome',
			dataIndex: 'first_name',
			align: 'center',
			render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
		},
		{
			title: 'Sobrenome',
			dataIndex: 'last_name',
			align: 'center',
			render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
		},
		{
			title: 'E-mail',
			dataIndex: 'email',
			align: 'center',
		},
		{
			title: 'Telefone',
			dataIndex: 'phone',
			align: 'center',
		},
		{
			title: 'CPF',
			dataIndex: 'cpf',
			align: 'center',
		},
		{
			title: 'Ações',
			dataIndex: 'actions',
			align: 'center',
			render: (t, k) => (
				<div style={{ display: 'flex', gap: 10 }}>
					<Button
						type="primary"
						onClick={() => navigate(`/colaboradores/${k.id}/`)}
						className={t}
					>
						Editar
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => deleteEmployer(k.id as string)}
					>
						Excluir
					</Button>
				</div>
			),
		},
	];

	const filteredEmployers = employers.filter((employer) => {
		return employer.first_name.toLowerCase().startsWith(search.toLowerCase());
	});

	return (
		<S.Container>
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end',
					gap: 20,
					marginBottom: '30px',
				}}
			>
				<Button
					type="primary"
					size="large"
					icon={<PlusOutlined />}
					onClick={() => navigate('/colaboradores/registro/')}
				>
					Adicionar colaborador
				</Button>
				<Search
					placeholder="Busque pelo nome do colaborador"
					allowClear
					size="large"
					onChange={(e) => setSearch(e.target.value)}
					style={{
						width: 400,
					}}
				/>
			</div>
			<Table
				columns={columns}
				dataSource={filteredEmployers}
				loading={loading}
				pagination={false}
				scroll={{ y: '700vh' }}
			/>
		</S.Container>
	);
};
