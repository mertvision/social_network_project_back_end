/**
 * All logins schema definition for MongoDB using Mongoose.
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

// Define the UserAllLogins schema for MongoDB
const UserAllLoginsSchema: Schema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: "User", // Reference to the User collection
        required: [true, "Please provide a user id"], // User ID is required
    },
    login_date: {
        type: Date,
        default: Date.now, // Default to current date and time
    },
    login_ip: {
        type: String, // IP address of the login
    },
});

// Create a UserLogins model based on the UserAllLoginsSchema
const UserLogins = mongoose.model('UserLogins', UserAllLoginsSchema);

export default UserLogins; // Export the UserLogins model
