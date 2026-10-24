import { useCallback } from "react"
import { getMe, login, register } from "./authApi";
import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "./authSlice";

const useAuth = () => {

    const dispatch = useDispatch()


    const loginHandler = useCallback(async (data: any) => {
        try {
            dispatch(setLoading(true))
            const res = await login(data);
            dispatch(setUser(res))
            return res;
        } catch (err) {
            console.log("loginHandler error", err)
            setError(err)
            throw err;
        } finally {
            dispatch(setLoading(false))
        }

    }, [dispatch])

    const registerHandler = useCallback(async (data: any) => {
        try {
            dispatch(setLoading(true))
            const res = await register(data);
            dispatch(setUser(res))
            return res;
        } catch (err) {
            console.log("registerHandler error", err)
            setError(err)
            throw err;
        } finally {
            dispatch(setLoading(false))
        }

    }, [dispatch])

    const getMeHandler = useCallback(async () => {
        try {
            dispatch(setLoading(true))
            const res = await getMe();
            dispatch(setUser(res?.user))
            return res;
        } catch (err) {
            console.log("getMeHandler error", err)
            setError(err)
            throw err;
        } finally {
            dispatch(setLoading(false))
        }

    }, [dispatch])


    return { loginHandler, registerHandler, getMeHandler }
}

export default useAuth