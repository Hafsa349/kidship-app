import React from 'react';
import { View, FlatList, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { HeaderComponent } from '../components';

const conversations = [
    { id: '1', name: 'Alice', lastMessage: 'Hey, how are you?' },
    { id: '2', name: 'Bob', lastMessage: 'See you tomorrow!' },
    // Add more contacts here
];

export const ConversationScreen = ({ navigation }) => {
    const renderConversationItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('MessageDetailScreen', { contactName: item.name })}
            style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}
        >
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.lastMessage}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{flex: 1}}>
        <View style={{ flex: 1 }}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={renderConversationItem}
            />
        </View>
        </SafeAreaView>
    );
};
