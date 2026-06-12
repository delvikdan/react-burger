import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from '@components/app/app';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed-page/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { Home } from '@pages/home/home';
import { LoginPage } from '@pages/login-page/login-page';
import { NotFoundPage } from '@pages/not-found-page/not-found-page';
import { OrderInfoPage } from '@pages/order-info-page/order-info-page';
import { ProfileOrderPage } from '@pages/profile-order-page/profile-order-page';
import { ProfileIndexPage } from '@pages/profile-page/profile-index-page';
import { ProfilePage } from '@pages/profile-page/profile-page';
import { RegisterPage } from '@pages/register-page/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';
import { store } from '@services/store';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'ingredients/:id', element: <Home /> },
      {
        element: <ProtectedRoute onlyUnAuth={true} />,
        children: [
          { path: 'register', element: <RegisterPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'reset-password', element: <ResetPasswordPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: <ProfilePage />,
            children: [
              { index: true, element: <ProfileIndexPage /> },
              {
                path: 'orders',
                element: <ProfileOrderPage />,
                children: [{ path: ':id', element: <OrderInfoPage source="profile" /> }],
              },
            ],
          },
        ],
      },
      {
        path: 'feed',
        element: <FeedPage />,
        children: [{ path: ':id', element: <OrderInfoPage source="feed" /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
