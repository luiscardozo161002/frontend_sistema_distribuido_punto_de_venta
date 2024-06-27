import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  if (token && location.pathname === '/login') {
    return <Navigate to="/" />;
  }

  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
