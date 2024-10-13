/**
 * JWTLib Class
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
// Importing custom modules 
import {JWTEnvInterface} from "../../interfaces/env/env_jwt_interface";

// JWTLib class
export class JWTLib {

    /**
     * Sends a JWT to the client in a cookie and as part of the response JSON.
     *
     * @param user - The user object containing user information.
     * @param user_profile_images - User profile images associated with the user.
     * @param res - The Express response object.
     */
    static async _sendToken(user: any, user_profile_images: any, res: Response) {
        const env = process.env as unknown as JWTEnvInterface;

        // Retrieve configuration values from environment variables
        const JWT_SECRET_KEY = env.JWT_SECRET_KEY; // Secret key for signing JWT
        const JWT_EXPIRE = env.JWT_EXPIRE; // Expiration time for JWT
        const JWT_COOKIE_EXPIRE = env.JWT_COOKIE_EXPIRE; // Cookie expiration time
        const NODE_ENV = process.env.NODE_ENV as string; // Current environment (e.g., development or production)

        // Generate a payload for JWT
        const payload = {
            id: user?.id as string, // User id
            name: user?.name as string, // User name
        };

        // Sign the JWT (generate a token) with the payload and JWT secret key
        const token = jwt.sign(payload, JWT_SECRET_KEY, {
            expiresIn: parseInt(JWT_EXPIRE),
        });

        // Send the JWT to the client in a cookie and as part of the response JSON
        return res.status(200) // Set HTTP status code to OK (200)
            .cookie("access_token", token, {
                httpOnly: true, // Cookie is not accessible via JavaScript (client-side)
                expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRE)), // Set cookie expiration time
                secure: NODE_ENV === 'development' ? false : true, // Use secure flag based on environment
            })
            .json({
                success: true, // Indicates the request was successful
                access_token: token, // Return the JWT as part of the response
                user: {
                    id: user?.id,
                    first_name: user?.first_name,
                    last_name: user?.last_name,
                    user_profile_images: user_profile_images
                },
            });
    }

    /**
     * Checks if the token is included in the request headers.
     *
     * @param req - The Express request object.
     * @returns A promise that resolves to true if the token is included, otherwise false.
     */
    static async isTokenIncluded(req: Request): Promise<boolean> {
        // Check if the authorization header is present and starts with "Bearer:"
        const authorization = req.headers.authorization;
        if (!authorization?.startsWith("Bearer:")) {
            return false;
        }
        return true;
    };

    /**
     * Extracts the access token from the request headers.
     *
     * @param req - The Express request object.
     * @returns The access token if present, otherwise undefined.
     */
    static async _getAccessTokenFromHeader(req: Request): Promise<string | undefined> {
        const authorization = req.headers.authorization; // Get the authorization header
        if (authorization) {
            const access_token = authorization.split(" ")[1]; // Extract the token from "Bearer <token>"
            return access_token;
        }
        return undefined; // Return undefined if authorization header is not present
    };
};
