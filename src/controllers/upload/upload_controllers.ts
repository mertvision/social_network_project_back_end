/**
 * Upload controllers for the upload routes
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import {Request, Response, NextFunction} from "express"; // Importing Express types for handling requests, responses, and next middleware
// Importing custom modules
import UserImages from "../../schemes/user_images/user_images_schema"; // Importing UserImages schema for database interactions
import CustomError from "../../utils/error/CustomError"; // Importing custom error handler

/**
 * Controller to handle uploading a single profile image.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const uploadSingleProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract authenticated user ID from the request
        const auth_user_id = req.user?.id;

        // Find user images document by user ID
        const auth_user_images = await UserImages.findOne({ user_id: auth_user_id });

        // Handle case where no user images document is found
        if (!auth_user_images) {
            return next(new CustomError("Unexpected database document error.", 500));
        }

        // Assign the uploaded image filename to the profile_image_name field
        auth_user_images.profile_image_name = req.savedImage;

        // Clear the saved image property from the request object
        req.savedImage = '';

        // Save the updated user images document
        await auth_user_images.save();

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: "Your profile image has been uploaded successfully."
        });
    } catch (err) {
        // Pass any errors to the next middleware
        return next(err);
    }
};

/**
 * Controller to handle uploading a single cover image.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const uploadSingleCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract authenticated user ID from the request
        const auth_user_id = req.user?.id;

        // Find user images document by user ID
        const auth_user_images = await UserImages.findOne({ user_id: auth_user_id });

        // Handle case where no user images document is found
        if (!auth_user_images) {
            return next(new CustomError("Unexpected database document error.", 500));
        }

        // Assign the uploaded image filename to the cover_image_name field
        auth_user_images.cover_image_name = req.savedImage;
        
        // Save the updated user images document
        await auth_user_images.save();

        // Clear the saved image property from the request object
        req.savedImage = '';

        // Respond with success message and the name of the uploaded cover image
        return res.status(200).json({
            success: true,
            message: "Your cover image has been uploaded successfully.",
            cover_image_name: auth_user_images.cover_image_name,
        });
    } catch (err) {
        // Handle errors (optional: you might want to log or pass the error)
    }
};

