import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { InsertUser, User } from '@shared/schema';

// Initialize SQLite database
const db = new Database('auth.sqlite');

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

export class SQLiteAuthStorage {
  // Get user by ID
  async getUser(id: number): Promise<User | undefined> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as User | undefined;
    return user;
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<User | undefined> {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as User | undefined;
    return user;
  }

  // Create a new user
  async createUser(userData: InsertUser): Promise<User> {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // Insert the user with hashed password
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const info = stmt.run(userData.username, hashedPassword);
    
    // Return the newly created user
    return {
      id: info.lastInsertRowid as number,
      username: userData.username,
      password: hashedPassword
    };
  }

  // Verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const authStorage = new SQLiteAuthStorage();