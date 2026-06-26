/**
 * Local dev startup script — handles SQLite/PostgreSQL schema swap.
 * 
 * The project uses PostgreSQL on Vercel production but SQLite for local dev.
 * This script:
 * 1. Swaps schema to SQLite
 * 2. Generates Prisma client for SQLite
 * 3. Pushes schema to SQLite DB (no migrations needed)
 * 4. Runs `next dev`
 * 5. Restores PostgreSQL schema on exit
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SCHEMA = path.join(ROOT, 'prisma', 'schema.prisma');
const SQLITE_SCHEMA = path.join(ROOT, 'prisma', 'schema.sqlite.prisma');

// Check if PostgreSQL schema or SQLite schema is active
const currentSchema = fs.readFileSync(SCHEMA, 'utf-8');
const isAlreadySqlite = currentSchema.includes('provider = "sqlite"');

if (!isAlreadySqlite) {
  console.log('[dev] Switching to SQLite schema...');
  fs.copyFileSync(SQLITE_SCHEMA, SCHEMA);
  
  // Generate Prisma client for SQLite
  execSync('npx prisma generate', { cwd: ROOT, stdio: 'inherit' });
  
  // Push schema to SQLite (creates/updates tables without migration files)
  execSync('npx prisma db push', { cwd: ROOT, stdio: 'inherit' });
  
  console.log('[dev] SQLite database ready ✓');
}

// Set up cleanup on exit
const cleanup = () => {
  const current = fs.readFileSync(SCHEMA, 'utf-8');
  if (current.includes('provider = "sqlite"')) {
    console.log('\n[dev] Restoring PostgreSQL schema...');
    // Restore PostgreSQL schema from scratch (don't have a backup, write it directly)
    const pgSchema = current.replace(
      'provider = "sqlite"',
      'provider = "postgresql"'
    );
    fs.writeFileSync(SCHEMA, pgSchema);
    console.log('[dev] PostgreSQL schema restored ✓');
  }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Run next dev
const { spawn } = require('child_process');
const child = spawn('npx', ['next', 'dev'], {
  cwd: ROOT,
  stdio: 'inherit',
  shell: true,
});

child.on('close', (code) => {
  cleanup();
  process.exit(code);
});
