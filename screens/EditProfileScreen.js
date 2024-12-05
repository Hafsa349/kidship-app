import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../config';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { updateUser } from '../services/firebaseUserService';
import { Timestamp } from 'firebase/firestore';

const formatDateToDDMMYYYY = (dateObj) => {
    if (!dateObj) return '';
    const date = new Date(dateObj.seconds * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatDateToFirestore = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
};

export const EditProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const { userDetail } = route.params;

    const [firstName, setFirstName] = useState(userDetail.firstName || '');
    const [lastName, setLastName] = useState(userDetail.lastName || '');
    const [phoneNumber, setPhoneNumber] = useState(userDetail.phoneNumber || '');
    const [dateOfBirth, setDateOfBirth] = useState(
        userDetail.dateOfBirth
            ? formatDateToDDMMYYYY(userDetail.dateOfBirth)
            : ''
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.brandBlue} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const formatDateToFirestore = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-${day}`);
    };

    const handleSave = async () => {
        if (!firstName || !lastName || !phoneNumber || !dateOfBirth) {
            Alert.alert('Error', 'Please fill all the fields.');
            return;
        }
    
        try {
            const updates = {
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth: Timestamp.fromDate(formatDateToFirestore(dateOfBirth)),
            };
    
            await updateUser(userDetail.uid, updates); // Update Firestore
            Alert.alert('Success', 'Profile updated successfully.');
    
            if (typeof route.params.refreshUserDetail === 'function') {
                await route.params.refreshUserDetail(); // Refresh userDetail in TabNavigator
            }
    
            navigation.goBack();
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile.');
        }
    };
    

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
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
                placeholder="Date of Birth (DD-MM-YYYY)"
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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
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
