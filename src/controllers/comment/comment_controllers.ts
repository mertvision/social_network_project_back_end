/**
 * Comment controllers for answer routes
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules from Express and Mongoose
import {Request, Response, NextFunction} from "express";
// Importing custom schemes for MongoDB using mongoose
import Comment from "../../schemes/comment/comment_schema";

/**
 * Controller to add a new comment to a specific post.
 *
 * @async
 * @function addNewCommentToPost
 * @param {Request} req - The request object containing comment data.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {CustomError} - Throws an error if there's an issue creating the comment.
 */
export const addNewCommentToPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {content} = req.body; // Get comment content from request body
        const {post_id} = req.params; // Get the post ID from request parameters
        const auth_user_id = req.user?.id; // Get the authenticated user's ID

        const comment = await Comment.create({
            content: content,
            post_id: post_id,
            user_id: auth_user_id,
        });

        await comment.save(); // Save the new comment

        const populatedComment = await Comment.findById(comment?._id).populate('user_id', '_id first_name last_name').populate('post_id', '_id content likes');

        return res.status(200).json({
            success: true,
            comment: populatedComment
        });
    } catch (err) {
        return next(err); // Handle any errors that occur during the process
    };
};

/**
 * Controller to retrieve all comments for a specific post.
 *
 * @async
 * @function getAllCommentsOfSinglePost
 * @param {Request} req - The request object containing the post ID.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {CustomError} - Throws an error if there's an issue retrieving comments.
 */
export const getAllCommentsOfSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {post_id} = req.params; // Get the post ID from request parameters

        const comments = await Comment.find({ post_id: post_id }).populate('user_id', '_id first_name last_name').populate('post_id', '_id content likes');

        return res.status(200).json({
            success: true,
            comments
        });
    } catch (err) {
        return next(err); // Handle any errors that occur during the process
    };
};