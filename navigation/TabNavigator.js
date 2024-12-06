//TabNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { StyleSheet } from 'react-native';

import { AuthenticatedUserContext } from '../providers';
import { Colors, auth } from '../config';
import { allowedEditingRoles } from '../utils/constants';
import { Icon } from '../components';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AuthStack, AppStack, ProfileStack } from '.';
import { CalendarScreen, CreatePostScreen, HomeWorkScreen, ReportScreen } from '../screens';
import { fetchUserDetails } from '../services';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();
export const TabNavigator = () => {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetail, setUserDetail] = useState({});

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

    useEffect(() => {
        const fetchUserData = async () => {
            console.log(user)
            const validUser = user && user.emailVerified && user.uid;
            if (validUser) {
                try {
                    const userDetails = await fetchUserDetails(user.uid);
                    setUserDetail(userDetails);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const refreshUserDetail = async () => {
        if (user?.uid) {
            try {
                const userDetails = await fetchUserDetails(user.uid); // Fetch updated details from Firestore
                setUserDetail(userDetails); // Update state
            } catch (error) {
                console.error('Error refreshing user details:', error);
            }
        }
    };

    // Decide which stack to show based on user authentication status
    const getTabScreen = () => {
        console.log(' userDetail object', userDetail)
        if (isLoading) {
            return null; // You might want to show a loading indicator here
        }

        const allowEditing = userDetail?.userRoles?.some(role => allowedEditingRoles.includes(role)) || false;
        console.log('allowEditing', allowedEditingRoles, allowEditing)

        return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: true,
                    headerTintColor: Colors.brandYellow,
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarShowLabel: false,

                }}
            >
                <Tab.Screen name="Home" component={AppStack} options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarActiveTintColor: Colors.mediumGray,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} color={focused ? Colors.brandBlue : Colors.mediumGray} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen
                    name="Child Progress"
                    children={({ navigation }) => (
                        <ReportScreen
                            navigation={navigation}
                            allowEditing={allowEditing}
                            user={user}
                            userDetail={userDetail}
                        />
                    )}
                    options={{
                        headerShown: true,

                        tabBarLabel: 'Child Progress',
                        tabBarActiveTintColor: Colors.mediumGray,
                        tabBarInactiveTintColor: Colors.mediumGray,
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "book" : "book-outline"}
                                color={focused ? Colors.brandBlue : Colors.mediumGray}
                                size={28}
                                style={{ marginRight: 0 }}
                            />
                        ),
                    }}
                />


                {allowEditing &&
                    <Tab.Screen
                        name="Create Post"
                        component={user ? CreatePostScreen : AuthStack}
                        options={{
                            tabBarLabel: 'Post',
                            tabBarActiveTintColor: Colors.mediumGray,
                            tabBarInactiveTintColor: Colors.mediumGray,
                            tabBarIcon: ({ focused }) => (
                                <Icon name={focused ? "plus-circle" : "plus-circle-outline"} color={focused ? Colors.brandBlue : Colors.mediumGray} size={28}
                                    style={{ marginRight: 0 }} />
                            ),
                        }} />
                }
                <Tab.Screen
                    name="Events"
                    children={({ navigation }) => (
                        <CalendarScreen navigation={navigation} allowEditing={allowEditing} />
                    )}
                    options={{
                        tabBarLabel: 'Calendar',
                        tabBarActiveTintColor: Colors.mediumGray,
                        tabBarInactiveTintColor: Colors.mediumGray,
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name={focused ? "calendar" : "calendar-outline"} color={focused ? Colors.brandBlue : Colors.mediumGray} size={28}
                                style={{ marginRight: 0 }} />
                        ),
                    }} />
                <Tab.Screen
                    name="Profile"
                    children={(props) => (
                        <ProfileStack
                            {...props}
                            user={user}
                            userDetail={userDetail}
                            refreshUserDetail={refreshUserDetail}
                            allowEditing={allowEditing}

                        />
                    )}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? 'person-circle' : 'person-circle-outline'}
                                color={focused ? Colors.brandBlue : Colors.mediumGray}
                                size={28}
                            />
                        ),
                    }}
                />

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
