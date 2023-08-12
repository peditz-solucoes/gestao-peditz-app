import React from 'react';
import * as S from './styles';

interface CardProps {
	children: React.ReactNode;
	onClick?: () => void;
	style?: React.CSSProperties;
	title?: string;
}

export const Card: React.FC<CardProps> = ({
	children,
	style,
	title,
	onClick,
}) => {
	return (
		<S.CardContainer style={style} onClick={() => onClick && onClick()}>
			{title && (
				<h4
					style={{
						color: '#A0AEC0',
					}}
				>
					{title}
				</h4>
			)}

			<S.CardContent>{children}</S.CardContent>
		</S.CardContainer>
	);
};
