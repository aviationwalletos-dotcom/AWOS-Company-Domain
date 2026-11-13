/* 공통 머리말·꼬리말, 홈 화면 동작, 소식·연혁 그리기 */
(function () {
  "use strict";
  var S = window.SITE || {};
  var PHOTO = window.PHOTO || function (x) { return x; };
  var page = document.body.getAttribute("data-page") || "";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function fmtDate(iso) {
    var p = String(iso).split("-");
    return p[0] + ". " + Number(p[1]) + ". " + Number(p[2]) + ".";
  }
  function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }
  function mailHref(subject) {
    return "mailto:" + S.email + (subject ? "?subject=" + encodeURIComponent(subject) : "");
  }
  // 분류별 기본 사진 (news.js 에 image 를 비워 둔 글)
  var CAT_PHOTO = { "공지": "1691394045643-aafd8e17deab", "소식": "1746129700182-bef672132578", "보도": "1629221731259-4f0760e3ee89" };
  function newsPhoto(n, w) { return PHOTO(n.image || CAT_PHOTO[n.category] || CAT_PHOTO["소식"], w); }

  var LOGO = '<picture><source srcset="assets/img/awos-logo-ring-288.webp" type="image/webp">' +
             '<img src="assets/img/awos-logo-ring-288.png" alt="" width="36" height="36"></picture>';

  /* ---------- 머리말: 떠 있는 둥근 메뉴 ---------- */
  var nav = [
    { id: "about", href: "about.html", label: "회사소개" },
    { id: "service", href: "service.html", label: "주요 기능" },
    { id: "news", href: "news.html", label: "뉴스룸" },
    { id: "history", href: "history.html", label: "연혁" }
  ];
  var header = document.getElementById("site-header");
  if (header) {
    header.innerHTML =
      '<div class="hd-bar">' +
        '<a class="brand" href="index.html" aria-label="AWOS 홈">' + LOGO + '<span class="brand-name">AW<span>OS</span></span></a>' +
        '<nav id="site-nav" class="site-nav" aria-label="주 메뉴"><ul>' +
          nav.map(function (n) {
            return '<li><a href="' + n.href + '"' + (n.id === page ? ' aria-current="page"' : "") + ">" + n.label + "</a></li>";
          }).join("") +
          '<li class="nav-ask"><a href="' + esc(S.appUrl) + '/inquiry">고객센터</a></li>' +
        "</ul></nav>" +
        '<a class="hd-ask" href="' + esc(S.appUrl) + '/inquiry">도입 문의</a>' +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">' +
          '<span class="menu-bars" aria-hidden="true"></span><span class="sr-only">메뉴</span>' +
        "</button>" +
      "</div>";
    var mbtn = header.querySelector(".menu-btn");
    var navEl = header.querySelector(".site-nav");
    var setMenu = function (open) {
      mbtn.setAttribute("aria-expanded", String(open));
      header.classList.toggle("menu-open", open);
    };
    mbtn.addEventListener("click", function () { setMenu(mbtn.getAttribute("aria-expanded") !== "true"); });
    navEl.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    var onScrollHd = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScrollHd, { passive: true });
    onScrollHd();
  }

  /* ---------- 꼬리말 ---------- */
  var footer = document.getElementById("site-footer");
  if (footer) {
    var info = [];
    info.push(esc(S.companyKo) + (S.companyEn ? " (" + esc(S.companyEn) + ")" : ""));
    var line = [];
    if (S.ceo) line.push("대표 " + esc(S.ceo));
    if (S.bizNumber) line.push("사업자등록번호 " + esc(S.bizNumber));
    if (line.length) info.push(line.join('<span class="sep" aria-hidden="true"></span>'));
    if (S.address) info.push(esc(S.address));
    if (S.email) info.push('E-mail. <a href="' + mailHref() + '">' + esc(S.email) + "</a>");
    if (S.patentNote) info.push(esc(S.patentNote));

    footer.innerHTML =
      '<div class="wrap ft-top">' +
        '<div class="ft-brand"><a class="brand" href="index.html" aria-label="AWOS 홈">' + LOGO + '<span class="brand-name">AW<span>OS</span></span></a>' +
          '<a class="ft-app" href="' + esc(S.appUrl) + '">AWOS 서비스 바로가기</a></div>' +
        '<div class="ft-cols">' +
          '<div><p class="ft-h">회사소개</p><ul><li><a href="about.html">회사 소개</a></li><li><a href="history.html">연혁</a></li></ul></div>' +
          '<div><p class="ft-h">주요 기능</p><ul>' +
            '<li><a href="service.html#schedule">스케줄</a></li><li><a href="service.html#briefing">브리핑 · 안전</a></li>' +
            '<li><a href="service.html#records">기록</a></li><li><a href="service.html#license">자격 · 법령</a></li>' +
            '<li><a href="service.html#ops">기관 운영</a></li></ul></div>' +
          '<div><p class="ft-h">뉴스룸</p><ul><li><a href="news.html">소식</a></li></ul></div>' +
          '<div><p class="ft-h">고객센터</p><ul><li><a href="' + esc(S.appUrl) + '/inquiry">도입 문의</a></li>' +
            (S.email ? '<li><a href="' + mailHref() + '">메일 문의</a></li>' : "") + "</ul></div>" +
        "</div>" +
      "</div>" +
      '<div class="wrap ft-bottom">' +
        '<address class="ft-info">' + info.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</address>" +
        '<p class="ft-copy">Copyright © ' + new Date().getFullYear() + " " + esc(S.companyEn || "AWOS") + " All rights reserved.</p>" +
      "</div>";
  }

  /* ---------- 맨 위로 ---------- */
  var toTop = document.querySelector(".to-top");
  if (!toTop) {
    toTop = document.createElement("button");
    toTop.type = "button"; toTop.className = "to-top"; toTop.setAttribute("aria-label", "맨 위로");
    toTop.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(toTop);
  }
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
  var onScrollTop = function () { toTop.classList.toggle("is-on", window.scrollY > 480); };
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();

  /* ---------- 링크 채우기 ---------- */
  each(document.querySelectorAll("[data-app-path]"), function (a) { a.setAttribute("href", S.appUrl + a.getAttribute("data-app-path")); });
  each(document.querySelectorAll("[data-mail]"), function (a) { a.setAttribute("href", mailHref(a.getAttribute("data-mail"))); });

  /* ---------- 화면에 들어오면 올라오는 요소 ---------- */
  var rvs = document.querySelectorAll(".rv");
  if (rvs.length && "IntersectionObserver" in window && !reduceMotion) {
    document.documentElement.classList.add("js-rv");
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); rio.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    each(rvs, function (el) { rio.observe(el); });
  }

  /* ---------- 홈: 첫 화면 슬라이드 ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    var slides = hero.querySelectorAll(".hero-slide");
    var dots = hero.querySelectorAll(".hero-dots button");
    var pauseBtn = hero.querySelector(".hero-pause");
    var cur = 0, timer = null, paused = reduceMotion, SLIDE_MS = 6500;
    var schedule = function () {
      window.clearTimeout(timer);
      if (!paused) timer = window.setTimeout(function () { if (!document.hidden) go(cur + 1); else schedule(); }, SLIDE_MS);
    };
    var go = function (n) {
      cur = (n + slides.length) % slides.length;
      each(slides, function (s, i) {
        var on = i === cur;
        s.classList.toggle("is-on", on);
        s.setAttribute("aria-hidden", String(!on));
        each(s.querySelectorAll("a"), function (a) { a.tabIndex = on ? 0 : -1; });
      });
      each(dots, function (d, i) { if (i === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      hero.style.setProperty("--slide-ms", SLIDE_MS + "ms");
      hero.classList.remove("tick"); void hero.offsetWidth; if (!paused) hero.classList.add("tick");
      schedule();
    };
    var setPaused = function (p) {
      paused = p;
      pauseBtn.setAttribute("aria-pressed", String(p));
      pauseBtn.setAttribute("aria-label", p ? "자동 넘김 재생" : "자동 넘김 멈춤");
      hero.classList.toggle("is-paused", p);
      if (p) { hero.classList.remove("tick"); window.clearTimeout(timer); } else go(cur);
    };
    each(dots, function (d, i) { d.addEventListener("click", function () { go(i); }); });
    hero.querySelector(".hero-prev").addEventListener("click", function () { go(cur - 1); });
    hero.querySelector(".hero-next").addEventListener("click", function () { go(cur + 1); });
    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    if (reduceMotion) setPaused(true); else go(0);
  }

  /* ---------- 홈: 주요 기능 카드 ---------- */
  var BIZ = [
    { name: "스케줄", href: "service.html#schedule", desc: "교관 라인업을 모아 가용 기체 · 교관 근무 · NOTAM 제한을 반영해 배정하고, 확정하면 교관과 학생에게 바로 알립니다." },
    { name: "브리핑 · 안전", href: "service.html#briefing", desc: "브리핑지를 자동으로 작성하고, 교관 결재를 거친 비행만 GO로 넘어갑니다. 비행 적합성과 커런시도 함께 확인합니다." },
    { name: "기록", href: "service.html#records", desc: "교관이 한 번 확정한 비행이 학생 로그북과 훈련기록부, 교관 서명까지 이어지고, 비행경력증명서를 법정 서식으로 출력합니다." },
    { name: "자격 · 법령", href: "service.html#license", desc: "자격증명 · 항공신체검사 · 항공영어구술능력의 유효기간과 응시 요건을 국내 법령 기준으로 판정하고 근거 조문을 함께 보여줍니다." },
    { name: "기관 운영", href: "service.html#ops", desc: "기단 모니터와 가동률, 비행시간 기준 진도, 교관 비행시간을 따로 모으지 않아도 한 화면에서 봅니다." }
  ];
  var bizCards = document.querySelectorAll(".biz-card");
  if (bizCards.length) {
    var bp = document.getElementById("bp");
    var bName = bp.querySelector(".biz-name"), bDesc = bp.querySelector(".biz-desc"), bLink = bp.querySelector(".pill");
    var pick = function (i, focus) {
      each(bizCards, function (c, k) {
        var on = k === i;
        c.setAttribute("aria-selected", String(on));
        c.tabIndex = on ? 0 : -1;
      });
      bp.setAttribute("aria-labelledby", "bt-" + i);
      bp.classList.remove("swap"); void bp.offsetWidth; bp.classList.add("swap");
      bName.textContent = BIZ[i].name; bDesc.textContent = BIZ[i].desc; bLink.setAttribute("href", BIZ[i].href);
      if (focus) bizCards[i].focus();
      centerCard(i, true);
    };
    // 폰: 고른 카드가 가로 목록 가운데 오도록 (페이지는 움직이지 않게 가로로만)
    var row = bizCards[0].parentNode;
    var centerCard = function (i, smooth) {
      if (row.scrollWidth <= row.clientWidth) return;
      var c = bizCards[i];
      var left = c.offsetLeft - row.offsetLeft - (row.clientWidth - c.offsetWidth) / 2;
      row.scrollTo({ left: Math.max(0, left), behavior: smooth && !reduceMotion ? "smooth" : "auto" });
    };
    window.setTimeout(function () { centerCard(2, false); }, 60);
    each(bizCards, function (c, i) {
      c.addEventListener("click", function () { pick(i); });
      c.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (k) { e.preventDefault(); pick((i + k + bizCards.length) % bizCards.length, true); }
      });
    });
  }

  /* ---------- 홈: 뉴스룸 슬라이더 ---------- */
  var news = (window.NEWS || []).slice().sort(byDateDesc);
  var track = document.getElementById("nr-track");
  if (track) {
    track.innerHTML = news.length ? news.slice(0, 8).map(function (n) {
      return '<li class="nr-item"><a href="news.html?id=' + encodeURIComponent(n.id) + '">' +
        '<span class="nr-ph"><img src="' + esc(newsPhoto(n, 800)) + '" alt="" loading="lazy"></span>' +
        '<span class="nr-title">' + esc(n.title) + "</span>" +
        '<time class="nr-date" datetime="' + esc(n.date) + '">' + fmtDate(n.date) + "</time></a></li>";
    }).join("") : '<li class="empty">아직 올라온 소식이 없습니다.</li>';
    var bar = document.querySelector(".nr-bar span");
    var prev = document.querySelector(".nr-prev"), next = document.querySelector(".nr-next");
    var step = function () { var it = track.querySelector(".nr-item"); return it ? it.getBoundingClientRect().width + 20 : 300; };
    var upd = function () {
      var max = track.scrollWidth - track.clientWidth;
      var vis = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      var pos = max > 0 ? track.scrollLeft / max : 0;
      bar.style.width = (vis * 100) + "%";
      bar.style.left = (pos * (1 - vis) * 100) + "%";
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    track.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ---------- 홈: 숫자 올라가기 ---------- */
  var nums = document.querySelectorAll(".gl-num[data-to]");
  if (nums.length && "IntersectionObserver" in window && !reduceMotion) {
    each(nums, function (el) { el.textContent = "0"; });
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        nio.unobserve(e.target);
        var el = e.target, to = Number(el.getAttribute("data-to")), t0 = null, DUR = 1400;
        var stepN = function (t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / DUR, 1), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(to * ease));
          if (p < 1) window.requestAnimationFrame(stepN);
        };
        window.requestAnimationFrame(stepN);
      });
    }, { threshold: 0.5 });
    each(nums, function (el) { nio.observe(el); });
  }

  /* ---------- 회사 개요 표 (about) ---------- */
  var facts = document.getElementById("company-facts");
  if (facts) {
    var rows = [
      ["회사명", esc(S.companyKo + (S.companyEn ? " (" + S.companyEn + ")" : ""))],
      ["대표", esc(S.ceo)],
      ["설립", esc(S.founded)],
      ["사업 분야", "한국형 비행교육원 행정관리 프로그램 개발 및 생태계 구축"],
      ["소재지", esc(S.address)],
      ["문의", S.email ? '<a href="' + mailHref() + '">' + esc(S.email) + "</a>" : ""]
    ];
    facts.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
      return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>";
    }).join("");
  }

  /* ---------- 소식 목록 · 본문 (news) ---------- */
  var listView = document.getElementById("news-list-view");
  var articleView = document.getElementById("news-article-view");
  if (listView && articleView) {
    var id = new URLSearchParams(location.search).get("id");
    if (id) {
      var n = null;
      news.forEach(function (x) { if (x.id === id) n = x; });
      listView.hidden = true; articleView.hidden = false;
      if (!n) {
        articleView.innerHTML = '<p class="empty">찾는 글이 없습니다. 주소가 바뀌었거나 삭제된 글입니다.</p>' +
          '<p class="center"><a class="pill pill-navy" href="news.html">목록으로</a></p>';
      } else {
        document.title = n.title + " | AWOS";
        var idx = news.indexOf(n), newer = news[idx - 1], older = news[idx + 1];
        articleView.innerHTML =
          '<article class="article">' +
            '<div class="article-meta"><span class="cat">' + esc(n.category) + '</span><time datetime="' + esc(n.date) + '">' + fmtDate(n.date) + "</time></div>" +
            "<h2>" + esc(n.title) + "</h2>" +
            '<figure class="article-ph"><img src="' + esc(newsPhoto(n, 1600)) + '" alt=""></figure>' +
            '<div class="article-body">' + (n.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
            (n.link ? '<p><a class="pill pill-navy" href="' + esc(n.link.url) + '">' + esc(n.link.label) + "</a></p>" : "") +
          "</article>" +
          '<nav class="article-nav" aria-label="이전·다음 글">' +
            (newer ? '<a href="news.html?id=' + encodeURIComponent(newer.id) + '"><span>다음 글</span>' + esc(newer.title) + "</a>" : "<span></span>") +
            (older ? '<a href="news.html?id=' + encodeURIComponent(older.id) + '"><span>이전 글</span>' + esc(older.title) + "</a>" : "<span></span>") +
          "</nav>" +
          '<p class="center"><a class="pill pill-navy" href="news.html">목록으로</a></p>';
      }
    } else {
      var cats = ["전체"];
      news.forEach(function (x) { if (cats.indexOf(x.category) < 0) cats.push(x.category); });
      var filterEl = document.getElementById("news-filter");
      var listEl = document.getElementById("news-list");
      var current = "전체";
      var draw = function () {
        var items = current === "전체" ? news : news.filter(function (x) { return x.category === current; });
        listEl.innerHTML = items.length ? items.map(function (x) {
          return '<li class="nr-item"><a href="news.html?id=' + encodeURIComponent(x.id) + '">' +
            '<span class="nr-ph"><img src="' + esc(newsPhoto(x, 800)) + '" alt="" loading="lazy"></span>' +
            '<span class="nr-cat">' + esc(x.category) + "</span>" +
            '<span class="nr-title">' + esc(x.title) + "</span>" +
            '<time class="nr-date" datetime="' + esc(x.date) + '">' + fmtDate(x.date) + "</time></a></li>";
        }).join("") : '<li class="empty">이 분류에는 아직 글이 없습니다.</li>';
        each(filterEl.querySelectorAll("button"), function (b) {
          b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === current));
        });
      };
      filterEl.innerHTML = cats.map(function (c) { return '<button type="button" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
      filterEl.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        current = b.getAttribute("data-cat"); draw();
      });
      draw();
    }
  }

  /* ---------- 연혁 (history) ---------- */
  var histEl = document.getElementById("history-list");
  if (histEl) {
    var hist = (window.HISTORY || []).slice().sort(function (a, b) { return (b.year * 100 + b.month) - (a.year * 100 + a.month); });
    var years = [];
    hist.forEach(function (h) { if (years.indexOf(h.year) < 0) years.push(h.year); });
    histEl.innerHTML = years.map(function (y) {
      var rowsH = hist.filter(function (h) { return h.year === y; }).map(function (h) {
        return '<li class="hist-row"><time class="hist-month" datetime="' + y + "-" + String(h.month).padStart(2, "0") + '">' + String(h.month).padStart(2, "0") + "</time>" +
          '<ul class="hist-items">' + h.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></li>";
      }).join("");
      return '<section class="hist-year" aria-labelledby="y' + y + '"><h2 id="y' + y + '" class="hist-year-num">' + y + "</h2>" +
        '<ol class="hist-rows">' + rowsH + "</ol></section>";
    }).join("");
  }
})();
