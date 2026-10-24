import { BrowserRouter } from "react-router"
import AppRouter from "./AppRouter"
import useAuth from "../features/auth/useAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function App() {
    const { getMeHandler } = useAuth();
    const { user } = useSelector((state: any) => state.auth);
    console.log("user", user)
    useEffect(() => {
        getMeHandler();
    }, []);
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}
