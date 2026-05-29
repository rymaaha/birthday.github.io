// ── CUSTOM CURSOR ──
const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cur.style.left=mx+'px'; cur.style.top=my+'px'; });
setInterval(() => { rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; }, 16);
document.addEventListener('mousedown', () => cur.style.transform='translate(-50%, -50%) scale(1.8)');
document.addEventListener('mouseup', () => cur.style.transform='translate(-50%, -50%) scale(1)');

// ── PG MODE ──
let pgOn = false;
function togglePG() {
  pgOn = !pgOn;
  document.body.classList.toggle('pg-mode', pgOn);
  document.getElementById('pg-label').textContent = pgOn ? 'PG: ON' : 'PG Mode';
}

// ── K OVERLAY HERO BACKGROUND ──
const ko = document.getElementById('k-overlay');
if (ko) {
  for (let i = 0; i < 80; i++) {
    const k = document.createElement('span');
    k.className = 'k-letter';
    k.textContent = 'K';
    k.style.cssText = `animation-delay:${(Math.random() * -12).toFixed(1)}s;animation-duration:${(6 + Math.random() * 8).toFixed(1)}s;font-size:${(2 + Math.random() * 9).toFixed(1)}rem;opacity:${(0.04 + Math.random() * 0.18).toFixed(2)};margin:0 .2rem`;
    ko.appendChild(k);
  }
}

// ── FADE IN OBSERVER ──
const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1 });
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

// ── TERMS & CONDITIONS POPUP (5 MIN TIMER) ──
const termsOverlay = document.getElementById('terms-overlay');
if (termsOverlay) {
    const lastAccepted = localStorage.getItem('termsAcceptedTime');
    const now = new Date().getTime();
    if (lastAccepted && (now - lastAccepted < 5 * 60 * 1000)) {
        termsOverlay.style.display = 'none';
    }
    document.getElementById('terms-accept').addEventListener('click', () => {
        localStorage.setItem('termsAcceptedTime', new Date().getTime());
        termsOverlay.style.opacity = '0';
        setTimeout(() => termsOverlay.style.display = 'none', 500);
    });
}

// ── SECRET PAGE PASSWORD ──
const passBtn = document.getElementById('secret-btn');
if (passBtn) {
    passBtn.addEventListener('click', tryPass);
    document.getElementById('secret-input').addEventListener('keydown', e => { if (e.key === 'Enter') tryPass(); });
}
function tryPass() {
    const v = document.getElementById('secret-input').value.trim().toLowerCase();
    if (v === 'lilryma') {
        document.getElementById('secret-gate').style.display = 'none';
        document.getElementById('secret-content').style.display = 'block';
    } else {
        const err = document.getElementById('secret-error');
        err.textContent = '✗ access denied. try again.';
        setTimeout(() => err.textContent = '', 2000);
    }
}

// ── APPLE INVISIBLE INK ──
document.querySelectorAll('.apple-reveal').forEach(el => {
    const words = el.innerText.split(' ');
    el.innerHTML = '';
    words.forEach(w => {
        const span = document.createElement('span');
        span.className = 'ink-word';
        span.innerText = w;
        span.addEventListener('mouseenter', () => {
            span.classList.add('revealed');
            setTimeout(() => span.classList.remove('revealed'), 2500);
        });
        el.appendChild(span);
        el.appendChild(document.createTextNode(' '));
    });
});

// ── ENVELOPE MODAL ──
function openLetter(title, content, isVideo = false) {
    const modal = document.getElementById('letter-modal');
    document.getElementById('modal-title').innerText = title;
    
    const bodyEl = document.getElementById('modal-body');
    if (isVideo) {
        bodyEl.innerHTML = content; 
    } else {
        bodyEl.innerText = content;
    }
    
    modal.style.display = 'flex';
}
function closeLetter() {
    document.getElementById('letter-modal').style.display = 'none';
    const bodyEl = document.getElementById('modal-body');
    if (bodyEl.innerHTML.includes('iframe')) {
        bodyEl.innerHTML = ''; 
    }
}