/**
 * Inventory Model
 * 
 * PURPOSE:
 * This model manages medical inventory items in the clinic.
 * It tracks items, quantities, prices, and stock status for inventory management.
 * 
 * USAGE:
 * Used for tracking medical supplies, medications, and equipment.
 * Helps monitor stock levels and determine when items need to be reordered.
 * 
 * RELATIONSHIPS:
 * - References InventoryCategory model (category)
 * 
 * FEATURES:
 * - Automatic status calculation based on quantity and average quantity
 * - Status can be: 'in stock', 'out of stock', 'for reorder'
 */

const mongoose = require('mongoose');

// Inventory Schema - matches inventory table
// Defines the structure of inventory item documents in MongoDB
const inventorySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryCategory',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  averageQuantity: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    default: null,
    enum: ['in stock', 'out of stock', 'for reorder', null]
  }
}, {
  timestamps: false // No timestamps for inventory
});

// Indexes
inventorySchema.index({ item: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ status: 1 });

// Virtual for calculating status based on quantity and averageQuantity
inventorySchema.virtual('calculatedStatus').get(function() {
  if (this.quantity === 0) {
    return 'out of stock';
  }
  if (this.averageQuantity && this.quantity < this.averageQuantity) {
    return 'for reorder';
  }
  return 'in stock';
});

// Use explicit collection name for new database
const Inventory = mongoose.model('Inventory', inventorySchema, 'inventory');

module.exports = Inventory;

