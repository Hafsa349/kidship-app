import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet } from 'react-native';
import { HeaderComponent, Button } from '../components';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../config';



export const CreatePostScreen = ({ navigation }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
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

    useEffect(() => {
        if (!image) pickImage()
    }, [image]);

    return (
        <>
            {/* Image picker */}
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={pickImage} >
                        {image ? <Image style={styles.imageDefault} source={{ uri: image }} /> : (
                            <View style={styles.imageDefault}>
                                <MaterialIcons name="upload" size={34} color="gray" />
                            </View>
                        )}


                        <Text style={styles.imageText}>Change Image</Text>
                    </TouchableOpacity>
                    {/* TextInput for caption */}
                    <TextInput style={styles.captionInput}
                        className="h-[92px] font-plight w-full p-3 mb-10 bg-gray-50 rounded-2xl border-[1px] border-gray-200 "
                        placeholder="Write a caption..."
                        multiline={true}
                        value={caption}
                        onChangeText={(newValeu) => setCaption(newValeu)}
                    />

                    {/* Button */}
                    <Button style={styles.button}>
                        <Text style={styles.buttonText}>Share</Text>
                    </Button>


                </View>
            </View>



        </>
    )
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
        backgroundColor: Colors.lightGrey,
        borderRadius: 10,
        borderWidth: 0,
        borderColor: Colors.legalGray
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
        fontSize: 18,
        color: Colors.brandBlue,
        fontWeight: '700'
    },
})
