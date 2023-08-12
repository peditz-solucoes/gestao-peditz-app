import React from 'react';
import * as S from './styles';
import { FormEmployer } from '../../components/FormEmployer';
import { useParams } from 'react-router-dom';

export const EmployerViewPage: React.FC = () => {
	const { id } = useParams();

	return (
		<S.Container>
			<FormEmployer type="edit" employerId={id} />
		</S.Container>
	);
};
