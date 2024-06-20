import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthStack from './auth-stack';
import AppStack from './app-stack';
import { useAuth } from 'src/context/auth-config/interfaces';
import useAppearance from 'src/hooks/use-appearance';

const Root = createNativeStackNavigator<RootStackParamList>();

export default function RootStack(): React.JSX.Element | null {
  const authStatus = useAuth();

  useAppearance();

  return (
    <Root.Navigator
      initialRouteName={authStatus?.user?.uid ? 'AppStack' : 'AuthStack'}
      screenOptions={{
        headerShown: false,
      }}>
      {authStatus?.user?.uid ? (
        <Root.Screen name="AppStack" component={AppStack} />
      ) : (
        <Root.Screen name="AuthStack" component={AuthStack} />
      )}
    </Root.Navigator>
  );
}
