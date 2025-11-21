const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
},
{ timestamps: true }
);

// indexing for performance optimization
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ action: 1 });

module.exports = mongoose.model('Activity', activitySchema);

