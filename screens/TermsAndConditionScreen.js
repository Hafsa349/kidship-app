import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const TermsAndConditionScreen = ({ navigation }) => {

    return (
        <>
            <HeaderComponent navigation={navigation} title="T's & C's" navigationTo="back"  />
            <Text>{"TermsAndConditionScreen"}</Text>
        </>
    )
};