import { ReactNode, createContext, useContext, useState } from 'react';
import { Bill, OrderGroupList } from '../types';
import api from '../services/api';
import { AxiosError, AxiosResponse } from 'axios';
import { errorActions } from '../utils/errorActions';

interface BillProviderProps {
	children: ReactNode;
}

interface BillContextData {
	bills: Bill[];
	selectedBill: Bill;
	fetchBills: () => void;
	fetchBill: (id: string) => void;
	ordersGroupList: OrderGroupList[];
	fetchOrders: (billId: string) => void;
	handleDeleteOrder: (id: string, operatorCode: string, billId: string) => void;
	handleJoinBill: (billId: string[]) => void;
	selectedBills: Bill[];
}

export const BillContext = createContext({} as BillContextData);

export function BillProvider({ children }: BillProviderProps) {
	const [bills, setBills] = useState<Bill[]>([] as Bill[]);
	const [selectedBill, setSelectedBill] = useState<Bill>({} as Bill);
	const [selectedBills, setSelectedBills] = useState<Bill[]>([] as Bill[]);
	const [orders, setOrders] = useState<OrderGroupList[]>(
		[] as OrderGroupList[]
	);

	function fetchBills() {
		api
			.get('/bill/')
			.then((response: AxiosResponse) => {
				setBills(response.data);
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {
				// console.log('finally');
			});
	}

	function fetchBill(id: string) {
		api
			.get(`/bill/${id}/`)
			.then((response: AxiosResponse) => {
				setSelectedBill(response.data);
				fetchOrders(response.data.id);
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {});
	}

	function fetchOrders(billId: string) {
		api
			.get(`/order-list/?bill=${billId}`)
			.then((response: AxiosResponse) => {
				setOrders(response.data);
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {
				// console.log('finally');
			});
	}

	function handleDeleteOrder(id: string, operatorCode: string, billId: string) {
		api
			.post(`/order-delete/`, {
				operator_code: operatorCode,
				order_id: id,
			})
			.then(() => {
				fetchOrders(billId);
			})
			.catch((error: AxiosError) => {
				errorActions(error);
			})
			.finally(() => {
				// console.log('finally');
			});
	}

	function handleJoinBill(billId: string[]) {
		for (let id of billId) {
			api
				.get(`/bill/${id}/`)
				.then((response: AxiosResponse) => {
					setSelectedBills([...selectedBills, response.data]);
				})
				.catch((error: AxiosError) => {
					errorActions(error);
				});

			api
				.get(`/order-list/?bill=${id}`)
				.then((response: AxiosResponse) => {
					setOrders([...orders, response.data]);
				})
				.catch((error: AxiosError) => {
					errorActions(error);
				});
		}
	}

	return (
		<BillContext.Provider
			value={{
				bills,
				selectedBill,
				fetchBills,
				fetchBill,
				ordersGroupList: orders,
				fetchOrders,
				handleDeleteOrder,
				handleJoinBill,
				selectedBills,
			}}
		>
			{children}
		</BillContext.Provider>
	);
}

export function useBill() {
	const context = useContext(BillContext);
	return context;
}
