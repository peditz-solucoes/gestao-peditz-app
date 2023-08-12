import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import Table, { ColumnsType, TableProps } from 'antd/es/table';
import { useEffect, useState } from 'react';

interface DataType {
	key: number;
	name: string;
  price: number;
}

const columns: ColumnsType<DataType> = [
	{
		title: 'Name',
		dataIndex: 'name',
	},
	{
		title: 'price',
		dataIndex: 'price',
		sorter: (a, b) => a.price - b.price,
	},
	{
		title: 'Ações',
		key: 'action',
		width: 180,
		render: () => (
			<Space
				style={{
					display: 'flex',
					gap: '15px',
					justifyContent: 'center',
				}}
			>
				<Button type="primary" icon={<FormOutlined />} />
				<Button
					type="primary"
					style={{ backgroundColor: '#DC1F0B' }}
					icon={<DeleteOutlined />}
				/>
			</Space>
		),
	},
];

const data: DataType[] = [];
for (let i = 1; i <= 10000; i++) {
  data.push({
    key: i,
    name: `Product ${i}`,
    price: Math.floor(Math.random() * 100) + 1 // Gera um preço aleatório entre 1 e 100
  });
}

export const TableProducts: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [tableLayout] = useState();
	const [ellipsis] = useState(false);

	const tableColumns = columns.map((item) => ({ ...item, ellipsis }));

	const tableProps: TableProps<DataType> = {
		loading,
		tableLayout,
	};

	useEffect(() => {
		setLoading(false);
	}, [data]);

	return (
		<>
			<Table
				{...tableProps}
				pagination={{
          defaultPageSize: 10,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} produtos`,
        }}
				columns={tableColumns}
				dataSource={data}
				style={{ width: '100%' }}
			/>
		</>
	);
};
