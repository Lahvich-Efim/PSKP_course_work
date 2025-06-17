import type { RouteObject } from 'react-router-dom';
import CoordinatorDashboardPage from '@/pages/CoordinatorDashboardPage.tsx';
import ParticipantManagementPage from '@/pages/coordinator/participants_management/ParticipantManagementPage.tsx';
import ManageSuppliesPage from '@/pages/coordinator/ManageSuppliesPage.tsx';

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
];

export default CoordinatorRoutes;
