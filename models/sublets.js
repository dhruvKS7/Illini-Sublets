const mongoose = require('mongoose');

const subletSchema = new mongoose.Schema({
  poster_id: {
    type: String,
    required: true,
  },
  numBedrooms: {
    type: Number,
    required: true,
  },
  numBathrooms: {
    type: Number,
    required: true,
  },
  petFriendly: {
    type: Boolean,
    required: true,
  },
  parking: {
    type: Boolean,
    required: true,
  },
  gym: {
    type: Boolean,
    required: true,
  },
  utilitiesIncluded: {
    type: Boolean,
    required: true,
  },
  secureEntry: {
    type: Boolean,
    required: true,
  },
  elevator: {
    type: Boolean,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  interestedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  term: {
    type: String,
    required: true,
  },
  monthlyPrice: {
    type: Number,
    required: true,
  },
  leasingCompany: {
    type: String,
    required: true,
  },
  lessor: {
    type: String,
    required: true,
  }
}, { versionKey: false });

// Export the Mongoose model
module.exports = mongoose.model('sublets', subletSchema);
