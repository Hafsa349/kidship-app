import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Colors, auth } from '../config';
import { HeaderComponent } from '../components';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext, SchoolContext } from '../providers';
import { fetchUserDetailsByIds, fetchUserDetails, getPosts, toggleLike, getLikes, getComments } from '../services';
import { formatDateToDays } from '../utils';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Single loading state
  const [likeLoading, setLikeLoading] = useState({});
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { schoolDetail, setSchoolDetail } = useContext(SchoolContext);
  const [userDetail, setUserDetail] = useState({});
  const [schoolId, setSchoolId] = useState('');
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  // Fetch user details and populate schoolId
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('User object:', user); // Debugging
      if (user && user.uid) {
        try {
          const userDetails = await fetchUserDetails(user.uid);
          setSchoolId(userDetails.schoolId);
          setSchoolDetail(userDetails.schoolId);
          setUserDetail(userDetails);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Fetch posts based on schoolId
  const fetchPosts = useCallback(async () => {
    if (!schoolId) {
      console.log('No schoolId available yet.');
      return;
    }

    setLoading(true); // Start loading indicator
    setRefreshing(true); // Start refreshing indicator

    try {
      const postData = await getPosts(schoolId);
      if (!postData || postData.length === 0) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const userIds = postData.map(post => post.authorId).filter(Boolean);
      const uniqueUserIds = [...new Set(userIds)];
      const authorDetailsArray = uniqueUserIds.length > 0 ? await fetchUserDetailsByIds(uniqueUserIds) : [];
      const authorDetailsMap = Object.fromEntries(
        authorDetailsArray.map(user => [user.uid, user])
      );

      const postsWithDetails = await Promise.all(postData.map(async (post) => {
        const postLikes = await getLikes(post.id);
        const postComments = await getComments(post.id);

        return {
          ...post,
          likes: postLikes.length,
          isLiked: postLikes.includes(user.uid),
          commentsCount: postComments.length,
          authorDetails: authorDetailsMap[post.authorId] || {
            name: 'Unknown',
            image_url: 'unknown',
          },
        };
      }));

      const sortedPosts = postsWithDetails.sort((a, b) => {
        const dateA = a.createdAt?.seconds * 1000 + a.createdAt?.nanoseconds / 1000000;
        const dateB = b.createdAt?.seconds * 1000 + b.createdAt?.nanoseconds / 1000000;
        return dateB - dateA;
      });

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts or user details:', error);
    }

    setLoading(false); // Stop loading indicator
    setRefreshing(false); // Stop refreshing indicator
  }, [schoolId, user.uid]);

  // Trigger fetchPosts whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  // Handle like toggling
  const handleLike = async (postId) => {
    try {
      setLikeLoading(prev => ({ ...prev, [postId]: true }));
      const postIndex = posts.findIndex(post => post.id === postId);
      const isCurrentlyLiked = posts[postIndex].isLiked;

      await toggleLike(postId, user.uid, isCurrentlyLiked);

      const updatedLikes = await getLikes(postId);

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: updatedLikes.length, isLiked: !isCurrentlyLiked }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Function to get initials from name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  const renderPost = ({ item }) => {
    const displayName = `${item.authorDetails?.firstName || ''}`.trim();
    const createdAt = formatDateToDays(item.createdAt);

    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => navigation.navigate('PostDetailScreen', { post: item, uid: user.uid })}
      >
        {displayName && (
          <View style={styles.postHeader}>
            <View style={styles.avatarContainer}>
              {item.authorDetails?.image_url ? (
                <Image
                  source={{ uri: item.authorDetails.image_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>
                    {getInitials(item.authorDetails?.firstName, item.authorDetails?.lastName)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.authorName}>{displayName}</Text>
              <Text style={styles.createdAt}>{createdAt}</Text>
            </View>
          </View>
        )}
        <Image source={{ uri: item.image_url }} style={styles.postImage} />
        <View style={styles.interactionContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likesContainer}>
            {likeLoading[item.id] ? (
              <ActivityIndicator size="small" color={Colors.orange} />
            ) : (
              <Icon
                name={item.isLiked ? "heart" : "heart-outline"}
                size={16}
                color={Colors.brandYellow}
              />
            )}
            <Text style={styles.likes}>{item.likes} {item.likes === 1 ? 'like' : 'likes'}</Text>
          </TouchableOpacity>
          <View style={styles.commentsContainer}>
            <Icon name="chatbubble-outline" size={20} color={Colors.primary} />
            <Text style={styles.comments}>{item.commentsCount} {item.commentsCount === 1 ? 'comment' : 'comments'}</Text>
          </View>
        </View>
        <Text style={styles.postText}>
          {item.text.length > 250 ? item.text.slice(0, 250) + '...' : item.text}
        </Text>
        <Text style={styles.postTime}>{item.timeAgo}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeaderComponent title="" navigation={navigation} />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshing={refreshing} // Display the pull-to-refresh indicator
        onRefresh={fetchPosts} // Trigger the fetchPosts function on pull-to-refresh
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.noPosts}>
              <Text style={styles.comments}>No posts found</Text>
            </View>
          ) : null
        }
      />

      {(loading || refreshing) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
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
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: 'bold',
  },
  createdAt: {
    fontSize: 14,
    color: Colors.grey,
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
  noPosts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

export default HomeScreen;
