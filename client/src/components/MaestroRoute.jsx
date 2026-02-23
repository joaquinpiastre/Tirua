import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MaestroRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== 'maestro' && user?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default MaestroRoute;
