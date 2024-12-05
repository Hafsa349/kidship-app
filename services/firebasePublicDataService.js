import { collection, getDocs, query, where, addDoc, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../config';

export const getPosts = async (schoolId) => {
    try {
        // Ensure schoolId is provided
        if (!schoolId) {
            throw new Error('schoolId is required to fetch posts');
        }

        // Reference the collection and apply filters
        const col = collection(db, 'posts');
        const q = query(
            col,
            where('isActive', '==', true),
            where('schoolId', '==', schoolId) // Add filter for schoolId
        );

        // Fetch the documents
        const snapshot = await getDocs(q);

        // Map the documents to the desired format
        return snapshot.docs.map(doc => ({
            id: doc.id,      // Document ID
            ...doc.data()    // Spread document data
        }));
    } catch (error) {
        console.error('Error fetching posts', error);
        return [];
    }
};

export const getEvents = async (schoolId) => {
    try {
        if (!schoolId) {
            throw new Error('schoolId is required to fetch events');
        }

        const col = collection(db, 'events');
        const q = query(
            col,
            where('schoolId', '==', schoolId)
        );

        const snapshot = await getDocs(q);

        // Log all documents for debugging
        snapshot.docs.forEach(doc => {
                      });

        // Map the documents to the desired format
        return snapshot.docs.map(doc => ({
            id: doc.id,      // Document ID
            ...doc.data()    // Event data
        }));
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};


export const addEvent = async (event) => {
    try {
        const col = collection(db, 'events');
        const docRef = await addDoc(col, event);
        return { id: docRef.id, ...event };
    } catch (error) {
        console.error('Error adding event', error);
        return null;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const eventDoc = doc(db, 'events', eventId);
        await deleteDoc(eventDoc);
        console.log(`Event ${eventId} deleted successfully.`);
        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
};


export const getSchool = async (uid) => {
    try {
        const col = collection(db, 'schools');
        const q = query(col, where('isActive', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,      // append document ID here
            ...doc.data()    // spread the document data
        }));
    } catch (error) {
        console.error('Error fetching posts', error);
        return null;
    }
};

export const addPost = async (post) => {
    try {
        const col = collection(db, 'posts');
        const docRef = await addDoc(col, post);
        console.log("Post added with ID: ", docRef.id);
        return { id: docRef.id, ...post };
    } catch (error) {
        console.error('Error adding post', error);
        return null;
    }
};
