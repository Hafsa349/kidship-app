import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';

import React, { useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { auth } from '../config';
import { AuthStack } from '../navigation';
export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      authenticatedUser => {
        setUser(authenticatedUser);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [setUser]);

  return (
    <NavigationContainer>
      {user && user.emailVerified ? (
        <TabNavigator />
      ) : <AuthStack />}

    </NavigationContainer>
  );
};
