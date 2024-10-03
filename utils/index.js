import * as Yup from 'yup';

const phoneRegExp = /^(?:(\+?61)? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})|(04\d{8})|(?:\+?61 ?)?(?:\((?=.*\)))? ?0?4 ?\d{2}(?: ?\d{2}){3})$/

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});


export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match password.')
    .required('Confirm Password is required.'),
  firstName: Yup.string().required().min(3).label('First Name'),
  lastName: Yup.string().required().min(3).label('Last Name'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Invalid Australian Phone number, eg: 04XXXXXXXXX')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .label('Email')
    .email('Enter a valid email')
});
