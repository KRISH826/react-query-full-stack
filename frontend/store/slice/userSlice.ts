import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null,
}

const getLocalToken = () => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null") {
            return token;
        }
    }
    return null;
};

const initialState: AuthState = {
    accessToken: getLocalToken(),
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            localStorage.setItem("token", action.payload);
        },
        clearAccessToken: (state) => {
            state.accessToken = null;
            localStorage.removeItem("token");
        },
    },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;