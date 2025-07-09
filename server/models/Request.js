const db = require('../database/init');

class Request {
  static create(requestData) {
    const stmt = db.prepare(`
      INSERT INTO food_requests (foodItemId, requesterId, message, requestedQuantity, pickupTime)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      requestData.foodItemId,
      requestData.requesterId,
      requestData.message || null,
      requestData.requestedQuantity,
      requestData.pickupTime || null
    );
    
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT r.*, 
             f.title as foodTitle, f.category as foodCategory,
             u.name as requesterName, u.email as requesterEmail, u.phone as requesterPhone,
             d.name as donorName, d.email as donorEmail, d.phone as donorPhone
      FROM food_requests r
      JOIN food_items f ON r.foodItemId = f.id
      JOIN users u ON r.requesterId = u.id
      JOIN users d ON f.donorId = d.id
      WHERE r.id = ?
    `);
    return stmt.get(id);
  }

  static findByRequester(requesterId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT r.*, 
             f.title as foodTitle, f.category as foodCategory, f.pickupLocation,
             d.name as donorName, d.email as donorEmail, d.phone as donorPhone
      FROM food_requests r
      JOIN food_items f ON r.foodItemId = f.id
      JOIN users d ON f.donorId = d.id
      WHERE r.requesterId = ?
      ORDER BY r.createdAt DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(requesterId, limit, offset);
  }

  static findByDonor(donorId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT r.*, 
             f.title as foodTitle, f.category as foodCategory,
             u.name as requesterName, u.email as requesterEmail, u.phone as requesterPhone
      FROM food_requests r
      JOIN food_items f ON r.foodItemId = f.id
      JOIN users u ON r.requesterId = u.id
      WHERE f.donorId = ?
      ORDER BY r.createdAt DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(donorId, limit, offset);
  }

  static findByFoodItem(foodItemId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT r.*, 
             u.name as requesterName, u.email as requesterEmail, u.phone as requesterPhone
      FROM food_requests r
      JOIN users u ON r.requesterId = u.id
      WHERE r.foodItemId = ?
      ORDER BY r.createdAt DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(foodItemId, limit, offset);
  }

  static update(id, requestData) {
    const fields = [];
    const values = [];
    
    Object.keys(requestData).forEach(key => {
      if (requestData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(requestData[key]);
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`UPDATE food_requests SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM food_requests WHERE id = ?');
    return stmt.run(id);
  }

  static getStats() {
    const totalRequests = db.prepare('SELECT COUNT(*) as count FROM food_requests').get().count;
    const completedRequests = db.prepare('SELECT COUNT(*) as count FROM food_requests WHERE status = "completed"').get().count;
    const pendingRequests = db.prepare('SELECT COUNT(*) as count FROM food_requests WHERE status = "pending"').get().count;
    
    return {
      total: totalRequests,
      completed: completedRequests,
      pending: pendingRequests
    };
  }
}

module.exports = Request;