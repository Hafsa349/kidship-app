import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { StyleSheet } from 'react-native';

import { AuthenticatedUserContext } from '../providers';
import { Colors, auth } from '../config';
import { Icon } from '../components';
import { AuthStack, AppStack, MoreAppStack } from '../navigation';

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
                        <Icon name={focused ? "home" : "home-outline"} color={focused ? Colors.yellow :  Colors.mediumGray} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen name="Parents" component={user ? AppStack : AuthStack} options={{
                    tabBarLabel: 'PARENTS',
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={focused ? "wallet" : "wallet-outline"} color={focused ? Colors.yellow :  Colors.mediumGray} size={28}
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
                        <Icon name={"dots-horizontal" } color={focused ? Colors.yellow :  Colors.mediumGray} size={28}
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
