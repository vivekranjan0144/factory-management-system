import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice.jsx';
import materialReducer from './features/auth/materialSlice.jsx';
import orderConfirmReducer from './features/orderMaterialSlice.jsx';
import productionTargetsReducer from './features/production/productionTargetSlice.jsx';
import productionJobReducer from './features/production/productionJobSlice.jsx';
import materialRequestReducer from './features/Inventory/MaterialRequestSlice.js';
import FinishGoodReducer from './features/Inventory/finishGoodSlice.js';
import FactoryReducer from './features/factorySlice.jsx';

export const store = configureStore({
  reducer: {
    auth: authReducer,
       material: materialReducer,
       orders: orderConfirmReducer,
         productionTargets: productionTargetsReducer,
         productionJobs: productionJobReducer,
          materialRequests: materialRequestReducer,
          finishGoods: FinishGoodReducer,
          factory: FactoryReducer,
    // products: productReducer,
  },
});
