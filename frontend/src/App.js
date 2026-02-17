import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { loadUser } from './features/auth/authSlice';
import Login from './pages/Login/Login';
// import TopBar from './componant/AdminDashboard/TopBar';

import ProtectedRoute from './utils/ProtectedRoute';

// Admin Components
import AdminDashboard from './componant/AdminDashboard/AdminDashboard';
import GanaralManagerDashboard from './componant/Admin/Inventory/generalManagerDashboard';
import AdminStoreDetails from './componant/Admin/Inventory/AdminStoreDetails';
import InventoryDetails from './componant/Admin/Inventory/InventoryDetails';
import InventoryPurchesUpdate from './componant/Admin/Inventory/InventoryPurchesUpdate';
import InventoryRequest from './componant/Admin/Inventory/InventoryRequest';
import FinishGoods from './componant/Admin/Inventory/FinishGoods';
import ProductionDashboard from './componant/Admin/Production/ProductionDashboard';
import ProductionActive from './componant/Admin/Production/ProductionActive';
import ProductionjobDetails from './componant/Admin/Production/ProductionJobDetails';
import CreateTarget from './componant/Admin/Production/CreateTarget.jsx';
import PurchaseDeptDashboard from './componant/Admin/PruchaseDepartment/PurchaseDeptDashboard';
import PurchaseOrder from './componant/Admin/PruchaseDepartment/PurchaseOrder';
import Staff from './componant/GeneralManagerDash/pages/Staff';
import Vendors from './componant/GeneralManagerDash/pages/Vendor';
import Jobs from './componant/GeneralManagerDash/pages/Staff';
import UnauthRedirect from './pages/Login/Unauth';
import TopBar from './componant/navbar/navbar';
import UserOptions from './componant/userOptions/userOption';
import FinishGoodsFactory from './componant/Admin/Inventory/Finish_goods_Factory.jsx';

function App() {
  const dispatch = useDispatch();
  const {user, loadingUser,isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loadingUser) return <div>Loading App...</div>; // App-level loader

  return (
    <BrowserRouter>
      {/* <PrimarySearchAppBar /> */}
    {isAuthenticated ?<UserOptions user={user}/>:''}  
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Unauthenticated" element={<UnauthRedirect />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['general manager']}>
              <GanaralManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/details/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager', 'store manager']}>
              <AdminStoreDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/details/inventory/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager', 'store manager']}>
              <InventoryDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/details/purches/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager', 'store manager']}>
              <InventoryPurchesUpdate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Inventory/request/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager', 'store manager']}>
              <InventoryRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finish_goods/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager', 'store manager']}>
              <FinishGoodsFactory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Inventory/finish_goods"
          element={
            <ProtectedRoute allowedRoles={['general manager', 'store manager']}>
              <FinishGoods />
            </ProtectedRoute>
          }
        />

        <Route
          path="/production/target/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager','supervisor','manager']}>
              <ProductionDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/production/job/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager','supervisor','manager']}>
              <ProductionActive />
            </ProtectedRoute>
          }
        />

        <Route
          path="/production/job/details/:id"
          element={
            <ProtectedRoute allowedRoles={['general manager','supervisor','manager']}>
              <ProductionjobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Purchase"
          element={
            <ProtectedRoute allowedRoles={['general manager']}>
              <PurchaseDeptDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Purchase/order"
          element={
            <ProtectedRoute allowedRoles={['general manager']}>
              <PurchaseOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Create/Target"
          element={
            <ProtectedRoute allowedRoles={['general manager']}>
              <CreateTarget/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/general-manager/Jobs"
          element={
            <ProtectedRoute allowedRoles={['general manager']}>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/general-manager/staff"
          element={
            <ProtectedRoute allowedRoles={['general manager']}>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/general-manager/vendor"
          element={
            <ProtectedRoute allowedRoles={['general manager']}>
              <Vendors />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
