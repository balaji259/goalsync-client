// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import approvalReducer from './approvalSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    approval: approvalReducer,
  },
});
