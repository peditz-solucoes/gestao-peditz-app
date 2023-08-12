import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber } from 'antd';
import React from 'react';
import { InputIncrement } from '../../InputIncrement';

export const ComplementItemForm: React.FC = () => {
	return (
		<div
			style={{
				width: '100%',
				padding: '5px 10px',
				backgroundColor: '#fff',
				borderRadius: '8px',
			}}
		>
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end',
				}}
			>
				<Button
					icon={
						<DeleteOutlined
							style={{
								color: '#ff4d4f',
							}}
						/>
					}
					type="ghost"
				/>
			</div>
			<Form layout="vertical">
				<div
					style={{
						display: 'flex',
						// justifyContent: 'space-between',
						alignItems: 'center',
            gap: '20px',
						flexDirection: 'row',
					}}
				>
					<Form.Item>
						<Input placeholder="Nome do item" />
					</Form.Item>
					<Form.Item
						name="price"
						initialValue={'0'}
						// style={{
						// 	width: '100%',
						// }}
					>
						<InputNumber
							size="large"
							min={'0' as string}
							// style={{
							// 	width: '80%',
							// }}
							formatter={(value) =>
								`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							}
							parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
						/>
					</Form.Item>
					<Form.Item label="Minimo:">
						<InputIncrement />
					</Form.Item>
					<Form.Item label="Maximo:">
						<InputIncrement />
					</Form.Item>
				</div>
			</Form>
		</div>
	);
};
