require('dotenv').config();
const mongoose = require('mongoose');
const Store = require('./models/Store');

const newStores = [
  {
    name: '테스트 매장A\n부평길',
    address: '춘천시 부평길 11-8',
    lat: 37.8813,
    lng: 127.7298,
    crowd: '여유',
    waitTeams: 0,
    soldout: false,
  },
  {
    name: '테스트 매장B\n한빛관',
    address: '강원대학교 한빛관',
    lat: 37.8694,
    lng: 127.7448,
    crowd: '여유',
    waitTeams: 0,
    soldout: false,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('연결됨');
  const result = await Store.insertMany(newStores);
  console.log(`매장 ${result.length}개 추가 완료`);
  result.forEach(s => console.log(`  - ${s.name.replace('\n',' ')} (${s._id})`));
  await mongoose.disconnect();
  console.log('완료!');
}

run().catch(err => { console.error(err); process.exit(1); });
