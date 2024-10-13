/**
 * Friendship routes
 *
 * @license MIT License
 * @author Mert Özdemir <mertozdemircontact@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing custom modules
import {addUserAsFriend} from "../../controllers/friendship/friendship_controllers"; // Importing function to add a user as a friend
import {hasAccess} from "../../middlewares/access/access"; // "access" middleware
import {generateRouter} from "../../utils/router/router"; // Importing router generator

// Definition of a router
const friendshipRouter = generateRouter(); // Create a new router instance

// Route to add a user as a friend
friendshipRouter.post('/:user_id', hasAccess, addUserAsFriend); // Endpoint: POST http://localhost:PORT/api/friendship/:user_id

// Exporting the friendship router
export default friendshipRouter; // Export the friendship router

