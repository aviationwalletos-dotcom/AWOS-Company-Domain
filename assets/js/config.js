/*
  회사 기본 정보 — 여기만 고치면 모든 페이지 머리말·꼬리말에 반영됩니다.
  값을 빈 문자열("")로 두면 그 항목은 화면에 나오지 않습니다.
*/
window.SITE = {
  companyKo: "주식회사 에이워스",
  companyEn: "AWOS Inc.",
  ceo: "우혁준",
  email: "aviationwalletos@gmail.com",
  appUrl: "https://aviationwallet.com",

  // 법인 등기·사업자등록이 끝나면 채워 넣으세요.
  bizNumber: "",       // 예: "000-00-00000"
  address: "",         // 예: "경기도 고양시 덕양구 항공대학로 76, 산학협력관 210호"
  founded: "",         // 예: "2026. 11."

  patentNote: "특허 출원 제10-2026-0151507호 외 3건"
};

/*
  사진 주소 만들기
  - "assets/..." 나 "https://..." 로 시작하면 그대로 씁니다. (저장소에 넣은 사진)
  - 그 밖에는 Unsplash 사진 번호로 보고 주소를 만듭니다. (무료 Unsplash 라이선스 사진)
*/
window.PHOTO = function (id, w) {
  if (!id) return "";
  if (/^(assets\/|https?:)/.test(id)) return id;
  return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 1200) + "&q=75";
};
