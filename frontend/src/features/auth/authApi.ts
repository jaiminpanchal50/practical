import api from "../../lib/axiosInstance";


export async function register(data: any) {
    try {
        const res = await api.post("/auth/register", data);
        console.log("register api res", res)
        return res?.data;
    } catch (error) {
        throw error;
    }
}


export async function login(data: any) {
    try {
        const res = await api.post("/auth/login", data);
        console.log("login api res", res)
        return res?.data;
    } catch (error) {
        throw error;
    }
}

export async function getMe() {
    try {
        const res = await api.get("/auth/me");
        console.log("getMe api res", res)
        return res?.data;
    } catch (error) {
        throw error;
    }
}