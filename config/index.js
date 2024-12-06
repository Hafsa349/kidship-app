import { Images } from './images.js';
import { Colors } from './theme.js';
import { auth, db, expoConfig, storage } from './firebase.js';


const ADMIN_ROLES = ["teacher", "admin"];
const PARENT_ROLES = ["parent"];


export { Images, Colors, auth, db, expoConfig, storage, ADMIN_ROLES, PARENT_ROLES};
