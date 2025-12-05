import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"; // Needed for tokens
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";


export const signupUser = async ({ name, email, password ,avatarUrl}) => {
    const exist = await User.findOne({ email });
   if (exist) {
        const err = new Error("Email already registered");
        err.status = 400;
        throw err;
    }


    let finalAvatarUrl = "";

    if (avatarUrl) {
    const uploadResponse = await cloudinary.uploader.upload(avatarUrl, {
      folder: "streamify/avatars",
    });
    finalAvatarUrl = uploadResponse.secure_url;
    }

    const salt = await bcrypt.genSalt(10); // Generate salt rounds
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password with salt

    const user = await User.create({ 
        name,
         email,
          password: hashedPassword , 
          avatar : finalAvatarUrl || "",
        });
    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user._id });

    // store the refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    return { user, accessToken, refreshToken };
};


export const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        const err = new Error("No refresh token provided");
        err.status = 401;
        throw err;
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        const err = new Error("Invalid refresh token");
        err.status = 401;
        throw err;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    // Remove ONLY this refresh token from the list
    user.refreshTokens = user.refreshTokens.filter(
        (tokenObj) => tokenObj.token !== refreshToken
    );

    await user.save();

    return { message: "Logged out successfully" };
};



export const getMe = async (id) => {
    const user = await User.findById(id).select("-password -refreshTokens");
    return user;
};
