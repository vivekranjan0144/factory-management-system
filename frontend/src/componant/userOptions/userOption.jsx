import React from 'react'
import "./userOption.css"
// import { Button, Tooltip } from 'antd'
import { AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery, useTheme, Tooltip } from '@mui/material';

import { FaSignOutAlt } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
const UserOption = () => {
   const dispatch = useDispatch()
     const navigate = useNavigate();
   
  const handleLogout = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    dispatch(logout())
    navigate('/login');
  };
  return (
    <div className='userOptionMain'> 
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
          </div>
  )
}

export default UserOption