// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen,
  MyAccountScreen, MoreScreen,
  LoginScreen, SignupScreen, ForgotPasswordScreen, CreatePostScreen, CalendarScreen, HomeWorkScreen,
  NotificationScreen
   } from '../screens';

const { Navigator, Screen } = createStackNavigator();

export const AppStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen component={HomeScreen} name="HomeScreen" />
      <Screen component={NotificationScreen} name="NotificationScreen" />
      <Screen component={MyAccountScreen} name="MyAccountScreen" />
      <Screen component={HomeWorkScreen} name="HomeWorkScreen" />
      <Screen component={CalendarScreen} name="CalendarScreen" />
      <Screen component={CreatePostScreen} name="CreatePostScreen" />
      <Screen component={MoreScreen} name="MoreScreen" />
      <Screen component={LoginScreen} name="LoginScreen" />
      <Screen component={SignupScreen} name="SignupScreen" />
      <Screen component={ForgotPasswordScreen} name="ForgotPasswordScreen" />
    </Navigator>
  );
};
