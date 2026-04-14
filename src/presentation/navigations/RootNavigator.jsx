import { useContext } from 'react';

import { AuthContext } from '../../logic/contexts/AuthContext';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

export default function RootNavigator() {
  const { user, authLoading } = useContext(AuthContext);
  if (authLoading) return null; // TODO：改成加载页
  return user ? <TabNavigator /> : <AuthNavigator />;
}
