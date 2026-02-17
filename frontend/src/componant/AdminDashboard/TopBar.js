import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const TopBar = () => {
    const auth = useSelector((state) => state.auth);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch()
  const handleLogout = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    dispatch(logout())
    navigate('/login');
  };
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[_\-]+/g, ' ') // replace underscores or hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
};
  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
        boxShadow: '0 2px 8px rgba(16,185,129,0.15)',
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
        <Typography
          variant={isMobile ? 'subtitle1' : 'h6'}
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 1,
            color: '#fff',
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          {toTitleCase(auth?.user?.role || '')} Dashboard
        </Typography>
        {!isMobile ? (
          <Tooltip title="Logout" arrow>
            <Button
              onClick={handleLogout}
              startIcon={<FaSignOutAlt size={20} />}
              sx={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 700,
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'rgba(255,255,255,0.25)',
                },
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              Logout
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="Logout" arrow>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: '#fff',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 2,
                p: 1,
                '&:hover': {
                  background: 'rgba(255,255,255,0.22)',
                },
              }}
            >
              <FaSignOutAlt size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;