import { useState, createContext, useMemo } from 'react';

import CustomAlert from './CustomAlert';

export const CustomAlertContext = createContext();

export function CustomAlertProvider({ children }) {
  const [state, setState] = useState({
    visible: false,
    title: '',
    content: '',
    buttons: [],
    type: 'center',
    style: null,
  });

  const showAlert = config => {
    const finalButtons = config.buttons?.length
      ? config.buttons.map(btn => ({
          ...btn,
        }))
      : [];

    setState({
      visible: true,
      title: config.title || '',
      content: config.content || '',
      buttons: finalButtons,
      type: config.type || 'center',
      style: config.style || null,
    });
  };

  const hideAlert = () => {
    setState(prev => ({ ...prev, visible: false }));
  };

  const value = useMemo(
    () => ({
      showAlert,
      hideAlert,
    }),
    [],
  );

  return (
    <CustomAlertContext.Provider value={value}>
      {children}

      <CustomAlert
        visible={state.visible}
        title={state.title}
        content={state.content}
        buttons={state.buttons}
        type={state.type}
        style={state.style}
        onClose={hideAlert}
      />
    </CustomAlertContext.Provider>
  );
}
