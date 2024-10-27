import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Colors, auth } from '../config';
import { HeaderComponent } from '../components';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { fetchUserDetails, getPosts } from '../services';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPosts();
        console.log(postData)
        setPosts(postData);
      } catch (error) {
        console.error('Error fetching posts:', error);
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userDetails = await fetchUserDetails(user.uid);
          setUserDetail(userDetails);
          const authUser = {
            ...authenticatedUser,
            userDetails: userDetails
          }
          console.log('authUser details', authUser);
          setUser(authUser);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.authorAvatar }} // Assuming there's an avatar URL for the author
          style={styles.avatar}
        />
        <View>
          <Text style={styles.authorName}>{item.authorName}</Text>
          <Text style={styles.postTime}>{item.timeAgo}</Text>
        </View>
      </View>
      <View style={styles.postContent}>
        {/* Assuming the post has an image or text */}
        <Image source={{ uri: item.image }} style={styles.postImage} />
        <Text style={styles.postText}>{item.text}</Text>
      </View>
      {/* <View style={styles.postActions}>
        <Text style={styles.likes}>{item.likes} likes</Text>
        <Text style={styles.comments}>{item.comments} comments</Text>
      </View> */}
    </View>
  );

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
      <HeaderComponent navigation={navigation} />
      <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id} // Assuming each post has a unique id
        contentContainerStyle={styles.container}
      />
      </View>
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
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    fontSize: 12,
    color: Colors.grey,
  },
  postContent: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postText: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likes: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
  comments: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
});

export default HomeScreen;
