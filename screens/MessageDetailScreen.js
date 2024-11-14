import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { HeaderComponent } from '../components';

export const MessageDetailScreen = ({ route, navigation }) => {
    const { contactName } = route.params;
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hi!', sender: 'other' },
        { id: '2', text: 'Hello!', sender: 'me' },
        { id: '3', text: 'Can I call you?', sender: 'other'}
        // Initial messages
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([
                ...messages,
                { id: Date.now().toString(), text: newMessage, sender: 'me' }
            ]);
            setNewMessage('');
        }
    };

    const renderMessageItem = ({ item }) => (
        <View style={{
            alignSelf: item.sender === 'me' ? 'flex-end' : 'flex-start',
            backgroundColor: item.sender === 'me' ? '#DCF8C6' : '#ECECEC',
            borderRadius: 8,
            padding: 8,
            marginVertical: 4,
            maxWidth: '70%'
        }}>
            <Text>{item.text}</Text>
        </View>
    );

    return (
        <>
        
            <View style={{ flex: 1, padding: 16 }}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessageItem}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    inverted
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message"
                        style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 16, padding: 16 }}
                    />
                    <Button title="Send" onPress={handleSendMessage} />
                </View>
            </View>
        </>
    );
};
