import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AutoLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const rawRole=user?.role;
    const role = rawRole?.toLowerCase().trim(); // normalize role

    if (!token || !role) {
      navigate('/login', { replace: true });
      return;
    }

    switch (role) {
      case 'admin':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'general manager':
        navigate('/generalManager/dashboard', { replace: true });
        break;
      case 'store manager':
        if (user?.factory_id) {
          navigate(`/details/${user?.factory_id}`, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
        break;
      default:
        navigate('/unauthorized', { replace: true });
        break;
    }
  }, [navigate]);

  return <div>Loading, please wait...</div>;
}

export default AutoLogin;
