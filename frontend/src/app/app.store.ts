import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../features/auth/authSlice';
import leadSlice from '../features/leads/leadSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        lead: leadSlice,
    },
})
