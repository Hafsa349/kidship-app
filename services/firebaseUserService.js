import { collection, doc, getDoc, getDocs, query, where, setDoc, addDoc, updateDoc } from "firebase/firestore";
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

export const createUser = async(uid, user)=>{
  setDoc(doc(db, "users", uid), user);
}

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


// Toggle like for a specific post
// postId, userId, isLiked)
export const toggleLike = async (postId, userId, isLiked) => {
  const likeRef = doc(db, 'posts', postId, 'likes', userId);
  const currentDateTime = new Date(); // Get current date and time

  try {
    if (isLiked) {
      // Update the existing like document to mark it as inactive and add an unlike timestamp
      await updateDoc(likeRef, {
        liked: false,
        updatedAt: currentDateTime, // set unlike timestamp
      });
    } else {
      // Set or update the document to mark it as active and add a like timestamp
      await setDoc(likeRef, {
        liked: true,
        createdAt: currentDateTime, // set like timestamp
        updatedAt: currentDateTime,
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};
// Get all likes for a specific post, returning user IDs who liked
export const getLikes = async (postId) => {
  const likesSnapshot = await getDocs(collection(db, "posts", postId, "likes"));
  return likesSnapshot.docs
    .filter(doc => doc.data().liked) // Only count active likes
    .map(doc => doc.id); // Return array of user IDs with active likes
};

// Add a comment to a specific post
export const addComment = async (postId, commentText, authorId) => {
  const currentDateTime = new Date();
  try {
    // Add a comment as an object with text and timestamp
    const newComment = {
      text: commentText,
      authorId: authorId,
      createdAt: currentDateTime, // Store the current timestamp
    };

    // Add the comment to the Firestore collection
    await addDoc(collection(db, "posts", postId, "comments"), newComment);
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

// Get all comments for a specific post
export const getComments = async (postId) => {
  console.log('comments')
  const commentsSnapshot = await getDocs(collection(db, "posts", postId, "comments"));
  const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(comments)
  return comments;
};

