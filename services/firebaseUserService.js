import { collection, doc, getDoc, getDocs, query, where, setDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../config';

// 1. Fetch a Single User's Details
export const fetchUserDetails = async (uid) => {
    if (!uid) {
        console.error("Missing uid in fetchUserDetails.");
        return null;
    }

    try {
        const docRef = doc(db,  "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...docSnap.data(), uid };
        } else {
            console.warn(`User with ID ${uid} does not exist.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching user details`, error);
        return null;
    }
};

// 2. Fetch Multiple User Details by IDs (Within a School)
export const fetchUserDetailsByIds = async (userIds) => {
    if (userIds && !Array.isArray(userIds) || userIds.length === 0) {
        return [];
    }

    try {
        const userDetails = await Promise.all(
            userIds.map(async (uid) => {
                const docRef = doc(db,  "users", uid);
                const docSnap = await getDoc(docRef);

                return docSnap.exists()
                    ? { ...docSnap.data(), uid }
                    : { uid, name: "Unknown", image_url: "https://path/to/dummy-avatar.png" }; // Default fallback
            })
        );
        return userDetails;
    } catch (error) {
        console.error(`Error fetching user details in bulk`, error);
        return [];
    }
};

// 3. Create or Update a User (Within a School)
export const createUser = async (uid, user) => {
    if (!uid || !user) {
        console.error("Invalid parameters in createUser.");
        return;
    }

    try {
        await setDoc(doc(db,  "users", uid), user, { merge: true });
        console.log(`User with ID ${uid} successfully created/updated.`);
    } catch (error) {
        console.error(`Error creating/updating user with ID ${uid}`, error);
    }
};

// 4. Fetch User by Phone Number (Within a School)
export const fetchUserByPhoneNumber = async (phoneNumber) => {
    if (!phoneNumber) {
        console.error("Invalid parameters in fetchUserByPhoneNumber.");
        return null;
    }

    try {
        const usersRef = collection(db,  "users");
        const phoneQuery = query(usersRef, where("phoneNumber", "==", phoneNumber));
        const querySnapshot = await getDocs(phoneQuery);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data(); // Return the first matched document
        } else {
            console.log(`No user found with phone number ${phoneNumber}.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching user by phone number in school`, error);
        return null;
    }
};

export const fetchSchoolByEmailDomain = async (emailDomain) => {
  if (!emailDomain) {
      console.error("Invalid parameters in fetchSchoolByEmailDomain.");
      return null;
  }

  try {
      const usersRef = collection(db, "schools");
      const phoneQuery = query(usersRef, where("emailDomain", "==", emailDomain));
      const querySnapshot = await getDocs(phoneQuery);

      if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data(); // Return the first matched document
      } else {
          console.warn(`No school found with email domain ${emailDomain}`);
          return null;
      }
  } catch (error) {
      console.error(`Error fetching school by email domain`, error);
      return null;
  }
};

export const fetchSchoolByName = async (name) => {
    if (!name) {
        console.error("Invalid parameters in fetchSchoolName.");
        return null;
    }

    try {
        const usersRef = collection(db, "schools");
        
        // To perform a "starts with" query, we use `startAt` and `endAt`
        // It will match names that start with the provided `name` value
        const nameQuery = query(
            usersRef, 
            where("name", ">=", name), // Start at the name
            where("name", "<", name + '\uf8ff') // End at the end of the name string
        );

        const querySnapshot = await getDocs(nameQuery);

        if (!querySnapshot.empty) {
            // Return the matched documents
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
        } else {
            console.warn(`No school found with name starting with ${name}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching school name`, error);
        return null;
    }
};

// 5. Toggle Like for a Post (Within a School)
export const toggleLike = async (postId, userId, isLiked) => {
    if (!postId || !userId) {
        console.error("Invalid parameters in toggleLike.");
        return;
    }

    const likeRef = doc(db, "posts", postId, "likes", userId);
    const currentDateTime = new Date();

    try {
        if (isLiked) {
            await deleteDoc(likeRef); // Remove the like
        } else {
            await setDoc(likeRef, {
                liked: true,
                createdAt: currentDateTime,
            });
        }
        console.log(`Toggled like for user ${userId} on post ${postId}`);
    } catch (error) {
        console.error(`Error toggling like for post ${postId}`, error);
    }
};

// 6. Get Likes for a Post (Within a School)
export const getLikes = async (postId) => {
    if (!postId) {
        console.error("Invalid parameters in getLikes.");
        return [];
    }

    try {
        const likesSnapshot = await getDocs(collection(db,  "posts", postId, "likes"));
        return likesSnapshot.docs.map(doc => doc.id); // Return user IDs who liked
    } catch (error) {
        console.error(`Error fetching likes for post ${postId}`, error);
        return [];
    }
};

// 7. Add a Comment to a Post (Within a School)
export const addComment = async (postId, commentText, authorId) => {
    if (!postId || !commentText || !authorId) {
        console.error("Invalid parameters in addComment.");
        return;
    }

    const currentDateTime = new Date();
    try {
        const newComment = {
            text: commentText,
            authorId,
            createdAt: currentDateTime,
        };

        await addDoc(collection(db,  "posts", postId, "comments"), newComment);
        console.log(`Added comment by user ${authorId} to post ${postId}`);
    } catch (error) {
        console.error(`Error adding comment to post ${postId}`, error);
    }
};

// 8. Get All Comments for a Post (Within a School)
export const getComments = async ( postId) => {
    if (!postId) {
        console.error("Invalid parameters in getComments.");
        return [];
    }

    try {
        const commentsSnapshot = await getDocs(collection(db, "posts", postId, "comments"));
        return commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}`, error);
        return [];
    }
};
