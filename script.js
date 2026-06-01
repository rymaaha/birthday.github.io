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

// ── APPLE INVISIBLE INK: DUAL-LAYER PARTICLE SYSTEM ──
document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.scratch-reveal-box');

  boxes.forEach(box => {
    const frostCanvas = box.querySelector('.frost-canvas');
    const particleCanvas = box.querySelector('.particle-canvas');
    const fCtx = frostCanvas.getContext('2d');
    const pCtx = particleCanvas.getContext('2d');

    let width, height;
    let particles = [];
    let resetTimer;

    // Matches the canvas size to the text perfectly
    const resize = () => {
      width = box.offsetWidth;
      height = box.offsetHeight;
      frostCanvas.width = width;
      frostCanvas.height = height;
      particleCanvas.width = width;
      particleCanvas.height = height;
      fillFrost();
    };

    // Fills the canvas with the white fog
    const fillFrost = () => {
      fCtx.globalCompositeOperation = 'source-over';
      fCtx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // The white glowing cloud
      fCtx.fillRect(0, 0, width, height);
    };

    // Initialize
    resize();
    window.addEventListener('resize', resize);

    // The core Scratch & Sparkle function
    const scratch = (x, y) => {
      // 1. Erase the fog (Scratch off)
      fCtx.globalCompositeOperation = 'destination-out';
      fCtx.beginPath();
      fCtx.arc(x, y, 20, 0, Math.PI * 2); // '20' is the brush size
      fCtx.fill();

      // 2. Spawn pretty white light particles
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5, // Drift left/right
          vy: (Math.random() - 1) * 2,     // Float upwards
          alpha: 1,
          size: Math.random() * 2 + 1
        });
      }

      // 3. Handle the quick reset
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        fillFrost(); // Refog after 800ms of inactivity
      }, 800);
    };

    // Track mouse and touch movements
    const handleMove = (e) => {
      e.preventDefault(); // Prevents screen scrolling on mobile while scratching
      const rect = box.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      scratch(clientX - rect.left, clientY - rect.top);
    };

    box.addEventListener('mousemove', handleMove);
    box.addEventListener('touchmove', handleMove, { passive: false });

    // The animation loop for the flying sparkles
    const animateParticles = () => {
      pCtx.clearRect(0, 0, width, height); // Clear previous frame
      
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03; // Fade out speed

        if (p.alpha <= 0) {
          particles.splice(i, 1); // Remove dead particles
          continue;
        }

        pCtx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fill();
      }
      requestAnimationFrame(animateParticles);
    };

    animateParticles(); // Start the engine
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

// ══════════════════════════════════
//   MEMORY REELS LOGIC
// ══════════════════════════════════

// 1. Setup the variables so the browser knows what to look for
let currentReelIndex = 0;
const memoryCards = document.querySelectorAll('.memory-card'); 
const reelsModal = document.getElementById('reels-modal');
const reelsContainer = document.getElementById('reels-container');
const reelItems = document.querySelectorAll('.reel-item');

// 2. Open the Reels modal to the specific video clicked
function openReel(index) {
  if (!reelsModal) return;
  currentReelIndex = index;
  reelsModal.classList.add('open');
  
  // Calculate exactly where to scroll based on the box's height
  const boxHeight = reelsContainer.clientHeight;
  
  // Jump instantly to the right video inside the floating box
  reelsContainer.scrollTop = boxHeight * index;
  
  // Ensure the current video plays
  const video = reelItems[index].querySelector('video');
  if (video) video.play();
}

// 3. Close the modal and scroll the grid to where they left off
function closeReel() {
  if (!reelsModal) return;
  reelsModal.classList.remove('open');
  
  // Pause all videos so they don't play in the background
  document.querySelectorAll('.reel-item video').forEach(v => v.pause());
  
  // Scroll the background grid to the exact video she was just watching
  if (memoryCards[currentReelIndex]) {
    memoryCards[currentReelIndex].scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
}

// 4. The floating down arrow button functionality
function nextReel() {
  if (currentReelIndex < reelItems.length - 1) {
    const boxHeight = reelsContainer.clientHeight;
    
    reelsContainer.scrollTo({
      top: boxHeight * (currentReelIndex + 1),
      behavior: 'smooth'
    });
  }
}

// 5. Keep track of which video she is currently looking at
if (reelsContainer) {
  const reelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      
      if (entry.isIntersecting) {
        currentReelIndex = parseInt(entry.target.dataset.index);
        if (video) video.play();
      } else {
        if (video) video.pause();
      }
    });
  }, { threshold: 0.6 }); 

  reelItems.forEach((item, index) => {
    item.dataset.index = index;
    reelObserver.observe(item);
  });
}