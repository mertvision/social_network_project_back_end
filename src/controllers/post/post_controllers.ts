/**
 * Post controllers for the post routes
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules from Express and Mongoose
import {Request, Response, NextFunction} from "express"; // Types for request, response, and middleware
import mongoose from "mongoose"; // Mongoose for MongoDB object modeling
// Importing custom modules for error handling, question schema, and slug generation
import CustomError from "../../utils/error/CustomError"; // Custom error handling
// Importing custom schemes for MongoDB using mongoose
import Post from "../../schemes/post/post_schema"; // Question schema for database operations

/**
 * Controller to handle asking a new question.
 *
 * @async
 * @function addNewPost
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const addNewPost = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const auth_user_id = req.user?.id; // Get authenticated user ID
        const {content} = req.body; // Extract content from request body
        // Create a new post with user ID and content
        const post = await Post.create({
            user_id: auth_user_id,
            content: content,
        });
    
        const files = req.files; // Retrieve files from the request
        console.log(files); // Log files for debugging

        const fileNames: string[] = []; // Array to hold file names

        // Check if files is an array
        if (Array.isArray(files)) {
            for (let index: number = 0; index < files.length; index++) {
                const file_name: string = files[index]?.filename; // Get file name
                if (file_name) {
                    fileNames.push(file_name); // Add file name to the array
                }
            }
        } else if (typeof files === 'object') {
            // If files is an object
            for (const key in files) {
                const fileArray = files[key]; // Get file array
                if (Array.isArray(fileArray)) {
                    for (let index: number = 0; index < fileArray.length; index++) {
                        const file_name: string = fileArray[index]?.filename; // Get file name
                        if (file_name) {
                            fileNames.push(file_name); // Add file name to the array
                        };
                    };
                };
            };
        };

        console.log("Eklenecek dosya adları:", fileNames); // Log the file names to be added
        post.files.push(...fileNames); // Add file names to the post
        await post.save(); // Save the post

        // Populate the post with user information
        const populatedPost = await Post.findById(post._id).populate('user_id', 'user_id first_name last_name');

        return res.status(200).json({
            success: true,
            post: populatedPost // Return the populated post
        });
    } catch (err) {
        // Handle any errors that occur during the process
        return next(err);
    };
};

/**
 * Controller to edit an existing question.
 *
 * @async
 * @function editSinglePost
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const editSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {post_id} = req.params; // Extract post ID from parameters
        const content = req.body.content; // Get new content from request body

        // Find the post by ID
        let post = await Post.findById(post_id);

        // If no post is found, throw an error
        if (!post) {
            return next(new CustomError("There is no question with that id.", 404));
        };

        // Update post fields
        post.content = content; // Update content

        // Save the updated post
        await post.save();

        // Respond with a success message and the updated post
        return res.status(200).json({
            message: "Your question has been updated.",
            new_content: post.content // Return the updated content
        });
    } catch (err) {
        // Handle any errors that occur during the process
        return next(err);
    };
};

/**
 * Controller to delete a question by its ID.
 *
 * @async
 * @function deleteSinglePost
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const deleteSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let authUserId = req.user?.id; // Get authenticated user ID
        let question_id; // Declare variable for question ID

        // Validate the presence of question ID in the request parameters
        if (!req.params.questionId) {
            return next(new CustomError("Please provide a question id", 400));
        };

        // Validate that the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
            return next(new CustomError("Please provide a validated question id", 400));
        };

        question_id = req.params.questionId; // Get question ID from parameters

        // Find the question by ID
        const question = await Post.findById(question_id);

        // If no question is found, throw an error
        if (!question) {
            return next(new CustomError("There is no question with that id.", 404));
        };

        // Check if the authenticated user is the owner of the question
        if (String(question.user_id) == authUserId) {
            // Delete the question if the user is the owner
            await Post.findByIdAndDelete(question_id);
            return res.status(200).json({
                success: true,
                message: "Your question has been deleted.", // Confirmation message
            });
        };

        // If the user is not the owner, respond with an error message
        return res.status(400).json({
            success: false,
            message: "You cannot delete this question." // Error message
        });
    } catch (err) {
        // Handle any errors that occur during the process
        return next(err);
    };
};
/**
 * Controller to like a question.
 *
 * @async
 * @function likeSinglePost
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const likeSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth_user_id = req.user?.id; // Get authenticated user ID
        const post_id = req.params.post_id; // Get post ID from request parameters

        // Find the post by ID
        const post = await Post.findById(post_id);

        if (!post) {
            return next(new CustomError("Post couldn't be found.", 400)); // Error if post is not found
        };

        const post_likes: mongoose.Schema.Types.ObjectId[] = post.likes; // Get likes array from post

        // Check if the authenticated user has already liked the post
        const likes_includes_auth_user = post_likes.find((like) => String(like) == auth_user_id);

        if (!likes_includes_auth_user) {
            // Add the authenticated user to the likes array
            const updatedPost = await Post.findByIdAndUpdate(post_id, {
                $addToSet: { likes: auth_user_id } // Use $addToSet to avoid duplicates
            }, { new: true });
            await updatedPost?.save(); // Save updated post
            return res.status(200).json({
                success: true,
                message: "You liked this post." // Success message
            });
        } else {
            return next(new CustomError("You already liked this post", 400)); // Error if already liked
        }
    } catch (err) {
        return next(err); // Handle errors
    };
};

/**
 * Controller to undo a like on a question.
 *
 * @async
 * @function undolikeSinglePost
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const undolikeSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth_user_id = req.user?.id; // Get authenticated user ID
        const post_id = req.params.post_id; // Get post ID from request parameters

        // Find the post by ID
        const post = await Post.findById(post_id);

        if (!post) {
            return next(new CustomError("Post could not be found.", 400)); // Error if post is not found
        };

        const post_likes: mongoose.Schema.Types.ObjectId[] = post.likes; // Get likes array from post

        // Check if the authenticated user has liked the post
        const likes_includes_auth_user = post_likes.find((like) => String(like) == auth_user_id);

        if (likes_includes_auth_user) {
            // Remove the authenticated user from the likes array
            const updatedPost = await Post.findByIdAndUpdate(post_id, {
                $pull: { likes: auth_user_id } // Use $pull to remove the user from likes
            }, { new: true });
            await updatedPost?.save(); // Save updated post
            return res.status(200).json({
                success: true,
                message: "You undoliked this post." // Success message
            });
        } else {
            return next(new CustomError("You already didn't like this post", 400)); // Error if not liked
        }
    } catch (err) {
        return next(err); // Handle errors
    };
};

/**
 * Controller to get feed posts.
 *
 * @async
 * @function getFeedPosts
 * @returns {Promise<void>}
 * @throws {Error}
 */
export const getFeedPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve the latest 10 posts, sorted by creation date, and populate user information
        const posts = await Post.find().sort({ createdAt: -1 }).limit(10).populate('user_id', 'user_id first_name last_name');

        // If no posts are found, return an empty array
        if (!posts) {
            return res.status(200).json({
                success: true,
                posts: [],
            });
        };

        return res.status(200).json({
            success: true,
            posts // Return the found posts
        });
    } catch (err) {
        return next(err); // Handle errors
    };
};
