/**
 * Upload routes.
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing custom modules
import {uploadSingleCoverImage, uploadSingleProfileImage} from "../../controllers/upload/upload_controllers"; // Importing upload controller functions
import {hasAccess} from "../../middlewares/access/access"; // Importing access middleware
import {uploadCoverImage} from "../../middlewares/upload/upload_cover_image"; // Importing cover image upload middleware
import {uploadProfileImage} from "../../middlewares/upload/upload_profile_image"; // Importing profile image upload middleware
import {generateRouter} from "../../utils/router/router"; // Importing the router generator

// Define a router
const uploadRouter = generateRouter(); // Creating a new router for upload routes

// Route for uploading a profile image
uploadRouter.post('/profile_image', [hasAccess, uploadProfileImage.single('image')], uploadSingleProfileImage); // Endpoint: POST http://localhost:PORT/api/upload/profile_image
// Route for uploading a cover image
uploadRouter.post('/cover_image', [hasAccess, uploadCoverImage.single('image')], uploadSingleCoverImage); // Endpoint: POST http://localhost:PORT/api/upload/cover_image

export default uploadRouter; // Exporting the upload router
