import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, View, Text, FlatList, TextInput, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const NewChatScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = auth.currentUser;

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => user.id !== currentUser?.uid);

      const sortedUsers = usersList.sort((a, b) => {
        if (a.firstName.toLowerCase() === b.firstName.toLowerCase()) {
          return a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
        }
        return a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase());
      });

      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again later.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);

    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const getAvatarUrl = (avatar) => {
    return avatar
      ? { uri: avatar }
      : require('../assets/images/profile-default.jpg'); // Path to your local placeholder image
  };

  const RenderNewConversationItem = ({ item, noBorder }) => (
    <TouchableOpacity
      style={[styles.container, noBorder ? {} : styles.borderBottom]}
      onPress={() => navigation.navigate('ChatRoomScreen', { item })}
    >
      <Image
        source={getAvatarUrl(item?.avatar)}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {item?.firstName} {item?.lastName}
        </Text>
        <Text style={styles.emailText}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <RenderNewConversationItem
            item={item}
            noBorder={index + 1 === filteredUsers.length}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found.</Text>
          </View>
        }
        style={styles.flatList}
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
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default NewChatScreen;
