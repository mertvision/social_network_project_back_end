/**
 * Router generation module
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import express from "express";

// Function to create and return a new Express router
export const generateRouter = () => {
    const router = express.Router(); // Create a new router instance
    return router; // Return the created router
};
