import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const NotificationScreen = ({ navigation }) => {

    return (
        <>
                 <HeaderComponent title="Notifications"  navigation={navigation} navigationTo="back"/>
                 <Text>{"NotificationScreen"}</Text>
        </>
    )
};