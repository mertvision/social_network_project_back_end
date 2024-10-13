/**
 * User bio schema definition for MongoDB using Mongoose.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import mongoose, {Schema} from "mongoose"; // Mongoose for MongoDB interactions

// Define the UserBio schema for MongoDB
const UserBioSchema: Schema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId, // Reference to the User model
        ref: "User", // Reference to the User collection
        required: [true, "Please provide a user id"], // User ID is required
    },
    about: {
        type: String,
        default: null, // Default value is null
    },
    worked_at: {
        type: String,
        default: null, // Default value is null
    },
    school: {
        type: String,
        default: null, // Default value is null
    },
    lives: {
        type: String,
        default: null, // Default value is null
    },
    from: {
        type: String,
        default: null, // Default value is null
    },
    relationship: {
        type: mongoose.Types.ObjectId, // Reference to the User model for relationship
        ref: "User", // Reference to the User collection
        required: false, // Relationship ID is optional
    },
});

// Create a UserBio model based on the UserBioSchema
const UserBio = mongoose.model('UserBio', UserBioSchema);

export default UserBio; // Export the UserBio model
