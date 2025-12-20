import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    role: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    role: null,
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: any; role: string | null }>
        ) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
