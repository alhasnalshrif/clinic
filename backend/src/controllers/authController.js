const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('../db');
const { users, authTokens } = require('../db/schema');
const { eq } = require('drizzle-orm');

class AuthController {
  // Django-style token authentication
  async getAuthToken(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      // Find user
      const user = await db.select()
        .from(users)
        .where(eq(users.username, username));

      if (!user || user.length === 0) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Get or create token
      let token = await db.select()
        .from(authTokens)
        .where(eq(authTokens.userId, user[0].id));

      if (!token || token.length === 0) {
        const tokenKey = crypto.randomBytes(20).toString('hex');
        await db.insert(authTokens).values({
          key: tokenKey,
          userId: user[0].id,
        });
        token = [{ key: tokenKey }];
      }

      res.json({ token: token[0].key });
    } catch (error) {
      console.error('Auth error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get current user info
  async getCurrentUser(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { password, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new user (register)
  async createUser(req, res) {
    try {
      const { username, password, email, firstName, lastName, group } = req.body;

      if (!username || !password || !group) {
        return res.status(400).json({ error: 'Username, password, and group are required' });
      }

      // Check if user exists
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.username, username));

      if (existingUser && existingUser.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await db.insert(users).values({
        username,
        password: hashedPassword,
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        group,
      }).returning();

      // Create token
      const tokenKey = crypto.randomBytes(20).toString('hex');
      await db.insert(authTokens).values({
        key: tokenKey,
        userId: newUser[0].id,
      });

      const { password: _, ...userWithoutPassword } = newUser[0];
      res.status(201).json({
        user: userWithoutPassword,
        token: tokenKey,
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllUsers(req, res) {
    try {
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        group: users.group,
        isActive: users.isActive,
        dateJoined: users.dateJoined,
        lastLogin: users.lastLogin,
      }).from(users);

      res.json({ users: allUsers });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();