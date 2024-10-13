/**
 * Comment routes
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules from Express
import express from "express"; // Importing Express
// Importing custom modules for comment-related functionalities
import {addNewCommentToPost, getAllCommentsOfSinglePost } from "../../controllers/comment/comment_controllers"; // Importing comment controller functions
// Importing access middleware to control user permissions
import {hasAccess} from "../../middlewares/access/access"; // Importing access middleware

// Creating an Express Router instance with merged parameters
const commentRouter = express.Router({mergeParams: true}); // Create a new router instance

// Route to add a new comment to a specific post
commentRouter.post('/', hasAccess, addNewCommentToPost); // Endpoint: POST http://localhost:PORT/api/post/:post_id/comments/
// Route to retrieve all comments for a specific post
commentRouter.get('/', getAllCommentsOfSinglePost); // Endpoint: GET http://localhost:PORT/api/post/:post_id/comments/

// Exporting the configured router for use in other parts of the application
export default commentRouter; // Export the comment router
