import React, { useState, useContext, useEffect, useRef } from 'react';
import { Image, Dimensions, Animated, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, auth } from '../config';
import { HeaderComponent, LoginComponent, Button } from '../components';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { fetchUserDetails, getBanners, getOffers } from '../services';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = screenWidth * 0.9; // Take 80% of the screen width for the item
const ITEM_WIDTH_OFFERS = screenWidth * 0.43; // Take 80% of the screen width for the item
const ITEM_HEIGHT = 300;
const OVERLAP_RATIO = 0.01; // Adjust overlap ratio as needed

export const HomeScreen = ({ navigation }) => {
  const navigator = useNavigation();
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerData = await getBanners();
        setBanners(bannerData.sort((a, b) => a.sort - b.sort));

        const whatsNewData = await getOffers();
        setWhatsNew(whatsNewData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData(); // Call fetchData only when component mounts
  }, []); // Empty dependency array to ensure it runs only once on mount

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userDetails = await fetchUserDetails(user.uid);
          console.log('userDetails', userDetails)
          setUserDetail(userDetails);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);


  return (
    <>
      <HeaderComponent navigation={navigation} />
      {loading && (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      )}
      <ScrollView>
        {/* Banners */}
        <View>
          {/* User Details Section */}
          {!user && <LoginComponent navigation={navigation} />}

        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.white,
  },
  titleText: {
    fontSize: 16,
    paddingTop: 10,
    fontWeight: '600'
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
    marginLeft: 18,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.yellow,
    padding: 14,
    borderRadius: 8,
    width: '92%'
  },
  buttonText: {
    fontSize: 20,
    color: Colors.darkGrey,
    fontWeight: '700'
  },
  title: {
    fontSize: 22,
    marginBottom: 4,
    fontWeight: '600',
    alignItems: 'center',
  }
});

export default HomeScreen;
