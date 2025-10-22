import axios, { type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const { store } = await import('../store');

        const token = store.getState().auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Проверка на 401 и попытка обновления токена

        const isManualRefresh =
            originalRequest.headers?.['x-manual-refresh'] === 'true';
        const isRefreshRequest = originalRequest.url.includes('/auth/refresh');

        if (
            error.response?.status === 401 &&
            !isManualRefresh &&
            !isRefreshRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const { store } = await import('../store');
                const { setAccessToken } = await import(
                    '../features/auth/authSlice'
                );

                const response = await api.get('/auth/refresh');
                const newAccessToken = response.data.access;
                store.dispatch(setAccessToken(newAccessToken));

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                const { store } = await import('../store');
                const { logout } = await import('../features/auth/authSlice');

                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
