import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');  // change '/login' to your login route
    }, 3000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h2>Unauthorized Access</h2>
      <p>You are not logged in. Redirecting to the login page...</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
};

export default UnauthRedirect;
