import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // Assuming the correct path for your firebase config

export const NewChatScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]); // State to store the users data
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users for search
  const [searchQuery, setSearchQuery] = useState(''); // State to track search input
  const currentUser = auth.currentUser; // Get the current user

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
        const filteredUsers = usersData.filter(user => user.id !== currentUser.uid);

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
        setFilteredUsers(sortedUsers); // Set the filtered users (initially the same as all users)
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      }
    };

    fetchUsers(); // Call the fetch function when the component mounts
  }, [currentUser.uid]); // Re-run the effect if the current user changes

  // Fallback avatar URL
  const getAvatarUrl = (avatar) => {
    return avatar || 'https://media.istockphoto.com/id/666545204/vector/default-placeholder-profile-icon.jpg?s=612x612&w=0&k=20&c=UGYk-MX0pFWUZOr5hloXDREB6vfCqsyS7SgbQ1-heY8=';
  };

  // Filter users based on search query
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text) {
      const filtered = users.filter(user =>
        user.firstName.toLowerCase().includes(text.toLowerCase()) ||
        user.lastName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered); // Update filtered users
    } else {
      setFilteredUsers(users); // If search is cleared, show all users
    }
  };

  const RenderNewConversationItem = ({ item, noBorder }) => (
    <TouchableOpacity
      style={[styles.container, noBorder ? {} : styles.borderBottom]}
      onPress={() => navigation.navigate('ChatRoomScreen', { item: item })}   >
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
    <View style={styles.screenContainer}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="To:"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Users List */}
      <FlatList
        data={filteredUsers} // Use the filtered users state
        keyExtractor={(item) => item.id} // Using the Firestore document ID (which should match user UID)
        renderItem={({ item, index }) => (
          <RenderNewConversationItem
            item={item}
            index={index}
            noBorder={index + 1 === filteredUsers.length} // Pass the noBorder prop
          />
        )}
        style={styles.flatList} // Style the FlatList to handle layout correctly
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  flatList: {
    flex: 1,
  },
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
