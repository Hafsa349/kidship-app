import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const ReportScreen = ({ navigation }) => {

    return (
        <>
            <HeaderComponent title="Reports" navigation={navigation} navigationTo="back" />
            <Text>{"Reports"}</Text>
        </>
    )
};