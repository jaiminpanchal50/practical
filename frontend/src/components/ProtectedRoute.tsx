import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
    const { user, loading } = useSelector((state: any) => state.auth);
    console.log('user', user)

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}