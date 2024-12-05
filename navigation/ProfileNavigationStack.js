import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    LoginScreen,
    ProfileScreen,
} from '../screens';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { Colors } from '../config';
import ChildrenScreen from '../screens/ChildrenScreen';
import StudentsScreen from '../screens/StudentsScreen';

const { Navigator, Screen } = createStackNavigator();

export const ProfileStack = ({ user, userDetail, refreshUserDetail, allowEditing }) => {
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
                        allowEditing={allowEditing}

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
            <Screen
                name="ChildrenScreen"
                children={(props) => <ChildrenScreen 
                    {...props} 
                    user={user}
                    userDetail={userDetail}
                     />}
                options={{
                    headerTitle: 'Children',
                }}
            />
                        <Screen
                name="StudentsScreen"
                children={(props) => <StudentsScreen 
                    {...props} 
                    user={user}
                    userDetail={userDetail}
                     />}
                options={{
                    headerTitle: 'Students',
                }}
            />
        </Navigator>
    );
};
