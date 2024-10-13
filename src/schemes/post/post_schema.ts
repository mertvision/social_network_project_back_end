/**
 * Question Schema for MongoDB using Mongoose.
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
import {PostInterface} from "../../interfaces/schemes/post/post_interface"; // Custom interface for the Post schema

// Question schema declaration
const PostSchema: Schema<PostInterface> = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId, // Reference to the User model
        ref: "User", // Reference to the User collection
        required: [true, "Please provide a user id"] // User ID is required
    },
    content: {
        type: String,
        required: [true, "Please provide content for the post."], // Content is required
        minlength: [1, "Please provide content that is at least 1 character long."] // Minimum content length
    },
    likes: [
        {
            type: mongoose.Types.ObjectId, // References to User IDs who liked the post
            ref: "User" // Reference to the User collection
        }
    ],
    files: [
        {
            type: String, // Array of file paths or names
        }
    ],
}, { timestamps: true, versionKey: false }); // Enable timestamps and disable version key

// Create a Post model based on the PostSchema
const Post = mongoose.model<PostInterface>('Post', PostSchema);

export default Post; // Export the Post model
