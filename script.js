// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });
  document.addEventListener('mousedown', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1.8)'; });
  document.addEventListener('mouseup', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; });
}

// ── K OVERLAY (Home Page Only) ──
const kOverlay = document.getElementById('k-overlay');
if(kOverlay) {
  for(let i=0;i<80;i++){
    const k = document.createElement('span');
    k.className = 'k-letter';
    k.textContent = 'K';
    k.style.animationDelay = (Math.random()*-12) + 's';
    k.style.animationDuration = (6+Math.random()*8) + 's';
    k.style.fontSize = (2+Math.random()*9) + 'rem';
    k.style.opacity = (0.04 + Math.random()*0.2);
    k.style.margin = '0 0.2rem';
    kOverlay.appendChild(k);
  }
}

// ── TERMS & CONDITIONS (5 Min Timer) ──
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('terms-overlay');
    const acceptBtn = document.getElementById('terms-accept');
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (overlay) {
        const lastAccepted = localStorage.getItem("termsAcceptedTime");
        const currentTime = new Date().getTime();

        // If accepted within the last 5 minutes, keep it hidden
        if (lastAccepted && (currentTime - lastAccepted < FIVE_MINUTES)) {
            overlay.style.display = "none";
        } else {
            overlay.style.display = "flex";
        }
    }

    if (acceptBtn && overlay) {
        acceptBtn.addEventListener('click', () => {
            // Save the exact time of acceptance
            localStorage.setItem("termsAcceptedTime", new Date().getTime());
            
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity .5s';
            setTimeout(() => overlay.style.display = 'none', 500);
        });
    }
});

// ── FADE IN ON SCROLL ──
function triggerFadeIns() {
  setTimeout(() => {
    const fades = document.querySelectorAll('.fade-in');
    fades.forEach((el,i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 100);
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
triggerFadeIns();

// ── SECRET PASSWORD ──
const secretBtn = document.getElementById('secret-btn');
const secretInput = document.getElementById('secret-input');
const PASSWORD = 'lilryma'; 

if (secretBtn && secretInput) {
    secretBtn.addEventListener('click', checkPassword);
    secretInput.addEventListener('keydown', e => { if(e.key === 'Enter') checkPassword(); });
}

function checkPassword() {
  const val = document.getElementById('secret-input').value.trim().toLowerCase();
  const err = document.getElementById('secret-error');
  
  if(val === PASSWORD) {
    document.getElementById('secret-gate').style.display = 'none';
    document.getElementById('secret-content').style.display = 'block';
    triggerFadeIns();
  } else {
    err.textContent = '✗ access denied. try again.';
    document.getElementById('secret-input').value = '';
    setTimeout(() => err.textContent = '', 2000);
  }
}

// ── REVEAL TEXT (Apple iMessage Style) ──
document.querySelectorAll('.reveal-text').forEach(el => {
    // Grab the original sentence and clear the HTML
    const text = el.textContent.trim();
    el.innerHTML = '';
    
    // Split the sentence into individual words
    const words = text.split(' ');
    
    words.forEach(word => {
        // Create a new span for every single word
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.textContent = word + ' '; // Keep the space after the word
        
        let timeout;
        
        // The function that reveals the word and sets the timer to hide it again
        const reveal = () => {
            span.classList.add('revealed');
            clearTimeout(timeout); // Resets the timer if you keep moving over it
            
            // Disappears again after 2.5 seconds (2500ms)
            timeout = setTimeout(() => {
                span.classList.remove('revealed');
            }, 2500); 
        };

        // Trigger on mouse hover or phone tap
        span.addEventListener('mouseenter', reveal);
        span.addEventListener('touchstart', reveal);
        
        // Put the newly styled word back into the paragraph
        el.appendChild(span);
    });
});

// ── GALLERY UPLOAD & LIGHTBOX ──
const photoInput = document.getElementById('photo-input');
if (photoInput) {
    photoInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      const grid = document.getElementById('photo-grid');
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          const card = document.createElement('div');
          card.className = 'photo-card';
          const img = document.createElement('img');
          img.src = ev.target.result;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
          const cap = document.createElement('div');
          cap.className = 'photo-caption';
          cap.textContent = file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');
          card.appendChild(img);
          card.appendChild(cap);
          card.addEventListener('click', () => openLightbox(ev.target.result));
          grid.insertBefore(card, grid.firstChild);
        };
        reader.readAsDataURL(file);
      });
    });
}

function openLightbox(src) {
  const lbImg = document.getElementById('lb-img');
  const lb = document.getElementById('lightbox');
  if (lbImg && lb) {
      lbImg.src = src;
      lb.classList.add('open');
  }
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}

const lbClose = document.getElementById('lb-close');
if (lbClose) lbClose.addEventListener('click', closeLightbox);

const lightbox = document.getElementById('lightbox');
if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if(e.target === this) closeLightbox();
    });
}

// ── UNI FILTER (Map Page) ──
document.querySelectorAll('.uni-tag').forEach(tag => {
  tag.addEventListener('click', function() {
    document.querySelectorAll('.uni-tag').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.uni-card').forEach(card => {
      const tags = card.dataset.tags || '';
      card.style.display = (filter === 'all' || tags.includes(filter)) ? 'block' : 'none';
    });
  });
});

// ── ENVELOPES / LETTERS POPUP ──
const envelopes = document.querySelectorAll('.js-envelope');
const letterOverlay = document.getElementById('letter-overlay');
const letterContent = document.getElementById('letter-content');
const closeLetterBtn = document.getElementById('close-letter');

if (envelopes.length > 0 && letterOverlay) {
    envelopes.forEach(env => {
        env.addEventListener('click', function() {
            // 1. Open the envelope visually
            this.classList.add('open');
            
            // 2. Grab the text from inside this specific envelope
            const contentHTML = this.querySelector('.env-letter').innerHTML;
            
            // 3. Put that text into the centered modal
            letterContent.innerHTML = contentHTML;
            
            // 4. Wait a tiny bit for the envelope flap to open, then show the modal
            setTimeout(() => {
                letterOverlay.style.display = 'flex';
                // This forces the browser to notice the display change before fading in
                void letterOverlay.offsetWidth; 
                letterOverlay.classList.add('visible');
            }, 450); 
        });
    });

    // Close modal function
    const closeMod = () => {
        letterOverlay.classList.remove('visible');
        setTimeout(() => {
            letterOverlay.style.display = 'none';
            // Resets all envelopes back to closed state
            envelopes.forEach(e => e.classList.remove('open'));
        }, 400);
    };

    if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeMod);
    
    // Close if clicking outside the paper
    letterOverlay.addEventListener('click', (e) => {
        if (e.target === letterOverlay) closeMod();
    });
}