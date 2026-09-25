import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalLoader from './GlobalLoader';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }

  // Assuming user object has a 'role' property. Adjust according to your actual user model.
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
