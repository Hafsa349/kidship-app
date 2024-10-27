import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { StyleSheet } from 'react-native';

import { AuthenticatedUserContext } from '../providers';
import { Colors, auth } from '../config';
import { Icon } from '../components';
import { AuthStack, AppStack, MoreAppStack } from '../navigation';
import { CalendarScreen, CreatePostScreen, HomeScreen, HomeWorkScreen, MoreScreen } from '../screens';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();
export const TabNavigator = () => {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            authenticatedUser => {
                setUser(authenticatedUser);
                setIsLoading(false);
            }
        );

        // unsubscribe auth listener on unmount
        return unsubscribeAuthStateChanged;
    }, [setUser]);

    // Decide which stack to show based on user authentication status
    const getTabScreen = () => {
        console.log('user object', user)
        if (isLoading) {
            return null; // You might want to show a loading indicator here
        }

        //const isNotParent = user.userRoles.find()
       
        return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                }}
            >
                <Tab.Screen name="Home" component={AppStack} options={{
                    tabBarLabel: 'HOME',
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({ focused }) => (
                        <Icon name={focused ? "home" : "home-outline"} color={focused ? Colors.brandBlue :  Colors.mediumGray} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen name="Homework" component={user ? HomeWorkScreen : AuthStack} options={{
                    tabBarLabel: 'Homework',
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={focused ? "book" : "book-outline"} color={focused ? Colors.brandBlue :  Colors.mediumGray} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                 <Tab.Screen name="Post" component={user ? CreatePostScreen : AuthStack} options={{
                    tabBarLabel: 'Post',
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={focused ? "plus-circle" : "plus-circle-outline"} color={focused ? Colors.brandBlue :  Colors.mediumGray} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen name="Calendar" component={user ? CalendarScreen : AuthStack} options={{
                    tabBarLabel: 'Calendar',
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={focused ? "calendar" : "calendar-outline"} color={focused ? Colors.brandBlue :  Colors.mediumGray} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen name="More"
                    children={() => <MoreAppStack user={user} />}
                options={{
                    tabBarLabel: 'MORE',
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={"dots-horizontal" } color={focused ? Colors.brandBlue :  Colors.mediumGray} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
            </Tab.Navigator>
        );
    };
    const styles = StyleSheet.create({
        orderIcon: {
            marginRight: 0
          },
    })
    return getTabScreen()
};
