import React, { useState } from 'react';
import { Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, FormErrorMessage, HeaderComponent, Button } from '../components';
import { Colors, auth, db, Images } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';
import { fetchUserByPhoneNumber, createUser } from '../services';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Logo } from '../components/Logo';

export const SignupScreen = ({ navigation }) => {
    const [errorState, setErrorState] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {
        passwordVisibility,
        handlePasswordVisibility,
        rightIcon,
        handleConfirmPasswordVisibility,
        confirmPasswordIcon,
        confirmPasswordVisibility
    } = useTogglePasswordVisibility();

    const handleSignup = async values => {
        const { email, password, firstName, lastName, phoneNumber } = values;

        try {
            // Check if email is already registered in Firebase Authentication
            const emailExists = await fetchSignInMethodsForEmail(auth, email);
            if (emailExists.length > 0) {
                showAlert('Email is already registered.');
                return; // Stop signup process
            }

            // Check if phone number is already registered in Firebase Users collection
            const phoneNumberSnapshot = await fetchUserByPhoneNumber(phoneNumber);
            if (phoneNumberSnapshot) {
                showAlert('Phone number is already registered.');
                return; // Stop signup process
            }

            // If email and phone number are not already registered, proceed with signup
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const createdAt = new Date().getTime();

            if (result) {
                const user = {
                    email,
                    phoneNumber,
                    firstName,
                    lastName,
                    createdAt,
                    dateOfBirth: dateOfBirth // Assuming dateOfBirth is present in values
                }
                await createUser(result.user.uid, user);
                showAlert('Account has been created successfully');
                navigation.navigate('HomeScreen');
            }
        } catch (error) {
            console.log('error', error);
            setErrorState(error.message);
        }
    };

    const showAlert = message => {
        if (Alert.alert) {
            Alert.alert(message);
        } else {
            console.log(message);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.container}>
                    <KeyboardAwareScrollView enableOnAndroid={true}>
                        <View style={styles.topContainer}>
                            <Logo uri={Images.logoLong} width={220} height={87} />
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.screenTitle}>Sign up to KidShip</Text>
                        </View>

                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                                confirmPassword: '',
                                firstName: '',
                                lastName: '',
                                phoneNumber: '',
                                dateOfBirth: ''
                            }}
                            validationSchema={signupValidationSchema}
                            onSubmit={values => handleSignup(values)}
                        >
                            {({
                                values, touched, errors, handleChange, handleSubmit, handleBlur
                            }) => (
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
                                        onBlur={handleBlur('email')} />
                                    <FormErrorMessage error={errors.email} visible={touched.email} />

                                    <TextInput
                                        name='phoneNumber'
                                        leftIconName='phone'
                                        placeholder='Enter Phone Number'
                                        autoCapitalize='none'
                                        keyboardType='phoneNumber'
                                        textContentType='phoneNumber'
                                        autoFocus={true}
                                        value={values.phoneNumber}
                                        onChangeText={handleChange('phoneNumber')}
                                        onBlur={handleBlur('phoneNumber')} />
                                    <FormErrorMessage error={errors.phoneNumber} visible={touched.phoneNumber} />

                                    <TextInput
                                        name='password'
                                        leftIconName='key-variant'
                                        placeholder='Enter Password'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        secureTextEntry={passwordVisibility}
                                        textContentType='newPassword'
                                        rightIcon={rightIcon}
                                        handlePasswordVisibility={handlePasswordVisibility}
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')} />
                                    <FormErrorMessage
                                        error={errors.password}
                                        visible={touched.password} />

                                    <TextInput
                                        name='confirmPassword'
                                        leftIconName='key-variant'
                                        placeholder='Confirm Password'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        secureTextEntry={confirmPasswordVisibility}
                                        textContentType='password'
                                        rightIcon={confirmPasswordIcon}
                                        handlePasswordVisibility={handleConfirmPasswordVisibility}
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')} />
                                    <FormErrorMessage
                                        error={errors.confirmPassword}
                                        visible={touched.confirmPassword} />

                                    <TextInput
                                        name='firstName'
                                        placeholder='Enter First Name'
                                        autoCapitalize='none'
                                        value={values.firstName}
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')} />
                                    <FormErrorMessage error={errors.firstName} visible={touched.firstName} />

                                    <TextInput
                                        name='lastName'
                                        placeholder='Enter Last Name'
                                        autoCapitalize='none'
                                        value={values.lastName}
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')} />
                                    <FormErrorMessage error={errors.lastName} visible={touched.lastName} />

                                    <View>
                                        <Button title="Select Date of Birth" onPress={showDatePickerModal} />
                                        {showDatePicker && (
                                            <DateTimePicker
                                                testID="datePicker"
                                                value={dateOfBirth}
                                                mode="date"
                                                maximumDate={new Date()} // Set maximum date to today
                                                display="spinner"
                                                onChange={handleDateChange}
                                            />
                                        )}
                                    </View>

                                    {errorState !== '' ? (
                                        <FormErrorMessage error={errorState} visible={true} />
                                    ) : null}

                                    <Button style={styles.button} onPress={handleSubmit}>
                                        <Text style={styles.buttonText}>Sign Up</Text>
                                    </Button>
                                    <Button
                                        style={styles.borderlessButtonContainer}
                                        borderless
                                        title={'Have an account already?'}
                                        onPress={() => navigation.navigate('LoginScreen')}
                                    />
                                </>
                            )}
                        </Formik>
                    </KeyboardAwareScrollView>
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
        justifyContent: 'center',
        paddingBottom: 10,
    }
});