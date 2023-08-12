import { Alert } from 'antd';

interface errorType {
	type: 'invalid' | 'error';
	message: string;
}

export const ErrorType: React.FC<errorType> = (error) => {
	function getErrorMessage() {
		if (error?.type === 'invalid') {
			return <Alert message={error.message} type="error" />;
		} else if (error?.type === 'error') {
			return <Alert message={error.message} type="error" />;
		}

		return null;
	}
	return <div>{getErrorMessage()}</div>;
};
