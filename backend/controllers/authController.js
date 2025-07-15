// LOGIC FOR LOGIN/REGISTER.

// controllers/authController.js
import bcrypt from 'bcryptjs';
import { pool } from '../models/db.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ msg: "User already exists" });
    }
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    req.session.user = {
      id: user[0].id,
      name: user[0].name,
      role: user[0].role
    };
    res.json({ msg: "Login successful", user: req.session.user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ msg: "Logged out successfully" });
  });
};
