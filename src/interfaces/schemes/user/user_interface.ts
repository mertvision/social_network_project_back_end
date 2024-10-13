/**
 * User Interface
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import {Document} from "mongoose"; // Importing Document type from mongoose

// UserInterface
export interface UserInterface extends Document {
    /**
     * The first name of the user.
     */
    first_name: string;

    /**
     * The last name of the user.
     */
    last_name: string;

    /**
     * The user's email address, used for communication and authentication.
     */
    email: string;

    /**
     * The user's password, stored securely.
     */
    password: string;
};
