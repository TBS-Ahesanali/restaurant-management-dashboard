// src/app/rootReducer.ts
import { combineReducers } from 'redux';
import userProfileReducer from './slices/userProfileSlice';
import restaurantManagementReducer from './slices/restaurantManagementSlice';
import menuManagementReducer from './slices/menuManagementSlice';
import offerManagementReducer from './slices/offerManagementSlice';
import customerManagementReducer from './slices/customermanagementslice';
import dashboardManagementReducer from './slices/dashboardManagementSlice';
import orderManagementReducer from './slices/orderManagementSlice';

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
  restaurantManagement: restaurantManagementReducer,
  menuManagement: menuManagementReducer,
  offerManagement: offerManagementReducer,
  customerManagement: customerManagementReducer,
  dashboardManagement: dashboardManagementReducer,
  orderManagement: orderManagementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
