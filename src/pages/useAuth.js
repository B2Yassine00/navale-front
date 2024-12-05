import { useEffect, useState } from 'react';
import { isAuthenticated } from './Api'; // Adjust the path if necessary

const useAuth = () => {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setAuth(isAuthenticated());
    };

    // Initial check when the component mounts
    checkAuth();

    // Listen for changes in localStorage (e.g., when the token changes)
    window.addEventListener('storage', checkAuth);

    // Cleanup listener when the component using this hook unmounts
    return () => {
        window.removeEventListener('storage', checkAuth);
    };
}, []);

  return auth; // Return the current authentication status
};

export default useAuth;
