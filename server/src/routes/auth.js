import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
const safeUser = user => ({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, college: user.college });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, college } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ message: 'Please fill all required fields.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, phone, password, college: college || '' });
    res.status(201).json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password || ''))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) { next(error); }
});

router.get('/me', protect, (req, res) => res.json({ user: safeUser(req.user) }));
export default router;
