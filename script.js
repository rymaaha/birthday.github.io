// ===============================
// GLOBAL INIT SAFE WRAPPER
// ===============================
document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // CUSTOM CURSOR
  // ===============================
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  document.addEventListener('mousemove', (e) => {
    if (!cur || !ring) return;
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => {
    if (cur) cur.style.transform = 'translate(-50%,-50%) scale(1.8)';
  });

  document.addEventListener('mouseup', () => {
    if (cur) cur.style.transform = 'translate(-50%,-50%) scale(1)';
  });


  // ===============================
  // PG MODE (SAFE VERSION)
  // ===============================
  let pgOn = false;

  const curses = ['bitch', 'slut', 'fuck', 'cunt', 'bullshit', 'damn', 'cum', 'fucking'];
  const curseRegex = new RegExp(`\\b(${curses.join('|')})\\b`, 'gi');

  function autoWrapCurses(element) {
    for (let i = element.childNodes.length - 1; i >= 0; i--) {
      let node = element.childNodes[i];

      if (node.nodeType === Node.TEXT_NODE) {
        if (curseRegex.test(node.nodeValue)) {
          const temp = document.createElement('div');
          temp.innerHTML = node.nodeValue.replace(
            curseRegex,
            '<span class="pg-word" data-orig="$1">$1</span>'
          );

          while (temp.firstChild) {
            element.insertBefore(temp.firstChild, node);
          }
          element.removeChild(node);
        }

      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.nodeName !== 'SCRIPT' &&
        node.nodeName !== 'STYLE' &&
        !node.classList.contains('pg-word') &&
        !node.classList.contains('apple-ink') // IMPORTANT FIX
      ) {
        autoWrapCurses(node);
      }
    }
  }

  autoWrapCurses(document.body);

  function togglePG() {
    pgOn = !pgOn;
    document.body.classList.toggle('pg-mode', pgOn);

    const label = document.getElementById('pg-label');
    if (label) label.textContent = pgOn ? 'PG: ON' : 'PG Mode';

    document.querySelectorAll('.pg-word').forEach(el => {
      el.textContent = pgOn ? '😃' : el.getAttribute('data-orig');
    });
  }

  window.togglePG = togglePG;


  // ===============================
  // FADE IN OBSERVER
  // ===============================
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));


  // ===============================
  // TERMS MODAL
  // ===============================
  const termsOverlay = document.getElementById('terms-overlay');

  if (termsOverlay) {
    const last = localStorage.getItem('termsAcceptedTime');
    const now = Date.now();

    if (last && now - last < 5 * 60 * 1000) {
      termsOverlay.style.display = 'none';
    }

    const btn = document.getElementById('terms-accept');
    if (btn) {
      btn.addEventListener('click', () => {
        localStorage.setItem('termsAcceptedTime', Date.now());
        termsOverlay.style.opacity = '0';
        setTimeout(() => termsOverlay.style.display = 'none', 500);
      });
    }
  }


  // ===============================
  // SECRET PASSWORD
  // ===============================
  function tryPass() {
    const input = document.getElementById('secret-input');
    if (!input) return;

    const val = input.value.trim().toLowerCase();

    if (val === 'lilryma') {
      document.getElementById('secret-gate').style.display = 'none';
      document.getElementById('secret-content').style.display = 'block';
    } else {
      const err = document.getElementById('secret-error');
      if (err) {
        err.textContent = '✗ nope WRONG!!! access denied. try again.';
        setTimeout(() => err.textContent = '', 2000);
      }
    }
  }

  const passBtn = document.getElementById('secret-btn');
  if (passBtn) passBtn.addEventListener('click', tryPass);

  const secretInput = document.getElementById('secret-input');
  if (secretInput) {
    secretInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryPass();
    });
  }


  // ===============================
  // TITLE REVEAL (.apple-ink)
  // ===============================
  document.querySelectorAll('.apple-ink').forEach(el => {
    let timer;

    function reveal() {
      el.classList.add('revealed');

      clearTimeout(timer);
      timer = setTimeout(() => {
        el.classList.remove('revealed');
      }, 10000);
    }

    el.addEventListener('mouseenter', reveal);
    el.addEventListener('mousemove', reveal);
    el.addEventListener('touchstart', reveal);
  });


  // ===============================
  // GIFT BOX (FIXED + SOUND + PARTICLES)
  // ===============================
  const sound = document.getElementById('gift-sound');

  function spawnParticles(x, y) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 120;

      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  }

  document.querySelectorAll('.gift-lid').forEach(lid => {
    lid.addEventListener('click', (e) => {
      if (lid.classList.contains('opened')) return;

      lid.classList.add('opened');

      if (sound) {
        sound.currentTime = 0;
        sound.play();
      }

      spawnParticles(e.clientX, e.clientY);

      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 300);
    });
  });


  // ===============================
  // ENVELOPE LOGIC
  // ===============================
  window.openEnvelope = function (wrapper, title, bodyText) {
    const envelope = wrapper.querySelector('.envelope');
    if (!envelope || envelope.classList.contains('open')) return;

    envelope.classList.add('open');

    setTimeout(() => {
      const modal = document.getElementById('letter-modal');
      const t = document.getElementById('modal-title');
      const b = document.getElementById('modal-body');

      if (t) t.innerText = title;
      if (b) b.innerText = bodyText;
      if (modal) modal.classList.add('visible');
    }, 600);
  };

  window.closeLetter = function () {
    const modal = document.getElementById('letter-modal');
    if (modal) modal.classList.remove('visible');

    document.querySelectorAll('.envelope').forEach(e => e.classList.remove('open'));
  };

// ===============================
  // MEMORY REELS
  // ===============================
  let currentReelIndex = 0;

  const reelsModal = document.getElementById('reels-modal');
  const reelsContainer = document.getElementById('reels-container');
  const reelItems = document.querySelectorAll('.reel-item');

  window.openReel = function (index) {
    if (!reelsModal) return;

    currentReelIndex = index;
    reelsModal.classList.add('open');

    const h = reelsContainer.clientHeight;
    reelsContainer.scrollTop = h * index;

    const vid = reelItems[index]?.querySelector('video');
    if (vid) vid.play();
  };

  window.closeReel = function () {
    if (!reelsModal) return;

    reelsModal.classList.remove('open');
    document.querySelectorAll('.reel-item video').forEach(v => v.pause());
  };

  window.nextReel = function () {
    if (!reelsContainer) return;

    const h = reelsContainer.clientHeight;
    reelsContainer.scrollTo({
      top: h * (currentReelIndex + 1),
      behavior: 'smooth'
    });
  };
  
  // NEW: Fully functional prevReel 
  window.prevReel = function () {
    if (!reelsContainer) return;

    const h = reelsContainer.clientHeight;
    reelsContainer.scrollTo({
      // We subtract 1 to scroll UP to the previous video
      top: h * (currentReelIndex - 1), 
      behavior: 'smooth'
    });
  };

  if (reelsContainer) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const video = e.target.querySelector('video');

        if (e.isIntersecting) {
          currentReelIndex = parseInt(e.target.dataset.index);
          video?.play();
        } else {
          video?.pause();
        }
      });
    }, { threshold: 0.6 });

    reelItems.forEach((item, i) => {
      item.dataset.index = i;
      obs.observe(item);
    });
  }

  // ===============================
  // K HERO BACKGROUND
  // ===============================
  const ko = document.getElementById('k-overlay');

  if (ko) {
    for (let i = 0; i < 80; i++) {
      const k = document.createElement('span');
      k.className = 'k-letter';
      k.textContent = 'K';

      k.style.cssText = `
        animation-delay:${(Math.random() * -12).toFixed(1)}s;
        animation-duration:${(6 + Math.random() * 8).toFixed(1)}s;
        font-size:${(2 + Math.random() * 9).toFixed(1)}rem;
        opacity:${(0.04 + Math.random() * 0.18).toFixed(2)};
        margin:0 .2rem;
      `;

      ko.appendChild(k);
    }
  }

});