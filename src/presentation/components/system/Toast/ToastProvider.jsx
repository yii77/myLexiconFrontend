import { useState, createContext, useContext, useRef } from 'react';
import Toast from './Toast';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [state, setState] = useState({
    visible: false,
    message: '',
    type: 'info',
  });

  const timerRef = useRef(null);

  const showToast = ({ message, type = 'info', duration = 2000 }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setState({
      visible: true,
      message,
      type,
    });

    timerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, visible: false }));
    }, duration);
  };

  const hideToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setState(prev => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      <Toast
        visible={state.visible}
        message={state.message}
        type={state.type}
      />
    </ToastContext.Provider>
  );
}
