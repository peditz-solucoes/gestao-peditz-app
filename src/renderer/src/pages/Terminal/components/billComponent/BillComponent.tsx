import React, { useCallback, useEffect } from 'react';
import { Bill } from '../../../../types';
import { Button, Input, InputRef, Spin } from 'antd';
import { BillCard } from '../billCard/billCard';
import * as S from './styles';
import { useTerminal } from '../../../../hooks/useTerminal';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { CreateCommandModal } from '../../../../components/CreateCommandModal';

export const BillComponent: React.FC = () => {
	const searchInput = React.useRef<InputRef>(null);
	const [searchValue, setSearchValue] = React.useState<string>('');
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const { bills, fetchBills, currentTab, fetchBill, setCurrentTab } =
		useTerminal();
	const [filteredBills, setFilteredBills] = React.useState<Bill[]>([]);
	const getBills = useCallback(async () => {
		setLoading(true);
		fetchBills()
			.then((newBills) => {
				setFilteredBills(newBills as Bill[]);
				searchInput.current?.focus();
				setSearchValue('');
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const removeCaracteres = (value: string) => {
		return value.replace(/[^Mm0-9]/g, '');
	};

	const filterBills = () => {
		console.log(searchValue);
		if (searchValue.includes('M') || searchValue.includes('m')) {
			const billsFiltered = bills.filter((bill) => {
				console.log(bill.number);
				return bill.table_datail.title == searchValue.replace(/[^0-9]/g, '');
			});
			if (billsFiltered.length === 1) {
				fetchBill(billsFiltered[0].id as string).then(() => {
					setCurrentTab('2');
				});
			}
			setFilteredBills([...billsFiltered]);
		} else {
			if (searchValue.length > 0) {
				const billsFiltered = bills.filter((bill) => {
					console.log(bill.number);
					return bill.number == Number(searchValue);
				});
				if (billsFiltered.length === 1) {
					fetchBill(billsFiltered[0].id as string).then(() => {
						setCurrentTab('2');
					});
				}
				setFilteredBills([...billsFiltered]);
			} else {
				setFilteredBills([...bills]);
			}
		}
	};

	const shortcuts = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === '+') {
				getBills();
			}
		},
		[getBills]
	);

	useEffect(() => {
		if (currentTab === '1') {
			getBills();
			window.removeEventListener('keyup', shortcuts, true);
			window.addEventListener('keyup', shortcuts, true);
		}
		if (currentTab !== '1') {
			window.removeEventListener('keyup', shortcuts, true);
		}
	}, [currentTab]);

	return (
		<>
			<S.container>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '1rem',
					}}
				>
					<Input.Search
						ref={searchInput}
						placeholder="Pesquisar comanda"
						value={searchValue}
						onChange={(e) => setSearchValue(removeCaracteres(e.target.value))}
						style={{
							width: '300px',
						}}
						onSearch={filterBills}
						size="large"
					/>
					<Button
						type="primary"
						size="large"
						onClick={() => setShowModal(true)}
					>
						Abrir Comanda
					</Button>
					<Button disabled={loading} size="large" onClick={getBills}>
						<ReloadOutlined spin={loading} />
					</Button>
					<Button disabled={loading} size="large">
						<QuestionCircleOutlined />
					</Button>
				</div>
				<S.BillsContainer>
					{loading ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
								height: '100%',
								width: '100vw',
							}}
						>
							<Spin size="large" />
						</div>
					) : (
						<>
							{filteredBills.map((bill, index) => (
								<BillCard key={index} bill={bill} />
							))}
						</>
					)}
				</S.BillsContainer>
			</S.container>
			<CreateCommandModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				flux="terminal"
			/>
		</>
	);
};
