/**
 * Server's middlewares
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing Node.js core modules
import path from "path";
// Importing third party modules
import express from "express"; // Importing Express for server framework
import helmet from "helmet"; // Importing Helmet for securing HTTP headers
import morgan from "morgan"; // Importing Morgan for logging HTTP requests
import cookieParser from "cookie-parser"; // Importing Cookie Parser for parsing cookies
import cors from "cors"; // Importing CORS for enabling Cross-Origin Resource Sharing
import router from "../../routes/routes"; // Importing the main router for API routes
// Importing custom modules
import customErrorHandler from "../../middlewares/handler/custom_error_handler"; // Importing custom error handler middleware

/**
 * Initializes the server middlewares.
 *
 * @param {any} server - The Express server instance.
 * @returns {void}
 */
export const initServerMiddlewares = (server: any): void => {
   /* Serve static files from the "public/images" directory */
   server.use("/images", express.static(path.join(__dirname, "../", "../", "../", "public/images")));
   /* Serve static files from the "public/videos" directory */
   server.use("/videos", express.static(path.join(__dirname, "../", "../", "../", "public/videos")));

   server.use(cors({
      origin: "http://localhost:3000",
      credentials: true
   })); // CORS
   server.use(express.json()); // Parse incoming JSON requests
   server.use(cookieParser()); // Parse cookies in the requests
   server.use('/api', router); // Set up API routes
   server.use(customErrorHandler); // Handle errors with custom middleware
   server.use(helmet()); // Set security headers using helmet
   server.use(morgan('dev')); // Log HTTP requests in 'dev' format
};
