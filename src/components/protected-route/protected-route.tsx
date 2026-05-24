import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

type TLocationState = {
  from?: {
    pathname?: string;
  };
};

const hasFromState = (state: unknown): state is TLocationState =>
  typeof state === 'object' && state !== null && 'from' in state;

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const { isAuthChecked, user } = useAppSelector((state) => state.auth);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = hasFromState(location.state) ? location.state.from : undefined;
    return <Navigate to={from?.pathname ?? '/'} replace />;
  }

  return <Outlet />;
};
