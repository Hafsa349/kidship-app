import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Colors, auth } from '../config';
import { HeaderComponent } from '../components';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { fetchUserDetailsByIds, getPosts } from '../services';
import { formatDateToDays } from '../utils';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postData = await getPosts();

        // Collect unique author IDs
        const userIds = postData.map(post => post.authorId).filter(id => id);
        const uniqueUserIds = [...new Set(userIds)]; // Remove duplicates

        // Fetch author details in bulk
        const authorDetailsArray = await fetchUserDetailsByIds(uniqueUserIds);

        // Create a map for quick lookup by author ID
        const authorDetailsMap = Object.fromEntries(
          authorDetailsArray.map(user => [user.uid, user])
        );

        // Attach author details to each post
        const postsWithAuthorDetails = postData.map(post => ({
          ...post,
          authorDetails: authorDetailsMap[post.authorId] || {
            name: 'Unknown',
            image_url: 'unknown', // Default avatar
          },
        }));

        // Sort posts based on createdAt date in descending order
        const sortedPosts = postsWithAuthorDetails.sort((a, b) => {
          const dateA = a.createdAt?.seconds * 1000 + a.createdAt?.nanoseconds / 1000000; // Convert Firestore timestamp to milliseconds
          const dateB = b.createdAt?.seconds * 1000 + b.createdAt?.nanoseconds / 1000000; // Convert Firestore timestamp to milliseconds
          return dateB - dateA; // Descending order
        });

        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts or user details:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  const renderPost = ({ item }) => {
    const displayName = `${item.authorDetails?.firstName || ''}`.trim();
    const createdAt = formatDateToDays(item.createdAt);

    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => navigation.navigate('PostDetailScreen', { post: item })} // Navigate to DetailScreen
      >
        {displayName && (
          <View style={styles.postHeader}>
            <Image
              source={{ uri: item.authorDetails?.image_url || 'https://path/to/dummy-avatar.png' }}
              style={styles.avatar}
            />
            <View style={styles.headerContent}>
              <Text style={styles.authorName}>{displayName}</Text>
              <Text style={styles.createdAt}>{createdAt}</Text> 
            </View>
          </View>
        )}
        <Image source={{ uri: item.image_url }} style={styles.postImage} />
        <View style={styles.interactionContainer}>
          <View style={styles.likesContainer}>
            <Icon name="heart" size={16} color={Colors.primary} />
            <Text style={styles.likes}>{item.likes} likes</Text>
          </View>
          <View style={styles.commentsContainer}>
            <Icon name="chatbubble-outline" size={16} color={Colors.primary} />
            <Text style={styles.comments}>{item.comments ? item.comments.length : 0} comments</Text>
          </View>
        </View>
        <Text style={styles.postText}>
          {item.text.length > 250 ? item.text.slice(0, 250) + '...' : item.text}
        </Text>
        <Text style={styles.postTime}>{item.timeAgo}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <>
        <HeaderComponent navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <HeaderComponent title="" navigation={navigation} />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  postCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between', // Space between avatar and header content
  },
  headerContent: {
    flex: 1, // Allow it to take remaining space
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  createdAt: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: 'left', // Align text to the right
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginVertical: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    fontSize: 14,
    color: Colors.darkGrey,
    marginLeft: 5,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comments: {
    fontSize: 14,
    color: Colors.darkGrey,
    marginLeft: 5,
  },
  postText: {
    fontSize: 14,
    color: Colors.darkGrey,
    marginVertical: 10,
  },
  postTime: {
    fontSize: 12,
    color: Colors.grey,
  },
});

export default HomeScreen;
