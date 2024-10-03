import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../config';
import { } from './firebasePublicDataService'
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

export const fetchUserOffers = async (userId) => {
    try {
        const col = collection(db, 'offers');
        const q = query(col, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching userOffers:', error);
        return null
    }
};

export const fetchUserOrders = async (userId) => {
    try {
        const col = collection(db, 'orders');
        const q = query(col, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching userOrders:', error);
        return null
    }
};

export const createUserOrder = async (userId, order) => {
    try {
        const col = collection(db, 'orders');
        const newOrderRef = await addDoc(col, {
            userId: userId,
            ...order, // Spread the order object to include its properties
            createdAt: new Date() // Optional: add a timestamp for when the order was created
        });
        console.log('Order created with ID:', newOrderRef.id);
        await updateDoc(newOrderRef, {
            uid: newOrderRef.id // Update the userId with the new value
        });
        return newOrderRef.id; // Return the ID of the created document
    } catch (error) {
        console.error('Error creating user order:', error);
        return null;
    }
};


export const updateRewardsPoints = async (userId,orderId, points, type) => {
    try {
        const col = collection(db, 'rewardPoints');
        await addDoc(col, {
            userId: userId,
            orderId:orderId,
            points: points, // Store the points value
            type: type, // Optional: store the type of reward or transaction
            createdAt: new Date() // Optional: add a timestamp for when the record was created
        });

        console.log('User points record added with ID:', userId, points);
    } catch (error) {
        console.error('Error adding user points record:', error);
        return null;
    }
};

export const fetchUserRewards = async (userId) => {
    try {
        const col = collection(db, 'rewardPoints');
        const q = query(col, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching rewardPoints:', error);
        return null
    }
};