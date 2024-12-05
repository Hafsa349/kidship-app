import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SchoolContext } from '../providers';
import { addEvent, getEvents } from '../services/firebasePublicDataService';

const formatDateToDDMMYYYY = (date) => {
    if (!date) return ''; // Return an empty string if date is undefined or null
    return date.split('-').reverse().join('-');
};
const formatDateToYYYYMMDD = (date) => date.split('-').reverse().join('-'); // Convert DD-MM-YYYY to YYYY-MM-DD

export const CalendarScreen = ({ navigation }) => {
    const todayDate = new Date().toISOString().split('T')[0];
    const [selectedType, setSelectedType] = useState('All'); // Filter type
    const [selectedDate, setSelectedDate] = useState(todayDate); // Default to today's date
    const [events, setEvents] = useState({});
    const [addEventModalVisible, setAddEventModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: 'Event',
        description: '',
        date: formatDateToDDMMYYYY(todayDate), // Displayed in DD-MM-YYYY
        time: '',
    });
    const { schoolDetail } = useContext(SchoolContext);

    // Fetch events from Firestore
    const fetchEvents = async () => {
        if (!schoolDetail) return;
        try {
            const fetchedEvents = await getEvents(schoolDetail);

            const formattedEvents = {};
            fetchedEvents.forEach((event) => {
                const { date, ...rest } = event;
                if (!date) {
                    console.error('Event is missing a date:', event);
                    return; // Skip events without a date
                }

                if (!formattedEvents[date]) {
                    formattedEvents[date] = [];
                }
                formattedEvents[date].push(rest);
            });
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };



    useEffect(() => {
        setEvents({});
        fetchEvents();
    }, [schoolDetail]);

    useEffect(() => {
        console.log('Fetched Events:', events);
    }, [events]);


    const handleAddEvent = async () => {
        if (!newEvent.title || !newEvent.time || !newEvent.description) {
            alert('Please fill all fields.');
            return;
        }

        if (!schoolDetail) {
            alert('School ID is missing.');
            return;
        }

        const eventToSave = {
            title: newEvent.title,
            type: newEvent.type,
            description: newEvent.description,
            date: formatDateToYYYYMMDD(newEvent.date), // Save as YYYY-MM-DD
            time: newEvent.time,
            schoolId: schoolDetail,
        };

        try {
            const addedEvent = await addEvent(eventToSave);
            if (addedEvent) {
                alert('Event added successfully!');
                setAddEventModalVisible(false);
                setNewEvent({
                    title: '',
                    type: 'Event',
                    description: '',
                    date: formatDateToDDMMYYYY(todayDate),
                    time: '',
                });
                fetchEvents(); // Refresh events after adding
            }
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Failed to add event.');
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setAddEventModalVisible(true)}
                >
                    <AntDesign name="pluscircle" size={32} color="#f4b22e" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const getFilteredEvents = (date) => {
        const dateEvents = events[date] || [];
        if (selectedType === 'All') return dateEvents;
        return dateEvents.filter((event) => event.type === selectedType);
    };

    const filteredEvents = getFilteredEvents(selectedDate);

    const getMarkedDates = () => {
        const marked = {};
        Object.keys(events).forEach((date) => {
            const dateEvents = getFilteredEvents(date);
            if (dateEvents.length > 0) {
                const color =
                    selectedType === 'Event'
                        ? '#92D4F2'
                        : selectedType === 'Homework'
                            ? '#A1D871'
                            : '#f4b22e';
                marked[date] = { marked: true, dotColor: color };
            }
        });

        marked[todayDate] = {
            customStyles: {
                text: {
                    color:
                        todayDate === selectedDate
                            ? '#FFFFFF'
                            : selectedType === 'Event'
                                ? '#92D4F2'
                                : selectedType === 'Homework'
                                    ? '#A1D871'
                                    : '#f4b22e',
                },
                container: {
                    backgroundColor:
                        todayDate === selectedDate
                            ? selectedType === 'Event'
                                ? '#92D4F2'
                                : selectedType === 'Homework'
                                    ? '#A1D871'
                                    : '#f4b22e'
                            : undefined,
                    borderRadius: 15,
                },
            },
        };

        return marked;
    };

    const openEventDetails = (event, date) => {
        setSelectedEvent({ ...event, date }); // Add the date to the selected event
        setDetailModalVisible(true);
    };

    const closeEventDetails = () => {
        setDetailModalVisible(false);
        setSelectedEvent(null);
    };

    return (
        <View style={styles.container}>
            {/* Top Filter Buttons */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        selectedType === 'All' && {
                            backgroundColor: '#f4b22e',
                            shadowColor: '#f4b22e',
                        },
                        selectedType !== 'All' && { backgroundColor: '#F4E2BC' },
                    ]}
                    onPress={() => setSelectedType('All')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            selectedType !== 'All' && { color: '#9ca3af' },
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        selectedType === 'Event' && {
                            backgroundColor: '#92D4F2',
                            shadowColor: '#92D4F2',
                        },
                        selectedType !== 'Event' && { backgroundColor: '#CDE5F1' },
                    ]}
                    onPress={() => setSelectedType('Event')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            selectedType !== 'Event' && { color: '#9ca3af' },
                        ]}
                    >
                        Events
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        selectedType === 'Homework' && {
                            backgroundColor: '#A1D871',
                            shadowColor: '#A1D871',
                        },
                        selectedType !== 'Homework' && { backgroundColor: '#CDEACD' },
                    ]}
                    onPress={() => setSelectedType('Homework')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            selectedType !== 'Homework' && { color: '#9ca3af' },
                        ]}
                    >
                        Homeworks
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Calendar Component */}
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markingType="custom"
                markedDates={getMarkedDates()}
            />

            {/* Add Event Modal */}
            <Modal visible={addEventModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Event</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={newEvent.title}
                            onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                        />
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder="Description"
                            value={newEvent.description}
                            onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                            multiline={true}
                            numberOfLines={3}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date (DD-MM-YYYY)"
                            value={newEvent.date}
                            onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Time (HH:MM)"
                            value={newEvent.time}
                            onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setNewEvent({ ...newEvent, type: 'Event' })}
                                style={[
                                    styles.typeButton,
                                    newEvent.type === 'Event' && { backgroundColor: '#92D4F2' },
                                ]}
                            >
                                <Text style={styles.typeButtonText}>Event</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setNewEvent({ ...newEvent, type: 'Homework' })}
                                style={[
                                    styles.typeButton,
                                    newEvent.type === 'Homework' && { backgroundColor: '#A1D871' },
                                ]}
                            >
                                <Text style={styles.typeButtonText}>Homework</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setAddEventModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Detail Modal */}
            <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            {selectedEvent && (
                <>
                    <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                    <Text
                        style={[
                            styles.modalType,
                            {
                                backgroundColor:
                                    selectedEvent.type === 'Event'
                                        ? '#92D4F2'
                                        : '#A1D871',
                            },
                        ]}
                    >
                        {selectedEvent.type}
                    </Text>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Description:</Text>
                        <Text style={styles.detailValue}>{selectedEvent.description || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                            {formatDateToDDMMYYYY(selectedEvent.date || 'N/A')}
                        </Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Time:</Text>
                        <Text style={styles.detailValue}>{selectedEvent.time || 'N/A'}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setDetailModalVisible(false);
                            setSelectedEvent(null);
                        }}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    </View>
</Modal>

            {/* Events List */}
            <View style={styles.eventsContainer}>
                <Text style={styles.sectionTitle}>Events for {formatDateToDDMMYYYY(selectedDate)}</Text>
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openEventDetails(item, selectedDate)}>
                            <View
                                style={[
                                    styles.eventItem,
                                    {
                                        backgroundColor:
                                            item.type === 'Event'
                                                ? '#92D4F2'
                                                : item.type === 'Homework'
                                                    ? '#A1D871'
                                                    : '#f4b22e',
                                    },
                                ]}
                            >
                                <Text style={styles.eventTime}>{item.time}</Text>
                                <Text style={styles.eventTitle}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.noEventsText}>No events for this date</Text>}
                />

            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    headerButton: { marginRight: 16 },
    container: { flex: 1, padding: 10 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
    modalType: {
        alignSelf: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        textAlign: 'center',
        marginBottom: 20,
    },
    detailBox: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    detailLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5 },
    detailValue: { fontSize: 16, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
    descriptionInput: { height: 80, textAlignVertical: 'top' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    typeButton: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
    typeButtonText: { fontWeight: 'bold' },
    addButton: { backgroundColor: '#f4b22e', padding: 10, alignItems: 'center', borderRadius: 5 },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
    closeButton: { marginTop: 10, alignItems: 'center', backgroundColor: '#ddd', padding: 10, borderRadius: 5 },
    closeButtonText: { color: '#333', fontWeight: 'bold' },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    filterButton: { flex: 1, alignItems: 'center', padding: 10, marginHorizontal: 5, borderRadius: 10, elevation: 4 },
    filterText: { color: '#000', fontWeight: 'bold' },
    eventsContainer: { marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    eventItem: { padding: 10, marginBottom: 5, borderRadius: 10 },
    eventTime: { fontSize: 16, color: '#555' },
    eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    noEventsText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' },
});
