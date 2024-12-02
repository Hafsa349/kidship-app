import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../config';
import { SchoolContext } from '../providers';
import { addEvent, getEvents } from '../services';

// Helper function to get today's date in "YYYY-MM-DD" format
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Calendar Screen Component
export const CalendarScreen = ({ navigation }) => {
    const [eventsData, setEventsData] = useState({});
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState(getTodayDate()); // Default to today's date
    const [modalVisible, setModalVisible] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const todayDate = getTodayDate();
    const { schoolDetail } = useContext(SchoolContext);

    const isToday = selectedDate === todayDate;
    const events = eventsData[selectedDate] || []; // Get events for the selected date

    // Fetch and process events
    useEffect(() => {
        const fetchEvents = async () => {
            const events = await getEvents(schoolDetail);
            const formattedEvents = {};
            const markedDatesObj = {};

            // Process events for display and marking
            events.forEach((event) => {
                const eventDate = event.date; // Assuming events are in 'YYYY-MM-DD' format
                if (!formattedEvents[eventDate]) {
                    formattedEvents[eventDate] = [];
                }
                formattedEvents[eventDate].push(event);

                // Mark the date
                markedDatesObj[eventDate] = {
                    marked: true,
                    dotColor: Colors.brandBlue, // Customize the color for events
                };
            });

            setEventsData(formattedEvents);
            setMarkedDates(markedDatesObj);
        };

        fetchEvents();
    }, [schoolDetail]);

    // Add new event
    const handleAddEvent = async () => {
        if (!newEventTitle.trim() || !newEventDescription.trim()) {
            alert('Please fill out all fields');
            return;
        }

        const newEvent = {
            id: Date.now().toString(),
            title: newEventTitle,
            description: newEventDescription,
            date: selectedDate,
            schoolId: schoolDetail,
        };

        await addEvent(newEvent);

        setEventsData((prevData) => ({
            ...prevData,
            [selectedDate]: [...(prevData[selectedDate] || []), newEvent],
        }));

        setMarkedDates((prevDates) => ({
            ...prevDates,
            [selectedDate]: {
                marked: true,
                dotColor: Colors.brandBlue,
            },
        }));

        setModalVisible(false);
        setNewEventTitle('');
        setNewEventDescription('');
    };

    return (
        <View style={styles.container}>
            {/* Calendar Component */}
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { selected: true, marked: true, selectedColor: Colors.brandBlue },
                }}
            />

            {/* Events List */}
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
                                        <Text style={styles.eventType}>{item.description}</Text>
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

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>

            {/* Add Event Modal */}
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
                            placeholder="Description"
                            value={newEventDescription}
                            onChangeText={setNewEventDescription}
                        />
                        <Button title="Save Event" onPress={handleAddEvent} />
                        <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    eventsContainer: { marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    icon: { marginRight: 10 },
    eventDetails: { flex: 1 },
    eventTitle: { fontSize: 16, fontWeight: 'bold', color: 'black' },
    eventType: { fontSize: 14, color: 'grey' },
    eventDate: { fontSize: 14, color: 'grey' },
    noEventsText: { fontSize: 16, color: 'grey', textAlign: 'center', marginTop: 20 },
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
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
