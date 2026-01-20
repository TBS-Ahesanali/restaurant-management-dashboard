// src/app/rootReducer.ts
import { combineReducers } from 'redux';
import userProfileReducer from './slices/userProfileSlice';
import restaurantManagementReducer from './slices/restaurantManagementSlice';

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
  restaurantManagement: restaurantManagementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
