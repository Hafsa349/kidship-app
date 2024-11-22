import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, View, Text, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; // Assuming the correct path for your firebase config
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

export const NewConversationScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]); // State to store the users data
  const currentUser = getAuth().currentUser; // Get the current user
  const currentUserId = currentUser?.uid; // Use the UID of the current user for comparison

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Assuming 'id' is Firestore's document ID (this should match user UID if you are using the UID as the document ID)
          ...doc.data(), // Get the document data
        }));

        // Filter out the current user based on their UID
        const filteredUsers = usersData.filter(user => user.id !== currentUserId);

        // Sort users by firstName and lastName in ascending order
        const sortedUsers = filteredUsers.sort((a, b) => {
          if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
            return -1;
          }
          if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
            return 1;
          }
          // If first names are the same, compare last names
          if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) {
            return -1;
          }
          if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) {
            return 1;
          }
          return 0;
        });

        setUsers(sortedUsers); // Set the sorted users data to state
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      }
    };

    fetchUsers(); // Call the fetch function when the component mounts
  }, [currentUserId]); // Re-run the effect if the current user changes

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
        data={users} // Use the users state (sorted)
        keyExtractor={(item) => item.id} // Using the Firestore document ID (which should match user UID)
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
