import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const HomeWorkScreen = ({ navigation }) => {

    return (
        <>
            <HeaderComponent title="Homework" />
            <Text>{"Homework"}</Text>
        </>
    )
};