import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './app/store';
import router from './routes/router';

ReactDOM.createRoot(document.getElementById('root')).render(
    <CookiesProvider>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </CookiesProvider>
);
