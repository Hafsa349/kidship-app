import React, { useEffect, useState } from 'react';
import { Pressable, Text, Touchable, View } from 'react-native';
import { HeaderComponent } from '../components';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



export const CreatePostScreen = ({ navigation }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // useEffect(() => {
    //     if (!image) pickImage()
    // }, [image]);

    return (
        <>
            <HeaderComponent title="Create Post" navigation={navigation} />
            <View >
                <Pressable title="Pick an image from camera roll" onPress={pickImage} />
                {image && <Image source={{ uri: image }} />}
            </View>
        </>
    )
};