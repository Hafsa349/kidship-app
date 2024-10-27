import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../config';
export const fetchUserDetails = async (uid) => {
    try {
        console.log('Fetching user details', uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return { ...docSnap.data(), uid };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error('Error fetching user detail:', error);
        return null
    }
};

export const fetchUserDetailsByIds = async (userIds) => {
    try {
      const userDetails = await Promise.all(
        userIds.map(async (uid) => {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            return { ...docSnap.data(), uid };
          } else {
            console.log(`No document found for user ID: ${uid}`);
            return { uid, name: "Unknown", image_url: "https://path/to/dummy-avatar.png" }; // Default values for missing users
          }
        })
      );
      return userDetails;
    } catch (error) {
      console.error('Error fetching user details in bulk:', error);
      return null;
    }
  };

export const fetchUserByPhoneNumber = async (phoneNumber) => {
    try {
        const usersCollectionRef = collection(db, 'users');
        const phoneNumberQuery = query(usersCollectionRef, where('phoneNumber', '==', phoneNumber));
        const querySnapshot = await getDocs(phoneNumberQuery);

        if (!querySnapshot.empty) {
            // Assuming there's only one document with a given phone number
            const userData = querySnapshot.docs[0].data();
            console.log("Document data:", userData);
            return userData;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error('Error fetching user detail by phonenumber:', error);
        return null;
    }
};
