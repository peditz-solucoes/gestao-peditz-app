import { Modal, Select } from 'antd';
import React, { useEffect } from 'react';
import { useBill } from '../../../hooks/useBill';

interface JoinCommandModalProps {
	onCancel: () => void;
	visible: boolean;
	billId: string;
}

export const JoinCommandModal: React.FC<JoinCommandModalProps> = ({
	onCancel,
	visible,
	billId,
}) => {
	const { bills, fetchBills } = useBill();
	const [selectedBillsIds, setSelectedBillsIds] = React.useState<string[]>([]);

	useEffect(() => {
		fetchBills();
		setSelectedBillsIds([...selectedBillsIds, billId]);
	}, []);

	return (
		<Modal
			onCancel={onCancel}
			open={visible}
			title="Unir comandas"
			destroyOnClose
		>
			<label>Selecione a comanda que deseja unir:</label>
			<Select
				showSearch
				style={{ width: '100%' }}
				placeholder="Busque a comanda desejada."
				optionFilterProp="children"
				filterOption={(input, option) => (option?.label ?? '').includes(input)}
				filterSort={(optionA, optionB) =>
					(optionA?.label ?? '')
						.toLowerCase()
						.localeCompare((optionB?.label ?? '').toLowerCase())
				}
				options={bills.map((bill) => {
					return {
						value: bill.id,
						label: `Comanda:${bill.number} | Cliente: ${
							bill.client_name.split(' ').length > 2
								? `${bill.client_name.split(' ')[0]} ${
										bill.client_name.split(' ')[1]
								  }...`
								: `${bill.client_name}`
						}`,
					};
				})}
			/>
		</Modal>
	);
};
