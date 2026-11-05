/* 공통 머리말·꼬리말과 소식·연혁 렌더링 */
(function () {
  "use strict";
  var S = window.SITE || {};
  var page = document.body.getAttribute("data-page") || "";

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

  /* ---------- 머리말 ---------- */
  var nav = [
    { id: "about", href: "about.html", label: "회사 소개" },
    { id: "service", href: "index.html#service", label: "서비스" },
    { id: "history", href: "history.html", label: "연혁" },
    { id: "news", href: "news.html", label: "소식" }
  ];
  var header = document.getElementById("site-header");
  if (header) {
    var links = nav.map(function (n) {
      var cur = n.id === page ? ' aria-current="page"' : "";
      return '<li><a href="' + n.href + '"' + cur + ">" + n.label + "</a></li>";
    }).join("");
    header.innerHTML =
      '<div class="wrap header-row">' +
        '<a class="brand" href="index.html" aria-label="AWOS 홈">' +
          '<span class="brand-short">AW<span class="brand-os">OS</span></span>' +
          '<span class="brand-long">Aviation Wallet <span class="brand-os">OS</span></span>' +
        "</a>" +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">' +
          '<span class="menu-btn-bars" aria-hidden="true"></span><span class="sr-only">메뉴</span>' +
        "</button>" +
        '<nav id="site-nav" class="site-nav" aria-label="주 메뉴">' +
          '<ul>' + links + "</ul>" +
          '<a class="btn btn-small" href="' + esc(S.appUrl) + '/inquiry">도입 문의</a>' +
        "</nav>" +
      "</div>";

    var btn = header.querySelector(".menu-btn");
    var navEl = header.querySelector(".site-nav");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      navEl.classList.toggle("is-open", !open);
    });
    navEl.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        btn.setAttribute("aria-expanded", "false");
        navEl.classList.remove("is-open");
      }
    });
  }

  /* ---------- 꼬리말 ---------- */
  var footer = document.getElementById("site-footer");
  if (footer) {
    var info = [];
    info.push("<div class=\"footer-name\">" + esc(S.companyKo) + (S.companyEn ? " (" + esc(S.companyEn) + ")" : "") + "</div>");
    var line = [];
    if (S.ceo) line.push("대표 " + esc(S.ceo));
    if (S.bizNumber) line.push("사업자등록번호 " + esc(S.bizNumber));
    if (line.length) info.push("<div>" + line.join("<span class=\"sep\" aria-hidden=\"true\"></span>") + "</div>");
    if (S.address) info.push("<div>" + esc(S.address) + "</div>");
    if (S.email) info.push('<div><a href="' + mailHref() + '">' + esc(S.email) + "</a></div>");

    footer.innerHTML =
      '<div class="wrap footer-grid">' +
        '<div class="footer-info"><picture><source srcset="assets/img/awos-logo-ring-288.webp" type="image/webp"><img class="footer-logo" src="assets/img/awos-logo-ring-288.png" alt="AWOS" width="88" height="88"></picture>' + info.join("") + "</div>" +
        '<ul class="footer-links">' +
          '<li><a href="about.html">회사 소개</a></li>' +
          '<li><a href="history.html">연혁</a></li>' +
          '<li><a href="news.html">소식</a></li>' +
          '<li><a href="' + esc(S.appUrl) + '">AWOS 서비스</a></li>' +
        "</ul>" +
        '<div class="footer-legal">' +
          (S.patentNote ? "<div>" + esc(S.patentNote) + "</div>" : "") +
          "<div>© " + new Date().getFullYear() + " " + esc(S.companyEn || "AWOS") + "</div>" +
        "</div>" +
      "</div>";
  }

  /* ---------- 회사 개요 표 (about) ---------- */
  var facts = document.getElementById("company-facts");
  if (facts) {
    var rows = [
      ["회사명", S.companyKo + (S.companyEn ? " (" + S.companyEn + ")" : "")],
      ["대표", S.ceo],
      ["설립", S.founded],
      ["사업 분야", "한국형 비행교육원 행정관리 프로그램 개발 및 생태계 구축"],
      ["소재지", S.address],
      ["문의", S.email ? '<a href="' + mailHref() + '">' + esc(S.email) + "</a>" : ""]
    ];
    facts.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
      var v = r[0] === "문의" ? r[1] : esc(r[1]);
      return "<div><dt>" + r[0] + "</dt><dd>" + v + "</dd></div>";
    }).join("");
  }

  /* ---------- 서비스(앱) 링크 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-app-path]"), function (a) {
    a.setAttribute("href", S.appUrl + a.getAttribute("data-app-path"));
  });

  /* ---------- 역할별 화면 탭 (index) ---------- */
  var tabs = document.querySelectorAll('.role-tabs [role="tab"]');
  if (tabs.length) {
    var select = function (t) {
      Array.prototype.forEach.call(tabs, function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
    };
    Array.prototype.forEach.call(tabs, function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!k) return;
        var n = tabs[(i + k + tabs.length) % tabs.length];
        select(n); n.focus();
      });
    });
  }
  // 화면 캡처 파일이 아직 없으면 글만 보여줍니다
  Array.prototype.forEach.call(document.querySelectorAll(".role-shot img"), function (img) {
    var off = function () { img.closest(".role-panel").classList.add("no-shot"); };
    if (img.complete && img.naturalWidth === 0) off();
    img.addEventListener("error", off);
  });

  /* ---------- 메일 링크 일괄 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-mail]"), function (a) {
    a.setAttribute("href", mailHref(a.getAttribute("data-mail")));
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-app]"), function (a) {
    a.setAttribute("href", S.appUrl);
  });

  /* ---------- 최근 소식 (index) ---------- */
  var news = (window.NEWS || []).slice().sort(byDateDesc);

  function newsRow(n) {
    return '<li class="news-row">' +
      '<a href="news.html?id=' + encodeURIComponent(n.id) + '">' +
        '<time class="news-date" datetime="' + esc(n.date) + '">' + fmtDate(n.date) + "</time>" +
        '<span class="news-cat">' + esc(n.category) + "</span>" +
        '<span class="news-title">' + esc(n.title) + "</span>" +
        (n.summary ? '<span class="news-sum">' + esc(n.summary) + "</span>" : "") +
      "</a></li>";
  }

  var latest = document.getElementById("latest-news");
  if (latest) {
    latest.innerHTML = news.length
      ? news.slice(0, 3).map(newsRow).join("")
      : '<li class="empty">아직 올라온 소식이 없습니다.</li>';
  }

  /* ---------- 소식 목록·본문 (news) ---------- */
  var listView = document.getElementById("news-list-view");
  var articleView = document.getElementById("news-article-view");
  if (listView && articleView) {
    var params = new URLSearchParams(location.search);
    var id = params.get("id");

    if (id) {
      var n = null;
      for (var i = 0; i < news.length; i++) if (news[i].id === id) n = news[i];
      listView.hidden = true;
      articleView.hidden = false;
      if (!n) {
        articleView.innerHTML =
          '<p class="empty">찾는 글이 없습니다. 주소가 바뀌었거나 삭제된 글입니다.</p>' +
          '<p><a class="text-link" href="news.html">소식 목록으로 가기</a></p>';
      } else {
        document.title = n.title + " | AWOS";
        var idx = news.indexOf(n);
        var newer = news[idx - 1], older = news[idx + 1];
        articleView.innerHTML =
          '<article class="article">' +
            '<div class="article-meta"><span class="news-cat">' + esc(n.category) + "</span>" +
            '<time datetime="' + esc(n.date) + '">' + fmtDate(n.date) + "</time></div>" +
            "<h1>" + esc(n.title) + "</h1>" +
            '<div class="article-body">' + (n.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
            (n.link ? '<p><a class="btn" href="' + esc(n.link.url) + '">' + esc(n.link.label) + "</a></p>" : "") +
          "</article>" +
          '<nav class="article-nav" aria-label="이전·다음 글">' +
            (newer ? '<a href="news.html?id=' + encodeURIComponent(newer.id) + '"><span>다음 글</span>' + esc(newer.title) + "</a>" : "<span></span>") +
            (older ? '<a href="news.html?id=' + encodeURIComponent(older.id) + '"><span>이전 글</span>' + esc(older.title) + "</a>" : "<span></span>") +
          "</nav>" +
          '<p><a class="text-link" href="news.html">소식 목록으로 가기</a></p>';
      }
    } else {
      var cats = ["전체"];
      news.forEach(function (x) { if (cats.indexOf(x.category) < 0) cats.push(x.category); });
      var filterEl = document.getElementById("news-filter");
      var listEl = document.getElementById("news-list");
      var current = "전체";

      function draw() {
        var items = current === "전체" ? news : news.filter(function (x) { return x.category === current; });
        listEl.innerHTML = items.length ? items.map(newsRow).join("") : '<li class="empty">이 분류에는 아직 글이 없습니다.</li>';
        Array.prototype.forEach.call(filterEl.querySelectorAll("button"), function (b) {
          b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === current));
        });
      }
      filterEl.innerHTML = cats.map(function (c) {
        return '<button type="button" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
      }).join("");
      filterEl.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        current = b.getAttribute("data-cat");
        draw();
      });
      draw();
    }
  }

  /* ---------- 연혁 (history) ---------- */
  var histEl = document.getElementById("history-list");
  if (histEl) {
    var hist = (window.HISTORY || []).slice().sort(function (a, b) {
      return (b.year * 100 + b.month) - (a.year * 100 + a.month);
    });
    var years = [];
    hist.forEach(function (h) { if (years.indexOf(h.year) < 0) years.push(h.year); });
    histEl.innerHTML = years.map(function (y) {
      var rows = hist.filter(function (h) { return h.year === y; }).map(function (h) {
        return '<li class="hist-row">' +
          '<time class="hist-month" datetime="' + y + "-" + String(h.month).padStart(2, "0") + '">' + h.month + "월</time>" +
          '<ul class="hist-items">' + h.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
          "</li>";
      }).join("");
      return '<section class="hist-year" aria-labelledby="y' + y + '">' +
        '<h2 id="y' + y + '" class="hist-year-num">' + y + "</h2>" +
        '<ol class="hist-rows">' + rows + "</ol></section>";
    }).join("");
  }
})();
