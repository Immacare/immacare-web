/**
 * InventoryHistory Model
 * 
 * PURPOSE:
 * This model stores historical snapshots of inventory changes.
 * It tracks stock levels over time for reporting and auditing purposes.
 * 
 * USAGE:
 * - Created automatically when inventory stock changes (POS sales, manual updates)
 * - Used for generating historical inventory reports by date range
 */

const mongoose = require('mongoose');

const inventoryHistorySchema = new mongoose.Schema({
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  item: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  unit: {
    type: String
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
    default: 'In Stock'
  },
  // What triggered this snapshot
  changeType: {
    type: String,
    enum: ['pos_sale', 'manual_update', 'adjustment', 'initial', 'restock'],
    default: 'manual_update'
  },
  // Quantity changed in this transaction
  quantityChanged: {
    type: Number,
    default: 0
  },
  // User who made the change (if available)
  changedBy: {
    type: String,
    default: null
  },
  // Date of the snapshot
  snapshotDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
inventoryHistorySchema.index({ inventoryId: 1, snapshotDate: -1 });
inventoryHistorySchema.index({ snapshotDate: -1 });
inventoryHistorySchema.index({ item: 1, snapshotDate: -1 });

const InventoryHistory = mongoose.model('InventoryHistory', inventoryHistorySchema, 'inventory_history');

module.exports = InventoryHistory;
