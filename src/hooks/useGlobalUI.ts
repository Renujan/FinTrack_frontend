import { useContext } from 'react';
import { GlobalContext, GlobalContextType } from '../context/GlobalContext';

export const useGlobalUI = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalUI must be used within a GlobalProvider');
  }
  return context;
};

export default useGlobalUI;
