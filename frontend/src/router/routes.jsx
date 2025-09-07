import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Customer = lazy(() => import('@/pages/Customer'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const POS = lazy(() => import('@/pages/POS'));
const Product = lazy(() => import('@/pages/Product'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Supplier = lazy(() => import('@/pages/Supplier'));
const Employee = lazy(() => import('@/pages/Employee'));
const Reports = lazy(() => import('@/pages/Reports'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

// New ERP features
const PurchaseOrders = lazy(() => import('@/pages/PurchaseOrders'));
const AccessControl = lazy(() => import('@/pages/AccessControl'));
const Locations = lazy(() => import('@/pages/Locations'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));

const Profile = lazy(() => import('@/pages/Profile'));



let routes = {
  expense: [],
  default: [
    {
      path: '/logout',
      element: <Logout />,
    },

    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/customers',
      element: <Customer />,
    },
    {
      path: '/pos',
      element: <POS />,
    },
    {
      path: '/product',
      element: <Product />,
    },
    {
      path: '/products',
      element: <Product />,
    },
    {
      path: '/inventory',
      element: <Inventory />,
    },
    {
      path: '/supplier',
      element: <Supplier />,
    },
    {
      path: '/suppliers',
      element: <Supplier />,
    },
    {
      path: '/reports',
      element: <Reports />,
    },
    {
      path: '/employees',
      element: <Navigate to="/employee" />,
    },
    {
      path: '/employee',
      element: <Employee />,
    },
    {
      path: '/payments',
      element: <Navigate to="/invoice" />,
    },
    {
      path: '/purchase-orders',
      element: <PurchaseOrders />,
    },
    {
      path: '/access-control',
      element: <AccessControl />,
    },
    {
      path: '/locations',
      element: <Locations />,
    },
    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },

    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },

    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
