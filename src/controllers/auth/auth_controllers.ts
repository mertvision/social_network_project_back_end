/**
 * Authentication controllers
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Import Statement of third-party modules
import {Request, Response, NextFunction} from "express"; // Express types for request, response, and middleware
import mongoose from "mongoose";
// Import Statement of custom modules (or classes, interfaces, etc.)
import {deleteAllUserInformationsFromDb, getAllAuthUserInformationsAndSendToClient} from "../../services/auth/auth_services";
import {JWTLib} from "../../lib/jwt/jwt"; // JWT library for token handling
import {CryptoPassword} from "../../lib/crypto/crypto_password"; // Library for password hashing
import {hasReq} from "../../utils/req/req_utils";
import IPLib from "../../lib/ip/ip_lib";
import DeviceLib from "../../lib/device/device_lib";
import CustomError from "../../utils/error/CustomError"; // Custom error handling class
// Importing custom schemes for MongoDB using mongoose
import User from "../../schemes/user/user_schema"; // User schema for database operations
import UserPrivacy from "../../schemes/user_privacy/user_privacy_schema";
import UserBio from "../../schemes/user_bio/user_bio_schema";
import UserImages from "../../schemes/user_images/user_images_schema";
import UserMetaData from "../../schemes/user_meta_data/user_meta_data_schema";
import Friendship from "../../schemes/friendship/friendship_schema";

/**
 * Registers a new user in the application.
 *
 * @async
 * @function register
 * @param {Request} req - The request object containing user registration data.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if registration fails.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {first_name, last_name, email, password} = req.body; // Destructure user details from request body

        const hashedPassword = await CryptoPassword.hashUserPassword(password, next); // Hash the password

        const user_ip = IPLib.getIpAddress(req); // Get user's IP address
        const user_device = DeviceLib.getDeviceInfo(req); // Get user's device information

        // Create a new user and related information in the database
        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword
        });

        await UserPrivacy.create({ user_id: user?.id });
        await UserBio.create({ user_id: user?.id });
        await UserImages.create({ user_id: user?.id, profile_image_name: req?.savedImage });
        await UserMetaData.create({ user_id: user?.id, registered_ip: user_ip, registered_device: user_device });
        await Friendship.create({ user_id: user?.id });

        return res.status(200).json({
            success: true,
            message: "You have been registered. Now login."
        });
    } catch (err) {
        return next(err); // Handle errors
    };
};

/**
 * Logs the user into the application.
 *
 * @async
 * @function login
 * @param {Request} req - The request object containing user login credentials.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if login fails.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const values = ["email", "password"]; // Required fields for login

        for (let index = 0; index < values.length; index++) {
            hasReq(`${values[index]}`); // Check for required fields
        };

        const {email, password} = req.body; // Destructure email and password from request body

        const user = await User.findOne({ email: email }).select("+password"); // Find user by email

        if (!user) {
            return next(new CustomError("There is no user with that e-mail address.", 404)); // Error if user not found
        };

        const result = await CryptoPassword.comparePassword(password, user.password, next); // Compare passwords

        if (!result) {
            return next(new CustomError("Password is incorrect.", 400)); // Error if password is incorrect
        };

        const user_profile_images = await UserImages.findOne({user_id: user?.id}); // Retrieve user profile images

        JWTLib._sendToken(user, user_profile_images, res); // Generate and send JWT token
        return;
    } catch (err) {
        return next(err); // Handle errors
    };
};

/**
 * Retrieves the authenticated user's details.
 *
 * @async
 * @function getMe
 * @param {Request} req - The request object containing the user's authentication details.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if user retrieval fails.
 */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let auth_user_id = req.user?.id; // Retrieve authenticated user's ID

        if (!auth_user_id) {
            return next(new CustomError("You are not authenticated. Please login", 400)); // Error if not authenticated
        };

        const user = await User.findById(auth_user_id); // Find user by ID

        if (!user) {
            return next(new CustomError("There is no user with that id.", 400)); // Error if user not found
        };

        const auth_user_id_as_objectid = new mongoose.Types.ObjectId(auth_user_id); // Convert user ID to ObjectId

        getAllAuthUserInformationsAndSendToClient(res, user, auth_user_id_as_objectid); // Send user information to client
        return;
    } catch (err) {
        next(err); // Handle errors
    };
};

/**
 * Edits the authenticated user's information.
 *
 * @async
 * @function editInformations
 * @param {Request} req - The request object containing new user information.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if user information update fails.
 */
export const editInformations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth_user_id = req.user?.id; // Get authenticated user's ID

        const { firstName, lastName, email } = req.body; // Destructure new information from request body

        const user = await User.findById(auth_user_id); // Find user by ID

        if (!user) {
            return next(new CustomError("There is no user with that id.", 404)); // Error if user not found
        }

        user.first_name = firstName; // Update user's first name
        user.last_name = lastName; // Update user's last name
        user.email = email; // Update user's email

        await user.save(); // Save updated user information

        return res.status(200).json({
            success: true,
            user: user // Return updated user information
        });
    } catch (err) {
        return next(err); // Handle errors
    };
};

/**
 * Edits the authenticated user's bio.
 *
 * @async
 * @function editBio
 * @param {Request} req - The request object containing new bio information.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if bio update fails.
 */
export const editBio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth_user_id = req?.user?.id; // Get authenticated user's ID

        const {
            profileUserAbout,
            profileUserWorkedAt,
            profileUserSchool,
            profileUserLives,
            profileUserFrom
        } = req.body; // Destructure new bio information from request body

        const user_bios = await UserBio.findOne({ user_id: auth_user_id }); // Find user's bio

        if (!user_bios) {
            return next(new CustomError("Unexpected database error", 500)); // Error if bio not found
        }

        // Update bio fields
        user_bios.about = profileUserAbout;
        user_bios.worked_at = profileUserWorkedAt;
        user_bios.school = profileUserSchool;
        user_bios.lives = profileUserLives;
        user_bios.from = profileUserFrom;

        await user_bios.save(); // Save updated bio information

        return res.status(200).json({
            success: true,
            user_bios: user_bios // Return updated bio information
        });
    } catch (err) {
        return next(err); // Handle errors
    }
};

/**
 * Changes the privacy setting of the authenticated user's account.
 *
 * @async
 * @function changeAccountPrivacy
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if privacy update fails.
 */
export const changeAccountPrivacy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth_user_id = req.user?.id; // Get authenticated user's ID

        const user_privacy = await UserPrivacy.findOne({ user_id: auth_user_id }); // Find user's privacy settings

        if (!user_privacy) {
            return next(new CustomError("Unexpected error.", 404)); // Error if privacy settings not found
        }

        // Toggle privacy setting
        user_privacy.profile_is_locked = !user_privacy.profile_is_locked;
        await user_privacy.save(); // Save updated privacy settings

        const message = user_privacy.profile_is_locked
            ? "You changed your profile privacy to private from public"
            : "You changed your profile privacy to public from private";

        return res.status(200).json({
            success: true,
            message: message // Return success message
        });
    } catch (err) {
        return next(err); // Handle errors
    }
};

/**
 * Logs out the user by clearing the access token cookie.
 *
 * @async
 * @function logout
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if logout fails.
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clear the access token cookie and respond with a success message
        return res.status(200).clearCookie("access_token").json({
            success: true,
            message: "You have been logged out."
        });
    } catch (err) {
        return next(err); // Handle errors
    }
};

/**
 * Deletes the authenticated user's account and all associated information.
 *
 * @async
 * @function deleteAccount
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if account deletion fails.
 */
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth_user_id = req.user?.id; // Get authenticated user's ID
        const auth_user_id_as_objectid = new mongoose.Types.ObjectId(auth_user_id); // Convert user ID to ObjectId

        await deleteAllUserInformationsFromDb(req, res, next, auth_user_id_as_objectid); // Delete user information
        return;
    } catch (err) {
        return next(err); // Handle errors
    }
};
