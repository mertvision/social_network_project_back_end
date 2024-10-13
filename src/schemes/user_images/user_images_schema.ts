/**
 * User images schema definition for MongoDB using mongoose
 * 
 * Author: Mert Özdemir <mertozdemircontact@icloud.com>
 */

// Importing third-party modules
import mongoose, {Schema} from "mongoose";

// Define the UserImages schema for MongoDB
const UserImagesSchema: Schema = new Schema({
      user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      profile_image_name: {
        type: String,
        default: 'default_profile_image.jpg',
      },
      cover_image_name: {
        type: String,
        default: 'default_cover_image.jpg'
      },
}); 

// Create a UserImages model based on the UserImagesSchema
const UserImages = mongoose.model('UserImages', UserImagesSchema);

export default UserImages; // Export the UserImages model