import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loadingUser } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Wait for loadUser to finish before redirecting
  if (loadingUser) {
    return <div>Loading...</div>; // Can use a Spinner or Skeleton
  }

  // 2. Not authenticated? Go to login, but keep the current location to return after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check if the user is allowed by role
  const normalizedRole = user?.role?.toLowerCase();
  const isAllowed = allowedRoles.length === 0 || allowedRoles.includes(normalizedRole);

  if (!isAllowed) {
    return <Navigate to="/Unauthenticated" replace />;
  }

  // 4. All good → render protected content
  return children;
};

export default ProtectedRoute;
