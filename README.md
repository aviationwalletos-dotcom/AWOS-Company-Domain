# AWOS 기업 홈페이지

GitHub Pages로 바로 올릴 수 있는 정적 사이트입니다. 빌드 과정이 없어서 파일을 저장소에 올리면 그대로 배포됩니다.
서비스 앱(aviationwallet.com, Netlify)과는 별도 저장소로 두는 것을 권합니다.

## 폴더 구조

```
index.html          홈 — 사진 슬라이드 · 주요 기능 · 뉴스룸 · 한눈에 보기 · 문의 · 문구
service.html        주요 기능 (스케줄 · 브리핑·안전 · 기록 · 자격·법령 · 기관 운영)
about.html          회사 소개 · 팀 · 자문 교수진
history.html        연혁
news.html           뉴스룸 목록 / 본문 (news.html?id=글아이디)
404.html            없는 주소로 들어왔을 때
assets/css/style.css
assets/js/config.js 회사명·대표·메일·사업자번호·주소, 사진 주소 만드는 함수
assets/js/site.js   공통 머리말·꼬리말, 홈 슬라이드·기능 카드·뉴스룸·숫자, 소식·연혁 그리기
assets/img/awos-logo-ring-288.png/.webp  원본 로고 (앱 public/logos 에서 가져옴, 꼬리말)
assets/img/favicon.png, apple-touch-icon.png  원본 로고로 만든 아이콘
data/news.js        소식 게시판 글
data/history.js     연혁 항목
.nojekyll           GitHub Pages가 Jekyll 처리를 하지 않도록 하는 빈 파일
```

## 자주 하는 수정

**소식 올리기** — `data/news.js`를 열어 배열 맨 위에 항목 하나를 복사해 붙이고 고칩니다.
`id`는 영문·숫자·하이픈만 씁니다. 날짜순 정렬과 홈 뉴스룸 슬라이드(최근 8건)는 자동입니다.

```js
{
  id: "jeju-pilot",
  date: "2026-11-20",
  category: "소식",        // 공지 | 소식 | 보도
  title: "제목",
  summary: "목록에 보이는 한 줄 요약",
  body: ["첫 문단", "둘째 문단"],
  link: { label: "기사 보기", url: "https://..." },  // 없으면 이 줄 삭제
  image: "assets/img/news/jeju.jpg"                  // 대표 사진, 없으면 분류별 기본 사진
},
```

**연혁 추가** — `data/history.js`에 `{ year: 2026, month: 12, items: ["내용"] }` 형식으로 넣습니다.

**회사 정보** — `assets/js/config.js`에서 고칩니다. 법인 등기와 사업자등록이 끝나면
`bizNumber`, `address`, `founded`를 채우면 꼬리말과 회사 소개 표에 자동으로 나타납니다. 빈 값은 화면에 나오지 않습니다.

**팀·자문 교수진** — `about.html`에서 직접 고칩니다.

## 내 컴퓨터에서 미리 보기

`index.html`을 더블클릭해서 브라우저로 열면 됩니다. 데이터가 `.js` 파일이라 서버 없이도 소식과 연혁이 보입니다.

## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다. (예: `awos-homepage`) Pages를 무료로 쓰려면 공개(Public) 저장소여야 합니다.
2. GitHub Desktop으로 저장소를 내려받고, 이 폴더의 파일 전체를 저장소 최상위에 넣은 뒤 commit · push 합니다.
   `.nojekyll`처럼 점으로 시작하는 파일도 같이 들어갔는지 확인하세요.
3. 저장소 Settings → Pages → Build and deployment에서 Source를 `Deploy from a branch`, Branch를 `main` / `/(root)`로 지정하고 저장합니다.
4. 1~2분 뒤 `https://<계정명>.github.io/awos-homepage/` 주소로 열립니다.

## 도메인 연결 (선택)

aviationwallet.com은 서비스 앱이 쓰고 있으므로, 회사 홈페이지는 별도 도메인이나 서브도메인(예: `www.회사도메인` 또는 `corp.aviationwallet.com`)을 쓰는 것을 권합니다.

1. Settings → Pages → Custom domain에 도메인을 입력합니다. (저장소에 `CNAME` 파일이 자동으로 생깁니다)
2. 도메인 관리 화면에서 서브도메인이면 CNAME 레코드를 `<계정명>.github.io`로, 루트 도메인이면 GitHub 안내의 A 레코드 4개를 등록합니다.
3. 연결이 확인되면 `Enforce HTTPS`를 켭니다.

`404.html`의 "홈으로 가기"는 도메인 루트(`/`)로 이동합니다. `github.io/저장소명/` 주소만 쓸 때는 이 링크가 계정 루트로 가므로, 도메인을 연결해 쓰는 것을 기준으로 했습니다.

## 사진

지금 들어간 사진은 모두 [Unsplash](https://unsplash.com)의 무료 사진(Unsplash 라이선스, 상업적 사용 가능·출처 표시 의무 없음)이며,
images.unsplash.com 주소로 불러옵니다. 실제 교육원·교관·기체 사진이 생기면 바꾸는 것을 권합니다.

- **홈 첫 화면 · 문의 띠 · 문구 띠 · 주요 기능 카드**: `index.html`의 `src="https://images.unsplash.com/..."` 부분을
  `assets/img/파일명.jpg`로 바꾸고 사진 파일을 `assets/img/`에 넣습니다. (첫 화면은 `srcset`도 같이 지우거나 바꿉니다)
- **하위 페이지 머리 사진**: 각 html의 `<img class="band-img" ...>`
- **뉴스룸 사진**: `data/news.js`의 `image` 값
- 사진은 가로 2000px 안팎, 300KB 이하 jpg/webp를 권합니다. 첫 화면 사진은 왼쪽이 어두울수록 글자가 잘 보입니다.

## 화면 동작

- 데스크톱: 첫 화면 사진이 6.5초마다 넘어가며(멈춤 버튼 있음), 주요 기능 카드를 누르면 카드가 커지고 아래 설명이 바뀝니다.
  뉴스룸은 좌우 화살표와 진행 막대, '한눈에 보기' 숫자는 화면에 들어올 때 올라갑니다.
- 태블릿 · 폰(1180px 이하): 홈의 각 구간이 화면 한 장씩 넘어갑니다.
- 기기에서 '동작 줄이기'를 켠 경우 자동 넘김과 움직임이 꺼집니다.
