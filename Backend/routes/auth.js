import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 20;

function throttle(req, res, next) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.startedAt > WINDOW_MS) {
    attempts.set(key, { startedAt: now, count: 1 });
    return next();
  }

  record.count += 1;
  if (record.count > MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many attempts. Please wait a few minutes and try again.',
    });
  }
  next();
}

function validateCredentials({ name, email, password, requireName }) {
  const errors = {};

  if (requireName) {
    const cleanName = String(name || '').trim();
    if (cleanName.length < 2) errors.name = 'Enter your full name (at least 2 characters).';
    else if (cleanName.length > 80) errors.name = 'Name must be 80 characters or fewer.';
  }

  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(cleanEmail)) errors.email = 'Enter a valid email address.';

  const cleanPassword = String(password || '');
  if (!cleanPassword) errors.password = 'Enter a password.';
  else if (requireName && cleanPassword.length < 8) errors.password = 'Use at least 8 characters.';
  else if (cleanPassword.length > 72) errors.password = 'Password must be 72 characters or fewer.';

  return {
    errors,
    values: { name: String(name || '').trim(), email: cleanEmail, password: cleanPassword },
  };
}

function accountUnavailable(res) {
  return res.status(503).json({
    success: false,
    error: 'Account service is temporarily unavailable. Check the database connection.',
  });
}

router.post('/register', throttle, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return accountUnavailable(res);

    const { errors, values } = validateCredentials({ ...req.body, requireName: true });
    if (Object.keys(errors).length) {
      return res.status(400).json({ success: false, error: Object.values(errors)[0], errors });
    }

    const existing = await User.findOne({ email: values.email }).lean();
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists. Try signing in.',
        errors: { email: 'This email is already registered.' },
      });
    }

    const user = await User.create({
      name: values.name,
      email: values.email,
      passwordHash: await User.hashPassword(values.password),
      lastLoginAt: new Date(),
    });

    return res.status(201).json({ success: true, token: signToken(user), user: user.toPublic() });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists. Try signing in.',
        errors: { email: 'This email is already registered.' },
      });
    }
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Could not create your account.' });
  }
});

router.post('/login', throttle, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return accountUnavailable(res);

    const { errors, values } = validateCredentials({ ...req.body, requireName: false });
    if (errors.email || errors.password) {
      return res.status(400).json({ success: false, error: errors.email || errors.password, errors });
    }

    const user = await User.findOne({ email: values.email }).select('+passwordHash');
    const valid = user ? await user.verifyPassword(values.password) : false;
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Incorrect email or password.' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    return res.json({ success: true, token: signToken(user), user: user.toPublic() });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Could not sign you in.' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user.toPublic() });
});

export default router;
