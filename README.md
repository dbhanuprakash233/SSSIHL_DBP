# Course Website — Odd Semester - 2026-27
### Dr. D Bhanu Prakash
#### Department of Mathematics and Computer Science

A static website for this semester's courses: syllabi, unit-wise hours, the
weekly timetable, prerequisite resources, and downloadable documents
(syllabus, lecture materials, timetable). No build tools or server required — it's
plain HTML/CSS/JS, ready for GitHub Pages.

## What's inside

```
index.html              Home page (faculty header, course cards, stats)
timetable.html          
courses/
  optimization-techniques.html
  data-analysis-visualization.html
  optimization-for-machine-learning.html
  probability-and-statistics.html
assets/
  css/styles.css         Shared stylesheet (navy/gold theme)
  js/main.js             Small progressive-enhancement script
files/                    Word documents linked from the site
  All pdfs
generator/                Optional: regenerate all HTML pages from one data file
  site_data.js            Faculty info, university info, all course content
  build_site.js           Node script that writes the HTML pages
.nojekyll                 Tells GitHub Pages to serve files as-is
```