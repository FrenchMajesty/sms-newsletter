import React from "react";
import App from "./App";
import {
    createBrowserRouter,
  } from "react-router-dom";
  import Auth from './pages/Auth/Auth';
  import CodeVerify from './pages/CodeVerify/CodeVerify';
  import Home from './pages/Home/Home';
import EditMessage from "pages/EditMessage/EditMessage";
import SubscriberList from "pages/SubscriberList/SubscriberList";
import EditSubscriber from "pages/EditSubscriber/EditSubscriber";
import ErrorPage from "pages/ErrorPage/ErrorPage";
import MessageHistory from "pages/MessageHistory/MessageHistory";

  
const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />
      //loader: rootLoader,
      /*children: [
        {
          path: "team",
          element: <Auth />,
          loader: teamLoader,
        },
      ],*/
    },
    {
      path: '/home',
      element: <Home />,
    },
    {
      path: '/auth',
      element: <Auth />,
    },
    {
      path: '/code-verify',
      element: <CodeVerify />,
    },
    {
      path: '/message/create',
      element: <EditMessage />
    },

    {
      path: '/message/history',
      element: <MessageHistory />
    },
    {
      path: 'subscribers',
      element: <SubscriberList />
    },
    {
      path: 'subscribers/add',
      element: <EditSubscriber />
    },
    {
      path: 'subscribers/:id',
      element: <EditSubscriber />
    },
  ]);

export default router;
