import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../config';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from 'firebase/auth';

export const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [displayName, setDisplayName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(''); // Format: YYYY-MM-DD

    // Add a return button to the header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.brandBlue} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleSave = async () => {
        if (!displayName || !phoneNumber || !dateOfBirth) {
            Alert.alert('Error', 'Please fill all the fields.');
            return;
        }

        try {
            await updateProfile(auth.currentUser, {
                displayName,
            });
            Alert.alert('Success', 'Profile updated successfully.');
            navigation.goBack(); // Navigate back after saving
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={displayName}
                onChangeText={setDisplayName}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.black,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: Colors.lightGrey,
    },
    saveButton: {
        backgroundColor: Colors.brandYellow,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.brandBlue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerButton: {
        marginLeft: 10,
    },
});
