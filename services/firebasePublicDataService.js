import { collection, getDocs, query, where } from "firebase/firestore";
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
