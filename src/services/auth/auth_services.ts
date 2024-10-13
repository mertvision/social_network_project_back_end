/**
 * Authentication services for handling user authentication-related operations.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
// Importing custom schemas for MongoDB using mongoose
import User from "../../schemes/user/user_schema";
import UserPrivacy from "../../schemes/user_privacy/user_privacy_schema";
import UserMetaData from "../../schemes/user_meta_data/user_meta_data_schema";
import UserImages from "../../schemes/user_images/user_images_schema";
import UserBio from "../../schemes/user_bio/user_bio_schema";
import UserLogins from "../../schemes/user_all_logins/user_all_logins_schema";
import Friendship from "../../schemes/friendship/friendship_schema";
import Post from "../../schemes/post/post_schema";
import Comment from "../../schemes/comment/comment_schema";

/**
 * Retrieves all authentication-related information for a user and sends it to the client.
 * This function collects user metadata, privacy settings, images, bio, and login records.
 *
 * @param res - The Express response object.
 * @param user - The user object containing user details.
 * @param auth_user_id - The ID of the authenticated user.
 */
export const getAllAuthUserInformationsAndSendToClient = async (res: Response, user: any, auth_user_id: any) => {
    try {
        const auth_user_id_as_objectid = auth_user_id; // Convert user ID to ObjectId

        // Get authenticated user metadata
        const user_meta_datas = await UserMetaData.findOne({
            user_id: auth_user_id_as_objectid,
        });

        // Get authenticated user privacy information
        const user_privacy = await UserPrivacy.findOne({
            user_id: auth_user_id_as_objectid,
        });

        // Get authenticated user profile images (profile image, cover image)
        const user_images = await UserImages.findOne({
            user_id: auth_user_id_as_objectid,
        });

        // Get user bio
        const user_bio = await UserBio.findOne({
            user_id: auth_user_id_as_objectid,
        });

        // Get all login records of the user
        const user_logins = await UserLogins.findOne({
            user_id: auth_user_id_as_objectid,
        });

        let {_doc} = user; // Destructure user object to access document

        return res.status(200).json({
            success: true,
            auth_user: {
                ..._doc,
                auth_user_meta_datas: user_meta_datas,
                auth_user_privacy: user_privacy,
                auth_user_images: user_images,
                auth_user_bio: user_bio,
                auth_user_logins: user_logins,
            },
        });
    } catch (err) {
        console.log(err); // Log any errors that occur
    };
};

/**
 * Deletes all information related to a user from the database.
 * This function removes user data from various collections in the database.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 * @param auth_user_id - The ID of the authenticated user to delete.
 */
export const deleteAllUserInformationsFromDb = async (req: Request, res: Response, next: NextFunction, auth_user_id: mongoose.Types.ObjectId) => {
    try {
        // Delete user document
        await User.findByIdAndDelete(auth_user_id);
        // Delete user privacy settings
        await UserPrivacy.findOneAndDelete({ user_id: auth_user_id });
        // Delete user metadata
        await UserMetaData.findOneAndDelete({ user_id: auth_user_id });
        // Delete all login records
        await UserLogins.findOneAndDelete({ user_id: auth_user_id });
        // Delete user profile images
        await UserImages.findOneAndDelete({ user_id: auth_user_id });
        // Delete user bio
        await UserBio.findOneAndDelete({ user_id: auth_user_id });
        // Delete friendship records
        await Friendship.findOneAndDelete({ user_id: auth_user_id });

        // Count the number of posts and comments for the user
        const posts_count = await Post.countDocuments({ user_id: auth_user_id });
        const comments_count = await Comment.countDocuments({ user_id: auth_user_id });

        let post_index: number;
        let comment_index: number;

        // Delete all posts related to the user
        for (post_index = 0; post_index < posts_count; post_index++) {
            await Post.findOneAndDelete({user_id: auth_user_id});
        };
        // Delete all comments related to the user
        for (comment_index = 0; comment_index < comments_count; comment_index++) {
            await Comment.findOneAndDelete({user_id: auth_user_id});
        };

        return res.status(200).json({
            success: true,
            message: "All information related to your account has been deleted from our systems. Until we meet again, goodbye.",
        });
    } catch (err) {
        return next(err); // Pass the error to the next middleware
    };
};
