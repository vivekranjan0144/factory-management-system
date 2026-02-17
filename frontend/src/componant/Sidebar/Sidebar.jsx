import React, { useState } from 'react';
import {
 
  DesktopOutlined,
  HomeOutlined,
  PieChartOutlined,
  ProductOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import './sidebar.css'
import { Layout, Menu } from 'antd';
import Title from 'antd/es/typography/Title';

import { Link } from 'react-router-dom';

const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Sidebar = ({ id,role }) => {
 const items = [];

  if (['store manager', 'general manager'].includes(role)) {
    items.push(getItem('Inventory Managenment', 'sub1', <PieChartOutlined />, [
      getItem(<Link to={`/Inventory/finish_goods`}>Finished Goods</Link>, '3', <ProductOutlined />),
    ]));
  }

  if (['production manager', 'general manager'].includes(role)) {
    items.push(getItem('Production & Manufacturing', 'sub2', <DesktopOutlined />, [
      // Add production links here
    ]));
  }

  if (role === 'general manager') {
    items.push(getItem('Team', 'sub3', <TeamOutlined />, [
      getItem(<Link to={'/Purchase'}>Purchase Department</Link>, '8', <ShoppingOutlined />),
    ]));
  }
    items.push(getItem(<Link to={'/general-manager/staff'}>Staff</Link>, '9', <TeamOutlined />));
  items.push(getItem(<Link to={'/general-manager/vendor'}>Vendors</Link>, '10', <ShoppingOutlined />));
  const [collapsed, setCollapsed] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();




  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      if (isMobile) {
        setCollapsed(true); // Collapse when entering mobile view
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: '200vh', paddingTop: "3px" }}>

      {isMobileView && (
        <button
          onClick={() => setCollapsed(prev => !prev)}
          style={{
            position: 'fixed',
            top: 0,
            left: 10,
            fontSize: '25px',
            zIndex: 1100,
            background: 'transparent',
            border: 'none',
            borderRadius: '4px',
            padding: '8px',
            color: 'black',
            cursor: 'pointer',
            transition: 'all 0.5s'
          }}
        >
          {collapsed ? (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="30" height="30">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            // Close (X) icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="30" height="30">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      )}



      <Sider
        collapsible
        collapsed={collapsed}
        // onCollapse={value => setCollapsed(value)}
        onCollapse={() => setCollapsed(prev => !prev)}
        collapsedWidth={isMobileView ? 0 : 80}

        style={{
          // background: 'linear-gradient(rgb(4, 120, 87) 0%, rgb(6, 95, 70) 100%)',
          // background: 'rgb(4, 120, 87)',
          background: 'rgb(3, 102, 74)',


          position: isMobileView ? 'fixed' : 'sticky',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          overflow: 'auto',
          width: collapsed ? (isMobileView ? 0 : 80) : 260,
        }}
        width={260}


      // breakpoint="md"
      // collapsedWidth={0}
      // onBreakpoint={(broken) => setIsMobileView(broken)}



      >
        

        {!collapsed && <div style={{}}>
          <Title level={5} style={{ color: '#A7F3D0', marginLeft: '10px', paddingTop: '20px' }}>

            MAIN
          </Title>
        </div>}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          style={{
            background: 'transparent',
            color: '#fff',
            borderRight: 0,
          }}
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />} style={{ color: '#fff' }}>
            <Link to={"/"} >Dashboard</Link>
          </Menu.Item>
        </Menu>
        {!collapsed && <div style={{}}>
          <Title level={5} style={{ color: '#A7F3D0', marginLeft: '10px', paddingTop: '20px' }}>
            MODULES
          </Title>
        </div>}

        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>

    </Layout>
  );
};
export default Sidebar;