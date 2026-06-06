const express = require('express');
const router  = express.Router();
const Notice  = require('../models/Notice');

// GET /api/notices — 전체 공지 조회
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/notices/:id/read — 개별 공지 읽음 처리
router.patch('/:id/read', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notice) return res.status(404).json({ message: '공지를 찾을 수 없습니다.' });
    res.json(notice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/notices/read-all — 전체 공지 읽음 처리
router.post('/read-all', async (req, res) => {
  try {
    await Notice.updateMany({}, { read: true });
    res.json({ message: '모든 공지를 읽음 처리했습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
