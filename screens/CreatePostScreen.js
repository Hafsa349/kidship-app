import React from 'react';
import { Text } from 'react-native';
import { HeaderComponent } from '../components';

export const CreatePostScreen = ({ navigation }) => {

    return (
        <>
                 <HeaderComponent title="New Post" />
                 <Text>{"Post"}</Text>
        </>
    )
};