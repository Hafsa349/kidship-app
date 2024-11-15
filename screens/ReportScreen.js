import React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';


const reportsData = [
    {
        'id': 1,
        'date': 'time',
        'title': 'Social and Emocial Skills',
        'desc': 'I like to have special jobs at my childminder’s. I like stories and will listen for a short period with',
        'teacher': {
            'id': 1,
        },
        'parent': {
            'id': 2,
        },
        'child': {
            'id': 3,
            'name': 'Theo'
        }

    },
    {
        'id': 2,
        'date': 'time',
        'title': 'Communication Skills',
        'desc': 'I like stories and will listen for a short period with. I like to have special jobs at my childminder’s',
        'teacher': {
            'id': 1,
        },
        'parent': {
            'id': 2,
        },
        'child': {
            'id': 4,
            'name': 'Cleo'
        }

    }
]

export const ReportScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <MaterialCommunityIcons name="file-star" size={30} color="#f5b22d" style={styles.icon} />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={1}>{item.desc}</Text>
            </View>
            <Text style={styles.timeText}>Time</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={reportsData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    timeText: {
        fontSize: 14,
        color: '#999',
    },
});