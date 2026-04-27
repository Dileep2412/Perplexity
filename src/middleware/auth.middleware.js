import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export async function authUser(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({
                message: "Invalid token. User not found.",
                success: false,
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false,
        });
    }
}