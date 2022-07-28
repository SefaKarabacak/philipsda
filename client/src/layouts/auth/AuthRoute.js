import React from 'react';
import { Route } from 'react-router-dom';

import AuthLayout from '.';

const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <AuthLayout>
          <Component {...matchProps} />
        </AuthLayout>
      )}
    />
  );
};

export default AuthRoute;
