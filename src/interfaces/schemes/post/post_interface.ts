/**
 * Question Interface
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Import Statement of third-party Modules
import mongoose, {Document} from "mongoose"; // Importing mongoose and Document type

/**
 * Interface representing a post document in MongoDB.
 * Extends the Document interface from Mongoose to include MongoDB document methods.
 */
export interface PostInterface extends Document {
    /**
     * The ObjectId of the user who authored the post.
     */
    user_id: mongoose.Schema.Types.ObjectId;

    /**
     * The content of the post.
     */
    content: string;

    /**
     * An array of file paths associated with the post.
     */
    files: string[];

    /**
     * An array of ObjectId references representing users who liked the post.
     */
    likes: mongoose.Schema.Types.ObjectId[];
};
