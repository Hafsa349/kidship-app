import React from 'react';
import { Button, Text } from 'react-native';

export const NotificationScreen = ({ navigation }) => {

    return (
        <>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </>
    )
};