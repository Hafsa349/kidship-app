// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  MyAccountScreen, 
  MoreScreen,
  LoginScreen, 
  SignupScreen, 
  ForgotPasswordScreen, 
  CreatePostScreen, 
  CalendarScreen, 
  HomeWorkScreen,
  NotificationScreen, 
  PostDetailScreen, 
  ReportScreen,
  ChatRoomScreen,
  ConversationScreen,
  NewConversationScreen,
  ChatScreen,
  NewChatScreen
} from '../screens';
import { Colors } from '../config';

const { Navigator, Screen } = createStackNavigator();

export const AppStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: true, headerTintColor: Colors.brandYellow }}>
      <Screen component={HomeScreen} name="HomeScreen" options={{ headerShown: false, headerTitle: 'Home' }} />
      <Screen component={NotificationScreen} name="NotificationScreen" options={{ headerTitle: 'Notifications' }}/>
      <Screen component={MyAccountScreen} name="MyAccountScreen" />
      <Screen component={HomeWorkScreen} name="HomeWorkScreen" />
      <Screen component={ChatScreen} name="ChatScreen" options={{ headerTitle: 'Messages' }} />
      <Screen component={NewChatScreen} name='NewChatScreen' options={{ headerTitle: 'New Message' }} />
      <Screen component={ChatRoomScreen} name="ChatRoomScreen" options={({ route }) => {
    const { firstName, lastName } = route.params.item;
    return {
      title: `${firstName} ${lastName}`
    };
  }} />
      <Screen component={CalendarScreen} name="CalendarScreen" options={{ headerTitle: 'Events' }}/>
      <Screen component={CreatePostScreen} name="CreatePostScreen" />
      <Screen component={PostDetailScreen} name="PostDetailScreen" options={{ headerShown: true, headerTitle: 'Post Detail' }}/>
      <Screen component={ReportScreen} name="ReportScreen"/>
      <Screen component={MoreScreen} name="MoreScreen" />
      <Screen component={LoginScreen} name="LoginScreen" />
      <Screen component={SignupScreen} name="SignupScreen" />
      <Screen component={ForgotPasswordScreen} name="ForgotPasswordScreen" />
      
    </Navigator>
  );
};
