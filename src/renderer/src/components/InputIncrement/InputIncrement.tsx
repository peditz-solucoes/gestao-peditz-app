import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber } from 'antd';
import React from 'react';

export const InputIncrement: React.FC = () => {
	const [value, setValue] = React.useState(0);

	function increment() {
		setValue(value + 1);
	}

	function decrement() {
		setValue(value - 1);
	}

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '6px',
			}}
		>
			<Button
				onClick={decrement}
				disabled={value <= 0}
				icon={
					<MinusOutlined
						style={{
							fontSize: '12px',
						}}
					/>
				}
			/>
			<InputNumber controls={false} value={value} min={0} />
			<Button
				onClick={increment}
				icon={
					<PlusOutlined
						style={{
							fontSize: '12px',
						}}
					/>
				}
			/>
		</div>
	);
};
