import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db, auth } from '../config/firebase';
import { collection, doc, addDoc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export const ChatRoomScreen = ({ route }) => {
    const { item } = route.params;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(''); // Control the TextInput value
    const scrollViewRef = useRef(null);
    const [isSendDisabled, setIsSendDisabled] = useState(true);

    const currentUser = auth.currentUser;
    const roomId = item.roomId || [currentUser?.uid, item?.id].sort().join('_');

    useEffect(() => {
        const messagesRef = collection(db, 'rooms', roomId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        }, (error) => {
            console.error('Error fetching messages:', error);
            Alert.alert('Error', 'Unable to fetch messages.');
        });

        return () => unsubscribe();
    }, [roomId]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            const messagesRef = collection(db, 'rooms', roomId, 'messages');
            await addDoc(messagesRef, {
                userId: currentUser?.uid,
                text: message.trim(),
                createdAt: Timestamp.fromDate(new Date()),
            });

            // Clear the input field
            setMessage('');
        } catch (error) {
            Alert.alert('Message', error.message);
        }
    };

    const renderMessageItem = ({ item: message }) => {
        const messageTime = format(new Date(message?.createdAt?.seconds * 1000), 'HH:mm');
        const isSender = currentUser?.uid === message?.userId;

        return (
            <View style={isSender ? styles.senderContainer : styles.receiverContainer}>
                <View style={isSender ? styles.senderBubble : styles.receiverBubble}>
                    <Text style={styles.messageText}>{message?.text}</Text>
                    <Text style={styles.timestamp}>{messageTime}</Text>
                </View>
            </View>
        );
    };

    const handleInputChange = (text) => {
        setMessage(text);
        setIsSendDisabled(text.trim().length === 0);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.chatContainer}>
                <FlatList
                    ref={scrollViewRef}
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
                    inverted
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type a message..."
                    value={message} // Bind TextInput value to state
                    onChangeText={handleInputChange} // Update state on input change
                    onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity
                    onPress={handleSendMessage}
                    style={[
                        styles.sendButton,
                        isSendDisabled ? { backgroundColor: '#eee' } : { backgroundColor: '#E5E7EB' },
                    ]}
                    disabled={isSendDisabled}
                >
                    <MaterialCommunityIcons
                        name="rocket-launch-outline"
                        size={30}
                        color={isSendDisabled ? '#fff' : '#737373'}
                    />
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
    senderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginRight: 10,
    },
    receiverContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
        marginLeft: 10,
    },
    senderBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    receiverBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        backgroundColor: '#f5b22d',
        borderWidth: 1,
        borderColor: '#ca8a04',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    timestamp: {
        fontSize: 10,
        color: '#ca8a04',
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

export default ChatRoomScreen;