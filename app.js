/**
 * THE CURIOUS DEVELOPER — Interactive Editorial Engine
 * Lightweight, accessible, zero heavy external dependencies.
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIS SYSTEM (Subtle tactile micro-feedback) ---
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
  }

  function playTactileClick() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio context might be restricted
    }
  }

  // --- THEME SYSTEM (Warm Paper / Ink Dark) ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('curious_dev_theme') || 'paper';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      initAudio();
      playTactileClick();
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'paper' ? 'ink' : 'paper';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('curious_dev_theme', next);
    });
  }

  // --- SOUND TOGGLE ---
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        document.body.classList.remove('sound-muted');
        playTactileClick();
      } else {
        document.body.classList.add('sound-muted');
      }
    });
    // Default muted for user respect
    document.body.classList.add('sound-muted');
  }

  // --- CHAPTER SCROLL SPY & PROGRESS TRACKER ---
  const chapters = [
    { id: 'hero', code: '00 // PROLOGUE' },
    { id: 'who-am-i', code: '01 // WHO AM I' },
    { id: 'why-i-learn', code: '02 // WHY I LEARN' },
    { id: 'what-i-build', code: '03 // WHAT I BUILD' },
    { id: 'arsenal', code: '04 // ARSENAL' },
    { id: 'logbook', code: '05 // LOGBOOK' },
    { id: 'whats-next', code: '06 // NEXT EPISODE' }
  ];

  const currentChapterText = document.getElementById('currentChapterText');
  const trackerProgress = document.getElementById('trackerProgress');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateScrollSpy() {
    const scrollPos = window.scrollY + 200;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressPercent = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));

    if (trackerProgress) {
      trackerProgress.style.width = `${progressPercent}%`;
    }

    let activeChapter = chapters[0];

    for (let i = chapters.length - 1; i >= 0; i--) {
      const section = document.getElementById(chapters[i].id);
      if (section && section.offsetTop <= scrollPos) {
        activeChapter = chapters[i];
        break;
      }
    }

    if (currentChapterText && currentChapterText.textContent !== activeChapter.code) {
      currentChapterText.textContent = activeChapter.code;
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === activeChapter.id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  // --- MOBILE NAVIGATION DRAWER ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu(open) {
    initAudio();
    playTactileClick();
    if (open) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
  }
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // --- NOTEBOOK TABS IN CHAPTER 02 ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      playTactileClick();

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('hidden', 'true');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.removeAttribute('hidden');
      }
    });
  });

  // --- PROJECT FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      playTactileClick();

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- ARSENAL INTERACTIVE TOOL LINKS ---
  const toolChips = document.querySelectorAll('.tool-chip');
  const feedbackBanner = document.getElementById('toolFeedbackBanner');
  const feedbackText = document.getElementById('toolFeedbackText');

  toolChips.forEach(chip => {
    chip.addEventListener('click', () => {
      initAudio();
      playTactileClick();

      toolChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const toolName = chip.getAttribute('data-tool');
      const connectedProjects = chip.getAttribute('data-projects') || '';

      // Highlight matching project cards
      let matchedCount = 0;
      projectCards.forEach(card => {
        const cardTech = card.getAttribute('data-tech') || '';
        if (cardTech.toLowerCase().includes(toolName.toLowerCase())) {
          card.classList.add('highlighted-by-tool');
          matchedCount++;
          card.style.display = 'flex';
        } else {
          card.classList.remove('highlighted-by-tool');
        }
      });

      if (feedbackText) {
        if (connectedProjects.includes('Night Harvest')) {
          feedbackText.innerHTML = `<strong>${toolName}</strong> was used to build: <span style="color: var(--gold-primary); font-weight: 700;">Night Harvest</span>. Check the highlighted project card!`;
        } else {
          feedbackText.innerHTML = `<strong>${toolName}</strong> is part of my study and development workbench for upcoming projects.`;
        }
      }

      // Smooth scroll to projects section if user wants to see
      const projectsSec = document.getElementById('what-i-build');
      if (projectsSec && window.innerWidth < 900) {
        projectsSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- PROJECT DEEP DIVE MODAL DATA & CONTROLLER ---
  const projectDetailsData = {
    nightharvest: {
      title: 'NIGHT HARVEST',
      genre: '2D TOP-DOWN FARMING & SURVIVAL SANDBOX',
      engine: 'Godot Engine + GDScript',
      duration: '4-Week Solo Experiment',
      summary: 'I wanted to try making a game, so I started learning Godot and built a 2D top-down farming survival loop where you plant crops during the day and defend your farm from night hazards.',
      challenges: [
        'Learning how Godot scene trees and node hierarchies communicate without messy dependencies.',
        'Setting up day/night ambient lighting shifts and torch lighting radiuses.',
        'Building a custom tilemap grid with interactive soil states (tilled, watered, planted).'
      ],
      discoveries: 'Building a game made me appreciate clean state management. When entities update every single frame, having simple and decoupled state logic makes debugging so much easier.',
      sourceUrl: 'https://github.com/limbrasonadev'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  function openProjectModal(projectId) {
    const data = projectDetailsData[projectId];
    if (!data || !modalContent) return;

    initAudio();
    playTactileClick();

    modalContent.innerHTML = `
      <div class="modal-project-header">
        <span class="p-num">PROJECT DEV NOTES</span>
        <h3 class="modal-project-title">${data.title}</h3>
        <p class="p-genre">${data.genre}</p>
        <div class="modal-meta-bar">
          <span><strong>ENGINE / TOOLS:</strong> ${data.engine}</span>
          <span><strong>TIMELINE:</strong> ${data.duration}</span>
        </div>
      </div>

      <div class="modal-body-section">
        <h4 class="b-label"><span class="b-icon">📜</span> PROJECT OVERVIEW</h4>
        <p class="modal-summary">${data.summary}</p>

        <h4 class="b-label" style="margin-top: 1.5rem;"><span class="b-icon">⚙</span> WHAT I TACKLED & LEARNED</h4>
        <ul class="modal-challenges-list">
          ${data.challenges.map(c => `<li>${c}</li>`).join('')}
        </ul>

        <h4 class="b-label" style="margin-top: 1.5rem;"><span class="b-icon">💡</span> BIGGEST TAKEAWAY</h4>
        <blockquote class="modal-quote">"${data.discoveries}"</blockquote>
      </div>

      <div class="modal-actions-bar">
        <a href="${data.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <span>VIEW GITHUB REPOSITORY</span> <span>→</span>
        </a>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    initAudio();
    playTactileClick();
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      openProjectModal(proj);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // --- SUBTLE PORTRAIT TILT EFFECT ---
  const portraitCard = document.getElementById('portraitCard');
  if (portraitCard && window.matchMedia('(pointer: fine)').matches) {
    portraitCard.addEventListener('mousemove', (e) => {
      const rect = portraitCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 8;
      const rotateY = (x / rect.width) * 8;
      portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    portraitCard.addEventListener('mouseleave', () => {
      portraitCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  // --- TRANSMISSION / CONTACT FORM SIMULATION ---
  window.handleTransmission = function (form) {
    initAudio();
    playTactileClick();

    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const message = document.getElementById('senderMessage').value;
    const feedback = document.getElementById('formFeedback');
    const sendBtn = document.getElementById('sendBtn');

    if (!name || !email || !message) return;

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span>SENDING MESSAGE...</span>';

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span>SEND MESSAGE</span> <span>→</span>';
      form.reset();
      
      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.textContent = `✓ Thanks for reaching out, ${name}! Your message has been noted. You can also reach me directly at limuelforwork@gmail.com.`;
        setTimeout(() => {
          feedback.textContent = '';
        }, 7000);
      }
    }, 800);
  };

})();
