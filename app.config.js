import 'dotenv/config';

export default {
  expo: {
    name: 'Kidship',
    slug: 'kidship',
    privacy: 'public',
    platforms: ['ios', 'android'],
    version: '0.0.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      backgroundColor: '#000000'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "au.com.kidship.ios"
    },
    android:{
      package: "au.com.kidship.android"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      firebaseApiUrl: process.env.FIREBASE_API_URL,
      eas: {
        projectId: "3bf459e5-1187-474c-a3c3-5198b85eccb0"
      }
    }
  }
};
