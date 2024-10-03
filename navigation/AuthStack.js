// AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, SignupScreen, ForgotPasswordScreen } from '../screens';

const { Navigator, Screen } = createStackNavigator();

export const AuthStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen component={LoginScreen} name="LoginScreen" />
      <Screen component={SignupScreen} name="SignupScreen" />
      <Screen component={ForgotPasswordScreen} name="ForgotPasswordScreen" />
    </Navigator>
  );
};
