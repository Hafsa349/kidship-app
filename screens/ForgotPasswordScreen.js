import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';

import { passwordResetSchema } from '../utils';
import { Colors, auth, Images } from '../config';
import { View, TextInput, Button, FormErrorMessage , HeaderComponent} from '../components';
import { Logo } from '../components/Logo';


export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const handleSendPasswordResetEmail = values => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Success: Password Reset Email sent.');
        navigation.navigate('LoginScreen');
      })
      .catch(error => setErrorState(error.message));
  };

  return (
    <>
    {/* <HeaderComponent navigationTo={"Login"} navigation={navigation} title={"Reset your password"} /> */}
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
                        <View style={styles.topContainer}>
                            <Logo uri={Images.logoLong} width={220} height={87} />
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.screenTitle}>Forgot your password?</Text>
                        </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={values => handleSendPasswordResetEmail(values)}
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
            {/* Email input field */}
            <TextInput
              name='email'
              leftIconName='email'
              placeholder='Enter email'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
            {/* Display Screen Error Mesages */}
            {errorState !== '' ? (
              <FormErrorMessage error={errorState} visible={true} />
            ) : null}
            {/* Password Reset Send Email  button */}
            <Button style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </Button>
          </>
        )}
      </Formik>
      <Button
                                        style={styles.borderlessButtonContainer}
                                        borderless
                                        title={'Remember your password?'}
                                        onPress={() => navigation.navigate('LoginScreen')}
                                    />
    </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: 20,
},
topContainer: {
    alignItems: 'flex-start',
},
innerContainer: {
    alignItems: 'flex-start',
    paddingBottom: 20
},
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.brandYellow,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row' // Align content horizontally
},
buttonText: {
    fontSize: 18,
    color: Colors.brandBlue,
    fontWeight: '700'
},
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
