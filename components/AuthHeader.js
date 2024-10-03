import { View, TouchableOpacity, StyleSheet } from 'react-native'; // Assuming you're using React Native
import { Logo, Icon } from '.';
import { Images, Colors } from '../config'

export const AuthHeader = ({ navigationTo, navigation }) => {
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {navigationTo && (
                    <TouchableOpacity onPress={() => navigation.navigate(navigationTo)}>
                        <Icon name="keyboard-backspace" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.headerCenter}>
                {/* Adjusting the width of the logo container to center it */}
                <View style={styles.logoContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
                        <Logo uri={Images.logo} width={100} height={50} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLeft: {
        paddingTop: 80,
        paddingRight: 0, // Adjusted padding to create space between the back button and the logo
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center', // Centering the logo horizontally
        paddingTop: 60,
    },
});