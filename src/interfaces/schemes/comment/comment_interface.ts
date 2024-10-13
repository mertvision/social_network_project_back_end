/**
 * Comment Interface
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Import Statement of Third Party Modules
import mongoose, { Document } from "mongoose"; // Importing mongoose and Document type

/**
 * Interface representing a comment document in MongoDB.
 * Extends the Document interface from Mongoose to include MongoDB document methods.
 */
export interface CommentInterface extends Document {
    /**
     * The content of the comment provided by the user.
     */
    content: string;

    /**
     * An array of ObjectId references representing users who liked the comment.
     */
    likes: mongoose.Types.ObjectId[];

    /**
     * The ObjectId of the user who authored the comment.
     */
    user_id: mongoose.Schema.Types.ObjectId;

    /**
     * The ObjectId of the post to which this comment belongs.
     */
    post_id: mongoose.Schema.Types.ObjectId;
};
