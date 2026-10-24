import { BrowserRouter } from "react-router"
import AppRouter from "./AppRouter"
import useAuth from "../features/auth/useAuth";
import { useEffect } from "react";

export default function App() {
    const { getMeHandler } = useAuth();
    useEffect(() => {
        getMeHandler();
    }, []);
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}
