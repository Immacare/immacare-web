/**
 * LandingService Model
 * 
 * PURPOSE:
 * This model stores the dynamic content for landing page services.
 * Admins can manage service cards and their detail pages through the admin panel.
 * 
 * STRUCTURE:
 * - Card data: title, cardImage, slug (for URL)
 * - Detail page: bannerImage, description, sections (flexible content blocks)
 */

const mongoose = require('mongoose');

// Schema for content sections on the detail page
const SectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['heading', 'paragraph', 'list', 'blockquote', 'image'],
    required: true
  },
  content: {
    type: String, // For heading, paragraph, blockquote, image URL
    default: ''
  },
  items: [{
    type: String // For list items
  }],
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const LandingServiceSchema = new mongoose.Schema({
  // Card display on landing page
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  cardImage: {
    type: String, // URL or path to image
    required: true
  },
  
  // Detail page content
  bannerImage: {
    type: String, // URL or path to banner image
    required: true
  },
  description: {
    type: String, // Main description paragraph
    required: true
  },
  
  // Flexible content sections
  sections: [SectionSchema],
  
  // Display order on landing page carousel
  displayOrder: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
LandingServiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries (slug index is already created by unique: true)
LandingServiceSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('LandingService', LandingServiceSchema);
