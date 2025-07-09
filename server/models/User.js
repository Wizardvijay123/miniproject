const db = require('../database/init');

class User {
  static create(userData) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, address, city, state, zipCode, profileImage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userData.name,
      userData.email,
      userData.password,
      userData.phone || null,
      userData.address || null,
      userData.city || null,
      userData.state || null,
      userData.zipCode || null,
      userData.profileImage || null
    );
    
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static update(id, userData) {
    const fields = [];
    const values = [];
    
    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }

  static findAll(limit = 50, offset = 0) {
    const stmt = db.prepare('SELECT * FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset);
  }
}

module.exports = User;