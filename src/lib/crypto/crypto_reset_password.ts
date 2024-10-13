/**
 * Crypto class for handling password reset token generation.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing built-in modules (Core Node.js API)
import crypto from "crypto"; // Importing the crypto module for generating tokens

// Importing custom modules
// (No custom modules are currently imported)

// Importing third-party modules
// (No third-party modules are currently imported)

/**
 * Class for handling password reset token generation.
 */
export class CryptoResetPassword {
    /**
     * Generates a reset password token and its expiration date.
     *
     * @returns An object containing the reset password token and its expiration date.
     */
    static async _generateResetPasswordToken() {
        // Retrieve the token expiration time from environment variables
        const RESET_PASSWORD_TOKEN_EXPIRE = process.env.RESET_PASSWORD_EXPIRE as string;

        // Generate a random hex string of 15 bytes
        const randomHexString = await crypto.randomBytes(15).toString("hex");

        // Create a SHA256 hash of the random hex string to serve as the reset token
        const resetPasswordToken = crypto.createHash('SHA256').update(randomHexString).digest('hex');

        // Calculate the expiration date for the reset token
        const resetPasswordTokenExpire = new Date(Date.now() + parseInt(RESET_PASSWORD_TOKEN_EXPIRE));

        // Return the generated token and its expiration date
        return {resetPasswordToken, resetPasswordTokenExpire}; // Return the token and expiration date
    };
};
