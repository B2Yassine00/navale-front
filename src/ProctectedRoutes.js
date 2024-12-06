import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { isAuthenticated } from './pages/Api';


const ProtectedRoutes = ({ children }) => {
    const auth = isAuthenticated();

    return auth ? children : <Navigate to="/connexion" />;
}

export default ProtectedRoutes;