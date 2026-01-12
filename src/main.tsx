import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '../src/assets/styles/global.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
// import 'perfect-scrollbar/css/perfect-scrollbar.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider autoHideDuration={1500} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} preventDuplicate>
      <AuthProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
