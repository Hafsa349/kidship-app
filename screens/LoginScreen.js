import React, { useState } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, Button, FormErrorMessage, HeaderComponent } from '../components';
import { Colors, Images, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';
import { Logo } from '../components/Logo';


export const LoginScreen = ({ route, navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [loading, setLoading] = useState(false);
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();
  const { navigateBackTo } = route;

  const handleLogin = async values => {
    setLoading(true); // Start loading
    try {
      const { email, password } = values;
      const result = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate(navigateBackTo ? navigateBackTo : "HomeScreen");
    } catch (error) {
      setErrorState("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.topContainer}>
          <Logo uri={Images.logoLong} width={220} height={87} />
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.screenTitle}>Log in to KidShip</Text>
          </View>
          <Formik
            initialValues={{
              email: 'hafsa123@gmail.com',
              password: 'hafsa123'
            }}
            validationSchema={loginValidationSchema}
            onSubmit={values => handleLogin(values)}
          >
            {({ handleSubmit, values, touched, errors, handleChange, handleBlur }) => (
              <>
                <TextInput
                  name='email'
                  leftIconName='email'
                  placeholder='Enter email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  autoFocus={true}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='Enter password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='password'
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {errorState !== '' && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}
                <Button
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.black} />
                  ) : (
                    <Text style={styles.buttonText}>{'Login'}</Text>
                  )}
                </Button>
              </>
            )}
          </Formik>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Forgot Password?'}
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            disabled={loading} // Disable during loading
          />
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Do not have account?'}
            onPress={() => navigation.navigate('SignupScreen')}
            disabled={loading} // Disable during loading
          />

        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.brandBlue,
    paddingHorizontal: 20
  },
  topContainer: {
    alignItems: 'flex-start',
    paddingVertical: 40
  },
  innerContainer: {
    alignItems: 'flex-start',
    paddingBottom: 20
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    paddingTop: 0
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
    justifyContent: 'center',
    paddingBottom: 10,
  }
});

export default LoginScreen;
