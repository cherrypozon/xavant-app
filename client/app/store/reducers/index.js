import { combineReducers } from '@reduxjs/toolkit';

// Import slice reducers
import dashboardReducer from '../slices/dashboardSlice';
import smartCameraReducer from '../slices/smartCameraSlice';

// Import API reducers
import { dashboardApi } from '../api/dashboardApi';
import { smartCameraApi } from '../api/smartCameraApi';

const rootReducer = combineReducers({
  // Slices
  dashboard: dashboardReducer,
  smartCamera: smartCameraReducer,
  
  // API reducers
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [smartCameraApi.reducerPath]: smartCameraApi.reducer,
});

export default rootReducer;
