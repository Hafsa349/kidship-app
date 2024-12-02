import React, { useState } from 'react';
import { Text, StyleSheet, Alert, SafeAreaView, FlatList, View, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification } from 'firebase/auth';
import { TextInput, FormErrorMessage, Button } from '../components';
import { Colors, auth, Images } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';
import { fetchUserByPhoneNumber, createUser, fetchSchoolByName } from '../services';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Logo } from '../components';
import Autocomplete from 'react-native-autocomplete-input';

export const SignupScreen = ({ navigation }) => {
    const [errorState, setErrorState] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [schoolSuggestions, setSchoolSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        passwordVisibility,
        handlePasswordVisibility,
        rightIcon,
        handleConfirmPasswordVisibility,
        confirmPasswordIcon,
        confirmPasswordVisibility,
    } = useTogglePasswordVisibility();

    const handleSignup = async (values) => {
        setIsLoading(true); // Show loader
        const { email,password, firstName, lastName, phoneNumber, schoolName } = values;
        try {
            const schoolData = await fetchSchoolByName(schoolName);
            if (!schoolData) {
                showAlert('School not found. Please check the name and try again.');
                setIsLoading(false);
                return;
            }
            const schoolId = schoolData[0]?.uid;

            const emailExists = await fetchSignInMethodsForEmail(auth, email);
            if (emailExists.length > 0) {
                showAlert('Email is already registered.');
                setIsLoading(false);
                return;
            }

            const phoneNumberSnapshot = await fetchUserByPhoneNumber(phoneNumber);
            if (phoneNumberSnapshot) {
                showAlert('Phone number is already registered.');
                setIsLoading(false);
                return;
            }

            console.log(phoneNumberSnapshot);
            console.log(schoolData);
            console.log(schoolId)
             const isEmployee = schoolData.domain === email.split('@')[1];

            const createdAt = new Date().getTime();
            const user = {
                email,
                phoneNumber,
                firstName,
                lastName,
                createdAt,
                dateOfBirth,
                userRoles: [isEmployee ? 'teacher' : 'parent'],
                schoolId: schoolId,
            };

            const result = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(result.user);

            await createUser(result.user.uid, user);
            showAlert('Account has been created successfully! Please verify your email.');
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.log('Error:', error);
            setErrorState(error.message);
        } finally {
            setIsLoading(false); // Hide loader
        }
    };

    const showAlert = (message) => {
        Alert.alert('', message, [{ text: 'OK' }]);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const handleSchoolNameChange = async (text, setFieldValue) => {
        setFieldValue('schoolName', text);
        if (text.length >= 3) {
            const suggestions = await fetchSchoolSuggestions(text);
            setSchoolSuggestions(suggestions);
        } else {
            setSchoolSuggestions([]);
        }
    };

    const handleSchoolSelection = (selectedSchool, setFieldValue) => {
        setFieldValue('schoolName', selectedSchool);
        setSchoolSuggestions([]);
    };

    const fetchSchoolSuggestions = async (query) => {
        try {
            const result = await fetchSchoolByName(query);
            return result ? result.map((school) => school.name) : [];
        } catch (error) {
            console.log('Error fetching school suggestions:', error);
            return [];
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Logo uri={Images.logoLong} width={220} height={87} />
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.screenTitle}>Sign up to KidShip</Text>
                </View>

                <Formik
                    initialValues={{
                        email: 'shazz03+2@gmail.com',
                        password: 'Test1234',
                        confirmPassword: 'Test1234',
                        firstName: 'Test',
                        lastName: 'Hafs',
                        phoneNumber: '0413895030',
                        dateOfBirth: '',
                        schoolName: '',
                    }}
                    validationSchema={signupValidationSchema}
                    onSubmit={(values) => handleSignup(values)}
                >
                    {({
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                        setFieldValue,
                    }) => (
                        <>
                            <Autocomplete
                                data={schoolSuggestions}
                                defaultValue={values.schoolName}
                                onChangeText={(text) => handleSchoolNameChange(text, setFieldValue)}
                                placeholder="Enter School Name"
                                style={styles.autocompleteInput}
                                flatListProps={{
                                    keyExtractor: (_, index) => index.toString(),
                                    renderItem: ({ item }) => (
                                        <Text
                                            style={{ padding: 14, fontSize: 12 }}
                                            onPress={() => handleSchoolSelection(item, setFieldValue)}
                                        >
                                            {item}
                                        </Text>
                                    ),
                                }}
                            />
                            <FormErrorMessage error={errors.schoolName} visible={touched.schoolName} />

                            <TextInput
                                name="email"
                                leftIconName="email"
                                placeholder="Enter email"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoFocus
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                            />
                            <FormErrorMessage error={errors.email} visible={touched.email} />

                            <TextInput
                                name="phoneNumber"
                                leftIconName="phone"
                                placeholder="Enter Phone Number"
                                autoCapitalize="none"
                                keyboardType="phone-pad"
                                textContentType="telephoneNumber"
                                value={values.phoneNumber}
                                onChangeText={handleChange('phoneNumber')}
                                onBlur={handleBlur('phoneNumber')}
                            />
                            <FormErrorMessage error={errors.phoneNumber} visible={touched.phoneNumber} />

                            <TextInput
                                name="password"
                                leftIconName="key-variant"
                                placeholder="Enter Password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={passwordVisibility}
                                textContentType="newPassword"
                                rightIcon={rightIcon}
                                handlePasswordVisibility={handlePasswordVisibility}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                            />
                            <FormErrorMessage error={errors.password} visible={touched.password} />

                            <TextInput
                                name="confirmPassword"
                                leftIconName="key-variant"
                                placeholder="Confirm Password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={confirmPasswordVisibility}
                                textContentType="password"
                                rightIcon={confirmPasswordIcon}
                                handlePasswordVisibility={handleConfirmPasswordVisibility}
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                            />
                            <FormErrorMessage error={errors.confirmPassword} visible={touched.confirmPassword} />

                            <TextInput
                                name="firstName"
                                placeholder="Enter First Name"
                                autoCapitalize="none"
                                value={values.firstName}
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                            />
                            <FormErrorMessage error={errors.firstName} visible={touched.firstName} />

                            <TextInput
                                name="lastName"
                                placeholder="Enter Last Name"
                                autoCapitalize="none"
                                value={values.lastName}
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                            />
                            <FormErrorMessage error={errors.lastName} visible={touched.lastName} />

                            <View>
                                <Button title="Select Date of Birth" onPress={showDatePickerModal} />
                                {showDatePicker && (
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={dateOfBirth}
                                        mode="date"
                                        maximumDate={new Date()}
                                        display="spinner"
                                        onChange={handleDateChange}
                                    />
                                )}
                            </View>

                            {errorState !== '' ? (
                                <FormErrorMessage error={errorState} visible />
                            ) : null}

                            <Button
                                style={styles.button}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color={Colors.brandBlue} />
                                ) : (
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                )}
                            </Button>
                            <Button
                                style={styles.borderlessButtonContainer}
                                borderless
                                title="Have an account already?"
                                onPress={() => navigation.navigate('LoginScreen')}
                            />
                        </>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
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
    },
    screenTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.black,
        paddingTop: 20,
        paddingBottom: 20,
    },
    autocompleteInput: {
        height: 40,
        paddingHorizontal: 10,
        paddingLeft: 14,
        borderRadius: 20,
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: Colors.brandYellow,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 18,
        color: Colors.brandBlue,
        fontWeight: '700',
    },
    borderlessButtonContainer: {
        marginVertical: 5,
        paddingTop: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
