import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider, SchoolProvider, UserProvider } from './providers';

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaProvider>
        <SchoolProvider>
          <UserProvider>
            <RootNavigator />
          </UserProvider>
        </SchoolProvider>
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
