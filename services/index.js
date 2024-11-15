import { fetchUserDetails, fetchUserDetailsByIds, createUser, toggleLike, addComment, getLikes, getComments,fetchUserByPhoneNumber } from './firebaseUserService';
import { getPosts, addPost } from './firebasePublicDataService';
export {
    fetchUserDetails,
    fetchUserByPhoneNumber,
    getPosts,
    fetchUserDetailsByIds,
    createUser,
    toggleLike,
    getComments,
    addComment,
    getLikes,
    addPost
};