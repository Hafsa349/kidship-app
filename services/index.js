import { fetchUserDetails, fetchUserDetailsByIds, createUser, toggleLike, addComment, getLikes, getComments,fetchUserByPhoneNumber, fetchSchoolByEmailDomain, fetchSchoolByName} from './firebaseUserService';
import { getPosts, addPost, getEvents, addEvent } from './firebasePublicDataService';
export {
    fetchUserDetails,
    fetchUserByPhoneNumber,
    fetchSchoolByEmailDomain,
    fetchSchoolByName,
    getPosts,
    fetchUserDetailsByIds,
    createUser,
    toggleLike,
    getComments,
    addComment,
    getLikes,
    addPost,
    addEvent,
    getEvents
};