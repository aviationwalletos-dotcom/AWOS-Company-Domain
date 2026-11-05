# AWOS 기업 홈페이지

GitHub Pages로 바로 올릴 수 있는 정적 사이트입니다. 빌드 과정이 없어서 파일을 저장소에 올리면 그대로 배포됩니다.
서비스 앱(aviationwallet.com, Netlify)과는 별도 저장소로 두는 것을 권합니다.

## 폴더 구조

```
index.html          랜딩(홈) — 앱 메인 화면(OpsLanding)을 옮긴 것
about.html          회사 소개 · 팀 · 자문 교수진
history.html        연혁
news.html           소식 목록 / 본문 (news.html?id=글아이디)
404.html            없는 주소로 들어왔을 때
assets/css/style.css
assets/js/config.js 회사명·대표·메일·사업자번호·주소 (머리말·꼬리말·회사 개요에 반영)
assets/js/site.js   공통 머리말·꼬리말, 소식·연혁 그리기
assets/img/awos-logo-ring-288.png/.webp  원본 로고 (앱 public/logos 에서 가져옴, 꼬리말)
assets/img/favicon.png, apple-touch-icon.png  원본 로고로 만든 아이콘
assets/img/landing/                  역할별 화면 캡처 넣는 곳 (util.webp · auto.webp · f-track.webp)
data/news.js        소식 게시판 글
data/history.js     연혁 항목
.nojekyll           GitHub Pages가 Jekyll 처리를 하지 않도록 하는 빈 파일
```

## 자주 하는 수정

**소식 올리기** — `data/news.js`를 열어 배열 맨 위에 항목 하나를 복사해 붙이고 고칩니다.
`id`는 영문·숫자·하이픈만 씁니다. 날짜순 정렬과 홈의 최근 소식 3개는 자동입니다.

```js
{
  id: "jeju-pilot",
  date: "2026-11-20",
  category: "소식",        // 공지 | 소식 | 보도
  title: "제목",
  summary: "목록에 보이는 한 줄 요약",
  body: ["첫 문단", "둘째 문단"],
  link: { label: "기사 보기", url: "https://..." }   // 없으면 이 줄 삭제
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

## 역할별 화면 캡처

홈의 '같은 정보, 역할마다 필요한 화면'은 앱 저장소의 `public/landing/ops/util.webp`, `auto.webp`, `f-track.webp`를
`assets/img/landing/`에 그대로 넣으면 글 옆에 화면이 나타납니다. 파일이 없으면 글만 가운데 정렬로 보입니다.
