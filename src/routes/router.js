import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/error-page';
import Index from '../pages/index';
import Layout from '../pages/layout';
import Works from '../pages/works/works';
import WorksForm from '../pages/works/worksForm';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Index />,
            },
            {
                path: '/works',
                children: [
                    { index: true, element: <Works /> },
                    { path: 'add', element: <WorksForm /> },
                    { path: ':id', element: <WorksForm /> },
                ],
            },
        ],
    },
]);
export default router;
