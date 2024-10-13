/**
 * Post routes for handling post-related API endpoints.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing our custom modules (or classes, interfaces, etc.)
import {addNewPost, editSinglePost, deleteSinglePost, likeSinglePost, undolikeSinglePost, getFeedPosts} from "../../controllers/post/post_controllers"; // Importing post controller functions
import {hasAccess} from "../../middlewares/access/access"; // Importing access middleware
import {uploadFile} from "../../middlewares/upload/upload_post_files"; // Importing file upload middleware
import {generateRouter} from "../../utils/router/router"; // Importing router generator
import commentRouter from "../comment/comment_routes"; // Importing comment router

// Define a post router
const postRouter = generateRouter(); // Create a new router instance

// Route for creating a new post
postRouter.post('/', [hasAccess, uploadFile.fields([{ name: 'image' }, { name: 'file' }])], addNewPost); // Endpoint: POST http://localhost:PORT/api/post/
// Route for editing a post by its ID
postRouter.put('/edit/:post_id', hasAccess, editSinglePost); // Endpoint: PUT http://localhost:PORT/api/post/edit/:post_id
// Route for deleting a post by its ID
postRouter.delete('/delete/:post_id', hasAccess, deleteSinglePost); // Endpoint: DELETE http://localhost:PORT/api/post/delete/:post_id
// Route for liking a post by its ID
postRouter.put('/like/:post_id', hasAccess, likeSinglePost); // Endpoint: PUT http://localhost:PORT/api/post/like/:post_id
// Route for undoing a like on a post by its ID
postRouter.put('/undolike/:post_id', hasAccess, undolikeSinglePost); // Endpoint: PUT http://localhost:PORT/api/post/undolike/:post_id
// Route for retrieving feed posts
postRouter.get('/feed/posts', hasAccess, getFeedPosts); // Endpoint: GET http://localhost:PORT/api/post/feed/posts

// Use the comment router for handling comments related to a specific post
postRouter.use('/:post_id/comments', commentRouter); // Route for comments on a specific post

// Exporting the post router
export default postRouter; // Export the post router
