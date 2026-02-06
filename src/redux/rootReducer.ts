// src/app/rootReducer.ts
import { combineReducers } from 'redux';
import userProfileReducer from './slices/userProfileSlice';
import restaurantManagementReducer from './slices/restaurantManagementSlice';
import menuManagementReducer from './slices/menuManagementSlice';

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
  restaurantManagement: restaurantManagementReducer,
  menuManagement: menuManagementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
