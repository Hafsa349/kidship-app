import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { HeaderComponent } from '../components';
import { Colors } from '../config';
import Icon from 'react-native-vector-icons/Ionicons';
import { toggleLike, addComment, getLikes, getComments, fetchUserDetailsByIds } from '../services'; // Import required services
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore query functions

export const PostDetailScreen = ({ navigation, route }) => {
  const { post, uid } = route.params;
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]); // Initialize comments as an empty array
  const [authorDetailsMap, setAuthorDetailsMap] = useState({});

  // Fetch all comments when the page loads
  const fetchCommentsAndAuthors = async () => {
    try {
      // Fetch comments for the current post
      const fetchedComments = await getComments(post.id);
      console.log(fetchedComments)
      setComments(fetchedComments);

      //Fetch author details for the comments
      const authorIds = fetchedComments.map(comment => comment.authorId);
      const uniqueAuthorIds = [...new Set(authorIds)]; // Get unique author IDs
      const authorDetails = await fetchUserDetailsByIds(uniqueAuthorIds);
      const authorDetailsMap = Object.fromEntries(
        authorDetails.map(user => [user.uid, user]) // Map details by uid
      );
      setAuthorDetailsMap(authorDetailsMap);
    } catch (error) {
      console.error('Error fetching comments and authors:', error);
    }
  };
  useEffect(() => {
    
    fetchCommentsAndAuthors();
  }, [post.id]); // Fetch comments and authors on component mount

  const handleLike = async () => {
    setLoading(true);
    try {
      await toggleLike(post.id, uid, isLiked);
      const updatedLikes = await getLikes(post.id);
      setLikes(updatedLikes.length);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
    setLoading(false);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await addComment(post.id, comment, uid);
      const updatedComments = await getComments(post.id);
      setComments(updatedComments); // Update comments after submitting
      setComment(''); // Clear comment input
      fetchCommentsAndAuthors();
      Keyboard.dismiss(); // Hide keyboard after submitting
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* <HeaderComponent navigation={navigation} title="Post Detail" navigationTo="back" /> */}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.authorContainer}>
            <Image 
              source={{ uri: post.authorDetails?.image_url || 'https://path/to/default-avatar.png' }} 
              style={styles.authorImage} 
            />
            <Text style={styles.authorName}>{post.authorDetails?.firstName || 'Unknown'}</Text>
          </View>
          <Image source={{ uri: post.image_url }} style={styles.image} />

          <View style={styles.content}>
            <View style={styles.interactionContainer}>
              <TouchableOpacity onPress={handleLike} style={styles.likesContainer}>
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.primary} style={styles.activityIndicator} />
                ) : (
                  <Icon name={isLiked ? "heart" : "heart-outline"} size={20} color={Colors.orange} />
                )}
                <Text style={styles.likes}>{likes} likes</Text>
              </TouchableOpacity>
              <View style={styles.commentsContainer}>
                <Icon name="chatbubble-outline" size={16} color={Colors.primary} />
                <Text style={styles.comments}>{comments.length} comments</Text>
              </View>
            </View>
            <Text style={styles.postTime}>{post.timeAgo}</Text>
            <Text style={styles.postText}>{post.text}</Text>
          </View>

          {/* Comments Section */}
          <Text style={styles.title}>Comments</Text>
          <View style={styles.commentsList}>
            {comments.map((comment, index) => {
              const author = authorDetailsMap[comment.authorId]; // Get the author from the map
              return (
                <View key={index} style={styles.comment}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={{ uri: author?.image_url || 'https://path/to/default-avatar.png' }} 
                      style={styles.commentUserImage}
                    />
                    <Text style={styles.commentUserName}>{author?.firstName || ''}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Comment Section */}
      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleCommentSubmit} style={styles.commentButton}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.activityIndicator} />
          ) : (
            <Icon name="send" size={16} color={Colors.orange} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  title:{
    marginTop:10,
    fontSize: 18,
    fontWeight: 'bold'
  },
  contentContainer: {
    paddingBottom: 80,  // Space for the sticky comment input box
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  content: {
    padding: 10,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  postText: {
    fontSize: 18,
    color: Colors.darkGrey,
    marginBottom: 10,
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
  postTime: {
    fontSize: 11,
    color: Colors.grey,
  },
  commentSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    padding: 10,
    zIndex: 1,  // Ensure it's above the ScrollView
  },
  commentInput: {
    flex: 1,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  commentButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  commentButtonText: {
    color: Colors.black,
  },
  commentsList: {
    marginTop: 10,
  },
  comment: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUserName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 16,
    color: Colors.darkGrey,
  },
  activityIndicator: {
    marginLeft: 10,
  },
});

export default PostDetailScreen;
