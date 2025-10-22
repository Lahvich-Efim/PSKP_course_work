import type { RouteObject } from 'react-router-dom';
import CoordinatorDashboardPage from '@/pages/CoordinatorDashboardPage.tsx';
import ParticipantManagementPage from '@/pages/coordinator/participants_management/ParticipantManagementPage.tsx';
import ManageSuppliesPage from '@/pages/coordinator/ManageSuppliesPage.tsx';
import ProductsPage from '@/pages/coordinator/ProductsPage.tsx';

const CoordinatorRoutes: RouteObject[] = [
    {
        index: true,
        element: <CoordinatorDashboardPage />,
    },
    {
        path: 'participants',
        element: <ParticipantManagementPage />,
    },
    {
        path: 'supplies',
        element: <ManageSuppliesPage />,
    },
    {
        path: 'products',
        element: <ProductsPage />,
    },
];

export default CoordinatorRoutes;
