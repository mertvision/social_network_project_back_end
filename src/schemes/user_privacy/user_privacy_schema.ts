/**
 * User privacy schema definition for MongoDB using Mongoose.
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

// Define the UserPrivacy schema for MongoDB
const UserPrivacySchema: Schema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId, // Reference to the User model
        ref: "User", // Reference to the User collection
        required: [true, "Please provide a user id"] // User ID is required
    },
    profile_is_locked: {
        type: Boolean, // Indicates if the profile is locked
        default: false, // Default value is false (not locked)
    }
});

// Create a UserPrivacy model based on the UserPrivacySchema
const UserPrivacy = mongoose.model('UserPrivacy', UserPrivacySchema);

export default UserPrivacy; // Export the UserPrivacy model
