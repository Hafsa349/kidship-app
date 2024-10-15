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
