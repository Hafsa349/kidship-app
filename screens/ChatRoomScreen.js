import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db, auth } from '../config/firebase';  // Import your firebase config
import { collection, doc, addDoc, setDoc, getDoc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';  // Firestore functions

export const ChatRoomScreen = ({ route, navigation }) => {
    const { item } = route.params;  // The recipient from route params
    const [messages, setMessages] = useState([]); // State for messages
    const [message, setMessage] = useState(''); // State for the message input
    const scrollViewRef = useRef(null);  // Ref for scroll view to auto-scroll when new messages are added
    const currentUser = auth.currentUser; // Get the current user

    console.log("Current User ID:", currentUser?.uid);
    console.log("Recipient ID (item.id):", item?.id);

    // Generate room ID based on currentUser and recipient's user ID
    const getRoomId = (user1, user2) => {
        const sortUserId = [user1, user2].sort();  // Sort the IDs to avoid duplicate rooms
        return sortUserId.join('_');
    };

    // Firebase query for the chat room
    useEffect(() => {
        if (!currentUser?.uid || !item?.id) {
            console.error("Missing currentUser or item id");
            return;  // Exit if currentUser or item id is missing
        }

        const roomId = getRoomId(currentUser.uid, item.id);  // Generate the room ID
        const docRef = doc(db, 'rooms', roomId);  // Reference to the chat room document
        const messagesRef = collection(docRef, 'messages');  // Messages collection
        const q = query(messagesRef, orderBy('createAt', 'asc'));  // Query messages ordered by creation time

        const unsub = onSnapshot(q, (snapshot) => {
            const allMessages = snapshot.docs.map(doc => doc.data());  // Fetch all messages
            setMessages(allMessages);  // Update the state with the new messages
        });

        // Cleanup on unmount
        return () => unsub();
    }, [currentUser?.uid, item?.id]);

    // Send message handler
    const handleSendMessage = async () => {
        if (message.trim() && currentUser?.uid && item?.id) {
            const roomId = getRoomId(currentUser?.uid, item?.id); // Generate room ID
            const newMessage = {
                id: Date.now().toString(),
                text: message,
                sender: 'You',
                userId: currentUser?.uid,
                createAt: new Date(),
            };

            try {
                const docRef = doc(db, 'rooms', roomId); // Reference to the room document

                // Check if room document exists. If not, create it.
                const docSnapshot = await getDoc(docRef);
                if (!docSnapshot.exists()) {
                    // Room doesn't exist, create it
                    await setDoc(docRef, {
                        createdAt: Timestamp.now(), // Use Firebase Timestamp for createdAt
                        participants: [currentUser?.uid, item?.id], // Store the participants (user IDs)
                    });
                }

                // Add the new message to the messages sub-collection
                const messagesRef = collection(docRef, 'messages'); // Messages sub-collection
                await addDoc(messagesRef, newMessage);  // Add the message to Firestore
                setMessage('');  // Clear input field after sending
            } catch (error) {
                console.error("Error sending message:", error);
            }
        } else {
            console.error("Missing data for message: currentUser or item is undefined");
        }
    };

    // Scroll to the bottom of the chat view when new messages arrive
    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        updateScrollView();  // Scroll to the bottom whenever new messages are loaded or sent
    }, [messages]);

    const renderMessageItem = ({ item }) => {
        const isSender = item.userId === currentUser?.uid;
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
                <FlatList
                    ref={scrollViewRef}
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={(item) => item.id}
                    // Remove inverted to show the oldest messages at the bottom and recent ones at the top
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}  // Add padding to both top and bottom
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <MaterialCommunityIcons name="rocket-launch-outline" size={30} color="#737373" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// Styles for the components
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
        borderColor: '#e5e5e5',
        borderWidth: 1,
    },
    receiverBubble: {
        backgroundColor: '#f5b22d',
        borderColor: '#ca8a04',
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
