const db = require("../db");

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    FOREIGN KEY(customerId) REFERENCES customers(id)
  )
`);

// Ensure legacy databases have the 'address' column on customers
db.all(`PRAGMA table_info(customers)`, [], (err, rows) => {
  if (err) return;
  const hasAddress = rows.some((r) => r.name === "address");
  if (!hasAddress) {
    db.run(`ALTER TABLE customers ADD COLUMN address TEXT`);
  }
});

module.exports = db;
