import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, connectAuthEmulator, getReactNativePersistence, initializeAuth } from 'firebase/auth'; // Import necessary auth functions
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { expoConfig } = Constants;
// Initialize Firebase app
const firebaseConfig = {
  apiKey: expoConfig.extra.apiKey,
  authDomain: expoConfig.extra.authDomain,
  projectId: expoConfig.extra.projectId,
  storageBucket: expoConfig.extra.storageBucket,
  messagingSenderId: expoConfig.extra.messagingSenderId,
  appId: expoConfig.extra.appId,
};
// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(firebaseApp);
console.log('Firestore initialized:', db);
// Initialize Storage
const storage = getStorage(firebaseApp);

// Initialize Auth with React Native Persistence
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
console.log('Auth initialized with persistence');

// If you are using authentication emulator, connect it here
// connectAuthEmulator(auth, 'http://localhost:9099');

// Set up authentication persistence manually (React Native doesn't support Firestore persistence out of the box)
auth.setPersistence(getReactNativePersistence(AsyncStorage))
  .then(() => console.log('Authentication persistence set successfully'))
  .catch(error => console.error('Error setting authentication persistence:', error));

export { auth, db, expoConfig, storage };
