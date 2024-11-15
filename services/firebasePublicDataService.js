import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../config';

export const getPosts = async () => {
    try {
        const col = collection(db, 'posts');
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
