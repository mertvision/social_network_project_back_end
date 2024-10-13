/**
 * The file containing the function that configures dotenv to allow the server to use environment variables.
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import dotenv from "dotenv"; // Importing the dotenv module to manage environment variables

/**
 * Initializes server configurations by loading environment variables from a .env file.
 *
 * @function initServerConfigurations
 * @returns {void}
 */
export const initServerConfigurations = (): void => {
    dotenv.config(); // Load environment variables from the .env file into process.env
};
