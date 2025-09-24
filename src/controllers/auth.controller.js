import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import jwt from "jsonwebtoken";

export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminRole = await Role.findOne({ value: "admin" });

    if (!adminRole) {
      return res.status(500).json({ error: "Admin role not found" });
    }

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id: adminRole._id
    });

    res.status(201).json({ message: "Admin created successfully", userId: user._id });
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

    console.log(user);

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

    const role = await Role.findOne({ _id: user.role_id });
    console.log(role);

    if (!role || role.value !== "admin") {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    const payload = { id: user._id, role_id: user.role_id, role: role.value };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

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

    const role = await Role.findOne({ _id: user.role_id });
    console.log(role);

    if (!role || role.value !== "admin") {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const payload = { id: user._id, role_id: user.role_id, role: role.value };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
