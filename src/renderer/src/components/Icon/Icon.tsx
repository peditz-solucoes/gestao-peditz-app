import React from 'react';

interface IconProps {
	icon: React.ReactNode;
	style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ icon, style }) => {
	return <div style={{ display: 'inline-block', ...style }}>{icon}</div>;
};
