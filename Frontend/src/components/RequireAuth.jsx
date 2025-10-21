import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'unauth'
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    axios.get('https://chatgpt-project-1-z3al.onrender.com/api/auth/me', { withCredentials: true })
      .then(() => { if (mounted) setStatus('ok'); })
      .catch(() => { if (mounted) setStatus('unauth'); });

    return () => { mounted = false; };
  }, []);

  if (status === 'loading') return null; // or return a spinner component
  if (status === 'unauth') return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default RequireAuth;