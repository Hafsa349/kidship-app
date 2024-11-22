import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, View, Text, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; // Assuming the correct path for your firebase config

export const NewConversationScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]); // State to store the users data

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Assuming 'id' is Firestore's document ID
          ...doc.data(), // Get the document data
        }));
        setUsers(usersData); // Set the users data to state
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      }
    };

    fetchUsers(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Fallback avatar URL
  const getAvatarUrl = (avatar) => {
    return avatar || 'https://media.istockphoto.com/id/666545204/vector/default-placeholder-profile-icon.jpg?s=612x612&w=0&k=20&c=UGYk-MX0pFWUZOr5hloXDREB6vfCqsyS7SgbQ1-heY8=';
  };

  const RenderNewConversationItem = ({ item, index, noBorder }) => (
    <TouchableOpacity
      style={[styles.container, noBorder ? {} : styles.borderBottom]}
      onPress={() => navigation.navigate('MessageDetailScreen', { contactName: item.firstName + ' ' + item.lastName })}
    >
      <Image
        source={{ uri: getAvatarUrl(item?.avatar) }} // Use the fallback URL
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item?.firstName} {item?.lastName}
          </Text>
        </View>
        <Text style={styles.emailText}>
          {item.email}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={users} // Use the users state
        keyExtractor={(item) => item.id} // Using the Firestore document ID
        renderItem={({ item, index }) => (
          <RenderNewConversationItem
            item={item}
            index={index}
            noBorder={index + 1 === users.length} // Pass the noBorder prop
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff'
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Equivalent to 'neutral-200'
  },
  avatar: {
    width: '20%', // You can adjust the width based on your design
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 50, // Rounded image
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600', // Equivalent to 'font-psemibold'
    color: '#333', // Dark neutral color
    textAlign: 'left',
  },
  emailText: {
    fontSize: 14,
    fontWeight: '400', // Equivalent to 'font-pregular'
    color: '#A0A0A0', // Lighter neutral color
    textAlign: 'left',
  },
});
