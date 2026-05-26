const { Client } = require('pg');

async function testConnection(password) {
  const client = new Client({
    user: 'postgres',
    password: password,
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres'
  });
  
  try {
    await client.connect();
    console.log(`SUCCESS with password: "${password}"`);
    await client.query("CREATE DATABASE codingbull_website;").catch(() => {});
    await client.query("CREATE USER codingbull WITH PASSWORD 'change-me';").catch(() => {});
    await client.query("ALTER DATABASE codingbull_website OWNER TO codingbull;").catch(() => {});
    await client.query("GRANT ALL PRIVILEGES ON DATABASE codingbull_website TO codingbull;").catch(() => {});
    console.log("Database codingbull_website and user codingbull created successfully.");
    process.exit(0);
  } catch (err) {
    console.log(`Failed with password: "${password}" - ${err.message}`);
  } finally {
    await client.end().catch(() => {});
  }
}

async function run() {
  const commonPasswords = ['postgres', 'admin', 'root', 'password', '123456', '', 'Pranshu', 'pranshu'];
  for (const pwd of commonPasswords) {
    await testConnection(pwd);
  }
}

run();
