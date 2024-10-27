import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { Images, Colors, auth } from '../config';
import { AuthenticatedUserContext } from '../providers';

export const HeaderComponent = ({ navigation, title, navigationTo, authUser = null }) => {
  const { user } = useContext(AuthenticatedUserContext);
    
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {navigationTo ? (
                    <TouchableOpacity style={{ paddingTop: 20, paddingBottom: 10 }} onPress={() => navigation.goBack()}>
                        <Icon name="keyboard-backspace" size={30} color={Colors.white} />
                    </TouchableOpacity>
                ) : (
                    <Logo uri={Images.logo} width={60} height={60} />
                )}
            </View>
            <View style={styles.headerCenter}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.headerRight}>
                <>
                    {user &&
                        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                            <Icon name="bell-outline" size={32} color={Colors.white} />
                        </TouchableOpacity>
                    }
                </>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: Colors.brandBlue,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.50,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 60,
    },
    headerLeft: {
        flex: 1,
    },
    headerCenter: {
        flex: 2,
        justifyContent: 'center',
        paddingTop: 10,
        alignItems: 'center',
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
        paddingTop: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
    },
});
