import userModel from "../models/user.model.js"; 
import jwt from "jsonwebtoken";  
import { sendEmail } from "../service/mail.service.js";

export async function register(req, res) {
    
        const { username, email, password } = req.body; 

        const isUserAlreadyRegistered = await userModel.findOne({
            $or: [{ email }, { username }]  
        });

        if (isUserAlreadyRegistered) {
            return res.status(400).json({
                message: "Username or email already in use" ,
                success: false,
                err:"Username or email already in use"
            });
        }

        const newUser = new userModel({ username, email, password });

        await sendEmail(
            email,
            "Welcome to Perplexity!",
            `<h1>Hi ${username},</h1><p>Thank you for registering at Perplexity. We're excited to have you on board!</p><p>Best regards,<br/>The Perplexity Team</p>`
        );

        res.status(201).json({
            message: "User registered successfully",
            success: true, 
            userModel: {
                id: newUser._id,
                username: newUser.username, 
                email: newUser.email,
            },
        });          
}
