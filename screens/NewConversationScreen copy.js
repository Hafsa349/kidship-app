import React from 'react';
import { Image, TouchableOpacity, StyleSheet, View, Text, FlatList } from 'react-native';

const users = [
  {
    id: '1',
    firstName: 'Charlie',
    lastName: 'Brown',
    avatar: '', // No avatar
    email: 'charlie@brown.com'
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Smith',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww',
    email: 'alice@smith.com'
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Thomas',
    avatar: 'https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww',
    email: 'bob@thomas.com'
  },

  // Add more contacts here
];

export const NewConversationScreen = ({ navigation }) => {

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
        data={users}
        keyExtractor={(item) => item.id.toString()} // Assuming item.id is a unique value
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
