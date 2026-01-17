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
  unit: {
    type: String,
    trim: true,
    maxlength: 50,
    default: null
  },
  beginning_balance: {
    type: Number,
    default: 0
  },
  adjustments: {
    type: Number,
    default: 0
  },
  actual_stock: {
    type: Number,
    default: 0
  },
  qty_used: {
    type: Number,
    default: 0
  },
  qty_wasted: {
    type: Number,
    default: 0
  },
  months_usage: {
    type: Number,
    default: 0
  },
  abl: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    default: 'In Stock',
    enum: ['In Stock', 'Out of Stock', 'For Reorder', null]
  },
  // Legacy fields for backward compatibility
  quantity: {
    type: Number,
    default: 0
  },
  averageQuantity: {
    type: Number,
    default: null
  }
}, {
  timestamps: true // Enable timestamps to track when inventory was last updated
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

