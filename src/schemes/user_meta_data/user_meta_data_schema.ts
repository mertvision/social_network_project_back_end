/**
 * User meta data schema definition for MongoDB using Mongoose.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import mongoose, { Schema } from "mongoose"; // Mongoose for MongoDB interactions
import { UserMetaDataInterface } from "../../interfaces/schemes/user_meta_data/user_meta_data_interface"; // Importing user metadata interface

// Define the UserMetaData schema for MongoDB
const UserMetaDataSchema: Schema<UserMetaDataInterface> = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId, // Reference to the User model
        ref: "User", // Reference to the User collection
        required: [true, "Please provide a user id"] // User ID is required
    },
    registered_at: {
        type: Date,
        default: Date.now, // Default registration date is the current date
    },
    registered_ip: {
        type: String, // IP address of the user
    },
    registered_device: {
        type: String, // Device information of the user
    },
});

// Create a UserMetaData model based on the UserMetaDataSchema
const UserMetaData = mongoose.model<UserMetaDataInterface>('UserMetaData', UserMetaDataSchema);

export default UserMetaData; // Export the UserMetaData model
