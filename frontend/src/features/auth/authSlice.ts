import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/models/user.ts';
import { AuthService } from '@/service/AuthService.ts';
import { AxiosError } from 'axios';

interface AuthState {
    isAuth: boolean | null;
    role: string | null;
    username: string | null;
    email: string | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    id: number | null;
}

const initialState: AuthState = {
    isAuth: null,
    username: null,
    role: null,
    email: null,
    loading: false,
    accessToken: null,
    error: null,
    id: null,
};

export const refreshToken = createAsyncThunk(
    'auth/refresh',
    async (_, thunkAPI) => {
        try {
            const response = await new AuthService().refreshToken();
            const { access_token } = response;
            const decode = jwtDecode<User>(access_token);
            return {
                id: decode.id,
                username: decode.username,
                email: decode.email,
                role: decode.role,
                accessToken: access_token,
            };
        } catch (error: unknown) {
            thunkAPI.dispatch(logout());
            if (error instanceof AxiosError)
                return thunkAPI.rejectWithValue(error.response?.data.message);
            else throw error;
        }
    },
);

export const login = createAsyncThunk(
    'auth/login',
    async (
        { username, password }: { username: string; password: string },
        thunkAPI,
    ) => {
        try {
            const response = await new AuthService().login({
                username,
                password,
            });
            const { access_token } = response;
            const decode = jwtDecode<User>(access_token);
            return {
                username,
                id: decode.id,
                email: decode.email,
                role: decode.role,
                accessToken: access_token,
            };
        } catch (error: unknown) {
            if (error instanceof AxiosError)
                return thunkAPI.rejectWithValue(error.response?.data.message);
            else throw error;
        }
    },
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await new AuthService().logout();
    } catch (error: unknown) {
        if (error instanceof AxiosError)
            return thunkAPI.rejectWithValue(error.response?.data.message);
        else throw error;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken(state, { payload }: PayloadAction<string>) {
            state.accessToken = payload;
            localStorage.setItem('accessToken', payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        id: number;
                        username: string;
                        email: string;
                        role: string;
                        accessToken: string;
                    }>,
                ) => {
                    state.id = action.payload.id;
                    state.isAuth = true;
                    state.email = action.payload.email;
                    state.username = action.payload.username;
                    state.role = action.payload.role.toLowerCase();
                    localStorage.setItem(
                        'accessToken',
                        action.payload.accessToken,
                    );
                    state.accessToken = action.payload.accessToken;
                    state.loading = false;
                },
            )
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            .addCase(login.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                refreshToken.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        id: number;
                        username: string;
                        email: string;
                        role: string;
                        accessToken: string;
                    }>,
                ) => {
                    state.id = action.payload.id;
                    state.isAuth = true;
                    state.username = action.payload.username;
                    state.email = action.payload.email;
                    state.role = action.payload.role.toLowerCase();
                    state.accessToken = action.payload.accessToken;
                    state.loading = false;
                    localStorage.setItem(
                        'accessToken',
                        action.payload.accessToken,
                    );
                },
            )
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            .addCase(
                refreshToken.rejected,
                (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    state.isAuth = false;
                    state.error = action.payload;
                    localStorage.removeItem('accessToken');
                    state.accessToken = null;
                    state.username = null;
                    state.email = null;
                    state.role = null;
                    state.id = null;
                },
            )
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.isAuth = false;
                localStorage.removeItem('accessToken');
                state.accessToken = null;
                state.username = null;
                state.email = null;
                state.role = null;
                state.id = null;
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            .addCase(
                logout.rejected,
                (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
