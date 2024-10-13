/**
 * Main file for server routes.
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Import Statement of Our Custom Modules (classes, interfaces, routes, etc.)
import {generateRouter} from "../utils/router/router"; // Module for generating a new router
import authRouter from "./auth/auth_routes"; // Authentication routes
import postRouter from "./post/post_routes"; // Post routes
import profileRouter from "./profile/profile_routes"; // User-related routes
import uploadRouter from "./upload/upload_routes"; // Upload routes
import friendshipRouter from "./friendship/friendship_routes"; // Friendship routes

// Creating a new router
const router = generateRouter(); // Create a new router instance

/* Defining server routes
API Endpoints */
router.use('/auth', authRouter); // http://localhost:PORT/api/auth
router.use('/post', postRouter); // http://localhost:PORT/api/post
router.use('/profile', profileRouter); // http://localhost:PORT/api/profile
router.use('/upload', uploadRouter); // http://localhost:PORT/api/upload
router.use('/friendship', friendshipRouter); // http://localhost:PORT/api/friendship

// Exporting the router
export default router; // Export the main router

