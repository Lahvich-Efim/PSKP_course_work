import type { RouteObject } from 'react-router-dom';
import coordinatorRoutes from './CoordinatorRoutes';
import participantRoutes from './ParticipantRoutes';

export const roleRouteMap: Record<string, RouteObject[]> = {
    coordinator: coordinatorRoutes,
    participant: participantRoutes,
};
