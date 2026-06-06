require('dotenv').config();
const mongoose = require('mongoose');
const Store = require('./models/Store');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await Store.deleteOne({ address: '춘천시 부평길 11-8' });
  console.log(result.deletedCount ? '✅ 부평길 매장 삭제 완료' : '❌ 매장을 찾지 못했습니다');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
