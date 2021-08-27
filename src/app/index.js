import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './useAuth';

import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import { Loader, Navbar } from '../common';
import Container from '../common/container';

const retryFetch = (fn, retriesLeft = 5, interval = 1000) => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          retryFetch(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

const Login = lazy(() => retryFetch(() => import('../components/login')));
const UserList = lazy(() => retryFetch(() => import('../components/list')));
const AnalyticsPage = lazy(() => retryFetch(() => import('../components/analytics-page/AnalyticsPage')));
const NotFound = lazy(() => retryFetch(() => import('../components/notFound')));
const AdminList = lazy(() => retryFetch(() => import('../components/adminList')));

const routeList = [
  { path: "login", component: Login, publicComponent: Login, isPublic: true },
  { path: "analytics-page", component: AnalyticsPage, publicComponent: AnalyticsPage, isPublic: false },
  { path: "home", component: AdminList, publicComponent: UserList, isPublic: true },
  { path: "", component: AdminList, publicComponent: UserList, isPublic: true },
];

const FallBackComp = () => (<Loader loading={true} loadingText="Loading..." >
  <div className="vh-100 w-100"></div>
</Loader>)

toast.configure();
const App = () => {
  const user = useAuth();
  const routes = !user.isloggedIn ? routeList.filter(route => route.isPublic) : routeList;

  return (
    <Suspense fallback={<FallBackComp />}>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <Navbar />
      <Container>
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path}
              exact
              path={`/${route.path}`}
              component={!user.isloggedIn ? route.publicComponent : route.component}
            />
          ))}
          <Route path="*" component={NotFound} />
        </Switch>
      </Container>
    </Suspense>
  );
};

const AppWithProvider = () => {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
};

export default AppWithProvider;
