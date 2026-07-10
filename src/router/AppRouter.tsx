import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import Home from '@pages/home';
import RoadFighter from '@pages/road-fighter';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/road-fighter',
        element: <RoadFighter />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
