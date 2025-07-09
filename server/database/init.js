const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'foodshare.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zipCode TEXT,
      profileImage TEXT,
      isVerified BOOLEAN DEFAULT FALSE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Food items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit TEXT NOT NULL,
      expiryDate DATE,
      pickupLocation TEXT NOT NULL,
      pickupInstructions TEXT,
      images TEXT, -- JSON array of image URLs
      isAvailable BOOLEAN DEFAULT TRUE,
      donorId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (donorId) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Food requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS food_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foodItemId INTEGER NOT NULL,
      requesterId INTEGER NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
      requestedQuantity INTEGER NOT NULL,
      pickupTime DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (foodItemId) REFERENCES food_items (id) ON DELETE CASCADE,
      FOREIGN KEY (requesterId) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_food_items_donor ON food_items (donorId);
    CREATE INDEX IF NOT EXISTS idx_food_items_available ON food_items (isAvailable);
    CREATE INDEX IF NOT EXISTS idx_food_requests_food_item ON food_requests (foodItemId);
    CREATE INDEX IF NOT EXISTS idx_food_requests_requester ON food_requests (requesterId);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
  `);

  console.log('Database tables created successfully');
};

// Initialize database
createTables();

module.exports = db;