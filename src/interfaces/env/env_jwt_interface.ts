/**
 * Interface for JWT environment variables.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */
export interface JWTEnvInterface {
    /**
     * The secret key used for signing JWT tokens.
     * This should be kept confidential.
     */
    JWT_SECRET_KEY: string;

    /**
     * The expiration time for the JWT tokens, typically in a string format (e.g., '1h', '2d').
     */
    JWT_EXPIRE: string;

    /**
     * The expiration time for the JWT cookie, usually specified in a string format (e.g., '1h', '2d').
     */
    JWT_COOKIE_EXPIRE: string;
};

