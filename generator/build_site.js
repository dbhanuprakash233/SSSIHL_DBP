const fs = require("fs");
const path = require("path");
const { FACULTY, UNI, UNIT_COLORS, courses } = require("./site_data.js");

const OUT = path.join(__dirname, "..");

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------------------------------------------------------------
// Shared chrome: <head>, header, footer
// ---------------------------------------------------------------
function faviconHref() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="14" fill="#1F3864"/><text x="50" y="66" font-size="55" text-anchor="middle" fill="#B08D57" font-family="Georgia,serif">M</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function head(title, description, depth) {
  const base = depth === 0 ? "" : "../";
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} · ${UNI.dept} · ${UNI.name}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="icon" href="${faviconHref()}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}assets/css/styles.css">`;
}

function headerNav(active, depth) {
  const base = depth === 0 ? "" : "../";
  const link = (href, label, key) =>
    `<a href="${base}${href}"${active === key ? ' class="active"' : ""}>${label}</a>`;
  return `<div class="id-strip"></div>
  <header class="site-header">
    <div class="container header-top">
      <a class="brand" href="${base}index.html">
        <span class="brand-mark">M</span>
        <span class="brand-text">
          <span class="uni">${UNI.name}</span><br>
          <span class="dept">${UNI.dept}</span>
        </span>
      </a>
      <div class="faculty-card">
        <span class="avatar">${FACULTY.initials}</span>
        <span>
          <span class="fname">${FACULTY.name}</span><br>
          <span class="frole">${FACULTY.role} &middot; <a href="mailto:${FACULTY.email}">${FACULTY.email}</a></span>
        </span>
      </div>
    </div>
    <nav class="main-nav" aria-label="Primary">
      <div class="container">
        <ul>
          <li>${link("index.html", "Home", "home")}</li>
          <li>${link("index.html#courses", "Courses", "courses")}</li>
          <li>${link("timetable.html", "Timetable", "timetable")}</li>
          <li>${link("resources.html", "Prerequisites &amp; Resources", "resources")}</li>
        </ul>
      </div>
    </nav>
  </header>`;
}

function footer(depth) {
  const base = depth === 0 ? "" : "../";
  return `<footer class="site-footer">
    <div class="container">
      <div class="foot-grid">
        <div>
          <h4>${UNI.name}</h4>
          <p class="small" style="color:rgba(255,255,255,.65)">${UNI.school}<br>${UNI.address}</p>
          <p class="small" style="color:rgba(255,255,255,.65)">Tel: ${UNI.phone} &nbsp;|&nbsp; ${UNI.email} &nbsp;|&nbsp; ${UNI.web}</p>
        </div>
        <div>
          <h4>Site</h4>
          <ul>
            <li><a href="${base}index.html">Home</a></li>
            <li><a href="${base}index.html#courses">Courses</a></li>
            <li><a href="${base}timetable.html">Timetable</a></li>
            <li><a href="${base}resources.html">Prerequisites &amp; Resources</a></li>
          </ul>
        </div>
        <div>
          <h4>Instructor</h4>
          <ul>
            <li>${FACULTY.name}</li>
            <li>${FACULTY.role}</li>
            <li><a href="mailto:${FACULTY.email}">${FACULTY.email}</a></li>
            <li>${FACULTY.office}</li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <span>&copy; ${new Date().getFullYear()} ${UNI.name}. ${FACULTY.term}.</span>
        <span>Built for GitHub Pages &middot; all names and details are placeholders.</span>
      </div>
    </div>
  </footer>`;
}

function page(title, description, active, depth, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${head(title, description, depth)}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${headerNav(active, depth)}
  <main id="main">
${bodyHtml}
  </main>
  ${footer(depth)}
  <script src="${depth === 0 ? "" : "../"}assets/js/main.js"></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------
// Ledger bar (signature element): proportional unit-hour bar
// ---------------------------------------------------------------
function ledgerBar(units) {
  const total = units.reduce((a, u) => a + u.periods, 0);
  const segs = units
    .map((u, i) => `<span style="width:${((u.periods / total) * 100).toFixed(1)}%;background:${UNIT_COLORS[i % UNIT_COLORS.length]}" title="Unit ${u.unit}: ${esc(u.topic)} — ${u.periods} hrs"></span>`)
    .join("");
  return `<div class="ledger">
    <div class="ledger-bar">${segs}</div>
    <div class="ledger-caption"><span>${units.length} units</span><span>${total} contact hrs</span></div>
  </div>`;
}

// ---------------------------------------------------------------
// Course card (used on homepage)
// ---------------------------------------------------------------
function courseCard(c) {
  return `<a class="course-card" href="courses/${c.slug}.html">
    <div class="code">${esc(c.code)}${c.codeNote ? " *" : ""}</div>
    <h3>${esc(c.title)}</h3>
    <div class="meta"><span>${esc(c.category)}</span><span>L-T-P-C ${c.ltpc}</span><span>${c.totalPeriods} periods</span></div>
    ${ledgerBar(c.units)}
  </a>`;
}

// ---------------------------------------------------------------
// Units table
// ---------------------------------------------------------------
function unitsTable(units, heading) {
  const total = units.reduce((a, u) => a + u.periods, 0);
  const rows = units
    .map((u) => `<tr><td class="num">${u.unit}</td><td>${esc(u.topic)}</td><td class="num">${u.periods}</td></tr>`)
    .join("\n");
  return `<h3>${heading}</h3>
  <div class="table-wrap">
    <table class="data">
      <thead><tr><th class="num">Unit</th><th>Topic</th><th class="num">Periods</th></tr></thead>
      <tbody>
${rows}
        <tr class="total"><td></td><td>Total</td><td class="num">${total}</td></tr>
      </tbody>
    </table>
  </div>`;
}

function bulletList(items) {
  return `<ul class="bullets">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

// =================================================================
// INDEX PAGE
// =================================================================
function buildIndex() {
  const totalHours = courses.reduce((a, c) => a + c.totalPeriods, 0);
  const body = `
  <section class="hero">
    <div class="container">
      <div class="eyebrow">${UNI.dept} &middot; ${FACULTY.term}</div>
      <h1>Course hub for everything I'm teaching this semester.</h1>
      <p class="lead">Syllabi, lecture-wise lesson plans, the weekly timetable and prerequisite resources for all four courses — kept in one place, versioned on GitHub.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="#courses">Browse courses</a>
        <a class="btn btn-outline" href="timetable.html">View timetable</a>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="stat-strip">
      <div class="stat"><div class="num">${courses.length}</div><div class="label">Courses this term</div></div>
      <div class="stat"><div class="num">${totalHours}</div><div class="label">Total contact hours</div></div>
      <div class="stat"><div class="num">6&times;6</div><div class="label">Weekly timetable grid</div></div>
      <div class="stat"><div class="num">1</div><div class="label">Instructor</div></div>
    </div>
  </div>

  <section class="section container" id="courses">
    <div class="section-head">
      <div class="eyebrow">This Semester</div>
      <h2>Courses</h2>
      <p>Each course page has the full syllabus — objectives, outcomes, unit-wise hours, practicals and reading list — plus a download link for the complete lesson plan.</p>
    </div>
    <div class="course-grid">
      ${courses.map(courseCard).join("\n      ")}
    </div>
  </section>

  <hr class="divider">

  <section class="section container">
    <div class="two-col">
      <div>
        <div class="section-head">
          <div class="eyebrow">Instructor</div>
          <h2>${esc(FACULTY.name)}</h2>
        </div>
        <p>${esc(FACULTY.role)} at ${UNI.name}, ${UNI.school}. Office hours are posted outside ${esc(FACULTY.office)} and by appointment.</p>
        <div class="hero-actions">
          <a class="btn btn-navy" href="mailto:${FACULTY.email}">Email ${esc(FACULTY.name.split(" ")[1] || "instructor")}</a>
          <a class="btn btn-outline" style="border-color:var(--line);color:var(--navy)" href="resources.html">Prerequisites &amp; resources</a>
        </div>
      </div>
      <div class="panel">
        <ul class="info-list">
          <li><span class="k">Designation</span><span class="v">${esc(FACULTY.role)}</span></li>
          <li><span class="k">Academic Term</span><span class="v">${esc(FACULTY.term)}</span></li>
          <li><span class="k">Email</span><span class="v"><a href="mailto:${FACULTY.email}">${FACULTY.email}</a></span></li>
          <li><span class="k">Office</span><span class="v">${esc(FACULTY.office)}</span></li>
          <li><span class="k">Phone</span><span class="v">${esc(FACULTY.phone)}</span></li>
        </ul>
      </div>
    </div>
  </section>
`;
  return page(
    "Home",
    `Course hub for ${UNI.dept} — syllabi, timetable and resources for ${FACULTY.term}.`,
    "home",
    0,
    body
  );
}

// =================================================================
// COURSE DETAIL PAGES
// =================================================================
function buildCoursePage(c, idx) {
  const prev = courses[idx - 1];
  const next = courses[idx + 1];
  const body = `
  <div class="container" style="padding-top:26px;">
    <div class="crumb"><a href="../index.html">Home</a> &rsaquo; <a href="../index.html#courses">Courses</a> &rsaquo; ${esc(c.title)}</div>
  </div>

  <section class="section container" style="padding-top:0;">
    <span class="tag">${esc(c.category)}</span>
    <h1 style="margin-top:14px;">${esc(c.title)}</h1>
    <p class="small" style="font-family:var(--mono);color:var(--text-muted);">${esc(c.code)}${c.codeNote ? " — code incomplete in source syllabus, confirm with the registrar" : ""}</p>

    <div class="two-col" style="margin-top:26px;">
      <div>
        <h2>Course Objectives</h2>
        ${c.objectives.length > 1 ? bulletList(c.objectives) : `<p>${esc(c.objectives[0])}</p>`}

        <h2>Course Outcomes</h2>
        ${bulletList(c.outcomes)}

        ${unitsTable(c.units, "Syllabus — Lecture Units")}

        ${c.practicals ? unitsTable(c.practicals, "Syllabus — Practical Units") : ""}

        <h3 style="margin-top:26px;">Key Text(s)</h3>
        ${bulletList(c.keyTexts)}

        ${c.suggestedReadings && c.suggestedReadings.length ? `<h3>Suggested / Additional Readings</h3>${bulletList(c.suggestedReadings)}` : ""}
      </div>

      <div>
        <div class="panel" style="margin-bottom:18px;">
          <h3 class="mt-0">Course Snapshot</h3>
          <ul class="info-list">
            <li><span class="k">L-T-P-C</span><span class="v">${c.ltpc}</span></li>
            <li><span class="k">Total Periods</span><span class="v">${c.totalPeriods}</span></li>
            <li><span class="k">Prerequisites</span><span class="v">${esc(c.prerequisites)}</span></li>
          </ul>
        </div>

        <div class="panel" style="margin-bottom:18px;">
          <h3 class="mt-0">Prerequisite Resources</h3>
          <p class="small">Placeholder links — swap for your preferred prep material or an official prerequisite exam.</p>
          ${c.prereqLinks.map((l) => `<div class="resource-card" style="margin-bottom:10px;padding:14px;"><div class="rc-title" style="font-size:.92rem;"><a href="${l.url}" target="_blank" rel="noopener">${esc(l.title)}</a></div><div class="rc-desc">${esc(l.desc)}</div></div>`).join("\n          ")}
        </div>

        <div class="panel">
          <h3 class="mt-0">Course Materials</h3>
          <ul class="info-list">
            <li><span class="k">Full Syllabus</span><span class="v"><a href="../files/Syllabus_Combined.docx">Download .docx</a></span></li>
            <li><span class="k">Lesson Plan</span><span class="v"><a href="../files/Lesson_Plans.docx">Download .docx</a></span></li>
            <li><span class="k">Timetable</span><span class="v"><a href="../timetable.html">View page</a></span></li>
          </ul>
        </div>
      </div>
    </div>

    <hr class="divider" style="margin:36px 0 22px;">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <span>${prev ? `<a href="${prev.slug}.html">&larr; ${esc(prev.title)}</a>` : `<a href="../index.html">&larr; Back to home</a>`}</span>
      <span>${next ? `<a href="${next.slug}.html">${esc(next.title)} &rarr;</a>` : `<a href="../index.html#courses">Back to all courses &rarr;</a>`}</span>
    </div>
  </section>
`;
  return page(c.title, `Syllabus for ${c.title} (${c.code}) — objectives, outcomes, units and readings.`, "courses", 1, body);
}

// =================================================================
// TIMETABLE PAGE
// =================================================================
function buildTimetable() {
  const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];
  const PERIODS = [
    "09:00 – 10:00",
    "10:00 – 11:00",
    "11:15 – 12:15",
    "12:15 – 13:15",
    "14:15 – 15:15",
    "15:15 – 16:15"
  ];

  const headRow = `<tr><th>Day / Time</th>${PERIODS.map((t, i) => `<th>Period ${i + 1}<span class="time">${t}</span></th>`).join("")}</tr>`;

  const bodyRows = DAYS.map((day, dIdx) => {
    const cells = PERIODS.map((_, pIdx) => {
      if (dIdx === 0 && pIdx === 3) {
        return `<td class="brk">e.g., Lunch Break</td>`;
      }
      return `<td class="slot"><span class="sc">Subject Code</span>Room No.<br>Faculty Initials</td>`;
    }).join("");
    return `<tr><td class="day-label">${day}</td>${cells}</tr>`;
  }).join("\n        ");

  const legendRows = courses
    .map((c) => `<tr><td>${esc(c.code)}</td><td>${esc(c.title)}</td><td></td></tr>`)
    .join("\n            ");

  const body = `
  <section class="section container" style="padding-top:30px;">
    <div class="section-head">
      <div class="eyebrow">Weekly Schedule</div>
      <h1>Class Timetable</h1>
      <p>6 teaching days &times; 6 periods a day. Times, rooms and subject codes below are placeholders — replace them with your actual schedule.</p>
    </div>

    <div class="panel" style="margin-bottom:24px;">
      <ul class="info-list" style="display:grid;grid-template-columns:repeat(4,1fr);gap:0 20px;">
        <li style="border-top:none;"><span class="k">Class / Section</span><span class="v">______________</span></li>
        <li style="border-top:none;"><span class="k">Semester</span><span class="v">______________</span></li>
        <li style="border-top:none;"><span class="k">Academic Year</span><span class="v">______________</span></li>
        <li style="border-top:none;"><span class="k">Effective From</span><span class="v">______________</span></li>
      </ul>
    </div>

    <div class="timetable-wrap">
      <table class="timetable">
        <thead>${headRow}</thead>
        <tbody>
        ${bodyRows}
        </tbody>
      </table>
    </div>

    <h3 style="margin-top:34px;">Subject Code Legend</h3>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Subject Code</th><th>Subject Name</th><th>Faculty</th></tr></thead>
        <tbody>
            ${legendRows}
        </tbody>
      </table>
    </div>

    <p class="small" style="margin-top:18px;">Need the printable version? <a href="files/Weekly_Timetable.docx">Download the Word timetable</a>.</p>
  </section>
`;
  return page("Timetable", "Weekly class timetable — 6 days, 6 periods per day.", "timetable", 0, body);
}

// =================================================================
// RESOURCES PAGE
// =================================================================
function buildResources() {
  const prereqCards = courses
    .flatMap((c) => c.prereqLinks.map((l) => ({ ...l, course: c.title })))
    .reduce((acc, l) => {
      if (!acc.find((x) => x.url === l.url)) acc.push(l);
      return acc;
    }, []);

  const body = `
  <section class="section container" style="padding-top:30px;">
    <div class="section-head">
      <div class="eyebrow">Before You Start</div>
      <h1>Prerequisites &amp; Course Resources</h1>
      <p>Prep material for course prerequisites, plus downloadable syllabus and lesson-plan documents for the full semester.</p>
    </div>

    <div class="placeholder-note"><strong>Placeholder links.</strong> Swap these for your institution's actual prerequisite exams, waiver forms or refresher modules.</div>

    <h2>Prerequisite Preparation</h2>
    <div class="resource-grid">
      ${prereqCards
        .map(
          (l) => `<a class="resource-card" href="${l.url}" target="_blank" rel="noopener">
        <span class="rc-type">External Link</span>
        <span class="rc-title">${esc(l.title)}</span>
        <span class="rc-desc">${esc(l.desc)}</span>
      </a>`
        )
        .join("\n      ")}
    </div>

    <h2 style="margin-top:40px;">Downloadable Course Material</h2>
    <div class="resource-grid">
      <a class="resource-card" href="files/Syllabus_Combined.docx">
        <span class="rc-type">Word Document</span>
        <span class="rc-title">Combined Syllabus — All 4 Courses</span>
        <span class="rc-desc">Objectives, outcomes, unit-wise hours and reading lists.</span>
      </a>
      <a class="resource-card" href="files/Lesson_Plans.docx">
        <span class="rc-type">Word Document</span>
        <span class="rc-title">Lecture &amp; Practical Lesson Plans</span>
        <span class="rc-desc">Hour-by-hour teaching schedule mapped to syllabus periods.</span>
      </a>
      <a class="resource-card" href="files/Weekly_Timetable.docx">
        <span class="rc-type">Word Document</span>
        <span class="rc-title">Printable Weekly Timetable</span>
        <span class="rc-desc">Landscape one-page timetable template.</span>
      </a>
      <a class="resource-card" href="files/Syllabus_TitlePage.docx">
        <span class="rc-type">Word Document</span>
        <span class="rc-title">Syllabus Cover / Title Page</span>
        <span class="rc-desc">Department letterhead-style cover sheet.</span>
      </a>
    </div>

    <h2 style="margin-top:40px;">Per-Course Prerequisites</h2>
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>Course</th><th>Code</th><th>Prerequisite</th></tr></thead>
        <tbody>
          ${courses.map((c) => `<tr><td><a href="courses/${c.slug}.html">${esc(c.title)}</a></td><td>${esc(c.code)}</td><td>${esc(c.prerequisites)}</td></tr>`).join("\n          ")}
        </tbody>
      </table>
    </div>
  </section>
`;
  return page("Prerequisites & Resources", "Prerequisite preparation links and downloadable syllabus material.", "resources", 0, body);
}

// ---------------------------------------------------------------
// Write files
// ---------------------------------------------------------------
fs.writeFileSync(path.join(OUT, "index.html"), buildIndex());
fs.writeFileSync(path.join(OUT, "timetable.html"), buildTimetable());
fs.writeFileSync(path.join(OUT, "resources.html"), buildResources());
courses.forEach((c, i) => {
  fs.writeFileSync(path.join(OUT, "courses", `${c.slug}.html`), buildCoursePage(c, i));
});

console.log("Site built:", 3 + courses.length, "pages");
