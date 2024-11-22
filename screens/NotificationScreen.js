import React from 'react';
import { Button, Text } from 'react-native';
import { HeaderComponent } from '../components';

export const NotificationScreen = ({ navigation }) => {

    return (
        <>
                 <Button title="Go Back" onPress={() => navigation.goBack()} // Navigate to Home
      />
        </>
    )
};