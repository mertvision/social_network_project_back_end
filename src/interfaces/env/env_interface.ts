/**
 * Environment variables interface
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// An interface for process environment variables
export interface ProcessEnvInterface {
    /**
     * The protocol used by the server (e.g., 'http', 'https').
     * This is an optional field.
     */
    SERVER_PROTOCOL?: string;

    /**
     * The host address for the server (e.g., 'localhost').
     * This is an optional field.
     */
    SERVER_HOST?: string;

    /**
     * The primary port number on which the server listens.
     * This is an optional field.
     */
    SERVER_PRIMAL_PORT?: string;
};

