/**
 * UserMetaData Interface. 
 * Interface representing user metadata in MongoDB.
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 *
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import mongoose, {Document} from "mongoose";

// UserMetaDataInterface definition
export interface UserMetaDataInterface extends Document {
    /**
     * The ID of the user associated with the metadata.
     */
    user_id: mongoose.Schema.Types.ObjectId; // Kullanıcı ID'si

    /**
     * The date when the user registered.
     */
    registered_at: Date;

    /**
     * The IP address from which the user registered. This field is optional.
     */
    registered_ip?: string; // Opsiyonel alan

    /**
     * The device used by the user during registration. This field is optional.
     */
    registered_device?: string; // Opsiyonel alan
};
