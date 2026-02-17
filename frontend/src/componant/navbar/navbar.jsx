// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import MoreIcon from '@mui/icons-material/MoreVert';
// import { useDispatch } from 'react-redux';
// import { logout } from '../../features/auth/authSlice';
// import logo from '../Assets/favicon.ico'
// import Title from 'antd/es/typography/Title';
// import { useNavigate } from 'react-router-dom';




// export default function PrimarySearchAppBar() {

// const dispatch =useDispatch()
// const navigate=useNavigate()
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     dispatch(logout())
// navigate('/login')
//     setAnchorEl(null);
//     handleMobileMenuClose();
//   };

//   const handleMobileMenuOpen = (event) => {
//     setMobileMoreAnchorEl(event.currentTarget);
//   };

//   const menuId = 'primary-search-account-menu';
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem >Profile</MenuItem>
//       {/* <MenuItem >My account</MenuItem> */}
//       <MenuItem onClick={()=>handleMenuClose()}>Logout</MenuItem>
//     </Menu>
//   );

//   const mobileMenuId = 'primary-search-account-menu-mobile';
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       <MenuItem>
//         <IconButton size="large" aria-label="show 4 new mails" color="inherit">
//           <Badge badgeContent={4} color="error">
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem>
//       <MenuItem>
//         <IconButton
//           size="large"
//           aria-label="show 17 new notifications"
//           color="inherit"
//         >
//           <Badge badgeContent={17} color="error">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//         <p>Notifications</p>
//       </MenuItem>
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           size="large"
//           aria-label="account of current user"
//           aria-controls="primary-search-account-menu"
//           aria-haspopup="true"
//           color="inherit"
//         >
//           <AccountCircle />
//         </IconButton>
//         <p>Profile</p>
//       </MenuItem>
//     </Menu>
//   );

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//      <AppBar position="sticky"   elevation={0} sx={{ backgroundColor: 'rgb(4, 120, 87)' }}>

//         <Toolbar>
//                 <div
//           style={{
//             height: 40,
//             display: 'flex',
//             alignItems: 'center',
//             background: ' rgba(255,255,255,0.2)',
//             margin: '5px',
//             borderRadius: '10px',
//             // justifyContent: collapsed ? 'center' : 'flex-start',
//             padding: '0 24px',
//             // borderBottom: '1px solid rgba(255,255,255,0.2)',
//           }}

//         >
//           <img
//             src={logo}// Replace with your logo path
//             alt="Logo"
//             style={{
//               height: 25,
//               marginRight:  12,
//             }}
//           />
//           {/* {!collapsed && ( */}
//             <Title level={5} style={{ color: '#A7F3D0', margin: 0 }}>
//               Powerline
//             </Title>
//           {/* )} */}
//         </div>
//           {/* <IconButton
//             size="large"
//             edge="start"
//             color="inherit"
//             aria-label="open drawer"
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton> */}
//           {/* <Typography
//             variant="h6"
//             noWrap
//             component="div"
//             sx={{ display: { xs: 'none', sm: 'block' } }}
//           >
//             MUI
//           </Typography> */}
//           {/* <Search>
//             <SearchIconWrapper>
//               <SearchIcon />
//             </SearchIconWrapper>
//             <StyledInputBase
//               placeholder="Search…"
//               inputProps={{ 'aria-label': 'search' }}
//             />
//           </Search> */}
//           <Box sx={{ flexGrow: 1 }} />
//           <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//             <IconButton size="large" aria-label="show 4 new mails" color="inherit">
//               <Badge badgeContent={4} color="error">
//                 <MailIcon />
//               </Badge>
//             </IconButton>
//             <IconButton
//               size="large"
//               aria-label="show 17 new notifications"
//               color="inherit"
//             >
//               <Badge badgeContent={17} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//             <IconButton
//               size="large"
//               edge="end"
//               aria-label="account of current user"
//               aria-controls={menuId}
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               color="inherit"
//             >
//               <AccountCircle />
//             </IconButton>
//           </Box>
//           <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="show more"
//               aria-controls={mobileMenuId}
//               aria-haspopup="true"
//               onClick={handleMobileMenuOpen}
//               color="inherit"
//             >
//               <MoreIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       {renderMobileMenu}
//       {renderMenu}
//     </Box>
//   );
// }

import { useDispatch } from 'react-redux';
// import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="w-full bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wide">PGI Factory Management</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
