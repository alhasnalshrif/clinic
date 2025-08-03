const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { users, authTokens } = require('../db/schema');
const { eq } = require('drizzle-orm');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Check if it's a token auth (Django style) or JWT
    if (token.length === 40) { // Django token style
      const tokenRecord = await db.select()
        .from(authTokens)
        .where(eq(authTokens.key, token))
        .leftJoin(users, eq(authTokens.userId, users.id));

      if (!tokenRecord || tokenRecord.length === 0) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      req.user = tokenRecord[0].users_user;
    } else {
      // JWT style
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.select()
        .from(users)
        .where(eq(users.id, decoded.userId));

      if (!user || user.length === 0) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      req.user = user[0];
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    if (token.length === 40) {
      const tokenRecord = await db.select()
        .from(authTokens)
        .where(eq(authTokens.key, token))
        .leftJoin(users, eq(authTokens.userId, users.id));

      req.user = tokenRecord && tokenRecord.length > 0 ? tokenRecord[0].users_user : null;
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.select()
        .from(users)
        .where(eq(users.id, decoded.userId));

      req.user = user && user.length > 0 ? user[0] : null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};

module.exports = { authenticateToken, optionalAuth };