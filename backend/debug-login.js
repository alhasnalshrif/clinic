const bcrypt = require('bcryptjs');
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');

async function testLogin() {
  try {
    const username = 'admin';
    const password = 'admin123';
    
    console.log('Testing login for:', username);
    console.log('Password:', password);
    
    // Find user
    const user = await db.select()
      .from(users)
      .where(eq(users.username, username));
    
    if (!user || user.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user[0].username);
    console.log('User group:', user[0].group);
    console.log('Stored hash length:', user[0].password?.length);
    
    // Check password
    const validPassword = await bcrypt.compare(password, user[0].password);
    console.log('Password valid:', validPassword);
    
    if (validPassword) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password mismatch!');
      
      // Let's try to create a new hash and compare
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash for comparison:', newHash);
      const testCompare = await bcrypt.compare(password, newHash);
      console.log('New hash comparison works:', testCompare);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
