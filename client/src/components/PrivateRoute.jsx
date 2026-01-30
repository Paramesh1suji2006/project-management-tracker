import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './UI/Loader';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader fullPage />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
