import React, { useEffect, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Table } from 'antd';
import * as S from './styles';
import api from '../../services/api';
import { errorActions } from '../../utils/errorActions';
import { ColumnsType } from 'antd/es/table';
import { CategoryProductModal } from '../../components/CategoryProductModal';

const { confirm } = Modal;

interface Category {
	key: string;
	id: string;
	title: string;
	order: number;
}

export const CategoryProducts: React.FC = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [modalType, setModalType] = useState<{
		type: 'create' | 'edit';
		categoryId?: string;
	}>({
		type: 'create',
	});

	useEffect(() => {
		fetchCategories();
	}, []);

	function fetchCategories() {
		setIsLoading(true);
		api
			.get('/product-category/')
			.then((response) => {
				setCategories(response.data);
			})
			.catch((error) => {
				errorActions(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	const filterWordsByPrefix = categories.filter((word) =>
		word.title.toLowerCase().startsWith(searchValue)
	);

	function handleDelete(id: string) {
		setIsLoading(true);
		api
			.delete(`/product-category/${id}`)
			.then((response) => {
				if (response.status === 204) {
					setCategories((prevCategories) =>
						prevCategories.filter((category) => category.id !== id)
					);
				}
			})
			.catch((error) => {
				errorActions(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	const showDeleteConfirm = (id: string, title: string) => {
		confirm({
			title: `Tem certeza que deseja deletar a categoria ${title} ?`,
			icon: <ExclamationCircleFilled />,
			content:
				'Ao deletar a categoria, todos os produtos relacionados a ela serão deletados também.',
			okText: 'Deletar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				handleDelete(id);
			},
		});
	};

	const columns: ColumnsType<Category> = [
		{
			title: 'Titulo',
			dataIndex: 'title',
			key: 'title',
			align: 'center',
		},
		{
			title: 'Ordem',
			dataIndex: 'order',
			key: 'order',
			align: 'center',
			defaultSortOrder: 'ascend',
			sorter: (a, b) => a.order - b.order,
		},
		{
			title: 'Ações',
			key: 'action',
			align: 'center',
			render: (record: Category) => (
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
						onClick={() => {
							setIsModalOpen(true);
							setModalType({ type: 'edit', categoryId: record.id });
						}}
					>
						Editar
					</Button>
					<Button
						type="primary"
						danger
						size="small"
						onClick={() => showDeleteConfirm(record.id, record.title)}
					>
						Excluir
					</Button>
				</div>
			),
		},
	];

	const handleModal = (type: 'create' | 'edit', categoryId?: string) => {
		setModalType({ type, categoryId });
		setIsModalOpen(true);
	};

	return (
		<>
			<S.Container>
				<S.Header>
					<div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
						<Button
							type="primary"
							size="large"
							icon={<PlusOutlined />}
							onClick={() => handleModal('create')}
						>
							Adicionar Categoria
						</Button>
						<Input.Search
							placeholder="Nome da categoria"
							size="large"
							onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
						/>
					</div>
				</S.Header>
				<Table
					columns={columns}
					dataSource={filterWordsByPrefix}
					loading={isLoading}
					pagination={false}
					scroll={{ y: 700 }}
					style={{ width: '100%' }}
				/>
			</S.Container>
			<CategoryProductModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onUpdate={fetchCategories}
				type={modalType.type}
				categoryId={modalType.categoryId}
			/>
		</>
	);
};
