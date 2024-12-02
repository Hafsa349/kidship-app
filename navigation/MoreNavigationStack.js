//MoreNavigationStack.js
import { LocationScreen, MyAccountScreen, LoginScreen, MoreScreen, PrivacyPolicyScreen, TermsAndConditionScreen } from '../screens';
import React, {  } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();


export const MoreAppStack = () => {

    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen component={MoreScreen} name="MoreScreen" />
            <Screen component={MyAccountScreen} name="MyAccountScreen" />
            <Screen component={LoginScreen} name="LoginScreen" />
            <Screen component={PrivacyPolicyScreen} name="PrivacyPolicyScreen" />
            <Screen component={TermsAndConditionScreen} name="TermsAndConditionScreen" />
        </Navigator>
    );
}