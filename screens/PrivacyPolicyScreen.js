import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const PrivacyPolicyScreen = ({ navigation }) => {

    return (
        <>
            <HeaderComponent navigation={navigation} title="Privacy Policy" navigationTo="back" />
            <Text>{"PrivacyPolicy"}</Text>
        </>
    )
};