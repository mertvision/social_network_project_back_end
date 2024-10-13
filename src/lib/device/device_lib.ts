/**
 * Device library for device operations.
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import {Request} from "express"; // Importing Request type from express

// DeviceLib class
class DeviceLib {
    /**
     * Retrieves device information from the request headers.
     *
     * @param req - The Express request object.
     * @returns The user device information from the headers.
     */
    static getDeviceInfo(req: Request) {
        const userDevice = req.headers['user-agent']; // Get the user-agent header
        return userDevice; // Return the user device information
    }
}

// Exporting statement
export default DeviceLib; // Exporting the DeviceLib class
