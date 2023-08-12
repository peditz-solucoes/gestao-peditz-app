import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';

export function PrivateRoute() {
	const auth = isAuthenticated();

	return auth ? <Outlet /> : <Navigate to="/login" />;
}
