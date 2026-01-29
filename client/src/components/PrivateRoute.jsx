const PrivateRoute = ({ children }) => {
    // Authentication bypassed - allow access to all routes
    return children;
};

export default PrivateRoute;
