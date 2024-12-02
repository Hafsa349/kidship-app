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
  //schoolName: Yup.string().required().label('School Name1'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Invalid Australian Phone number, eg: 04XXXXXXXXX')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .label('Email')
    .email('Enter a valid email')
});

export const convertFirestoreTimestampToDate = (timestamp) => {
  if (!timestamp || typeof timestamp !== 'object') return null;

  const { seconds, nanoseconds } = timestamp;
  return new Date(seconds * 1000 + Math.floor(nanoseconds / 1000000));
};
export const formatDateToDays = (timestamp) => {
  const date = convertFirestoreTimestampToDate(timestamp);

  if (!date) {
    return 'Invalid date'; // Handle null or invalid timestamps
  }

  const now = new Date();
  const timeDiff = now - date;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const oneWeek = 7 * oneDay;

  if (timeDiff < oneDay) {
    return 'Today';
  } else if (timeDiff < oneWeek) {
    return `${Math.floor(timeDiff / oneDay)} days ago`;
  } else if (timeDiff < 2 * oneWeek) {
    return '1 week ago';
  } else {
    const weeksAgo = Math.floor(timeDiff / oneWeek);
    return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`; // pluralize for more than 1 week
  }
};
