import { collection, getDocs, getDoc, query, where, doc } from "firebase/firestore";
import { db } from '../config';
export const getBanners = async () => {
    try {
        const col = collection(db, 'banners');
        const q = query(col, where('active', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching getBanners', error);
        return null
    }
};
