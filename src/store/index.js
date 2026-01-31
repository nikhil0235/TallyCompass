import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import customerReducer from './slices/customerSlice'
import productReducer from './slices/productSlice'
import uiReducer from './slices/uiSlice'
import vocReducer from './slices/vocSlice'
import dashboardReducer from './slices/dashboardSlice'
import notificationReducer from './slices/notificationSlice'
import requestReducer from './slices/requestSlice'
import profileReducer from './slices/profileSlice'
import userListReducer from './slices/userListSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
    ui: uiReducer,
    voc: vocReducer,
    dashboard: dashboardReducer,
    notification: notificationReducer,
    requests: requestReducer,
    profile: profileReducer,
    userList: userListReducer,
  },
})

export default store