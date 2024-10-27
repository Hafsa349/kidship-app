import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { HeaderComponent } from '../components';
import { Colors } from '../config';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

export const PostDetailScreen = ({ navigation, route }) => {
    // Retrieve the post object from the route parameters
    const { post } = route.params;

    return (
        <>
            <HeaderComponent navigation={navigation} title="Post Detail" navigationTo="back" />

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
                    <Text style={styles.postText}>{post.text}</Text>

                    <View style={styles.interactionContainer}>
                        <View style={styles.likesContainer}>
                            <Icon name="heart" size={16} color={Colors.primary} />
                            <Text style={styles.likes}>{post.likes} likes</Text>
                        </View>
                        <View style={styles.commentsContainer}>
                            <Icon name="chatbubble-outline" size={16} color={Colors.primary} />
                            <Text style={styles.comments}>{post.comments ? post.comments.length : 0} comments</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.postTime}>{post.timeAgo}</Text>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.white,
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
        fontSize: 12,
        color: Colors.grey,
    },
});

export default PostDetailScreen;
