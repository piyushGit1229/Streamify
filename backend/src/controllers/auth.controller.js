import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { signupUser , loginUser, logoutUser ,getMe } from "../services/auth.service.js";

export const signup = asyncHandler(async(req,res)=>{
    const {name , email , password, avatarUrl  }= req.body;
    const user = await signupUser({name , email , password , avatarUrl  });

     res.status(201).json({
        message: "User created",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }
    });
});

export const login = asyncHandler(async(req,res)=>{
    const {email , password}= req.body;
    const {user , accessToken , refreshToken} = await loginUser({email , password});

    const cookieOptions = {
        httpOnly: true,
        secure: false, 
        sameSite: "lax", 
        domain: "localhost",
        path: "/"
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
        message: "User logged in",
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        },
    });
});


export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify token safely
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Remove only this specific refresh token
    user.refreshTokens = user.refreshTokens.filter(
        (tokenObj) => tokenObj.token !== refreshToken
    );
    await user.save();

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,        // keep same as login
        sameSite: "lax",
        domain: "localhost",
        path: "/",
    });

    return res.status(200).json({ message: "User logged out" });
});





export const me = asyncHandler(async (req, res) => {
    const user = await getMe(req.user.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    });
});
