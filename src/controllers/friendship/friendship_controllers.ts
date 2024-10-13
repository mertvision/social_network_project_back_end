/**
 * Friendship controllers
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
// Importing custom modules
import CustomError from "../../utils/error/CustomError";
import {isParameterIdValid} from "../../utils/req/req_utils";
// Importing custom schemes for MongoDB using mongoose
import Friendship from "../../schemes/friendship/friendship_schema";

/**
 * Controller to add a user as a friend.
 *
 * @async
 * @function addUserAsFriend
 * @param {Request} req - The request object containing user information.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>}
 * @throws {CustomError} - Throws an error if user is already a friend or if there is a server issue.
 */
export const addUserAsFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth_user_id = req.user?.id; // Get the authenticated user's ID
        const user_id = req.params.user_id; // Get the ID of the user to be added as a friend

        isParameterIdValid('user_id', req, next); // Validate the user ID parameter

        // Find the friendship record for the user to be added
        const user_friendships = await Friendship.findOne({ user_id: user_id }).populate('user_id', '_id first_name last_name');

        // Check if the user has friendships recorded
        if (!user_friendships) {
            return next(new CustomError("Unexpected server configuration error", 404));
        }

        const user_friends: any = user_friendships?.friends; // Get the user's friends

        // Check if the authenticated user is already a friend
        const auth_user_already_friend = user_friends.find((userFriend: any) => String(userFriend) == auth_user_id);

        if (auth_user_already_friend) {
            return next(new CustomError("You are already friends.", 400)); // Error if already friends
        } else {
            // Update friendships for both users
            await Friendship.findOneAndUpdate({ user_id: auth_user_id }, {
                $addToSet: { friends: user_id } // Add user_id to auth user's friends
            }, { new: true });

            await Friendship.findOneAndUpdate({ user_id: user_id }, {
                $addToSet: { friends: auth_user_id } // Add auth_user_id to user's friends
            }, { new: true });

            return res.status(200).json({
                success: true,
                message: "Friendship is established."
            });
        }
    } catch (err) {
        return next(err); // Handle any errors that occur
    }
};
