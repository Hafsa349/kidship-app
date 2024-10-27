import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { HeaderComponent } from '../components';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

export const HomeWorkScreen = ({ navigation }) => {
    const allHomework = [
        { id: '1', title: 'Painting Homework', date: '2024-10-17', class: 'Art' },
        { id: '2', title: 'Science Homework', date: '2024-10-25', class: 'Science' },
        { id: '3', title: 'Theater Homework', date: '2024-10-30', class: 'Drama' },
        { id: '4', title: 'Math Homework', date: '2024-11-02', class: 'Science' },
        { id: '5', title: 'Music Homework', date: '2024-11-05', class: 'Art' },
    ];

    const [selectedClass, setSelectedClass] = useState(null);

    const filteredHomework = allHomework.filter((item) => 
        !selectedClass || item.class === selectedClass
    );

    const upcomingHomework = filteredHomework.filter(item => new Date(item.date) > new Date());
    const pastHomework = filteredHomework.filter(item => new Date(item.date) <= new Date());

    const renderHomeworkItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <FontAwesome name="book" size={24} color="#4A90E2" style={styles.icon} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.commentIcon}>
                <FontAwesome name="comment" size={24} color="#4A90E2" />
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <HeaderComponent title="Homework" />
            <View style={styles.filterContainer}>
                <Text style={styles.label}>Select Class</Text>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedClass(value)}
                        items={[
                            { label: 'Art', value: 'Art' },
                            { label: 'Science', value: 'Science' },
                            { label: 'Drama', value: 'Drama' },
                        ]}
                        placeholder={{ label: "Select Class", value: null }}
                        style={{
                            ...pickerSelectStyles,
                        }}
                        value={selectedClass}
                        Icon={() => (
                            <FontAwesome name="chevron-down" size={16} color="#666" style={styles.iconRight} />
                        )}
                    />
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Upcoming homeworks</Text>
                <FlatList
                    data={upcomingHomework}
                    renderItem={renderHomeworkItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.emptyMessage}>No upcoming homework</Text>}
                />
                <Text style={styles.sectionTitle}>Past homeworks</Text>
                <FlatList
                    data={pastHomework}
                    renderItem={renderHomeworkItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.emptyMessage}>No past homework</Text>}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'flex-start', // Align items to the start (left)
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5, // Space between label and picker
        textAlign: 'left', // Ensure the label text is left-aligned
    },
    pickerContainer: {
        position: 'relative', // Allow positioning of the icon inside
        width: 200, // Set a fixed width for the picker
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        marginVertical: 6,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    commentIcon: {
        paddingLeft: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        paddingVertical: 20,
    },
    iconRight: {
        position: 'absolute',
        right: 10,
        top: 10, // Adjust to center the icon vertically
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        paddingRight: 30, // Add padding for the arrow
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        color: '#333',
        backgroundColor: '#e0e0e0',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingRight: 30, // Add padding for the arrow
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        color: '#333',
        backgroundColor: '#e0e0e0',
    },
    placeholder: {
        color: '#666',
        fontSize: 16,
    },
});

export default HomeWorkScreen;
