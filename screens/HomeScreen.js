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
  bannerContainer: {
    marginLeft: 20,
    marginTop: 24

  },
  container: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.white,
  },
  featuredContainer: {
    marginTop: 20,
    marginLeft: 0,
    marginRight: 0,
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

  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 16, // Adjust padding as needed
  },
  qrSection: {
    backgroundColor: Colors.yellow,
    borderRadius: 14,
    color: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  qrCodeContainer: {
    padding: 16,
    paddingRight: 0,
  },
  pointsBalanceContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 20,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  customerName: {
    fontWeight: 'bold',
    color: Colors.black,
    fontSize: 22,
    textTransform: 'uppercase',
    paddingTop: 12,
  },
  featuredImageContainer: {
    width: ITEM_WIDTH, // Take 80% of the screen width for the item
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 2, // Add spacing between images
  },
  imageSpacing: {
    marginRight: screenWidth * OVERLAP_RATIO, // Adjust overlap spacing
  },
  featuredImage: {
    flex: 1,
    opacity: 0.9,
    resizeMode: 'cover',
  },
  offersFeaturedImageContainer: {
    width: ITEM_WIDTH_OFFERS, // Take 80% of the screen width for the item
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 2, // Add spacing between images
  },
  offersFeaturedImage: {
    flex: 1,
    opacity: 0.9,
    resizeMode: 'cover',
  },
});

export default HomeScreen;
