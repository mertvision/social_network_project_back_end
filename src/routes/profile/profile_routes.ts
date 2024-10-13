/**
 * Users routes for handling user profile-related API endpoints.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

import {getUserProfileInformations, getProfilePostsByProfileId, getProfilePhotos, getProfileImage} from "../../controllers/profile/profile_controllers"; // Importing the function to get user profile information
import {hasAccess} from "../../middlewares/access/access"; // Importing access middleware
import {generateRouter} from "../../utils/router/router"; // Importing the router generator

const profileRouter = generateRouter(); // Creating a new router for profile routes

// Route for retrieving user profile information by profile ID
profileRouter.get('/:profile_id', hasAccess, getUserProfileInformations); // Endpoint: GET http://localhost:PORT/api/profile/:profile_id
// Route for retrieving posts by profile ID
profileRouter.get('/:profile_id/posts', hasAccess, getProfilePostsByProfileId); // Endpoint: GET http://localhost:PORT/api/profile/:profile_id/posts
// Route for retrieving profile photos
profileRouter.get('/:profile_id/photos', getProfilePhotos); // Endpoint: GET http://localhost:PORT/api/profile/:profile_id/photos
// Route for retrieving profile image
profileRouter.get('/:profile_id/profile_image', getProfileImage); // Endpoint: GET http://localhost:PORT/api/profile/:profile_id/profile_image

export default profileRouter; // Exporting the profile router
