import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../config';
import { storage } from '../config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '../components';
import { addPost } from '../services';

export const CreatePostScreen = ({ navigation }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access the media library is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [5, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleShare = async () => {
        if (!caption || !image) {
            alert('Please add both a caption and an image.');
            return;
        }

        const imageUri = image;
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const imageRef = ref(storage, `posts/${Date.now()}`);
        const uploadTask = uploadBytesResumable(imageRef, blob);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Calculate upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress); // Update progress state
            },
            (error) => {
                alert('Error uploading image: ' + error.message);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const post = {
                    caption,
                    imageUrl: downloadURL,
                    createdAt: new Date(),
                    isActive: true,
                };

                try {
                    await addPost(post, user.uid);
                    alert('Post shared successfully!');
                    navigation.goBack();
                } catch (error) {
                    console.error('Error adding post: ', error);
                    alert('Failed to share the post');
                }
            }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {image ? (
                        <Image style={styles.imageDefault} source={{ uri: image }} />
                    ) : (
                        <View style={styles.imageDefault}>
                            <MaterialIcons name="upload" size={34} color="gray" />
                        </View>
                    )}
                    <Text style={styles.imageText}>Change Image</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.captionInput}
                    placeholder="Write something about post ..."
                    multiline={true}
                    value={caption}
                    onChangeText={(newValue) => setCaption(newValue)}
                />

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <Text style={styles.progressText}>
                        Uploading... {Math.round(uploadProgress)}%
                    </Text>
                )}

                <Button style={styles.button} onPress={handleShare}>
                    <Text style={styles.buttonText}>Share</Text>
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    imageContainer: {
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    imageDefault: {
        backgroundColor: Colors.lightGrey,
        width: '100%',
        aspectRatio: '5/4',
        resizeMode: 'cover',
        minWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    imageText: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
        color: Colors.brandYellow,
    },
    captionInput: {
        height: 92,
        fontWeight: 'light',
        width: '100%',
        padding: 3,
        borderRadius: 10,
        border: 1,
        borderColor: Colors.brandYellow,
        borderWidth: 1,
        padding: 12,
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: Colors.brandYellow,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 18,
        color: Colors.brandBlue,
        fontWeight: '700',
    },
    progressText: {
        marginVertical: 10,
        fontSize: 16,
        color: 'gray',
    },
});
