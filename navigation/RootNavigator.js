// Inside RootNavigator.js

import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { AuthStack } from '../navigation';
import React, { useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { auth } from '../config';

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      authenticatedUser => {
        setUser(authenticatedUser);
      }
    );

    return unsubscribeAuthStateChanged;
  }, [setUser]);

  return (
    <NavigationContainer>
      {user && user.emailVerified ? (
        <TabNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
