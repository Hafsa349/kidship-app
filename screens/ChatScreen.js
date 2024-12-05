import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { format } from 'date-fns';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../config';

export const ChatScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser?.uid) return;

        const unsubscribeRooms = onSnapshot(
            query(collection(db, 'rooms'), where('participants', 'array-contains', currentUser?.uid)),
            async (snapshot) => {
                const rooms = snapshot.docs.map((roomDoc) => {
                    const roomData = roomDoc.data();
                    const otherUserId = roomData.participants.find((id) => id !== currentUser?.uid);
                    return { id: roomDoc.id, otherUserId };
                });

                const conversationsMap = new Map();

                rooms.forEach(({ id, otherUserId }) => {
                    const messagesQuery = query(
                        collection(db, 'rooms', id, 'messages'),
                        orderBy('createdAt', 'desc'),
                        limit(1)
                    );

                    const unsubscribeMessages = onSnapshot(messagesQuery, (messageSnapshot) => {
                        const lastMessage = messageSnapshot.docs.length
                            ? messageSnapshot.docs[0].data()
                            : { text: 'Say Hi!', createdAt: null };

                        getDoc(doc(collection(db, 'users'), otherUserId)).then((otherUserDoc) => {
                            if (!otherUserDoc.exists()) return;

                            const otherUser = otherUserDoc.data();

                            conversationsMap.set(id, {
                                id,
                                ...otherUser,
                                lastMessage: lastMessage.text,
                                lastMessageTime: lastMessage?.createdAt?.seconds
                                    ? new Date(lastMessage.createdAt.seconds * 1000)
                                    : null,
                            });

                            setConversations(Array.from(conversationsMap.values()));
                        });
                    });

                    // Cleanup the message listener
                    return () => unsubscribeMessages();
                });

                setLoading(false);
            }
        );

        return () => unsubscribeRooms();
    }, [currentUser?.uid]);

    const getAvatarUrl = (avatar) => {
        return avatar
            ? { uri: avatar }
            : require('../assets/images/profile-default.jpg'); // Path to your local placeholder image
    };

    // Add header button to navigate to New Chat Screen
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.headerRightButton} onPress={() => navigation.navigate('NewChatScreen')}>
                    <AntDesign name="pluscircle" size={32} color="#f5b22d" />
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity style={styles.headerLeftButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.brandBlue} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const RenderConversationItem = ({ item, noBorder }) => {
        const serializedItem = {
            ...item,
            lastMessageTime: item?.lastMessageTime ? item.lastMessageTime.toISOString() : null,
            roomId: item.id, // Include the roomId
        };

        return (
            <TouchableOpacity
                style={[styles.itemContainer, noBorder ? {} : styles.borderBottom]}
                onPress={() => navigation.navigate('ChatRoomScreen', { item: serializedItem })}
            >
                <Image
                    source={getAvatarUrl(item?.avatar)}
                    style={styles.avatar}
                />
                <View style={styles.textContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.nameText} numberOfLines={1}>
                            {item?.firstName} {item?.lastName}
                        </Text>
                        <Text style={styles.timeText}>
                            {item?.lastMessageTime ? format(new Date(item.lastMessageTime), 'HH:mm') : ''}
                        </Text>
                    </View>
                    <Text style={styles.lastMessageText} numberOfLines={1}>
                        {item?.lastMessage}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <RenderConversationItem
                                item={item}
                                index={index}
                                noBorder={index + 1 === conversations.length}
                            />
                        )}
                        ListEmptyComponent={
                            !loading && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No messages yet.</Text>
                                </View>
                            )
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 16,
    },
    headerLeftButton: {
        marginLeft: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    timeText: {
        fontSize: 14,
        color: '#999',
    },
    lastMessageText: {
        fontSize: 14,
        color: '#666',
    },
});
