const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
    type:    { type: String, enum: ['일반', '긴급'], default: '일반' },
    title:   { type: String, required: true },
    content: { type: String, required: true },
    date:    { type: String, required: true },   // "YYYY-MM-DD" 형식 유지
    read:    { type: Boolean, default: false },  // 읽음 상태 (단일 사용자 기준)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
