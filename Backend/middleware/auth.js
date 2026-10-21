import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const getSecret = () => process.env.JWT_SECRET;

export function signToken(user) {
  const secret = getSecret();
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: user._id.toString(), email: user.email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, error: 'Sign in to continue.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, getSecret());
    } catch {
      return res.status(401).json({ success: false, error: 'Your session has expired. Sign in again.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'Account service is temporarily unavailable.' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, error: 'This account no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
