/**
 * IP Address Library
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import express, { Request } from "express";

/**
 * Class providing methods for retrieving user IP addresses.
 */
class IPLib {
    /**
     * Retrieves the IP address of the user from the request.
     *
     * @param req - The Express request object.
     * @returns The user's IP address.
     */
    static getIpAddress(req: Request) {
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return userIp;
    }
};

// Exporting statement
export default IPLib;

