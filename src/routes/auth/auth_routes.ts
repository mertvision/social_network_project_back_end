/**
 * Authentication routes for handling user authentication-related API endpoints.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing our custom modules (or classes, interfaces, etc.)
import { generateRouter } from "../../utils/router/router"; // Importing the router generator
import { register, login, logout, getMe, editInformations, editBio, changeAccountPrivacy, deleteAccount } from "../../controllers/auth/auth_controllers"; // Importing authentication controller functions
import { hasAccess } from "../../middlewares/access/access"; // Importing access middleware
import { uploadProfileImage } from "../../middlewares/upload/upload_profile_image"; // Importing profile image upload middleware

// Define an authentication router
const authRouter = generateRouter(); // Generate a new router for authentication

// Route for user registration
authRouter.post('/register', uploadProfileImage.single('image'), register); // http://localhost:PORT/api/auth/register
// Route for user login
authRouter.post('/login', login); // http://localhost:PORT/api/auth/login
// Route for retrieving current user's information, requires authentication
authRouter.get('/me', hasAccess, getMe); // http://localhost:PORT/api/auth/me
// Route for updating user information, requires authentication
authRouter.put('/edit_informations', hasAccess, editInformations); // http://localhost:PORT/api/auth/edit_informations
// Route for updating user bio information, requires authentication
authRouter.put('/edit_bio', hasAccess, editBio); // // http://localhost:PORT/api/auth/edit_bio
// Route for changing account privacy settings, requires authentication
authRouter.get('/change_account_privacy', hasAccess, changeAccountPrivacy); // http://localhost:PORT/api/auth/change_account_privacy
// Route for logging out the current user, requires authentication
authRouter.get('/logout', hasAccess, logout); // http://localhost:PORT/api/auth/logout
// Route for deleting account, requires authentication
authRouter.delete('/delete', hasAccess, deleteAccount); // http://localhost:PORT/api/auth/delete

// Exporting the authentication router
export default authRouter; // Export the authentication router

