/**
 * Sending e-mail function declaration using nodemailer
 * 
 * @license MIT License
 * @author Mert Özdemir <mertozdemir@icloud.com>
 * 
 * This software is licensed under the MIT License. It may be used for legitimate purposes, 
 * but any use for fraudulent or malicious activities is strictly prohibited. 
 * The author disclaims all responsibility for illegal or unethical use.
 */

// Importing third-party modules
import nodemailer from "nodemailer"; // Importing the nodemailer module for sending emails

// Interface defining the structure of mail options
interface MailOptions {
    from: string;     // Sender's email address
    to: string;       // Recipient's email address
    subject: string;  // Subject of the email
    text?: string;    // Plain text body of the email (optional)
    html?: string;    // HTML body of the email (optional)
}

/**
 * Sends an email using the configured SMTP server.
 *
 * @param mailOptions - The options for the email to be sent.
 * @returns A promise that resolves when the email is sent.
 */
const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
    // Create a transporter object using SMTP server configurations from environment variables
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER_HOST, // SMTP server host
        port: Number(process.env.SMTP_SERVER_PORT), // SMTP server port
        auth: {
            user: process.env.SMTP_EMAIL, // SMTP username
            pass: process.env.SMTP_PASS // SMTP password
        }
    });

    // Send the email with the specified mail options
    const info = await transporter.sendMail(mailOptions);
    // Log the message ID of the sent email for confirmation
    console.log("Message sent: %s", info.messageId); // Log the message ID
};

// Export the sendEmail function for use in other modules
export default sendEmail; // Exporting the sendEmail function
