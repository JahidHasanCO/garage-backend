import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Roll from "../models/roll.model.js";
import jwt from "jsonwebtoken";

// Signup function
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 2. Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await User.create({
      name: "John Doe",
      email,
      password: password,
      roll_id: "68d0dcc55298f2df0e156757"
    });

    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Email" });

    // 2. Compare password
    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

    const roll = await Roll.findById(user.roll_id);
    if (!roll || roll.title !== "admin") {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    // 3. Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    // 4. Store refresh token in DB
    user.refresh_token = refreshToken;
    await user.save();

    // 5. Send tokens (access token in response, refresh in httpOnly cookie)
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      sameSite: "strict",
    });

    res.json({ accessToken, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
