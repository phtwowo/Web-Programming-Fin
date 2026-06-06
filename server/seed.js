/**
 * seed.js — MongoDB에 초기 데이터를 삽입합니다.
 * 실행: node seed.js
 * ※ .env 파일에 MONGODB_URI가 설정된 후 실행하세요.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Store    = require('./models/Store');
const Notice   = require('./models/Notice');

const INITIAL_STORES = [
  { name: '강원대 곰두리 POP-UP',   address: '강원대학교 백록관',        lat: 37.8687, lng: 127.7443, crowd: '보통', waitTeams: 8,  soldout: false },
  { name: '뉴진스 × MCM POP-UP',    address: '강원대 후문 근처',          lat: 37.8691, lng: 127.7431, crowd: '혼잡', waitTeams: 23, soldout: true  },
  { name: '노티드 도넛 춘천 팝업',   address: '강원대 중앙도서관 앞',      lat: 37.8675, lng: 127.7401, crowd: '여유', waitTeams: 2,  soldout: false },
  { name: '이솝 한정 컬렉션',        address: '강원대 학생회관 앞',        lat: 37.8660, lng: 127.7370, crowd: '보통', waitTeams: 11, soldout: false },
  { name: '무신사 스탠다드 춘천 팝업', address: '강원대 정문 100m',        lat: 37.8672, lng: 127.7390, crowd: '혼잡', waitTeams: 35, soldout: true  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB 연결됨');

  // 기존 데이터 삭제
  await Store.deleteMany({});
  await Notice.deleteMany({});

  // 매장 삽입
  const stores = await Store.insertMany(INITIAL_STORES);
  console.log(`매장 ${stores.length}개 삽입 완료`);

  // 공지 삽입 (storeId를 실제 ObjectId로 연결)
  const findStore = (name) => stores.find(s => s.name.includes(name))?._id ?? null;

  const INITIAL_NOTICES = [
    { storeId: null,              type: '긴급', title: '⚡ 일부 매장 조기 마감 예정',        content: '오늘 오후 6시 이후 일부 매장이 재고 소진으로 인해 조기 마감될 수 있습니다.',        date: '2025-06-10' },
    { storeId: null,              type: '일반', title: '팝업나우 서비스 오픈 안내',           content: '실시간 팝업 혼잡도 공유 플랫폼 팝업나우(PUN)가 정식 오픈했습니다!',               date: '2025-06-09' },
    { storeId: findStore('곰두리'), type: '긴급', title: '곰두리 팝업 — 한정판 굿즈 오픈런', content: '오전 10시 정각에 한정 200개 굿즈가 풀립니다.',                                    date: '2025-06-10' },
    { storeId: findStore('곰두리'), type: '일반', title: '곰두리 팝업 — 운영 시간 변경',     content: '6월 11일부터 오전 11시 ~ 오후 8시로 변경됩니다.',                                 date: '2025-06-09' },
    { storeId: findStore('MCM'),    type: '긴급', title: '뉴진스 MCM — 굿즈 전량 품절',      content: '현재 모든 굿즈가 품절 상태입니다. 재입고 일정은 미정입니다.',                      date: '2025-06-10' },
    { storeId: findStore('노티드'), type: '일반', title: '노티드 도넛 — 신메뉴 출시',        content: '춘천 팝업 한정 딸기 크림 도넛이 출시됩니다. 하루 50개 한정 판매.',               date: '2025-06-08' },
  ];

  const notices = await Notice.insertMany(INITIAL_NOTICES);
  console.log(`공지 ${notices.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log('완료!');
}

seed().catch(err => { console.error(err); process.exit(1); });
