import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { Colors } from '../config';
import { signOut } from 'firebase/auth';
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '../components';

export const ProfileScreen = ({ navigation }) => {
    const { user, setUser } = useContext(AuthenticatedUserContext);

    useEffect(() => {
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            (authenticatedUser) => {
                setUser(authenticatedUser);
            }
        );
        return unsubscribeAuthStateChanged;
    }, [setUser]);

    const handleSignOut = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: async () => {
                    try {
                        await signOut(auth);
                        setUser(null); // Reset user
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'LoginScreen' }],
                        });
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ]);
    };

    const navigateToScreen = (screen) => {
        navigation.navigate(screen);
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.displayName
                            ? user.displayName
                                .split(' ')
                                .map((name) => name[0])
                                .join('')
                            : 'Hi'}
                    </Text>
                </View>
                <Text style={styles.nameText}>{user?.displayName || ''}</Text>
                <Text style={styles.emailText}>{user?.email || 'Email Not Available'}</Text>
            </View>

            {/* Options Section */}
            <View style={styles.options}>
                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => navigateToScreen('EditProfileScreen')}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="person-circle-outline" size={24} color={Colors.brandYellow} />
                    </View>
                    <View>
                        <Text style={styles.optionTitle}>Edit Profile</Text>
                        <Text style={styles.optionSubtitle}>Change name, phone number and DOB</Text>
                    </View>
                    <View style={styles.optionForward}>
                        <Ionicons name="chevron-forward" size={24} color={Colors.lightGrey} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => navigateToScreen('ChangePasswordScreen')}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="key-outline" size={24} color={Colors.brandYellow} />
                    </View>
                    <View>
                        <Text style={styles.optionTitle}>Change Password</Text>
                        <Text style={styles.optionSubtitle}>Update and strengthen your password</Text>
                    </View>
                    <View style={styles.optionForward}>
                        <Ionicons name="chevron-forward" size={24} color={Colors.lightGrey} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => navigateToScreen('ViewChildrenScreen')}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="happy-outline" size={24} color={Colors.brandYellow} />
                    </View>
                    <View>
                        <Text style={styles.optionTitle}>View Children</Text>
                        <Text style={styles.optionSubtitle}>
                            Check your children's profiles
                        </Text>
                    </View>
                    <View style={styles.optionForward}>
                        <Ionicons name="chevron-forward" size={24} color={Colors.lightGrey} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => navigateToScreen('ViewChildrenScreen')}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="happy-outline" size={24} color={Colors.brandYellow} />
                    </View>
                    <View>
                        <Text style={styles.optionTitle}>View Students</Text>
                        <Text style={styles.optionSubtitle}>
                            Check your students's profiles
                        </Text>
                    </View>
                    <View style={styles.optionForward}>
                        <Ionicons name="chevron-forward" size={24} color={Colors.lightGrey} />
                    </View>
                </TouchableOpacity>
            </View>


            {/* Sign Out Section */}
            {user && user.emailVerified && (
                <View style={styles.signOutSection}>
                    <Button style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.brandYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 32,
        color: Colors.white,
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
    },
    emailText: {
        fontSize: 14,
        color: Colors.darkGrey,
    },
    options: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
    },
    optionIcon: {
        marginRight: 15,
    },
    optionTitle: {
        fontSize: 16,
        color: Colors.black,
        fontWeight: '500',
    },
    optionSubtitle: {
        fontSize: 14,
        color: Colors.darkGrey,
        fontWeight: '300',
    },
    optionForward: {
        flex: 1,
        alignItems: 'flex-end'
    },
    signOutSection: {
        padding: 20
    },
    signOutButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: Colors.brandYellow,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row' // Align content horizontally
    },
    signOutButtonText: {
        fontSize: 18,
        color: Colors.brandBlue,
        fontWeight: '700'
    },
});
