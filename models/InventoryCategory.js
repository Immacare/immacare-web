const mongoose = require('mongoose');

// Inventory Category Schema - matches inventory_category table
const inventoryCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: false // No timestamps for categories
});

// Index
inventoryCategorySchema.index({ category: 1 });

// Use explicit collection name for new database
const InventoryCategory = mongoose.model('InventoryCategory', inventoryCategorySchema, 'inventory_category');

module.exports = InventoryCategory;

