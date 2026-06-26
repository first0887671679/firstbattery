const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.adminUser.findMany().then(r => {
  console.log('Admin users in DB:');
  console.log(JSON.stringify(r.map(u => ({ id: u.id, email: u.email, name: u.name })), null, 2));
  p.$disconnect();
}).catch(e => {
  console.error(e);
  p.$disconnect();
  process.exit(1);
});
