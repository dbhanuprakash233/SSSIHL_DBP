class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="site-header">
    <div class="container header-top">
      <a class="brand" href="../index.html">
        <span class="brand-mark">SSS</span>
        <span class="brand-text">
          <span class="uni">Sri Sathya Sai Institute of Higher Learning</span><br>
          <span class="dept">Department of Mathematics and Computer Science</span>
        </span>
      </a>
      <div class="faculty-card">
        <span class="avatar">DBP</span>
        <span>
          <span class="fname">Dr. D Bhanu Prakash, Ph.D.</span><br>
          <span class="frole">Assistant Professor, DMACS &middot; <a href="mailto:dbhanuprakash233@gmail.com">dbhanuprakash233@gmail.com</a> &middot; </span>
          <span class="fwebsite"><a href="https://dbhanuprakash233.github.io" target="_blank">Personal Website</a></span>
        </span>
      </div>
    </div>
  </header>
    `;
  }
}
customElements.define('site-header', SiteHeader);