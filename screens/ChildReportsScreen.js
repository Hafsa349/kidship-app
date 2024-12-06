import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { Colors } from '../config';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const formatDateToDDMMYYYY = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatDateToTimestamp = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
};

export const ChildReportsScreen = ({ route, navigation }) => {
    const { allowEditing, childId, childName, userDetail } = route.params;
    const [reports, setReports] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportForm, setReportForm] = useState({
        title: '',
        description: '',
        date: '',
    });

    // Add Events Button
    useEffect(() => {
        if (allowEditing) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.headerRightButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <AntDesign name="pluscircle" size={32} color="#f4b22e" />
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({
                headerRight: () => null,
            });
        }
    }, [navigation, allowEditing]);

    // Set Header Title
    useEffect(() => {
        navigation.setOptions({
            headerTitle: childName,
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.headerLeftButton}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.brandBlue} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchReports = async () => {
        try {
            // Path: schools/{schoolId}/children/{childId}/reports
            const reportsRef = collection(
                db,
                `schools/${userDetail.schoolId}/children/${childId}/reports`
            );

            const q = query(reportsRef);
            const querySnapshot = await getDocs(q);

            const reportsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                date: formatDateToDDMMYYYY(doc.data().date), // Format the Firestore Timestamp
            }));

            setReports(reportsList);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };


    useEffect(() => {
        fetchReports();
    }, []);

    const handleAddReport = async () => {
        const { title, description, date } = reportForm;

        if (!title || !description || !date) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }

        try {
            // Path: schools/{schoolId}/children/{childId}/reports
            const reportsRef = collection(
                db,
                `schools/${userDetail.schoolId}/children/${childId}/reports`
            );

            const newReport = {
                title,
                description,
                date: formatDateToTimestamp(date), // Convert to Firestore Timestamp
                teacherId: userDetail.uid,
                teacherName: `${userDetail.firstName} ${userDetail.lastName}`, // Auto-fill teacher's name
                userId: userDetail.uid,
                createdAt: serverTimestamp(),
            };

            // Add the new report to the correct sub-collection
            await addDoc(reportsRef, newReport);

            Alert.alert('Success', 'Report added successfully.');
            setReportForm({ title: '', description: '', date: '' });
            setModalVisible(false);
            fetchReports(); // Refresh the reports list
        } catch (error) {
            console.error('Error adding report:', error);
            Alert.alert('Error', 'Failed to add report.');
        }
    };


    const openReportDetails = (report) => {
        setSelectedReport(report);
        setDetailModalVisible(true);
    };

    const closeReportDetails = () => {
        setSelectedReport(null);
        setDetailModalVisible(false);
    };

    const renderEmptyMessage = () => (
        (allowEditing ? (
            <><Text style={styles.emptyText}>
                No reports yet. Add a report to get start.
            </Text>
            </>
        ) : (
            <><Text style={styles.emptyText}>
                No reports yet.
            </Text>
            </>
        ))

    )

    const renderReportItem = ({ item }) => (
        <TouchableOpacity
            style={styles.reportItem}
            onPress={() => openReportDetails(item)}
        >
            <Text style={styles.reportTitle}>{item.title}</Text>
            <Text style={styles.reportDate}>Date: {item.date}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                renderItem={renderReportItem}
                ListEmptyComponent={renderEmptyMessage}
            />

            {/* Add Report Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Report</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={reportForm.title}
                            onChangeText={(text) =>
                                setReportForm({ ...reportForm, title: text })
                            }
                        />
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder="Description"
                            value={reportForm.description}
                            onChangeText={(text) =>
                                setReportForm({ ...reportForm, description: text })
                            }
                            multiline={true}
                            numberOfLines={3}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date (DD-MM-YYYY)"
                            value={reportForm.date}
                            onChangeText={(text) =>
                                setReportForm({ ...reportForm, date: text })
                            }
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: '#f9f9f9', color: Colors.lightGrey }]}
                            value={`${userDetail.firstName} ${userDetail.lastName}`}
                            editable={false}
                        />
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleAddReport}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Report Detail Modal */}
            <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedReport && (
                            <>
                                <Text style={styles.modalTitle}>{selectedReport.title}</Text>
                                <View style={styles.detailBox}>
                                    <Text style={styles.detailLabel}>Date:</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedReport.date || 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.detailBox}>
                                    <Text style={styles.detailLabel}>Description:</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedReport.description || 'N/A'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={closeReportDetails}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 16,
    },
    headerLeftButton: {
        marginLeft: 16,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
    },
    reportItem: {
        padding: 15,
        backgroundColor: Colors.lightGrey,
        borderRadius: 10,
        marginBottom: 10,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    reportDate: {
        fontSize: 14,
        color: Colors.darkGrey,
    },
    reportDescription: {
        fontSize: 14,
        color: Colors.darkGrey,
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.darkGrey,
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.white,
        width: '90%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.brandBlue,
    },
    detailBox: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        backgroundColor: Colors.brandYellow,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    saveButtonText: {
        color: Colors.brandBlue,
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.lightGrey,
    },
    cancelButtonText: {
        color: Colors.black,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#ddd',
    },
    closeButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        marginTop: 20,
    },
    editButton: {
        backgroundColor: '#92D4F2',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    descriptionInput: {
        height: 80,
        textAlignVertical: 'top',
    },
});


export default ChildReportsScreen;
