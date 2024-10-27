import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';
import { HeaderComponent, Button } from '../components';
import { Colors } from '../config';
import { launchImageLibrary } from 'react-native-image-picker';

export const CreatePostScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const chooseImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets) {
                const source = { uri: response.assets[0].uri };
                setImage(source);
            }
        });
    };

    const handleShare = () => {
        setLoading(true); // Start loading
        try {
            // Handle the share logic here
            console.log('Image: ', image);
            console.log('Description: ', description);
        } catch (error) {
            setErrorState("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderComponent title="New Post" navigation={navigation} />
            <View style={styles.container}>
                <Button title="Upload Image" onPress={chooseImage} />
                {image && <Image source={image} style={styles.image} />}
                <TextInput
                    style={styles.descriptionInput}
                    placeholder="Add a description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <Button
                    style={styles.button}
                    onPress={handleShare}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.black} />
                    ) : (
                        <Text style={styles.buttonText}>{'Share'}</Text>
                    )}
                </Button>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    descriptionInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: Colors.brandYellow,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row' // Align content horizontally
    },
    buttonText: {
        fontSize: 14,
        color: Colors.black,
        fontWeight: '700'
    },
});
