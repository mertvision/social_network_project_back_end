/**
 * The file containing the 'init' function where the server starts up
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing of interfaces
import {ProcessEnvInterface} from "../../interfaces/env/env_interface"; // Importing the custom interface for environment variables

/**
 * Initializes and starts the server.
 *
 * @param {any} server - The Express server instance.
 * @returns {Promise<void>}
 */
export const init = async (server: any): Promise<void> => {
    try {
        // Cast process.env to the custom ProcessEnvInterface for type safety
        const env = process.env as unknown as ProcessEnvInterface;

        // Extract environment variables for server configuration
        const SERVER_PROTOCOL = env.SERVER_PROTOCOL; // Protocol (http or https)
        const SERVER_HOST = env.SERVER_HOST; // Host address (e.g., localhost)
        const SERVER_PRIMAL_PORT = env.SERVER_PRIMAL_PORT; // Port number

        // Create a string representing the server address using the extracted environment variables
        const serverAddress: string = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PRIMAL_PORT}`;
        const serverCallbackMsg: string = `Server is running on ${serverAddress}`; // Message to log when server starts

        // Start the server and log a message once it's listening on the specified port
        server.listen(SERVER_PRIMAL_PORT, (): void => {
            console.log(serverCallbackMsg); // Log the server address
        });
    } catch (err) {
        console.error("Error initializing server:", err); // Log any errors that occur during initialization
    };
};
