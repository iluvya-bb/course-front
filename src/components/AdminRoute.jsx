
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getProfile } from '../services/userService';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const profile = await getProfile();
        setIsAdmin(profile.role === 'admin');
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminRoute;
