import React from 'react';
import { Route } from 'react-router-dom';

import DashboardLayout from '.';

const DashboardRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <DashboardLayout>
          <Component {...matchProps} />
        </DashboardLayout>
      )}
    />
  );
};

export default DashboardRoute;
