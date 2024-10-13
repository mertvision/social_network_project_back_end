/**
 * User schema definition for MongoDB using Mongoose.
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
// Importing custom modules (like modules, functions, classes, interfaces etc.)
import {UserInterface} from "../../interfaces/schemes/user/user_interface"; // User interface definition

// Define the User schema for MongoDB
const UserSchema: Schema<UserInterface> = new Schema({
    first_name: {
        type: String,
        required: [true, "Please provide a name."], // Name is required
    },
    last_name: {
        type: String,
        required: false, // Last name is optional
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true, // Ensures email is unique
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 
            'Please provide a valid e-mail' // Validates email format
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'], // Ensures password is provided
        minlength: [6, 'Please provide a password longer than 6 characters'], // Validates password length
        select: false // Password is not included in query results by default
    },
});

// Create a User model based on the UserSchema
const User = mongoose.model<UserInterface>('User', UserSchema);

export default User; // Export the User model
