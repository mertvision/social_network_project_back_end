/**
 * Main entry file for the Vision Social Network Project server
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
// Importing custom modules
import {initServerConfigurations} from "./init/config/server_config"; // Server configuration initialization
import {initServerMiddlewares} from "./init/middlewares/server_middlewares"; // Server middlewares initialization
// Importing database connection functions
import {initServerMongodbConnection} from "./database/connections/connect_mongodb"; // MongoDB connection
// Importing init server module
import {init} from "./init/server/init_server"; // Server initialization

// Creating an instance of the express server
const server = express();

// Invoking initialization modules
initServerConfigurations();
initServerMiddlewares(server);
initServerMongodbConnection();
init(server);

// Extending Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: string;
                name?: string;
            };
            savedImage: string;
            savedVideo: string;
            savedProfileImage: string;
        }
    }
};
