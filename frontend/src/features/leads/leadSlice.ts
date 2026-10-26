import { createSlice } from "@reduxjs/toolkit";

const leadSlice = createSlice({
    name: "lead",
    initialState: {
        leads: [],
        lead: "",
        loading: false,
        error: "",
    },
    reducers: {
        setLeads: (state, action) => {
            state.leads = action.payload;
        },
        setLead: (state, action) => {
            state.lead = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { setLeads, setLead, setLoading, setError } = leadSlice.actions;
export default leadSlice.reducer;