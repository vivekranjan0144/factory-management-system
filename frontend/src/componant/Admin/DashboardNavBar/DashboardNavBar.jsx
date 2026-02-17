import React from 'react';
import './dashboardNav.css';
import { Link, useLocation } from 'react-router-dom';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';

const DashboardNavBar = ({ navOptions = [], onNavClick, activeNav }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const auth = useSelector((state) => state.auth);
  const role = auth?.user?.role?.toLowerCase() ?? '';

  const rolePermissions = {
    admin: navOptions.map(item => item.nav),
    'general manager': navOptions.map(item => item.nav),
    production: ['Active Production', 'Target Board', 'Request', 'Update Stock', 'Ready'],
    'store manager': ['Store','Purches Order', , 'Material Request', 'Ready'],
  };

  const defaultAllowedNavs = ['Active Production', 'Target Board'];

  const allowedNavs = rolePermissions[role] || defaultAllowedNavs;

  const filteredNavOptions = navOptions.filter(item => allowedNavs.includes(item.nav));

  return (
    <nav className='navmain'>
      {/* <Typography.Title level={4}>Navigation</Typography.Title> */}
      <div className="navContainer">
        <ul>
          {filteredNavOptions.length > 0 ? (
            filteredNavOptions.map((item) => {
              const isActive = currentPath === item.link || activeNav === item.nav;
              return (
                <li key={item.nav}>
                  <Link
                    to={item.link || '#'}
                    onClick={() => onNavClick?.(item.nav)}
                    className={isActive ? 'active' : ''}
                  >
                    <span>{item.icon}</span>
                    <span id="navNAme">{item.nav}</span>
                  </Link>
                </li>
              );
            })
          ) : (
            // <li>No navigation options available</li>
            ''
          )}
        </ul>
      </div>
    </nav>
  );
};

export default DashboardNavBar;
