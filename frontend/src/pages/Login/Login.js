import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUser, reset } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

 const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await dispatch(loginUser({ email, password })).unwrap();
  } catch (err) {
    // err is the error message from rejectWithValue
    setError(err || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    if (auth?.isAuthenticated && auth?.user) {
      const { role, factory_id } = auth.user;

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'general manager') {
        navigate('/');
      } else if (role === 'store manager') {
        navigate(`/details/${factory_id}`);
      } else {
        navigate(`/production/job/${factory_id}`);
      }
    }
   
  }, [auth.isAuthenticated, auth.error,auth.user, navigate]);

  return (
    <div className="login-container">
      {/* Left Side - Login Form */}
      <div className={`login-section ${mounted ? 'mounted' : ''}`}>
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`sign-in-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Company Branding */}
      <div className="branding-section">
        <div className="animated-background">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`circle-${i}`}
              className="floating-circle"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}

          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`shape-${i}`}
              className="morphing-shape"
              style={{
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.7}s`,
                borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`,
              }}
            ></div>
          ))}

          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`line-${i}`}
              className="sliding-line"
              style={{
                width: '200px',
                height: '2px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 180}deg)`,
                animationDelay: `${i * 1.5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="energy-orbs">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="floating-orb"
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + i * 8}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className={`branding-content ${mounted ? 'mounted' : ''}`}>
          <div className="logo-section">
            <div className="logo-wrapper">
              <h1 className="logo-text">Powerline Group</h1>
              <div className="logo-underline"></div>
            </div>
          </div>

          <div className={`motto-section ${mounted ? 'mounted' : ''}`}>
            <h2 className="motto">Powering Your Life Always</h2>
            <p className="sub-motto">Reliable energy solutions for a brighter tomorrow</p>
          </div>

          <div className={`features-grid ${mounted ? 'mounted' : ''}`}>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">24/7 Reliable Power</h3>
              <p className="feature-description">Uninterrupted energy supply</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Sustainable Energy</h3>
              <p className="feature-description">Eco-friendly solutions</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🔧</div>
              <h3 className="feature-title">Smart Grid Technology</h3>
              <p className="feature-description">Advanced infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
