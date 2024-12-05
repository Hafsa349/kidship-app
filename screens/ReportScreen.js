import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Colors } from '../config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config';
import AntDesign from '@expo/vector-icons/AntDesign';

export const ReportScreen = ({ user, userDetail, allowEditing, navigation }) => {
    const [children, setChildren] = useState([]);
    const [searchText, setSearchText] = useState('');
    const schoolId = userDetail?.schoolId;


    const fetchChildren = async () => {
        if (!schoolId) return; // Ensure schoolId is provided

        try {
            const childrenRef = collection(db, `schools/${schoolId}/children`);
            let q;

            if (allowEditing) {
                // Fetch all children in the school with teacherIds containing the current user
                q = query(childrenRef, where('teacherIds', 'array-contains', user.uid));
            } else {
                // Fetch children with parentIds containing the current user
                q = query(childrenRef, where('parentIds', 'array-contains', user.uid));
            }

            const querySnapshot = await getDocs(q);

            const childrenList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Apply search filter
            const filteredChildren = childrenList.filter((child) =>
                `${child.firstName} ${child.lastName}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );

            setChildren(filteredChildren);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, [allowEditing, searchText]);

    const renderChildItem = ({ item }) => (
        <TouchableOpacity
            style={styles.childItem}
            onPress={() =>
                navigation.navigate('ChildReportsScreen', {
                    allowEditing, // Pass allowEditing directly
                    childId: item.id,
                    childName: `${item.firstName} ${item.lastName}`,
                    userDetail, // Pass the entire userDetail object
                })
            }
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {item.firstName[0]}
                    {item.lastName[0]}
                </Text>
            </View>
            <View>
                <Text style={styles.childName}>
                    {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.childReports}>
                    {item.reportCount || 0}{' '}
                    {item.reportCount === 1 ? 'Report' : 'Reports'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for a child..."
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={children}
                keyExtractor={(item) => item.id}
                renderItem={renderChildItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No children found with reports.
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerButton: { marginRight: 16 },
    container: { flex: 1, backgroundColor: Colors.white, padding: 16 },
    searchBar: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
        borderWidth: 1, 
        borderColor: '#ddd'
    },
    childItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.brandYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: { fontSize: 20, fontWeight: 'bold', color: Colors.brandBlue },
    childName: { fontSize: 16, fontWeight: 'bold', color: Colors.black },
    childReports: { fontSize: 14, color: Colors.darkGrey },
    emptyText: { textAlign: 'center', color: Colors.darkGrey, marginTop: 20 },
});

export default ReportScreen;
