const db = require('../database/init');

class Food {
  static create(foodData) {
    const stmt = db.prepare(`
      INSERT INTO food_items (title, description, category, quantity, unit, expiryDate, 
                             pickupLocation, pickupInstructions, images, donorId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      foodData.title,
      foodData.description || null,
      foodData.category,
      foodData.quantity,
      foodData.unit,
      foodData.expiryDate || null,
      foodData.pickupLocation,
      foodData.pickupInstructions || null,
      JSON.stringify(foodData.images || []),
      foodData.donorId
    );
    
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT f.*, u.name as donorName, u.email as donorEmail, u.phone as donorPhone
      FROM food_items f
      JOIN users u ON f.donorId = u.id
      WHERE f.id = ?
    `);
    const food = stmt.get(id);
    if (food && food.images) {
      food.images = JSON.parse(food.images);
    }
    return food;
  }

  static findAll(filters = {}, limit = 50, offset = 0) {
    let query = `
      SELECT f.*, u.name as donorName, u.email as donorEmail
      FROM food_items f
      JOIN users u ON f.donorId = u.id
      WHERE f.isAvailable = 1
    `;
    const params = [];

    if (filters.category) {
      query += ' AND f.category = ?';
      params.push(filters.category);
    }

    if (filters.city) {
      query += ' AND u.city = ?';
      params.push(filters.city);
    }

    if (filters.search) {
      query += ' AND (f.title LIKE ? OR f.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY f.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const foods = stmt.all(...params);
    
    return foods.map(food => {
      if (food.images) {
        food.images = JSON.parse(food.images);
      }
      return food;
    });
  }

  static findByDonor(donorId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT * FROM food_items 
      WHERE donorId = ? 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
    const foods = stmt.all(donorId, limit, offset);
    
    return foods.map(food => {
      if (food.images) {
        food.images = JSON.parse(food.images);
      }
      return food;
    });
  }

  static update(id, foodData) {
    const fields = [];
    const values = [];
    
    Object.keys(foodData).forEach(key => {
      if (foodData[key] !== undefined && key !== 'id') {
        if (key === 'images') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(foodData[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(foodData[key]);
        }
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`UPDATE food_items SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM food_items WHERE id = ?');
    return stmt.run(id);
  }

  static getCategories() {
    const stmt = db.prepare('SELECT DISTINCT category FROM food_items ORDER BY category');
    return stmt.all().map(row => row.category);
  }
}

module.exports = Food;