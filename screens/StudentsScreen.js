import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config';
import { Colors } from '../config';

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
    return Timestamp.fromDate(new Date(`${year}-${month}-${day}`));
};

export const StudentsScreen = ({ user, userDetail, navigation }) => {
    const [students, setStudents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({ firstName: '', lastName: '', dateOfBirth: '' });
    const isEditMode = !!selectedStudent; // Determine if editing
    const schoolId = userDetail?.schoolId;

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.headerRightButton}
                    onPress={() => {
                        setStudentForm({ firstName: '', lastName: '', dateOfBirth: '' });
                        setModalVisible(true);
                    }}
                >
                    <AntDesign name="pluscircle" size={32} color={Colors.brandYellow} />
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeftButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.brandBlue} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchStudents = async () => {
        try {
            const studentsRef = collection(db, `schools/${schoolId}/children`);
            const q = query(studentsRef, where('teacherIds', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);

            const studentsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                dateOfBirth: formatDateToDDMMYYYY(doc.data().dateOfBirth),
            }));

            setStudents(studentsList);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleAddOrUpdateStudent = async () => {
        const { firstName, lastName, dateOfBirth } = studentForm;

        if (!firstName || !lastName || !dateOfBirth) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }

        try {
            const dobTimestamp = formatDateToTimestamp(dateOfBirth);
            const studentsRef = collection(db, `schools/${schoolId}/children`);

            if (isEditMode) {
                // Editing an existing student
                const studentRef = doc(db, `schools/${schoolId}/children/${selectedStudent.id}`);
                await updateDoc(studentRef, { firstName, lastName, dateOfBirth: dobTimestamp });
                Alert.alert('Success', 'Student updated successfully.');
            } else {
                // Check if the student already exists
                const q = query(
                    studentsRef,
                    where('firstName', '==', firstName),
                    where('lastName', '==', lastName),
                    where('dateOfBirth', '==', dobTimestamp)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Student exists: Update teacherIds
                    const existingStudent = querySnapshot.docs[0];
                    const studentRef = doc(db, `schools/${schoolId}/children/${existingStudent.id}`);
                    const currentTeacherIds = existingStudent.data().teacherIds || [];

                    // Add current userId to teacherIds, ensuring no duplicates
                    await updateDoc(studentRef, {
                        teacherIds: [...new Set([...currentTeacherIds, user.uid])],
                    });
                    Alert.alert('Success', 'Student linked to your profile successfully.');
                } else {
                    // Student doesn't exist: Create a new student document
                    const newStudentRef = doc(studentsRef);
                    await setDoc(newStudentRef, {
                        firstName,
                        lastName,
                        dateOfBirth: dobTimestamp,
                        createdAt: serverTimestamp(),
                        teacherIds: [user.uid],
                    });
                    Alert.alert('Success', 'Student added successfully.');
                }
            }

            resetForm();
            fetchStudents(); // Refresh the students list
        } catch (error) {
            console.error('Error saving student:', error);
            Alert.alert('Error', 'Failed to save student.');
        }
    };

    const handleUnlinkStudent = async () => {
        try {
            const studentRef = doc(db, `schools/${schoolId}/children/${selectedStudent.id}`);
            const updatedTeacherIds = selectedStudent.teacherIds.filter((id) => id !== user.uid);

            if (updatedTeacherIds.length > 0) {
                await updateDoc(studentRef, { teacherIds: updatedTeacherIds });
                Alert.alert('Success', 'Student unlinked from your profile.');
            } else {
                await updateDoc(studentRef, { teacherIds: [] });
                Alert.alert('Success', 'You have removed your link to this student.');
            }

            resetForm();
            fetchStudents();
        } catch (error) {
            console.error('Error unlinking student:', error);
            Alert.alert('Error', 'Failed to unlink student.');
        }
    };

    const resetForm = () => {
        setModalVisible(false);
        setDetailModalVisible(false);
        setStudentForm({ firstName: '', lastName: '', dateOfBirth: '' });
        setSelectedStudent(null);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.studentItem}
                        onPress={() => {
                            setSelectedStudent(item);
                            setDetailModalVisible(true);
                        }}
                    >
                        <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
                        <Text style={styles.studentDetails}>DOB: {item.dateOfBirth}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.noStudentsText}>No students yet. Add a student to get started.</Text>
                }
            />

            {/* Details Modal */}
            <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedStudent?.firstName} {selectedStudent?.lastName}
                        </Text>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Date of Birth:</Text>
                            <Text style={styles.detailValue}>{selectedStudent?.dateOfBirth}</Text>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => {
                                    setStudentForm({
                                        firstName: selectedStudent.firstName,
                                        lastName: selectedStudent.lastName,
                                        dateOfBirth: selectedStudent.dateOfBirth,
                                    });
                                    setDetailModalVisible(false);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleUnlinkStudent}
                            >
                                <Text style={styles.buttonText}>Unlink</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add/Edit Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditMode ? 'Edit Student' : 'Add Student'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            value={studentForm.firstName}
                            onChangeText={(text) => setStudentForm({ ...studentForm, firstName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={studentForm.lastName}
                            onChangeText={(text) => setStudentForm({ ...studentForm, lastName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date of Birth (DD-MM-YYYY)"
                            value={studentForm.dateOfBirth}
                            onChangeText={(text) => setStudentForm({ ...studentForm, dateOfBirth: text })}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddOrUpdateStudent}>
                            <Text style={styles.saveButtonText}>{isEditMode ? 'Update' : 'Save'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRightButton: { marginRight: 16 },
    headerLeftButton: { marginLeft: 16 },
    container: { flex: 1, backgroundColor: Colors.white, padding: 20 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: Colors.brandBlue },
    detailBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginBottom: 15 },
    detailLabel: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    detailValue: { fontSize: 16, color: '#333' },
    input: { borderWidth: 1, borderColor: Colors.lightGrey, borderRadius: 10, padding: 10, marginBottom: 15 },
    saveButton: { backgroundColor: Colors.brandYellow, padding: 10, borderRadius: 10, alignItems: 'center' },
    saveButtonText: { color: Colors.brandBlue, fontWeight: 'bold', fontSize: 16 },
    editButton: { backgroundColor: Colors.brandYellow, padding: 10, borderRadius: 10, flex: 1, alignItems: 'center' },
    deleteButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 10, flex: 1, alignItems: 'center' },
    closeButton: { backgroundColor: Colors.lightGrey, padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    closeButtonText: { color: Colors.black, fontWeight: 'bold' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    studentItem: { padding: 15, backgroundColor: Colors.brandYellow, borderRadius: 10, marginBottom: 10 },
    studentName: { fontSize: 18, fontWeight: 'bold', color: Colors.brandBlue },
    studentDetails: { fontSize: 14, color: Colors.darkGrey },
    noStudentsText: { textAlign: 'center', color: Colors.darkGrey, marginTop: 20, fontSize: 16 },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-around', gap: 10, marginTop: 20 },
    cancelButton: { marginTop: 10, padding: 10, borderRadius: 10, alignItems: 'center', width: '100%' },
});

export default StudentsScreen;
