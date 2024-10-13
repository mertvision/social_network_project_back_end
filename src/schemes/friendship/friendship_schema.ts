/**
 * Friendship schema for managing user friendships.
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

// Friendship schema definition
const FriendshipSchema: Schema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId, // Reference to the User model
        ref: "User", // Reference to the User collection
        required: true, // User ID is required
    },
    friends: [{
        type: mongoose.Types.ObjectId, // Array of friend User IDs
        ref: "User", // Reference to the User collection
    }],
});

// Create a Friendship model based on the FriendshipSchema
const Friendship = mongoose.model('Friendship', FriendshipSchema);

export default Friendship; // Export the Friendship model
