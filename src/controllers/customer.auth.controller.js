import bcrypt from "bcryptjs";
import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "This account already exists" });
    }
    
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const customerRole = await Role.findOne({ value: "customer" });

    if (!customerRole) {
      return res.status(500).json({ error: "Customer role not found" });
    }
    
    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id: customerRole._id
    });

    // 4. Create customer profile
     await Customer.create({
      user_id: user._id,
      address
    });

    res.status(201).json({ message: "Customer created successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
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

    if (!role || role.value !== "customer") {
      return res.status(403).json({ error: "Access denied. Not a customer." });
    }

    const profile = await Customer.findOne({ user_id: user._id });

    // 3. Generate tokens
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

    res.json({ accessToken, user , profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};