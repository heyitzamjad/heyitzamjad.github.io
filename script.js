/* =============================================
   AMJAD RAHMAN — PORTFOLIO SCRIPT
   script.js
   ============================================= */

'use strict';

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ===== MOBILE NAV ===== */
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu   = document.getElementById('mobile-menu');

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    mobileToggle.classList.toggle('open'); // Kept synchronized with menu open state
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileToggle.classList.remove('open'); // Ensures burger button resets cleanly
    });
  });
}

/* ===== HERO CANVAS GRID ===== */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const CELL   = 44;
  const DOTS   = [];
  const MAX_D  = 3;

  function buildDots() {
    DOTS.length = 0;
    const cols = Math.ceil(canvas.width  / CELL) + 2;
    const rows = Math.ceil(canvas.height / CELL) + 2;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        DOTS.push({
          x: c * CELL,
          y: r * CELL,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.005,
          base: 0.06 + Math.random() * 0.12,
        });
      }
    }
  }

  buildDots();
  window.addEventListener('resize', buildDots, { passive: true });

  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  let frame = 0;
  function draw() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(96,165,250,0.04)';
    ctx.lineWidth = 1;
    const cols = Math.ceil(canvas.width  / CELL) + 2;
    const rows = Math.ceil(canvas.height / CELL) + 2;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, canvas.height);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(canvas.width, r * CELL);
      ctx.stroke();
    }

    // Intersection dots
    DOTS.forEach(d => {
      d.phase += d.speed;
      const pulse  = d.base + Math.sin(d.phase) * 0.08;
      const dx     = d.x - mouseX;
      const dy     = d.y - mouseY;
      const dist   = Math.sqrt(dx * dx + dy * dy);
      const nearby = Math.max(0, 1 - dist / 200);
      const alpha  = Math.min(1, pulse + nearby * 0.55);
      const radius = 1.2 + nearby * (MAX_D - 1.2);

      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${alpha.toFixed(3)})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ===== INTERSECTION OBSERVER — REVEAL ===== */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ===== STICKY NOTE RANDOM ROTATION ===== */
(function randomizeNotes() {
  const notes = document.querySelectorAll('.sticky-note');
  if (notes.length === 0) return;

  notes.forEach(note => {
    const base = parseFloat(note.dataset.rotate || 0);
    const jitter = (Math.random() - 0.5) * 1.5;
    note.style.transform = `rotate(${(base + jitter).toFixed(2)}deg)`;
  });
})();

/* ===== ANIMATED STAT COUNTERS ===== */
(function initCounters() {
  const els = document.querySelectorAll('.stat-number[data-target]');
  if (els.length === 0) return;

  // Easing function declaration moved out of execution loops to safeguard mathematical evaluation
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.classList.contains('stat-number-plus') ? '+' : '';
      const dur    = 1600;
      const start  = performance.now();

      function update(now) {
        const t   = Math.min((now - start) / dur, 1);
        const val = Math.floor(easeOut(t) * target);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
})();

/* ===== FOOTER RANDOM MESSAGES ===== */
(function setFooterMsg() {
  const el = document.getElementById('footer-msg');
  if (!el) return; // Guard clause added to avoid crashing on pages lacking this element

  const msgs = [
    'Built with HTML, CSS, and JavaScript. No frameworks were harmed.',
    'Still debugging life. Progress: unknown.',
    'Works on my machine. Shipping my machine next.',
    'Feature complete. Probably.',
    'Powered by caffeine and questionable late-night decisions.',
    'Made with love and a concerning number of browser tabs.',
    'Performance: fast. Sleep schedule: not.',
  ];
  el.textContent = msgs[Math.floor(Math.random() * msgs.length)];
})();

/* ===== "WHATEVER LOOKED INTERESTING THIS WEEK" ROTATION ===== */
(function rotateWeekly() {
  const el = document.getElementById('weekly-interest');
  if (!el) return;

  const interests = [
    'Whatever looked interesting this week',
    "Cloudflare Workers (it's cool, okay)",
    'Web Performance APIs',
    'Deno (probably briefly)',
    'Whatever was on HackerNews',
    'WASM (sent me a vague threat)',
  ];
  
  let idx = 0;
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % interests.length;
      el.textContent = interests[idx];
      el.style.opacity = '1';
    }, 300);
  }, 3000);
  el.style.transition = 'opacity 0.3s ease';
})();

/* ===== ACHIEVEMENT TOAST ===== */
const toast       = document.getElementById('achievement-toast');
const toastSub    = document.getElementById('achievement-sub');
let   toastTimer  = null;

function showAchievement(title, icon = '🏆') {
  if (!toast || !toastSub) return;
  clearTimeout(toastTimer);
  toastSub.textContent = title;
  const iconEl = toast.querySelector('.achievement-icon');
  if (iconEl) iconEl.textContent = icon;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ===== EASTER EGG #1 — LOGO CLICK × 7 ===== */
(function logoClicks() {
  const logo = document.getElementById('nav-logo');
  if (!logo) return;
  let clicks = 0;
  let resetTimer;

  logo.addEventListener('click', e => {
    e.preventDefault();
    clicks++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { clicks = 0; }, 2000);

    if (clicks === 7) {
      clicks = 0;
      showAchievement('Curiosity.exe', '🔍');
    }
  });
})();

/* ===== EASTER EGG #2 — TYPING "sudo" ===== */
(function sudoListener() {
  const overlay = document.getElementById('sudo-overlay');
  const closeBtn = document.getElementById('sudo-close');
  if (!overlay || !closeBtn) return; // Guard clause keeps this clean if layout drops the overlay elements

  const MAGIC = 'sudo';
  let buffer = '';
  let timer;

  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    buffer += e.key.toLowerCase();
    clearTimeout(timer);
    timer = setTimeout(() => { buffer = ''; }, 1500);

    if (buffer.includes(MAGIC)) {
      buffer = '';
      overlay.classList.add('show');
    }
  });

  closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
})();

/* ===== EASTER EGG #3 — 100% SCROLL ===== */
(function scrollComplete() {
  let fired = false;
  window.addEventListener('scroll', () => {
    if (fired) return;
    const scrolled = window.scrollY + window.innerHeight;
    const total    = document.documentElement.scrollHeight;
    if (scrolled >= total - 10) {
      fired = true;
      showAchievement('Persistent Visitor', '🎖️');
    }
  }, { passive: true });
})();

/* ===== GITHUB API ===== */
(function fetchGitHub() {
  const USERNAME    = 'heyitzamjad';
  const profileEl   = document.getElementById('github-profile');
  const reposEl     = document.getElementById('github-repos');
  if (!profileEl || !reposEl) return;

  const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    Python:     '#3572A5',
    Shell:      '#89e051',
    Rust:       '#dea584',
    Go:         '#00ADD8',
  };

  async function load() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${USERNAME}`),
        fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`),
      ]);

      if (!userRes.ok) throw new Error('GitHub API error');

      const user  = await userRes.json();
      const repos = reposRes.ok ? await reposRes.json() : [];

      // Profile card
      profileEl.innerHTML = `
        <div class="github-profile-loaded">
          <img class="github-avatar" src="${user.avatar_url}" alt="${user.login}" loading="lazy" />
          <div class="github-info">
            <div class="github-name">${user.name || user.login}</div>
            <div class="github-bio">${user.bio || 'Building things on the internet.'}</div>
            <div class="github-stats">
              <div class="github-stat">
                <div class="github-stat-num">${user.public_repos}</div>
                <div class="github-stat-label">Repos</div>
              </div>
              <div class="github-stat">
                <div class="github-stat-num">${user.followers}</div>
                <div class="github-stat-label">Followers</div>
              </div>
              <div class="github-stat">
                <div class="github-stat-num">${user.following}</div>
                <div class="github-stat-label">Following</div>
              </div>
            </div>
          </div>
          <a href="${user.html_url}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">View Profile →</a>
        </div>
      `;

      // Repos
      if (Array.isArray(repos) && repos.length > 0) {
        const filtered = repos.filter(r => !r.fork).slice(0, 6);
        reposEl.innerHTML = `
          <div class="github-repos-grid">
            ${filtered.map(repo => {
              const lang  = repo.language || 'Code';
              const color = LANG_COLORS[lang] || '#60A5FA';
              const desc  = repo.description
                ? repo.description.length > 72
                  ? repo.description.slice(0, 72) + '…'
                  : repo.description
                : 'No description yet.';
              return `
                <a class="github-repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
                  <div class="repo-name">${repo.name}</div>
                  <div class="repo-desc">${desc}</div>
                  <div class="repo-meta">
                    <span class="repo-lang">
                      <span class="lang-dot" style="background:${color}"></span>
                      ${lang}
                    </span>
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        `;
      } else {
        reposEl.innerHTML = `<p style="color:var(--muted);font-size:14px">No public repositories found yet.</p>`;
      }

    } catch (err) {
      profileEl.innerHTML = `
        <div style="color:var(--muted);font-size:14px;display:flex;align-items:center;gap:12px">
          <span>⚠️</span>
          <div>
            <div style="font-weight:600;margin-bottom:4px">Couldn't reach GitHub API</div>
            <div>Visit <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener" style="color:var(--accent-blue)">github.com/${USERNAME}</a> directly.</div>
          </div>
        </div>
      `;
    }
  }

  // Lazy-load when section scrolls into view
  const section = document.getElementById('github');
  if (!section) { load(); return; }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { load(); obs.disconnect(); }
  }, { threshold: 0.1 });
  obs.observe(section);
})();

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== HERO ENTRANCE SEQUENCE ===== */
(function heroEntrance() {
  const heroReveals = document.querySelectorAll('.hero .reveal-up');
  if (heroReveals.length === 0) return;

  heroReveals.forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
    setTimeout(() => el.classList.add('visible'), delay * 1000);
  });
})();

/* ===== CURSOR GLOW (desktop only) ===== */
(function cursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9990;
    width:320px; height:320px;
    border-radius:50%;
    background:radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 0.3s ease;
    top:0; left:0;
  `;
  document.body.appendChild(glow);

  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  (function animate() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  })();
})();

/* ===== ACTIVE NAV HIGHLIGHTING ===== */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (sections.length === 0 || links.length === 0) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--text)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();
