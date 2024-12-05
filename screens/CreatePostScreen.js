import React, { useState, useContext } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Image,
    StyleSheet,
    ActivityIndicator,
    Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../config';
import { storage } from '../config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '../components';
import { addPost } from '../services';
import { SchoolContext, AuthenticatedUserContext } from '../providers';

export const CreatePostScreen = ({ navigation }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const { schoolDetail } = useContext(SchoolContext);
    const { user } = useContext(AuthenticatedUserContext);
    const compressImage = async (uri) => {
        try {
            console.log('Compressing Image URI:', uri);
            const compressedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 800 } }], // Resize to 800px width
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70%
            );
            console.log('Compressed Image URI:', compressedImage.uri);
            return compressedImage.uri;
        } catch (error) {
            console.warn('Image compression failed, using original image.', error);
            return uri; // Return the original URI as a fallback
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access the media library is required!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [5, 4],
                quality: 1,
            });

            if (!result.canceled) {
                const compressedUri = await compressImage(result.assets[0].uri);
                setImage(compressedUri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('An error occurred while picking the image.');
        }
    };

    const handleShare = async () => {
        if (!caption || !image) {
            alert('Please add both a caption and an image.');
            return;
        }

        setIsUploading(true); // Block screen with ActivityIndicator

        try {
            const response = await fetch(image);
            if (!response.ok) {
                throw new Error('Failed to fetch the image for upload.');
            }

            const blob = await response.blob();
            const imageRef = ref(storage, `posts/${Date.now()}`);
            const uploadTask = uploadBytesResumable(imageRef, blob);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error('Upload error:', error);
                    alert('Error during upload: ' + error.message);
                    setIsUploading(false); // Allow interaction after error
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('File available at:', downloadURL);

                        const post = {
                            text: caption,
                            image_url: downloadURL,
                            createdAt: new Date(),
                            isActive: true,
                            authorId: user.uid,
                            schoolId: schoolDetail
                        };

                        await addPost(post);
                        alert('Post shared successfully!');
                        setCaption('');
                        setImage(null);
                        setUploadProgress(0);
                        navigation.goBack();

                    } catch (error) {
                        console.error('Error saving post:', error);
                        alert('Failed to save the post.');
                    } finally {
                        setIsUploading(false); // Allow interaction after upload
                    }
                }
            );
        } catch (error) {
            console.error('Error handling share:', error);
            alert('An unexpected error occurred while sharing the post.');
            setIsUploading(false); // Allow interaction after error
        }
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
                    placeholder="Write something about the post ..."
                    multiline={true}
                    value={caption}
                    onChangeText={setCaption}
                />

                <Button style={styles.button} onPress={handleShare}>
                    <Text style={styles.buttonText}>Share</Text>
                </Button>
            </View>

            {/* Modal to block screen while uploading */}
            {isUploading && (
                <Modal transparent={true} animationType="fade">
                    <View style={styles.uploadOverlay}>
                        <ActivityIndicator size="large" color={Colors.brandYellow} />
                        <Text style={styles.uploadText}>
                            Uploading... {Math.round(uploadProgress)}%
                        </Text>
                    </View>
                </Modal>
            )}
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
        borderWidth: 1,
        borderColor: Colors.brandYellow,
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
    uploadOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    uploadText: {
        marginTop: 16,
        fontSize: 18,
        color: Colors.brandYellow,
        fontWeight: 'bold',
    },
});