// API ENDPOINTS.


import express from 'express';
import { register, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ✅ Session check route (NEW)
router.get('/check', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
});



export default router;

