import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../config';
import { HeaderComponent, Button } from '../components';
import { signOut } from 'firebase/auth';
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
export const MoreScreen = ({ navigation }) => {
    const { user, setUser } = useContext(AuthenticatedUserContext);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            authenticatedUser => {
                setUser(authenticatedUser);
            }
        );
        // unsubscribe auth listener on unmount
        return unsubscribeAuthStateChanged;
    }, [setUser]);

    let settingsList = [
        { name: user ? "My Account" : "Sign in or create an account", screen: user ? "MyAccountScreen" : "LoginScreen"},
        { name: "Terms and Conditions", screen: "TermsAndConditionScreen" },
        { name: "Privacy Policy", screen: "PrivacyPolicyScreen" },
    ];

    if(user){
        settingsList.push({ name: "My Orders", screen: "OrderHistoryScreen" });
    }


    const handleSignOut = async () => {
        Alert.alert(
            'Confirm Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.navigate('HomeScreen');
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            ]
        );
    };

    const navigateToScreen = (screen) => {
        navigation.navigate(screen, { navigationTo: 'goBack' });
    };

    return (
        <>
            <HeaderComponent navigation={navigation} />
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {settingsList.map((setting, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.settingItemContainer}
                            onPress={() => navigateToScreen(setting.screen)}
                        >
                            <Text style={styles.settingItemText}>{setting.name}</Text>
                            <Text style={styles.arrow}>{">"}</Text>
                        </TouchableOpacity>
                    ))}
                    {user && (
                        <View style={styles.signOutSection}>
                            <Button style={styles.button} onPress={handleSignOut}>
                                <Text style={styles.buttonText}>Sign Out</Text>
                            </Button>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        zIndex: -1,
    },
    scrollContent: {
        flexGrow: 1,
        marginTop: 20
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: Colors.brandBlue,
        padding: 10,
        borderRadius: 8
    },
    buttonText: {
        fontSize: 20,
        color: Colors.black,
        fontWeight: '700'
    },
    settingItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
    },
    settingItemText: {
        fontSize: 18,
        color: Colors.black,
    },
    arrow: {
        fontSize: 18,
        color: Colors.darkGrey,
    },

    signOutSection: {
        padding: 20
    },
});
