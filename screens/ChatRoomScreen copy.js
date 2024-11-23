import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const ChatRoomScreen = ({ route, navigation, currentUser }) => {
    const { item } = route.params;
    const [messages, setMessages] = useState([]); // Local state for messages
    const [message, setMessage] = useState(''); // State for message input

    // Function to handle sending a message
    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { id: Date.now().toString(), text: message, sender: 'You', userId: currentUser?.userId }]);
            setMessage(''); // Clear input field after sending
        }
    };

    // Render message items with dynamic styling based on sender
    const renderMessageItem = ({ item }) => {
        const isSender = currentUser?.userId === item.userId;

        return (
            <View style={[styles.messageContainer, isSender ? styles.senderMessage : styles.receiverMessage]}>
                <View style={[styles.messageBubble, isSender ? styles.senderBubble : styles.receiverBubble]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.chatContainer}>
                {/* Chat Messages */}
                <FlatList
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={item => item.id}
                    inverted // Display newest messages at the bottom
                />
            </View>

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <MaterialCommunityIcons name="rocket-launch-outline" size={30} color="#737373" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    senderMessage: {
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    receiverMessage: {
        justifyContent: 'flex-start',
        marginLeft: 10,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 15,
    },
    senderBubble: {
        backgroundColor: '#fff',
        borderColor: '#D1D5DB', // Border similar to neutral-200
        borderWidth: 1,
    },
    receiverBubble: {
        backgroundColor: '#E0E7FF', // Example background color for received messages
        borderColor: '#F59E0B', // Example border color for received messages
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 999,
        paddingLeft: 20,
        margin: 10,
    },
    textInput: {
        flex: 1,
        marginRight: 8,
        fontSize: 18,
    },
    sendButton: {
        backgroundColor: '#E5E7EB',
        padding: 8,
        marginRight: 1,
        borderRadius: 999,
    },
});
