import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HeaderComponent } from '../components';
import { TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export const TermsAndConditionScreen = ({ navigation }) => {
    const handleBack = () => {
        navigation.goBack(); // Navigate to the previous screen
    }; 

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="pluscircle" size={32} color="#f5b22d" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.content}>
                <Text>Terms and Conditions Screen</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backButton: {
        marginRight: 16,
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#136f5f', // Use your preferred green color
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
});