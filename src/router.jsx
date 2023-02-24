import React from 'react';
import App from './App';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import CodeVerify from './pages/CodeVerify/CodeVerify';
import Home from './pages/Home/Home';
import moment from 'moment';
import EditMessage from 'pages/EditMessage/EditMessage';
import SubscriberList from 'pages/SubscriberList/SubscriberList';
import EditSubscriber from 'pages/EditSubscriber/EditSubscriber';
import ErrorPage from 'pages/ErrorPage/ErrorPage';
import MessageHistory from 'pages/MessageHistory/MessageHistory';
import { auth } from 'lib/firebase';
import { message } from 'antd';
import Landing from 'pages/Landing/Landing';

const RestrictAuth = ({ children }) => {
  const location = useLocation();
  const account = JSON.parse(localStorage.getItem('account') || 'null');
  const signUserOut = React.useCallback(() => {
    auth.signOut();
    localStorage.removeItem('account');
  }, []);
  if (
    !account ||
    moment().subtract(3, 'hours').isAfter(moment(account.login_at))
  ) {
    // User is not logged in or session has expired
    signUserOut();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const RestrictGuest = ({ children }) => {
  const account = JSON.parse(localStorage.getItem('account') || 'null');
  if (account) {
    // User is already logged in
    return <Navigate to="/home" replace />;
  }

  return children;
};

const Logout = () => {
  const signUserOut = React.useCallback(() => {
    message.success('You have been logged out');
    auth.signOut();
    localStorage.removeItem('account');
  }, []);
  React.useEffect(() => {
    signUserOut();
  }, [signUserOut]);
  return <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    //loader: rootLoader,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/login',
        element: (
          <RestrictGuest>
            <Auth />
          </RestrictGuest>
        ),
      },
      {
        path: '/code-verify',
        element: (
          <RestrictGuest>
            <CodeVerify />
          </RestrictGuest>
        ),
      },
      {
        path: '/home',
        element: (
          <RestrictAuth>
            <Home />
          </RestrictAuth>
        ),
      },
      {
        path: '/message/create',
        element: (
          <RestrictAuth>
            <EditMessage />
          </RestrictAuth>
        ),
      },

      {
        path: '/message/history',
        element: (
          <RestrictAuth>
            <MessageHistory />
          </RestrictAuth>
        ),
      },
      {
        path: 'subscribers',
        element: (
          <RestrictAuth>
            <SubscriberList />
          </RestrictAuth>
        ),
      },
      {
        path: 'subscribers/add',
        element: (
          <RestrictAuth>
            <EditSubscriber />
          </RestrictAuth>
        ),
      },
      {
        path: 'subscribers/:id',
        element: (
          <RestrictAuth>
            <EditSubscriber />
          </RestrictAuth>
        ),
      },
    ],
  },
  {
    path: '/log-out',
    element: <Logout />,
  },
]);

export default router;
