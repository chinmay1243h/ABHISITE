import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../services/AuthedContext";
import Layout from "./Layout";
import { getUserRoll } from "../../services/axiosClient";

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    requiredRole?: string; // Optional role requirement (e.g., "Admin")
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, requiredRole }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login with the current path saved for redirecting after login
        return <Navigate to="/login/" state={{ from: location }} replace />;
    }

    // Check role requirement if specified
    if (requiredRole) {
        const userRole = getUserRoll();
        if (userRole !== requiredRole) {
            // Redirect to home if user doesn't have required role
            return <Navigate to="/" replace />;
        }
    }

    return (
        <>
            <Component />
        </>
    );
};

export default PrivateRoute;
