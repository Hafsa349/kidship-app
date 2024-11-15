// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  MyAccountScreen, MoreScreen,
  LoginScreen, SignupScreen, ForgotPasswordScreen, CreatePostScreen, CalendarScreen, HomeWorkScreen,
  NotificationScreen, PostDetailScreen, ReportScreen,
  MessageDetailScreen,
  ConversationScreen
} from '../screens';
import { Colors } from '../config';

const { Navigator, Screen } = createStackNavigator();

export const AppStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: true, headerTintColor: Colors.brandYellow }}>
      <Screen component={HomeScreen} name="HomeScreen" options={{ headerShown: false, headerTitle: 'Home' }} />
      <Screen component={NotificationScreen} name="NotificationScreen" />
      <Screen component={MyAccountScreen} name="MyAccountScreen" />
      <Screen component={HomeWorkScreen} name="HomeWorkScreen" />
      <Screen component={ConversationScreen} name="ConversationScreen" options={{ headerTitle: 'Messages' }} />
      <Screen component={MessageDetailScreen} name="MessageDetailScreen" options={({ route }) => ({ title: route.params.contactName })} />
      <Screen component={CalendarScreen} name="CalendarScreen" />
      <Screen component={CreatePostScreen} name="CreatePostScreen" />
      <Screen component={PostDetailScreen} name="PostDetailScreen" options={{ headerShown: false, headerTitle: 'Post Detail' }}/>
      <Screen component={ReportScreen} name="ReportScreen" options={{ headerTitle: 'Child Progress' }}/>
      <Screen component={MoreScreen} name="MoreScreen" />
      <Screen component={LoginScreen} name="LoginScreen" />
      <Screen component={SignupScreen} name="SignupScreen" />
      <Screen component={ForgotPasswordScreen} name="ForgotPasswordScreen" />
    </Navigator>
  );
};
