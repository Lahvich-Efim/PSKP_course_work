import type { RouteObject } from 'react-router-dom';
import ParticipantDashboardPage from '@/pages/ParticipantPage.tsx';
import ParticipantProductsPage from '@/pages/participant/ParticipantProductsPage.tsx';
import ParticipantCatalogsPage from '@/pages/participant/ParticipantCatalogsPage.tsx';

const ParticipantRoutes: RouteObject[] = [
    {
        index: true,
        element: <ParticipantDashboardPage />,
    },
    {
        path: 'products',
        element: <ParticipantProductsPage />,
    },
    {
        path: 'catalogs',
        element: <ParticipantCatalogsPage />,
    },
];

export default ParticipantRoutes;
