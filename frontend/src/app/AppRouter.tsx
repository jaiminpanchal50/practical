import { Route, Routes } from "react-router";


import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/PageNotFound";
import Home from "../pages/Home";
import LeadDetails from "../pages/LeadDetails";



export default function AppRouter() {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>




            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/leads/:id" element={<LeadDetails />} />
                </Route>
            </Route>






            {/* Default and fallback routes */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}