import { useCallback } from "react";
import { createLeadApi, createLeadNoteApi, deleteLeadApi, fetchLeadByIdApi, fetchLeadNotesApi, fetchLeadsApi, updateLeadStatusApi } from "./leadsApi";
import { useDispatch } from "react-redux";
import { setError, setLoading, setLead } from "./leadSlice";


const useLead = () => {

    const dispatch = useDispatch()

    const createLead = useCallback(async (data: any) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(""))
            const res = await createLeadApi(data)
            dispatch(setLead(res));
            return res;
        } catch (error) {
            dispatch(setError(error))
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);

    const fetchLeads = useCallback(async (params: any) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(""))
            const res = await fetchLeadsApi(params)
            return res;
        } catch (error) {
            dispatch(setError(error))
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);

    const fetchLeadById = useCallback(async (id: string | number) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(""))
            const res = await fetchLeadByIdApi(id)
            return res;
        } catch (error) {
            dispatch(setError(error))
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);

    const updateLeadStatus = useCallback(async (id: string | number, status: string) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(""))
            const res = await updateLeadStatusApi(id, status)
            return res;
        } catch (error) {
            dispatch(setError(error))
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);

    const deleteLead = useCallback(async (id: string | number) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(""))
            await deleteLeadApi(id)
        } catch (error) {
            dispatch(setError(error))
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);

    const fetchLeadNotes = useCallback(async (leadId: string | number) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(""))
            const res = await fetchLeadNotesApi(leadId)
            return res;
        } catch (error) {
            dispatch(setError(error))
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);

    const createLeadNote = useCallback(async (leadId: string | number, content: string) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(""))
            const res = await createLeadNoteApi(leadId, content)
            return res;
        } catch (error) {
            dispatch(setError(error))
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch]);


    return {
        createLead,
        fetchLeads,
        fetchLeadById,
        updateLeadStatus,
        deleteLead,
        fetchLeadNotes,
        createLeadNote
    }

}

export default useLead