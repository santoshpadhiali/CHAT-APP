import express, { json } from "express";
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import { generatedToken } from "../lib/uitill.js";
import cloudinary from "../lib/cloudinary.js"

export const Signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email is already in use" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic
        });

        await newUser.save();

        // Generate token and set cookie
        generatedToken(newUser._id, res);

        // Response
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic || null
        });

    } catch (error) {
        console.log("Error in Signup controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Await the user query
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        generatedToken(user._id, res);

        // Respond with user data
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic || null,
        });

    } catch (error) {
        console.error("The error occurred at Login:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const Logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
        console.error("Error at logout:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateprofilepic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pictures"
    });
    console.log(uploadResponse);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(" Error in updateprofilepic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const checkAuth =(req,res) =>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error at check auth",error.message);
        res.status(500).json({message : "internal server error cheack auth"})
        
    }
}