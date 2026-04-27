import userModel from "../models/user.model.js"; 
import jwt from "jsonwebtoken";  
import { sendEmail } from "../service/mail.service.js";

/*
@route POST /api/auth/register
@desc Register a new user       
@access Public
@body { username, email, password }
*/
export async function register(req, res) {
    const { username, email, password } = req.body; 

    const isUserAlreadyRegistered = await userModel.findOne({
        $or: [{ email }, { username }]  
    });

    if (isUserAlreadyRegistered) {
        return res.status(400).json({
            message: "Username or email already in use",
            success: false,
            err: "Username or email already in use"
        });
    }

    const newUser = new userModel({ username, email, password });
    await newUser.save();

    const emailVerificationToken = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const encodedToken = encodeURIComponent(emailVerificationToken);

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `<h1>Hi ${username},</h1>
               <p>Thank you for registering at Perplexity.</p>
               <p>Please verify your email by clicking the link below:</p> 
               <a href="${process.env.CLIENT_URL}/api/auth/verify-email?token=${encodedToken}">Verify Email</a>
               <p>If you did not register for this account, please ignore this email.</p>
               <p>Best regards,<br/>The Perplexity Team</p>`
    });

    return res.status(201).json({
        message: "User registered successfully",
        success: true, 
        user: {
            id: newUser._id,
            username: newUser.username, 
            email: newUser.email,
        },
    });          
}

/*
@route POST /api/auth/login
@desc Login user and return JWT token       
@access Public
@body { email, password }
*/
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
        });
    }   

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
        });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
        });
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return res.status(200).json({
        message: "Login successful",
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}

/*
@route GET /api/auth/get-me
@desc Get current logged in user's details
@access Private
*/
export async function getMe(req, res) {
    const userId = req.user._id;  // ✅ _id use karo

    const user = await userModel  // ✅ userModel use karo
        .findById(userId)
        .select("-password -__v -createdAt -updatedAt"); 

    if (!user) {                                    
        return res.status(404).json({
            message: "User not found",
            success: false,
        });
    }

    return res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user,
    });
}

/*
@route GET /api/auth/verify-email?token=...
@desc Verify user's email address
@access Public
@query { token }
*/  
export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;  

        if (!token) {
            return res.status(400).json({
                message: "Verification token is missing",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid verification token",
                success: false,
            });
        }       

        user.verified = true;
        await user.save();

        await sendEmail({
            to: user.email,
            subject: "Email Verified - Welcome to Perplexity!",
            html: `<h1>Email Verified</h1>
                   <p>Hi ${user.username},</p>
                   <p>Your email has been successfully verified. You can now log in.</p>
                   <p>Best regards,<br/>The Perplexity Team</p>`
        }); 

        return res.status(200).json({
            message: "Email verified successfully",
            success: true
        });

    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: error.message
        });
    }
}