/**
 * Utility functions for the "req" object.
 *
 * Author: Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import mongoose from "mongoose";
import { NextFunction, Request } from "express";
// Importing our custom modules
import CustomError from "../error/CustomError";

// Middleware to check if a specific parameter ID exists in the request
export const isParameterIdExist = (parameterId: string, req: Request, next: NextFunction) => {
    // Check if the specified parameter ID exists
    if (!req.params[parameterId]) {
        return next(new CustomError(`Please provide an ${parameterId}.`, 400)); // Return an error if the ID is missing
    };
};

// Middleware to validate the format of a specific parameter ID
export const isParameterIdValid = (parameterId: string, req: Request, next: NextFunction) => {
    // Check if the specified parameter ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params[parameterId])) {
        return next(new CustomError("Please provide a valid ID.", 400)); // Return an error if the ID is invalid
    }
};

// Middleware to check if the request body contains a specific key
export const hasReq = (key: string) => {
    return (req: Request, next: NextFunction) => {
        if (!req.body[key]) {
            return next(new CustomError(`Please provide ${key}.`, 400)); // Return an error if the key is missing
        };
        next();
    };
};
