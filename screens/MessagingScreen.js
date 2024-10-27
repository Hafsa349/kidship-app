import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const MessagingScreen = ({ navigation }) => {

    return (
        <>
            <HeaderComponent navigation={navigation} title="Messages" navigationTo="back" />
            <Text>{"Messages"}</Text>
        </>
    )
};