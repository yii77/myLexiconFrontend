import { useContext } from 'react';

import { CustomAlertContext } from './CustomAlertProvider';

export function useCustomAlert() {
  const context = useContext(CustomAlertContext);

  if (!context) {
    throw new Error('useCustomAlert must be used within CustomAlertProvider');
  }

  return context;
}
