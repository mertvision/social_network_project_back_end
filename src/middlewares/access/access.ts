/**
 * Middleware for user authentication.
 *
 * This middleware checks if the user is authenticated by verifying the access token.
 * If authenticated, the user can perform actions related to their account.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import {Request, Response, NextFunction} from "express"; // Importing types for Express requests and responses
import jwt from "jsonwebtoken"; // Importing the JSON Web Token library
// Importing custom modules
import CustomError from "../../utils/error/CustomError"; // Importing custom error handling class

// "hasAccess" middleware
export const hasAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // The token is retrieved from the cookies.
        const token = req?.cookies?.access_token; // Retrieving the access token from cookies

        // If the token doesn't exist
        if (!token) {
            return next(new CustomError("Please provide a token or authenticate.", 401)); // Error if token is missing
        };

        // Check if the token is a string
        if (typeof token !== 'string') {
            return next(new CustomError("Invalid token format.", 400)); // Error if token format is invalid
        };

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string; // Retrieving the JWT secret key from environment variables

        // Verifying the token with the secret key
        jwt.verify(token, JWT_SECRET_KEY, (err: any, result: any) => {
            if (err) {
                return next(err); // Passing any verification errors to the error handler
            };

            // Storing user information in the request object
            req.user = {
                id: result.id, // User ID from the token payload
                name: result.name // User name from the token payload
            };

            next(); // Proceeding to the next middleware or route handler
        });
    } catch (err) {
        return next(err); // Catching and passing any other errors to the error handler
    };
};
