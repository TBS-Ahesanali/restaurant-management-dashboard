// src/app/rootReducer.ts
import { combineReducers } from 'redux';
import userProfileReducer from './slices/userProfileSlice';
import restaurantManagementReducer from './slices/restaurantManagementSlice';
import menuManagementReducer from './slices/menuManagementSlice';
import offerManagementReducer from './slices/offerManagementSlice';
import customerManagementReducer from './slices/customermanagementslice';
import dashboardManagementReducer from './slices/dashboardManagementSlice';

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
  restaurantManagement: restaurantManagementReducer,
  menuManagement: menuManagementReducer,
  offerManagement: offerManagementReducer,
  customerManagement: customerManagementReducer,
  dashboardManagement: dashboardManagementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
