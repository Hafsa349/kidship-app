import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider } from './providers';
import { Colors, expoConfig } from './config';

const App = () => {
  return (
      <AuthenticatedUserProvider>
        <StatusBar barStyle="light-content" />
        <SafeAreaProvider>
            <RootNavigator />
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
  );
};

export default App;
