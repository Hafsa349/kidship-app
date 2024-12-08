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

export const ChildrenScreen = ({ user, userDetail, navigation }) => {
    const [children, setChildren] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [childForm, setChildForm] = useState({ firstName: '', lastName: '', dateOfBirth: '' });
    const isEditMode = !!selectedChild; // Determine if editing
    const schoolId = userDetail?.schoolId;

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.headerRightButton}
                    onPress={() => {
                        setChildForm({ firstName: '', lastName: '', dateOfBirth: '' });
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

    const fetchChildren = async () => {
        try {
            const childrenRef = collection(db, `schools/${schoolId}/children`);
            const q = query(childrenRef, where('parentIds', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);

            const childrenList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                dateOfBirth: formatDateToDDMMYYYY(doc.data().dateOfBirth),
            }));

            setChildren(childrenList);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    const handleAddOrUpdateChild = async () => {
        const { firstName, lastName, dateOfBirth } = childForm;
    
        if (!firstName || !lastName || !dateOfBirth) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }
    
        try {
            const dobTimestamp = formatDateToTimestamp(dateOfBirth);
            const childrenRef = collection(db, `schools/${schoolId}/children`);
    
            if (isEditMode) {
                // Editing an existing child
                const childRef = doc(db, `schools/${schoolId}/children/${selectedChild.id}`);
                await updateDoc(childRef, { firstName, lastName, dateOfBirth: dobTimestamp });
                Alert.alert('Success', 'Child updated successfully.');
            } else {
                // Check if the child already exists
                const q = query(
                    childrenRef,
                    where('firstName', '==', firstName),
                    where('lastName', '==', lastName),
                    where('dateOfBirth', '==', dobTimestamp)
                );
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    // Child exists: Update parentIds
                    const existingChild = querySnapshot.docs[0];
                    const childRef = doc(db, `schools/${schoolId}/children/${existingChild.id}`);
                    const currentParentIds = existingChild.data().parentIds || [];
    
                    // Add current userId to parentIds, ensuring no duplicates
                    await updateDoc(childRef, {
                        parentIds: [...new Set([...currentParentIds, user.uid])],
                    });
                    Alert.alert('Success', 'Child linked to your profile successfully.');
                } else {
                    // Child doesn't exist: Create a new child document
                    const newChildRef = doc(childrenRef);
                    await setDoc(newChildRef, {
                        firstName,
                        lastName,
                        dateOfBirth: dobTimestamp,
                        createdAt: serverTimestamp(),
                        parentIds: [user.uid],
                    });
                    Alert.alert('Success', 'Child added successfully.');
                }
            }
    
            resetForm();
            fetchChildren(); // Refresh the children list
        } catch (error) {
            // console.error('Error saving child:', error);
            Alert.alert('Error', error);
        }
    };
    

    const handleUnlinkChild = async () => {
        try {
            const childRef = doc(db, `schools/${schoolId}/children/${selectedChild.id}`);
            const updatedParentIds = selectedChild.parentIds.filter((id) => id !== user.uid);

            if (updatedParentIds.length > 0) {
                await updateDoc(childRef, { parentIds: updatedParentIds });
                Alert.alert('Success', 'Child unlinked from your profile.');
            } else {
                await updateDoc(childRef, { parentIds: [] });
                Alert.alert('Success', 'You have removed your link to this child.');
            }

            resetForm();
            fetchChildren();
        } catch (error) {
            console.error('Error unlinking child:', error);
            Alert.alert('Error', 'Failed to unlink child.');
        }
    };

    const resetForm = () => {
        setModalVisible(false);
        setDetailModalVisible(false);
        setChildForm({ firstName: '', lastName: '', dateOfBirth: '' });
        setSelectedChild(null);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={children}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.childItem}
                        onPress={() => {
                            setSelectedChild(item);
                            setDetailModalVisible(true);
                        }}
                    >
                        <Text style={styles.childName}>{item.firstName} {item.lastName}</Text>
                        <Text style={styles.childDetails}>DOB: {item.dateOfBirth}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.noChildrenText}>No children yet. Add a child to get started.</Text>
                }
            />

            {/* Details Modal */}
            <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedChild?.firstName} {selectedChild?.lastName}
                        </Text>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Date of Birth:</Text>
                            <Text style={styles.detailValue}>{selectedChild?.dateOfBirth}</Text>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => {
                                    setChildForm({
                                        firstName: selectedChild.firstName,
                                        lastName: selectedChild.lastName,
                                        dateOfBirth: selectedChild.dateOfBirth,
                                    });
                                    setDetailModalVisible(false);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleUnlinkChild}
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
                        <Text style={styles.modalTitle}>{isEditMode ? 'Edit Child' : 'Add Child'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            value={childForm.firstName}
                            onChangeText={(text) => setChildForm({ ...childForm, firstName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={childForm.lastName}
                            onChangeText={(text) => setChildForm({ ...childForm, lastName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date of Birth (DD-MM-YYYY)"
                            value={childForm.dateOfBirth}
                            onChangeText={(text) => setChildForm({ ...childForm, dateOfBirth: text })}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddOrUpdateChild}>
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
    childItem: { padding: 15, backgroundColor: Colors.brandYellow, borderRadius: 10, marginBottom: 10 },
    childName: { fontSize: 18, fontWeight: 'bold', color: Colors.brandBlue },
    childDetails: { fontSize: 14, color: Colors.darkGrey },
    noChildrenText: { textAlign: 'center', color: Colors.darkGrey, marginTop: 20, fontSize: 16 },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-around', gap: 10, marginTop: 20 },
    cancelButton: { marginTop: 10, padding: 10, borderRadius: 10, alignItems: 'center', width: '100%' },
});

export default ChildrenScreen;
