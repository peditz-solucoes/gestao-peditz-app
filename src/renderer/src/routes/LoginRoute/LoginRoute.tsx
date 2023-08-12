import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';

export function LoginRoute() {
	const auth = isAuthenticated();

	return !auth ? <Outlet /> : <Navigate to="/dashboard" />;
}
