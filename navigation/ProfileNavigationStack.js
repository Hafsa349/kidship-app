//MoreNavigationStack.js
import { LocationScreen, MyAccountScreen, LoginScreen, ProfileScreen, PrivacyPolicyScreen, TermsAndConditionScreen } from '../screens';
import React, {  } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { Colors } from '../config';

const { Navigator, Screen } = createStackNavigator();


export const ProfileStack = () => {

    return (
        <Navigator screenOptions={{ headerShown: true, headerTintColor: Colors.brandYellow }}>
            <Screen component={ProfileScreen} name="{ProfileScreen}" options={{headerTitle: 'Profile'}}/>
            <Screen component={LoginScreen} name="LoginScreen" options={{headerShown: false}} />
            <Screen component={EditProfileScreen} name="EditProfileScreen" options={{headerTitle: 'Edit Profile'}}/>
            <Screen component={ChangePasswordScreen} name="ChangePasswordScreen" options={{headerTitle: 'Change Password'}} />
        </Navigator>
    );
}