import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute() {

    const isAuthenticated = false;
    const isLoading = false;


    if (isLoading) {
        return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}