
const { db } = require('./src/db');
const { users } = require('./src/db/schema');

async function checkUsers() {
  const allUsers = await db.select().from(users);
  console.log('Users in database:');
  allUsers.forEach(user => {
    console.log(\- \: \\);
  });
}

checkUsers().catch(console.error);

