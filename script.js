// ── CURSOR ──
const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => { 
    if(cur && ring) {
        cur.style.left = e.clientX + 'px'; 
        cur.style.top = e.clientY + 'px'; 
        ring.style.left = e.clientX + 'px'; 
        ring.style.top = e.clientY + 'px'; 
    }
});
document.addEventListener('mousedown', () => { if(cur) cur.style.transform='translate(-50%,-50%) scale(1.8)' });
document.addEventListener('mouseup', () => { if(cur) cur.style.transform='translate(-50%,-50%) scale(1)' });

// ── PG MODE ──
let pgOn = false;

// 1. Add any words you want censored to this list (it will automatically catch uppercase/lowercase)
const curses = ['bitch', 'slut', 'fuck', 'cunt', 'bullshit', 'damn', 'cum'];
const curseRegex = new RegExp(`\\b(${curses.join('|')})\\b`, 'gi');

// 2. Automatically find these words in the text and wrap them so we can target them
function autoWrapCurses(element) {
    for (let i = element.childNodes.length - 1; i >= 0; i--) {
        let node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            if (curseRegex.test(node.nodeValue)) {
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = node.nodeValue.replace(curseRegex, '<span class="pg-word" data-orig="$1">$1</span>');
                while (tempDiv.firstChild) {
                    element.insertBefore(tempDiv.firstChild, node);
                }
                element.removeChild(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && !node.classList.contains('pg-word')) {
            autoWrapCurses(node);
        }
    }
}

// Run the auto-wrapper when the page loads
autoWrapCurses(document.body);

// 3. Make sure any manually added <span class="pg-word"> tags are also saved
document.querySelectorAll('.pg-word').forEach(el => {
    if (!el.hasAttribute('data-orig')) {
        el.setAttribute('data-orig', el.textContent);
    }
});

// 4. The actual toggle function that swaps the text
function togglePG() {
    pgOn = !pgOn;
    document.body.classList.toggle('pg-mode', pgOn);
    
    const pgLabel = document.getElementById('pg-label');
    if(pgLabel) pgLabel.textContent = pgOn ? 'PG: ON' : 'PG Mode';

    // Swap the text!
    document.querySelectorAll('.pg-word').forEach(el => {
        if (pgOn) {
            el.textContent = '😃'; // Replace with a smiley face
        } else {
            el.textContent = el.getAttribute('data-orig'); // Put the original curse word back
        }
    });
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
    const acceptBtn = document.getElementById('terms-accept');
    if(acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('termsAcceptedTime', new Date().getTime());
            termsOverlay.style.opacity = '0';
            setTimeout(() => termsOverlay.style.display = 'none', 500);
        });
    }
}

// ── SECRET PAGE PASSWORD ──
const passBtn = document.getElementById('secret-btn');
if (passBtn) {
    passBtn.addEventListener('click', tryPass);
    const secretInput = document.getElementById('secret-input');
    if(secretInput) {
        secretInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryPass(); });
    }
}
function tryPass() {
    const inputEl = document.getElementById('secret-input');
    if(!inputEl) return;
    
    const v = inputEl.value.trim().toLowerCase();
    if (v === 'lilryma') {
        document.getElementById('secret-gate').style.display = 'none';
        document.getElementById('secret-content').style.display = 'block';
    } else {
        const err = document.getElementById('secret-error');
        if(err) {
            err.textContent = '✗ access denied. try again.';
            setTimeout(() => err.textContent = '', 2000);
        }
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

// ── ENVELOPE / LETTER LOGIC ──
function openEnvelope(wrapper, title, bodyText) {
    const envelope = wrapper.querySelector('.envelope');
    
    // 1. Prevent action if already open
    if(envelope.classList.contains('open')) return;
    
    // 2. Trigger animation
    envelope.classList.add('open');
    
    // 3. Open modal after animation
    setTimeout(() => {
        const modal = document.getElementById('letter-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if(modalTitle) modalTitle.innerText = title;
        if(modalBody) modalBody.innerText = bodyText;
        if(modal) modal.classList.add('visible');
    }, 600);
}

function closeLetter() {
    const modal = document.getElementById('letter-modal');
    if(modal) modal.classList.remove('visible');
    
    // Reset all envelopes back to closed
    document.querySelectorAll('.envelope').forEach(env => {
        env.classList.remove('open');
    });
}