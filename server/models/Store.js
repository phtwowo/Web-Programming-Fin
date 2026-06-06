const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    address:   { type: String, required: true },
    lat:       { type: Number, required: true },
    lng:       { type: Number, required: true },
    crowd:     { type: String, enum: ['여유', '보통', '혼잡'], default: '보통' },
    waitTeams: { type: Number, default: 0, min: 0 },
    soldout:   { type: Boolean, default: false },
  },
  { timestamps: true }   // createdAt, updatedAt 자동 생성
);

module.exports = mongoose.model('Store', storeSchema);
