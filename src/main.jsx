import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './store'
import { initializeAuth } from './store/slices/authSlice'
import './index.css'
import App from './App.jsx'

const AppWithAuth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Clear any existing auth state on app start
    localStorage.removeItem('token')
    dispatch(initializeAuth({ 
      isAuthenticated: false, 
      user: null 
    }))
  }, [dispatch])

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppWithAuth />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Provider>
  </StrictMode>,
)
