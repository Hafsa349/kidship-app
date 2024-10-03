import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { View, TextInput, Button, FormErrorMessage, HeaderComponent } from '../components';
import { Colors, auth, db } from '../config';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { fetchUserDetails } from '../services';
export const MyAccountScreen = ({ route, navigation }) => {
  const navigationTo = route?.params?.navigationTo;
  const [errorState, setErrorState] = useState('');
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (user && user.uid) {
      fetchUser();
    }
  }, [user]);

  const fetchUser= async () => {
    try {
      console.log('Fetching user details', user.uid);
      const docRef = await fetchUserDetails(user.uid);

      if (docRef) {
        console.log("Document data:", docRef);
        setUserDetail(docRef);
        setLoading(false);
      } else {
        console.log("No such document!");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async values => {
    console.log('values', values);
    try {
      const { firstName, lastName } = values;
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { firstName, lastName }, { merge: true });
      console.log("Document successfully updated!");
      showAlert('Account has been updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      showAlert('Failed to update account details');
    }
  };

  const showAlert = message => {
    if (Alert.alert) {
      Alert.alert(message);
    } else {
      console.log(message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <HeaderComponent navigation={navigation} title="My Account" navigationTo={navigationTo} />
      <View isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <Formik
            initialValues={{
              email: userDetail.email || '',
              firstName: userDetail.firstName || '',
              lastName: userDetail.lastName || '',
              phoneNumber: userDetail.phoneNumber || ''
            }}
            onSubmit={values => handleSubmit(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur
            }) => (
              <>
                <TextInput
                  name='email'
                  editable={false}
                  value={values.email}
                  style={styles.disabledInput} // Apply style for disabled input
                />
                <TextInput
                  name='firstName'
                  placeholder='Enter First Name'
                  autoCapitalize='none'
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                />
                <TextInput
                  name='lastName'
                  placeholder='Enter Last Name'
                  autoCapitalize='none'
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                />
                <TextInput
                  name='phoneNumber'
                  editable={false}
                  value={values.phoneNumber}
                  style={styles.disabledInput} // Apply style for disabled input
                />
                {errorState !== '' ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Save</Text>
                </Button>
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.white,
    padding: 16
  },
  logoContainer: {
    alignItems: 'center'
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.yellow,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.black,
    fontWeight: '700'
  },
  disabledInput: {
  }
});

export default MyAccountScreen;
