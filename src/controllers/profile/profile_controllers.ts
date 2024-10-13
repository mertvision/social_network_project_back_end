/**
 * Profile controllers for the profile routes
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules (types etc.)
import {Request, Response, NextFunction} from "express"; // Types for request, response, and middleware
import mongoose from "mongoose"; // Mongoose for MongoDB object modeling
// Importing custom modules for database operations and error handling
import CustomError from "../../utils/error/CustomError"; // Custom error handling module
import {isParameterIdExist, isParameterIdValid} from "../../utils/req/req_utils"; // Utility functions for parameter validation
import {getProfileUserInformationsAndSendToClient} from "../../services/profile/profile_services"; // Service to get profile user information
// Importing custom schemes for MongoDB using Mongoose
import User from "../../schemes/user/user_schema"; // User schema for database operations
import UserImages from "../../schemes/user_images/user_images_schema"; // User images schema
import UserPrivacy from "../../schemes/user_privacy/user_privacy_schema"; // User privacy settings schema
import Post from "../../schemes/post/post_schema"; // Post schema for user posts

/**
 * Retrieves user profile information based on the provided profile ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getUserProfileInformations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if 'profile_id' parameter exists and is valid
        isParameterIdExist('profile_id', req, next);
        isParameterIdValid('profile_id', req, next);

        const auth_user_id = req?.user?.id; // Get authenticated user's ID

        // Extract the profile ID from request parameters
        let profile_id = req.params.profile_id;

        // Find the user by profile ID and select relevant fields
        const user = await User.findById(profile_id).select("_id first_name last_name");

        // If no user is found, throw an error
        if (!user) {
            return next(new CustomError("There is no user with that id.", 404));
        };

        // Retrieve privacy settings for the user profile
        const user_profile_privacy = await UserPrivacy.findOne({ user_id: profile_id });

        // If no privacy settings are found, throw an unexpected error
        if (!user_profile_privacy) {
            return next(new CustomError("Unexpected error.", 500));
        };

        // Allow the authenticated user to view their own profile
        if (profile_id == auth_user_id) {
            // Convert profile ID to ObjectId for further processing
            const profile_id_as_objectid = new mongoose.Types.ObjectId(profile_id);

            // Retrieve profile user information and send it to the client
            getProfileUserInformationsAndSendToClient(res, next, user, profile_id_as_objectid, 'not_locked_profile');
            return;
        } else {
            // Check if the profile is locked
            if (user_profile_privacy?.profile_is_locked === true) {
                // If the profile is locked
                // Convert profile ID to ObjectId for further processing
                const profile_id_as_objectid = new mongoose.Types.ObjectId(profile_id);

                // Retrieve profile user information and send it to the client
                getProfileUserInformationsAndSendToClient(res, next, user, profile_id_as_objectid, 'locked_profile');
                return;
            } else if (user_profile_privacy?.profile_is_locked === false) {
                // Convert profile ID to ObjectId for further processing
                const profile_id_as_objectid = new mongoose.Types.ObjectId(profile_id);

                // Retrieve profile user information and send it to the client
                getProfileUserInformationsAndSendToClient(res, next, user, profile_id_as_objectid, 'not_locked_profile');
                return;
            };
        };
    } catch (err) {
        // Handle any errors that occur during the process
        return next(err);
    };
};

/**
 * Retrieves profile posts by the provided profile ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getProfilePostsByProfileId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if 'profile_id' parameter exists and is valid
        isParameterIdExist('profile_id', req, next);
        isParameterIdValid('profile_id', req, next);

        const auth_user_id = req.user?.id; // Get authenticated user ID from request
        const { profile_id } = req.params; // Extract profile ID from request parameters

        // Retrieve privacy settings for the profile user
        const profile_user_privacy = await UserPrivacy.findOne({ user_id: profile_id });

        // If no privacy settings are found, throw an error
        if (!profile_user_privacy) {
            return next(new CustomError("Unexpected database error", 500));
        }

        // Check if the authenticated user is the owner of the profile
        if (auth_user_id === profile_id) {
            // Fetch posts for the authenticated user
            const profile_posts = await Post.find({ user_id: profile_id })
                .sort({ createdAt: -1 })
                .populate('user_id', 'user_id first_name last_name');

            // Return the fetched posts to the client
            return res.status(200).json({
                success: true,
                profile_posts: profile_posts
            });
        } else if (auth_user_id !== profile_id) {
            // If the authenticated user is not the owner, check privacy settings
            if (profile_user_privacy.profile_is_locked === true) {
                // If the profile is locked, deny access
                return next(new CustomError("Locked profile.", 403));
            } else if (profile_user_privacy.profile_is_locked === false) {
                // If the profile is not locked, fetch posts for the profile user
                const profile_posts = await Post.find({ user_id: profile_id })
                    .sort({ createdAt: -1 })
                    .populate('user_id', 'user_id first_name last_name');

                // Return the fetched posts to the client
                return res.status(200).json({
                    success: true,
                    profile_posts: profile_posts
                });
            }
        }
    } catch (err) {
        // Handle any errors that occur during the process
        return next(new CustomError("Unexpected error. Try again later.", 500));
    }
};

/**
 * Retrieves all images associated with the user's posts.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getProfilePhotos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { profile_id } = req.params; // Extracts the profile ID from the request parameters

        // Fetches post images for the given profile ID
        const posts_images = await Post.find({ user_id: profile_id }).select('files');

        // Return the retrieved photos in the response
        return res.status(200).json({
            success: true,
            photos: posts_images // Returns the retrieved photos in the response
        });
    } catch (err) {
        // Handle any errors that may occur (optional: add error handling logic)
        return next(err); // Pass the error to the next middleware
    }
};

/**
 * Retrieves the profile image for a given user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { profile_id } = req.params; // Extracts the profile ID from the request parameters

        // Fetches the profile image for the given user ID
        const profile_image = await UserImages.find({ user_id: profile_id });

        // Retrieves the name of the profile image
        const profile_image_name: unknown = profile_image[0]?.profile_image_name;

        // Return the profile image name in the response
        return res.status(200).json({
            success: true,
            profile_image_name: profile_image_name // Returns the profile image name in the response
        });
    } catch (err) {
        // Handle any errors that may occur (optional: add error handling logic)
        return next(err); // Pass the error to the next middleware
    }
};
