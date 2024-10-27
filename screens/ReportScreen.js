import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const ReportScreen = ({ navigation }) => {

    return (
        <>
            <HeaderComponent navigation={navigation} title="ReportScreen" navigationTo="back" />
            <Text>{"ReportScreen"}</Text>
        </>
    )
};