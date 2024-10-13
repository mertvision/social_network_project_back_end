/**
 * Comment Schema for MongoDB using Mongoose.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Import statement for third-party modules
import mongoose, {Schema} from "mongoose"; // Mongoose for MongoDB interactions
// Import statement for our custom interfaces
import {CommentInterface} from "../../interfaces/schemes/comment/comment_interface"; // Custom interface for the Comment schema

// Comment schema declaration
const CommentSchema: Schema<CommentInterface> = new Schema({
    content: {
        type: String,
        required: [true, "Please provide content for the comment."], // Content is required
        minlength: [1, "Please provide a minimum of 1 character."] // Minimum content length
    },
    user_id: {
        type: mongoose.Schema.ObjectId, // Reference to the User model
        required: true, // User ID is required
        ref: "User" // Reference to the User collection
    },
    post_id: {
        type: mongoose.Schema.ObjectId, // Reference to the Post model
        required: true, // Post ID is required
        ref: "Post" // Reference to the Post collection
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId, // References to User IDs who liked the comment
            ref: "User" // Reference to the User collection
        }
    ]
});

// Create a Comment model based on the CommentSchema
const Comment = mongoose.model<CommentInterface>('Comment', CommentSchema);

export default Comment; // Export the Comment model
