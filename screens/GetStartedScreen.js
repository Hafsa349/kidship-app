import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { View, Logo, Button } from '../components';
import { Colors, Images } from '../config';

export const GetStartedScreen = ({ route, navigation }) => {
  const { navigateBackTo } = route;

  const handleGetStarted = async values => {
    navigation.navigate("LoginScreen");
  }

  return (
    <>
      <View isSafe style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            Stay closer to your{'\n'}
            child’s world with
          </Text>
          <Logo uri={Images.logo} width={210} height={210} />
        </View>
        <Button
          style={styles.button}
          title={'Get Started'}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>{'Get Started'}</Text>
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: Colors.brandBlue,
    padding: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    color: Colors.white,
    fontFamily: 'psemibold',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 32,
    color: Colors.secondary200,
    fontFamily: 'pregular',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.brandYellow,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row' // Align content horizontally
  },
  buttonText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '700'
  },
});

export default GetStartedScreen;
