/**
 * Upload middleware using Multer package.
 * This middleware handles the upload of images and videos using Multer. 
 * It configures storage, filename, and file type validation for the uploaded files.
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing Node.js core modules
import path from "path";
// Importing Request type from express
import {Request} from "express";
// Importing multer for file uploads and necessary types
import multer, {StorageEngine} from "multer";

// Extend the Request interface to include custom properties for uploaded files
interface CustomRequest extends Request {
    savedImage: string; // Property to hold the name of the saved image
    savedVideo: string; // Property to hold the name of the saved video
};

// Configure storage for uploaded files
const storage: StorageEngine = multer.diskStorage({
    // Define the destination for uploaded files based on the field name
    destination: function (req: CustomRequest, file, cb) {
        // Set the destination path for images or videos
        if (file.fieldname === "image") {
            cb(null, path.join(__dirname, "../", "../", "../", "public", "images")); // Destination for images
        } else if (file.fieldname === "file") {
            cb(null, path.join(__dirname, "../", "../", "../", "public", "videos")); // Destination for videos
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
        } else if (file.fieldname === "file") {
            req.savedVideo = `video_${Date.now()}.${extension}`; // Save the video filename to the request object
            cb(null, req.savedVideo); // Callback with the generated filename
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
    } else if (file.fieldname === "file") {
        // Allow only MP4 video format
        if (file.mimetype === "video/mp4") {
            cb(null, true); // Accept the file
        } else {
            cb(null, false); // Reject the file
        }
    }
};

// Export the multer configuration for file uploads
export const uploadFile = multer({storage, fileFilter});
