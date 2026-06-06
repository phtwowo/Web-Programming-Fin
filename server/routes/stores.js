const express = require('express');
const router  = express.Router();
const Store   = require('../models/Store');

// GET /api/stores — 전체 매장 조회
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: 1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/stores/:id — 혼잡도·대기팀수·품절 업데이트 (제보)
router.patch('/:id', async (req, res) => {
  try {
    const { crowd, waitTeams, soldout } = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { crowd, waitTeams, soldout },
      { new: true, runValidators: true }
    );
    if (!store) return res.status(404).json({ message: '매장을 찾을 수 없습니다.' });
    res.json(store);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
