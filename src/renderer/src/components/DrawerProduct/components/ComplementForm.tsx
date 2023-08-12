import React from 'react';
import { ProductComplement } from '../../../types';
import { Button, Form, Input, Select, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { InputIncrement } from '../../InputIncrement/InputIncrement';
import { ComplementItemForm } from './ComplementItemForm';

interface DataProductComplementProps {
	complement: ProductComplement;
	onDelete: (id: string) => void;
	OnChangeAddItem: (complementId: string) => void;
}

export const ComplementForm: React.FC<DataProductComplementProps> = ({
	complement,
	onDelete,
	OnChangeAddItem,
}) => {
	return (
		<>
			<div
				style={{
					width: '100%',
					padding: '10px 20px',
					borderRadius: '8px',
					border: '1px solid #d9d9d9',
					backgroundColor: '#EDF2F7',
				}}
			>
				<Form layout="vertical">
					<Space
						direction="horizontal"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
						}}
					>
						<Form.Item>
							<Input
								style={{
									width: '500px',
								}}
							/>
						</Form.Item>
						<Button
							onClick={() => onDelete(complement.id as string)}
							icon={
								<DeleteOutlined
									style={{
										color: '#ff4d4f',
									}}
								/>
							}
							type="default"
						/>
					</Space>
					<Space
						direction="horizontal"
						style={{
							display: 'flex',
							gap: '20px',
						}}
					>
						<Form.Item label="Quantidade minima:">
							<InputIncrement />
						</Form.Item>
						<Form.Item label="Quantidade maxima:">
							<InputIncrement />
						</Form.Item>
						<Form.Item
							label="Tipo"
							tooltip="Tipo de seleção dos itens de complementos"
						>
							<Select
								defaultValue="tipos"
								style={{ width: 120 }}
								options={[
									{ value: 'radio', label: 'radio' },
									{ value: 'increment', label: 'incremento' },
									{ value: 'check box', label: 'check box' },
								]}
							/>
						</Form.Item>
						<Form.Item
							label="Formula"
							tooltip="Formula de calculo dos itens de complementos"
						>
							<Select
								defaultValue="formulas"
								style={{ width: 120 }}
								options={[
									{ value: 'maior', label: 'maior' },
									{ value: 'media', label: 'media' },
									{ value: 'soma', label: 'soma' },
								]}
							/>
						</Form.Item>
					</Space>

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
							overflowY: 'auto',
							maxHeight: '150px',
							marginBottom: '20px',
						}}
					>
						{complement.complement_items &&
							complement.complement_items.length > 0 &&
							complement.complement_items.map((item, index) => {
								console.log(item);
								return <ComplementItemForm key={index} />;
							})}
					</div>
					<div>
						<Button
							type="primary"
							style={{
								width: '100%',
							}}
							onClick={() => OnChangeAddItem(complement.id as string)}
						>
							Adicionar item
						</Button>
					</div>
				</Form>
			</div>
		</>
	);
};
