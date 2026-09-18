class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer class="site-footer">
    <div class="container">
      <div class="foot-grid">
        <div>
          <h4>Sri Sathya Sai Institute of Higher Learning</h4>
          <p class="small" style="color:rgba(255,255,255,.65)">Prasanthi Nilayam Campus<br>Puttaparthi - 515 134, Andhra Pradesh, India</p>
          <!-- <p class="small" style="color:rgba(255,255,255,.65)">Tel: +91 (555) 214-7890 &nbsp;|&nbsp; dds@meridian.edu &nbsp;|&nbsp; www.meridian.edu/datascience</p> -->
          <p class="small" style="color:rgba(255,255,255,.65)">www.sssihl.edu.in</p>        
        </div>
        <div>
          <h4>Site</h4>
          <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../index.html#courses">Courses</a></li>
            <li><a href="../timetable.html">Timetable</a></li>
          </ul>
        </div>
        <div>
          <h4>Instructor</h4>
          <ul>
            <li>Dr. D Bhanu Prakash, Ph.D.</li>
            <li>Assistant Professor, Department of Mathematics and Computer Science</li>
            <li><a href="mailto:dbhanuprakash233@gmail.com">dbhanuprakash233@gmail.com</a></li>
            <li>Room B8, Annex Building</li>
            <li><a href="https://dbhanuprakash233.github.io" target="_blank">Personal Website</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <ul>
            <li>Last Updated: September 18, 2026</li>
            <li>&copy; 2026 D Bhanu Prakash, Sri Sathya Sai Institute of Higher Learning. This course material is licensed under CC BY 4.0. https://creativecommons.org/licenses/by/4.0/</li>
          </ul>
      </div>
    </div>
  </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);
