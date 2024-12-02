import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider, SchoolProvider } from './providers';

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaProvider>
        <SchoolProvider>
          <RootNavigator />
        </SchoolProvider>
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
