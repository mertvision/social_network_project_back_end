/**
 * Profile services for profile controllers.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import {Response, NextFunction} from "express"; // Types for response and middleware
// Importing custom schemas for database operations
import UserPrivacy from "../../schemes/user_privacy/user_privacy_schema"; // User privacy settings schema
import UserImages from "../../schemes/user_images/user_images_schema"; // User images schema
import UserBio from "../../schemes/user_bio/user_bio_schema"; // User bio schema
import UserLogins from "../../schemes/user_all_logins/user_all_logins_schema"; // User logins schema
import Friendship from "../../schemes/friendship/friendship_schema"; // Friendship schema

/**
 * Retrieves profile user information and sends it to the client.
 * This function handles locked and unlocked profile scenarios.
 *
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 * @param user - The authenticated user object.
 * @param profile_user_id - The ID of the user whose profile is being accessed.
 * @param is_profile_locked - The status indicating if the profile is locked.
 */
export const getProfileUserInformationsAndSendToClient = async (res: Response, next: NextFunction, user: any, profile_user_id: any, is_profile_locked: string) => {
    try {
        const profile_user_id_as_objectid = profile_user_id; // Convert profile ID for database queries
        const profile_locking_status = is_profile_locked; // Determine the locking status of the profile

        // If the profile is locked
        if (profile_locking_status === 'locked_profile') {
            // Get privacy settings for the profile user
            const user_privacy = await UserPrivacy.findOne({
                user_id: profile_user_id_as_objectid,
            }).select("profile_is_locked");

            // Get profile images (profile image and cover image) for the user
            const user_images = await UserImages.findOne({
                user_id: profile_user_id_as_objectid,
            }).select("profile_image_name cover_image_name");

            // Get friends of the profile user
            const user_friends = await Friendship.findOne({
                user_id: profile_user_id_as_objectid
            }).select('friends').populate('friends', 'first_name last_name');

            let { _doc } = user; // Extract user document data

            // Send the combined profile information as a JSON response
            return res.status(200).json({
                success: true,
                profile_user: {
                    ..._doc,
                    profile_user_privacy: user_privacy,
                    profile_user_images: user_images,
                    profile_user_friends: user_friends?.friends,
                },
            });

        // If the profile is not locked
        } else if (profile_locking_status === 'not_locked_profile') {
            // Get privacy settings for the profile user
            const user_privacy = await UserPrivacy.findOne({
                user_id: profile_user_id_as_objectid,
            }).select("profile_is_locked");

            // Get profile images (profile image and cover image) for the user
            const user_images = await UserImages.findOne({
                user_id: profile_user_id_as_objectid,
            }).select("profile_image_name cover_image_name");

            // Get user bio information
            const user_bio = await UserBio.findOne({
                user_id: profile_user_id_as_objectid,
            }).select("about school from worked_at lives relationship");

            // Get friends of the profile user
            const user_friends = await Friendship.findOne({
                user_id: profile_user_id_as_objectid
            }).select('friends').populate('friends', 'first_name last_name');

            // Get all login information for the user
            const user_logins = await UserLogins.findOne({
                user_id: profile_user_id_as_objectid,
            });

            let {_doc} = user; // Extract user document data

            // Send the combined profile information as a JSON response
            return res.status(200).json({
                success: true,
                profile_user: {
                    ..._doc,
                    profile_user_privacy: user_privacy,
                    profile_user_images: user_images,
                    profile_user_bio: user_bio,
                    profile_user_friends: user_friends?.friends,
                    profile_user_logins: user_logins,
                },
            });
        }
    } catch (err) {
        // Handle any errors that occur during the process
        return next(err);
    }
};
