require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const storesRouter  = require('./routes/stores');
const noticesRouter = require('./routes/notices');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── 미들웨어 ── */
app.use(cors());            // 프론트(Vite :5173)에서 오는 요청 허용
app.use(express.json());    // JSON 바디 파싱

/* ── 라우트 ── */
app.use('/api/stores',  storesRouter);
app.use('/api/notices', noticesRouter);

/* ── 헬스체크 ── */
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

/* ── MongoDB 연결 후 서버 시작 ── */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
    app.listen(PORT, () => console.log(`🚀 서버 실행 중 → http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB 연결 실패:', err.message);
    process.exit(1);
  });
