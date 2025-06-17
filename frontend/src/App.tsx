import { useEffect, lazy, useState } from 'react';
import { Navigate, type RouteObject, useRoutes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/hook_redux.ts';
import { refreshToken } from './features/auth/authSlice.ts';
import { roleRouteMap } from './routes/roleRouteMap.ts';
import MainLayout from './components/layouts/MainLayout.tsx';

const AuthPage = lazy(() => import('./pages/AuthPage.tsx'));

function App() {
    const dispatch = useAppDispatch();
    const { isAuth, role, loading } = useAppSelector((state) => state.auth);
    const [roleRoutes, setRoleRoutes] = useState<RouteObject[]>([]);

    useEffect(() => {
        dispatch(refreshToken());
    }, [dispatch]);

    useEffect(() => {
        if (loading) return;

        const normalizedRole = role?.toLowerCase();
        const RoleRoutes =
            normalizedRole && roleRouteMap[normalizedRole]
                ? roleRouteMap[normalizedRole]
                : [];

        if (loading || isAuth === null) {
            return;
        }

        const routes: RouteObject[] = [];

        if (isAuth && normalizedRole) {
            routes.push(
                {
                    path: `/${normalizedRole}/*`,
                    element: <MainLayout />,
                    children: RoleRoutes,
                },
                {
                    path: '*',
                    element: <Navigate to={`/${normalizedRole}`} />,
                },
            );
        } else {
            routes.push(
                {
                    path: '/auth',
                    element: <AuthPage />,
                },
                {
                    path: '*',
                    element: <Navigate to={'/auth'} />,
                },
            );
        }
        setRoleRoutes(routes);
    }, [isAuth, loading, role]);

    return useRoutes(roleRoutes);
}

export default App;
