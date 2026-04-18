const mongoose = require('mongoose');

const DriveSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: [
      'Medical', 'Education', 'NGO', 'Old Age Home', 'Children\'s Home', 
      'Individual Problem', 'Disaster Relief', 'Animal Welfare', 'Environment'
    ],
    default: 'Individual Problem'
  },
  description: { type: String, required: [true, 'Description is required'] },
  beneficiaryName: { type: String, required: [true, 'Beneficiary name is required'] },
  beneficiaryUPI: { type: String, required: [true, 'Beneficiary UPI ID is required for direct transparent funding'] },

  
  // Multimedia
  coverImage: { type: String, required: [true, 'Cover image is required'] },
  images: [{ type: String }], // Gallery
  videoUrl: { type: String }, // Optional YouTube/Vimeo link
  
  // Verification info
  contactNumber: { type: String, required: [true, 'Contact number is required'] },
  alternateNumber: { type: String },
  documentLinks: [{
    name: { type: String },
    url: { type: String },
    docType: { type: String } // 'identity', 'medical', 'official'
  }],
  
  // Financials
  monetaryGoal: { type: Number, default: 0 },
  amountRaised: { type: Number, default: 0 },
  isTaxBenefitAvailable: { type: Boolean, default: false }, // 80G
  urgency: { type: String, enum: ['Normal', 'High', 'Critical'], default: 'Normal' },
  
  // Items (Old feature support)
  itemsNeeded: [{ type: String }],
  
  // Location
  location: { type: String, required: [true, 'Display location is required'] }, // Full address string
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  locationCoordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Campaign Timeline
  startDate: { type: Date, required: [true, 'Start date is required'] },
  endDate: { type: Date, required: [true, 'End date is required'] },
  
  // Management
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Creator is required'] },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  adminComment: { type: String },
  updates: [{ 
    title: String,
    text: String, 
    image: String, 
    date: { type: Date, default: Date.now } 
  }],
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drive', DriveSchema);