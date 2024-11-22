import React, { useLayoutEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, SafeAreaView, Image, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const conversations = [
    {
        id: '1',
        firstName: 'Alice',
        lastName: 'Smith',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww',
        lastMessage: 'Hey, how are you?'
    },
    {
        id: '2',
        firstName: 'Bob',
        lastName: 'Thomas',
        avatar: 'https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww',
        lastMessage: 'Hey!'
    },
    // Add more contacts here
];

export const ConversationScreen = ({ navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('NewConversationScreen')}>
                    <AntDesign name="pluscircle" size={32} color="#f5b22d" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const RenderConversationItem = ({ item, index, noBorder }) => (
        <TouchableOpacity
            style={[styles.itemContainer, noBorder ? {} : styles.borderBottom]}
            onPress={() => navigation.navigate('MessageDetailScreen', { contactName: item.firstName + ' ' + item.lastName })}
        >
            <Image
                source={{ uri: item?.avatar }}
                style={styles.avatar}
            />
            <View style={styles.textContainer}>
                <View style={styles.headerContainer}>
                    <Text
                        style={styles.nameText}
                        numberOfLines={1}
                    >
                        {item?.firstName} {item?.lastName}
                    </Text>
                    <Text style={styles.timeText}>
                        {/* {renderTime()} */}
                        Time
                    </Text>
                </View>
                <Text
                    style={styles.lastMessageText}
                    numberOfLines={1}
                >
                    {/* {renderLastMessage()} */}
                    Last Message
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id.toString()} // Assuming item.id is a unique value
                renderItem={({ item, index }) => (
                    <RenderConversationItem
                        item={item}
                        index={index}
                        noBorder={index + 1 === conversations.length} // Pass the noBorder prop
                    />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        height: 40, // Match the header's height (usually 44 or 48px for React Navigation's default header)
        width: 40, // Make the button's width match the height to maintain a circular shape
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16, // Add some margin on the right to position it better
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        gap: 16
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0', // Equivalent to 'neutral-200'
    },
    avatar: {
        width: 60,
        aspectRatio: 1,
        objectFit: 'cover',
        borderRadius: 50, // Rounded image
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600', // Equivalent to font-psemibold
        color: '#1f1f1f',
        width: '60%',
    },
    timeText: {
        fontSize: 14,
        fontWeight: '400', // Equivalent to font-pregular
        color: '#A0A0A0', // Neutral 500
    },
    lastMessageText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#A0A0A0', // Neutral 500
        width: '60%',
    },
});
