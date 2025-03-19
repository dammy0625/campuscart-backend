// backend/models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  images: { type: [String] }, // Array of URLs for multiple images
  createdAt: { type: Date, default: Date.now },
  id: { type: Number, unique: true }, // Custom ID field
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;


