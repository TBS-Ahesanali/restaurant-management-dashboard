// src/app/rootReducer.ts
import { combineReducers } from 'redux';
import userProfileReducer from './slices/userProfileSlice';

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
