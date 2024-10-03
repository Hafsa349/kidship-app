import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { Images, Colors } from '../config';
import { CartContext } from '../providers';


export const HeaderComponent = ({ navigation, title, navigationTo, displayCartIcon = true }) => {
    const { getCartQuantity } = useContext(CartContext);
    const cartQuantity = getCartQuantity();

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {navigationTo ? (
                    <TouchableOpacity style={{ paddingTop: 18 }} onPress={() => navigation.goBack()}>
                        <Icon name="keyboard-backspace" size={30} color="black" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                        <Logo uri={Images.logo} width={80} height={60} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.headerCenter}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.headerRight}>
                {displayCartIcon && (
                    <>
                        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
                            <Icon name="shopping-outline" size={32} color={Colors.darkGrey} />
                            {cartQuantity > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cartQuantity}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </>
                )}
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
        backgroundColor: Colors.white,
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
        alignItems: 'center',
        paddingTop: 16,
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
        paddingTop: 22,
    },
    cartBadge: {
        position: 'absolute',
        right: -10,
        top: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
    },
});
