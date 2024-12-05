import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    LocationScreen,
    MyAccountScreen,
    LoginScreen,
    ProfileScreen,
    PrivacyPolicyScreen,
    TermsAndConditionScreen
} from '../screens';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { Colors } from '../config';

const { Navigator, Screen } = createStackNavigator();

export const ProfileStack = ({ user, userDetail, refreshUserDetail }) => {
    return (
        <Navigator screenOptions={{ headerShown: true, headerTintColor: Colors.brandYellow }}>
<Screen 
    name="ProfileScreen" 
    children={(props) => (
        <ProfileScreen 
            {...props} 
            user={user} 
            userDetail={userDetail} 
            refreshUserDetail={refreshUserDetail} // Pass refreshUserDetail here
        />
    )}
    options={{ headerTitle: 'Profile' }}
/>

            <Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Screen
                name="EditProfileScreen"
                children={(props) => (
                    <EditProfileScreen
                        {...props}
                        refreshUserDetail={refreshUserDetail}
                    />
                )}
                options={{ headerTitle: 'Edit Profile' }}
            />
            <Screen
                name="ChangePasswordScreen"
                component={ChangePasswordScreen}
                options={{ headerTitle: 'Change Password' }}
            />
        </Navigator>
    );
};
