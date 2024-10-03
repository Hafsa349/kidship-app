import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native'; // Import ImageBackground and Image
import { Colors, Images } from '../config';

export const LoginComponent = ({ navigation }) => {
    return (
        <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('LoginScreen')}>
                <ImageBackground source={Images.gifts} style={styles.backgroundImage}>
                    {/* ImageBackground wraps the entire section */}
                    <Text style={styles.buttonText}>Sign in to view amazing rewards and offers</Text>
                </ImageBackground>
            </TouchableOpacity>
    );
};

const styles = {
    section: {
        flexDirection: 'row', // Aligns children horizontally
        justifyContent: 'space-between', // Adds space between children
        marginHorizontal: 2,
        marginTop:16,
        borderRadius: 10,
        backgroundColor: Colors.yellow,
    },
    textContainer: {
        flex: 1, // Takes up 50% of the horizontal space
        backgroundColor: Colors.yellow

    },
    imageContainer: {
    },
    button: {
        // Your button styles here
    },
    buttonText: {
        // Your button text styles here
        width: 180,
        fontWeight: '600',
        fontSize: 16,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'left',
        padding: 30,
    },
};
