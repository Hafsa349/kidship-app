import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider, CartProvider } from './providers';
import { Colors, expoConfig } from './config';

const App = () => {
  return (
    <StripeProvider 
    publishableKey={expoConfig?.extra?.stripePublishableKey}>
      <AuthenticatedUserProvider>
        <SafeAreaProvider style={{color: Colors.black }}>
          <CartProvider>
            <RootNavigator />
          </CartProvider>
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </StripeProvider>
  );
};

export default App;
