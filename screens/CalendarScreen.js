import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { HeaderComponent } from '../components';
import { Calendar } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../config';

// Sample events data
const initialEventsData = {
    '2024-10-27': [
        { id: '1', title: "Father's Day", type: 'Event', date: '17/08/2023' },
        { id: '2', title: 'Painting Homework', type: 'Homework', date: '17/08/2023' },
    ],
    '2024-10-26': [
        { id: '3', title: "Father's Day", type: 'Event', date: '11/08/2023' },
        { id: '4', title: 'Painting Homework', type: 'Homework', date: '11/08/2023' },
    ]
};

// Helper function to get today's date in "YYYY-MM-DD" format
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const CalendarScreen = ({ navigation }) => {
    const [eventsData, setEventsData] = useState(initialEventsData);
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventType, setNewEventType] = useState('');
    const todayDate = getTodayDate();
    const isToday = selectedDate === todayDate;

    const events = eventsData[selectedDate] || [];

    // Handler for adding a new event
    const handleAddEvent = () => {
        if (!newEventTitle.trim() || !newEventType.trim()) {
            alert('Please fill out all fields');
            return;
        }

        const newEvent = {
            id: Math.random().toString(),
            title: newEventTitle,
            type: newEventType,
            date: selectedDate,
        };

        setEventsData((prevData) => ({
            ...prevData,
            [selectedDate]: [...(prevData[selectedDate] || []), newEvent],
        }));

        setModalVisible(false);
        setNewEventTitle('');
        setNewEventType('');
    };

    return (
        <>
            <HeaderComponent title="Events"  navigation={navigation}/>
            <View style={styles.container}>
                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={{
                        [selectedDate]: { selected: true, marked: true, selectedColor: Colors.brandBlue }
                    }}
                />
                <View style={styles.eventsContainer}>
                    {events.length > 0 ? (
                        <>
                            <Text style={styles.sectionTitle}>
                                {isToday ? 'Events Today' : `Events for ${selectedDate}`}
                            </Text>
                            <FlatList
                                data={events}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.eventItem}>
                                        <FontAwesome name="star-o" size={24} color="black" style={styles.icon} />
                                        <View style={styles.eventDetails}>
                                            <Text style={styles.eventTitle}>{item.title}</Text>
                                            <Text style={styles.eventType}>{item.type}</Text>
                                        </View>
                                        <Text style={styles.eventDate}>{item.date}</Text>
                                    </View>
                                )}
                            />
                        </>
                    ) : (
                        <Text style={styles.noEventsText}>No events for this date</Text>
                    )}
                </View>

                {/* Floating Action Button (FAB) */}
                <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                    <FontAwesome name="plus" size={24} color="white" />
                </TouchableOpacity>

                {/* Modal for creating a new event */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Event</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Event Title"
                                value={newEventTitle}
                                onChangeText={setNewEventTitle}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Event Type"
                                value={newEventType}
                                onChangeText={setNewEventType}
                            />
                            <Button title="Save Event" onPress={handleAddEvent} />
                            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    eventsContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    icon: {
        marginRight: 10,
    },
    eventDetails: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    eventType: {
        fontSize: 14,
        color: 'grey',
    },
    eventDate: {
        fontSize: 14,
        color: 'grey',
    },
    noEventsText: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'center',
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: Colors.brandYellow,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
