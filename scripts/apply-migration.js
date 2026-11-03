/**
 * FTI Platform - Supabase Database Migration Runner
 * 
 * Usage:
 *   node scripts/apply-migration.js [DB_PASSWORD]
 *   or set SUPABASE_DB_PASSWORD in .env.local
 */

const fs = require('fs');
const path = require('path');

async function main() {
  const envPath = path.join(__dirname, '..', '.env.local');
  let dbPassword = process.argv[2] || process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;

  if (!dbPassword && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^(?:SUPABASE_DB_PASSWORD|DB_PASSWORD|DATABASE_PASSWORD)=(.*)$/m);
    if (match) {
      dbPassword = match[1].trim().replace(/^["']|["']$/g, '');
    }
  }

  const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
  if (!fs.existsSync(migrationFile)) {
    console.error('Migration file not found at:', migrationFile);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationFile, 'utf8');
  console.log(`[INFO] Loaded migration script (${sqlContent.length} bytes, 450+ lines).`);

  if (!dbPassword) {
    console.log('\n========================================================================');
    console.log('📌 SUPABASE DATABASE SETUP REQUIRED');
    console.log('========================================================================');
    console.log('To initialize the PostgreSQL tables, enums, RLS policies, and seed data:');
    console.log('');
    console.log('OPTION A (Instant via Supabase Dashboard SQL Editor):');
    console.log('1. Open: https://supabase.com/dashboard/project/cegdoxaqsopkvnnywaep/sql/new');
    console.log('2. Copy and paste the contents of:');
    console.log(`   ${migrationFile}`);
    console.log('3. Click "Run" (Green button).');
    console.log('');
    console.log('OPTION B (Automatic via this script):');
    console.log('Run with your Supabase database password:');
    console.log('   node scripts/apply-migration.js YOUR_DATABASE_PASSWORD');
    console.log('   or add SUPABASE_DB_PASSWORD=your_password to .env.local');
    console.log('========================================================================\n');
    return;
  }

  // If password provided, execute via pg
  let pg;
  try {
    pg = require('pg');
  } catch {
    console.log('[INFO] Installing pg client...');
    require('child_process').execSync('npm install --no-save pg', { stdio: 'inherit' });
    pg = require('pg');
  }

  const { Client } = pg;
  // Supabase direct connection string
  // Default project ref: cegdoxaqsopkvnnywaep
  const hosts = [
    `aws-0-ap-south-1.pooler.supabase.com`,
    `aws-0-ap-southeast-1.pooler.supabase.com`,
    `db.cegdoxaqsopkvnnywaep.supabase.co`
  ];

  let connected = false;
  for (const host of hosts) {
    console.log(`[INFO] Attempting connection via host: ${host}...`);
    const client = new Client({
      user: `postgres.cegdoxaqsopkvnnywaep`,
      password: dbPassword,
      host: host,
      port: 6543,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      console.log(`[SUCCESS] Connected to Supabase PostgreSQL database via ${host}!`);
      console.log('[INFO] Executing migration script (001_initial_schema.sql)...');
      await client.query(sqlContent);
      console.log('[SUCCESS] Database schema created, RLS policies enabled, and seed data inserted successfully!');
      await client.end();
      connected = true;
      break;
    } catch (err) {
      console.warn(`[WARN] Failed connection to ${host}:`, err.message);
      await client.end().catch(() => {});
    }
  }

  if (!connected) {
    console.error('\n[ERROR] Could not connect to Supabase database with the provided password.');
    console.log('Please copy and run the SQL script in:');
    console.log('https://supabase.com/dashboard/project/cegdoxaqsopkvnnywaep/sql/new');
  }
}

main().catch(console.error);
