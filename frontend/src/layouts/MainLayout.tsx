import { Outlet } from 'react-router'

export default function MainLayout() {
    return (
        <div className="main-layout">
            <main className="main-layout">
                <Outlet />
            </main>
        </div>
    );
}