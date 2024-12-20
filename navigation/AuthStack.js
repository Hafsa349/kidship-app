// AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, SignupScreen, ForgotPasswordScreen, GetStartedScreen, HomeScreen } from '../screens';

const { Navigator, Screen } = createStackNavigator();

export const AuthStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen component={GetStartedScreen} name="GetStartedScreen" />
      <Screen component={LoginScreen} name="LoginScreen" />
      <Screen component={HomeScreen} name="HomeScreen" />
      <Screen component={SignupScreen} name="SignupScreen" />
      <Screen component={ForgotPasswordScreen} name="ForgotPasswordScreen" />
    </Navigator>
  );
};
