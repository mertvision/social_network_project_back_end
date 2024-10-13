/**
 * Upload profile image middleware using Multer module.
 * This middleware handles the upload of profile images using Multer. 
 * It configures storage, filename, and file type validation for the uploaded images.
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing core Node.js modules
import path from "path";
// Importing third-party modules
import {Request} from "express";
import multer, {StorageEngine} from "multer";

// Extend the Request interface to include custom properties for uploaded files
interface CustomRequest extends Request {
    savedImage: string; // Property to hold the name of the saved image
};

// Configure storage for uploaded files
const storage: StorageEngine = multer.diskStorage({
    // Define the destination for uploaded files based on the field name
    destination: function (req: CustomRequest, file, cb) {
        if (file.fieldname === 'image') {
            cb(null, path.join(__dirname, "../", "../", "../", "public", "images")); // Destination for images
        }
    },

    // Define the filename for the uploaded files
    filename: function (req: CustomRequest, file, cb) {
        // Extract the file extension from the MIME type
        const extension = file.mimetype.split("/")[1];
        
        // Generate a unique filename based on the field name and current timestamp
        if (file.fieldname === "image") {
            req.savedImage = `image_${Date.now()}.${extension}`; // Save the image filename to the request object
            cb(null, req.savedImage); // Callback with the generated filename
        }
    },
});

// Define a file filter to restrict file types
const fileFilter = (req: CustomRequest, file: any, cb: any) => {
    // Check the file type based on the field name
    if (file.fieldname === "image") {
        // Allow only JPG or JPEG image formats
        if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true); // Accept the file
        } else {
            cb(null, false); // Reject the file
        }
    };
};

// Export the multer configuration for file uploads
export const uploadProfileImage = multer({storage, fileFilter});
