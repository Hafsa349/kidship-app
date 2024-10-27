import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { HeaderComponent } from '../components';
import { FontAwesome } from '@expo/vector-icons';  // Make sure to install this or replace with an icon library you have

export const HomeWorkScreen = ({ navigation }) => {
    // Sample data
    const upcomingHomework = [
        { id: '1', title: 'Painting Homework', date: '17/08/2024' },
    ];

    const pastHomework = [
        { id: '2', title: 'Science Homework', date: '11/08/2024' },
        { id: '3', title: 'Theater Homework', date: '11/08/2024' },
    ];

    // Function to render each homework item
    const renderHomeworkItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <FontAwesome name="book" size={24} color="black" style={styles.icon} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.commentIcon}>
                <FontAwesome name="comment" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <HeaderComponent title="Homework" navigation={navigation}/>
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Upcoming homeworks...</Text>
                <FlatList
                    data={upcomingHomework}
                    renderItem={renderHomeworkItem}
                    keyExtractor={(item) => item.id}
                />
                <Text style={styles.sectionTitle}>Past homeworks</Text>
                <FlatList
                    data={pastHomework}
                    renderItem={renderHomeworkItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    commentIcon: {
        paddingLeft: 10,
    },
});

export default HomeWorkScreen;
