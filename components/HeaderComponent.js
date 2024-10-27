import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView } from 'react-native';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { Images, Colors, auth } from '../config';
import { AuthenticatedUserContext } from '../providers';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export const HeaderComponent = ({ navigation, title, navigationTo, authUser = null }) => {
    const { user } = useContext(AuthenticatedUserContext);

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <View style={styles.headerLeft}>
                    {navigationTo ? (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="keyboard-backspace" size={26} color={Colors.brandBlue} />
                        </TouchableOpacity>
                    ) : (
                        <Logo uri={Images.logoIcon} width={80} height={40} />
                    )}
                </View>
                <View style={styles.headerCenter}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.headerRight}>
                    <>
                        {user &&
                            <><TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                                <MaterialCommunityIcons name="medal" size={26} color="#f5b22d" />
                            </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                                    <MaterialCommunityIcons name="message-processing" size={26} color="#f5b22d" />
                                </TouchableOpacity></>
                        }
                    </>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.brandBlue,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 3,
        paddingHorizontal: 10,
        height: 60,


    },
    headerLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'center'
    },
    headerCenter: {
        flex: 2,
        alignSelf: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'center',
        gap: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'regular',
        color: Colors.brandYellow,
    },
});
