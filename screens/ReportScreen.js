import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import { HeaderComponent } from '../components';

export const ReportScreen = ({ navigation }) => {

    return (
        <>
            {/* <HeaderComponent title="Reports" navigation={navigation} navigationTo="back" /> */}
            <SafeAreaView style={{flex: 1}}>
            <Text>{"Reports"}</Text>
            </SafeAreaView>
        </>
    )
};