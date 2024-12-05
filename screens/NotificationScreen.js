import React, { useEffect, useState } from 'react';
import { Button, Text, View, FlatList } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

// Request user permissions for notifications
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

// Save notification to Firestore
const saveNotificationToHistory = async notification => {
  try {
    await firestore().collection('notificationHistory').add({
      title: notification.notification.title,
      body: notification.notification.body,
      data: notification.data,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    console.log('Notification saved to history');
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

// NotificationScreen Component
const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission on mount
    requestUserPermission();

    // Get FCM token
    messaging()
      .getToken()
      .then(token => {
        console.log('Device Token:', token);
      });

    // Handle foreground notifications
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      saveNotificationToHistory(remoteMessage);
    });

    // Handle background notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification:', remoteMessage);
      saveNotificationToHistory(remoteMessage);
    });

    // Fetch notifications from Firestore
    const unsubscribeFirestore = firestore()
      .collection('notificationHistory')
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        const notificationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeFirestore();
    };
  }, []);

  // Render a single notification
  const renderNotification = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.body}</Text>
      <Text style={{ fontSize: 10, color: 'gray' }}>
        {item.timestamp?.toDate().toString() || 'N/A'}
      </Text>
    </View>
  );

  // Main UI
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
      />
    </View>
  );
};

export default NotificationScreen;
