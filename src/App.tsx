import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GlobalProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </GlobalProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
