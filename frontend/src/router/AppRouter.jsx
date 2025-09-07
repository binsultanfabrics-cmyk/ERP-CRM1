import React, { lazy, useEffect, useCallback, useMemo } from 'react';

import {} from 'react-router-dom';
import {} from 'react-router-dom';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';

import routes from './routes';

export default React.memo(function AppRouter() {
  let location = useLocation();
  const { state: stateApp, appContextAction } = useAppContext();
  const { app } = appContextAction;

  // Memoize the routes list to prevent unnecessary re-computations
  const routesList = useMemo(() => {
    const list = [];
    Object.entries(routes).forEach(([key, value]) => {
      list.push(...value);
    });
    return list;
  }, []);

  // Memoize the app name getter function
  const getAppNameByPath = useCallback((path) => {
    for (let key in routes) {
      for (let i = 0; i < routes[key].length; i++) {
        if (routes[key][i].path === path) {
          return key;
        }
      }
    }
    // Return 'default' app  if the path is not found
    return 'default';
  }, []);

  // Optimize the app switching logic - only run when pathname changes
  useEffect(() => {
    if (location.pathname === '/') {
      app.default();
    } else {
      const path = getAppNameByPath(location.pathname);
      app.open(path);
    }
  }, [location.pathname, app, getAppNameByPath]); // Include all dependencies to prevent stale closures

  let element = useRoutes(routesList);

  return element;
});
