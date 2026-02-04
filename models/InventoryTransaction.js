/**
 * InventoryTransaction Model
 * 
 * PURPOSE:
 * This model tracks ALL inventory transactions in detail for audit purposes.
 * It provides a complete trace of every stock movement - sales, restocks, 
 * adjustments, wastage, and manual updates.
 * 
 * USAGE:
 * - Created automatically when inventory changes occur (POS sales, restocks, adjustments)
 * - Used for generating detailed transaction reports and audit trails
 * - Enables tracking of who did what, when, and why
 */

const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  // Reference to the inventory item
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  
  // Item details (denormalized for historical accuracy)
  itemName: {
    type: String,
    required: true
  },
  categoryName: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  },
  
  // Transaction type
  transactionType: {
    type: String,
    enum: [
      'sale',           // POS sale - stock decreases
      'restock',        // Adding new stock
      'adjustment',     // Manual stock adjustment
      'wastage',        // Items wasted/expired
      'return',         // Customer return - stock increases
      'transfer_in',    // Transfer from another location
      'transfer_out',   // Transfer to another location
      'initial',        // Initial stock entry
      'correction'      // Stock correction/reconciliation
    ],
    required: true
  },
  
  // Quantity details
  quantityBefore: {
    type: Number,
    required: true
  },
  quantityChange: {
    type: Number,
    required: true  // Positive for additions, negative for deductions
  },
  quantityAfter: {
    type: Number,
    required: true
  },
  
  // Price information
  unitPrice: {
    type: Number,
    default: 0
  },
  totalValue: {
    type: Number,
    default: 0  // quantityChange * unitPrice
  },
  
  // Reference information (for linking to other records)
  referenceType: {
    type: String,
    enum: ['pos_transaction', 'purchase_order', 'manual', 'system', null],
    default: 'manual'
  },
  referenceId: {
    type: String,
    default: null  // ID of related POS transaction, purchase order, etc.
  },
  
  // User who performed the transaction
  performedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: {
      type: String,
      default: 'System'
    },
    userRole: {
      type: String,
      default: 'system'
    },
    userEmail: {
      type: String,
      default: ''
    }
  },
  
  // Additional details
  notes: {
    type: String,
    default: ''
  },
  
  // For POS sales - customer/patient info
  customerInfo: {
    name: { type: String, default: '' },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientProfile' }
  },
  
  // Batch/lot tracking (if applicable)
  batchNumber: {
    type: String,
    default: ''
  },
  expiryDate: {
    type: Date,
    default: null
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled', 'reversed'],
    default: 'completed'
  },
  
  // If this transaction was reversed/cancelled
  reversedBy: {
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryTransaction' },
    reversedAt: { type: Date },
    reason: { type: String }
  },
  
  // IP address for security audit
  ipAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

// Indexes for efficient querying
inventoryTransactionSchema.index({ inventoryId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ transactionType: 1, createdAt: -1 });
inventoryTransactionSchema.index({ 'performedBy.userId': 1, createdAt: -1 });
inventoryTransactionSchema.index({ createdAt: -1 });
inventoryTransactionSchema.index({ itemName: 'text', notes: 'text' });
inventoryTransactionSchema.index({ referenceId: 1 });
inventoryTransactionSchema.index({ status: 1 });

// Virtual for formatted transaction description
inventoryTransactionSchema.virtual('description').get(function() {
  const typeDescriptions = {
    'sale': 'Sold',
    'restock': 'Restocked',
    'adjustment': 'Adjusted',
    'wastage': 'Wasted',
    'return': 'Returned',
    'transfer_in': 'Transferred In',
    'transfer_out': 'Transferred Out',
    'initial': 'Initial Stock',
    'correction': 'Corrected'
  };
  
  const action = typeDescriptions[this.transactionType] || this.transactionType;
  const qty = Math.abs(this.quantityChange);
  return `${action} ${qty} ${this.unit || 'units'} of ${this.itemName}`;
});

// Ensure virtuals are included in JSON output
inventoryTransactionSchema.set('toJSON', { virtuals: true });
inventoryTransactionSchema.set('toObject', { virtuals: true });

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema, 'inventory_transactions');

module.exports = InventoryTransaction;
