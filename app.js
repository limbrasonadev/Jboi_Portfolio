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

  // =========================================================================
  // REUSABLE PROJECT DATA ENGINE
  // =========================================================================
  const defaultProjects = [
    {
      id: 'nightharvest',
      chapter: 'ENTRY 01 // GAME DEVELOPMENT',
      status: 'COMPLETED EXPERIMENT',
      title: 'NIGHT HARVEST',
      category: 'game',
      genre: '2D TOP-DOWN FARMING & SURVIVAL SANDBOX',
      quote: 'I wanted to try making a game, so I started learning Godot and built a farming survival loop.',
      description: 'A 2D top-down farming game where you plant crops during the day, manage your stamina, and protect your harvest from nocturnal hazards.',
      isInteractiveMock: true,
      image: '',
      gallery: [],
      wantedToMake: 'A 2D top-down farming game where you plant crops during the day, manage your stamina, and protect your harvest from nocturnal hazards.',
      learned: "How Godot's scene tree and nodes work, managing entity states with simple state machines, handling 2D tilemaps, and timing crop growth cycles.",
      built: 'A playable prototype featuring tile-based farming, day/night ambient lighting shifts, an inventory system, and crop growth mechanics.',
      improve: "Clean up how inventory items are passed between nodes, and add more enemy variety and seasonal weather effects.",
      technologies: ['Godot Engine', 'GDScript', '2D Tilemaps', 'Pixel Art', 'Git'],
      githubUrl: 'https://github.com/limbrasonadev',
      liveUrl: '',
      duration: '4-Week Solo Experiment',
      challenges: [
        'Learning how Godot scene trees and node hierarchies communicate without tangled dependencies.',
        'Setting up day/night ambient lighting shifts and torch light radiuses.',
        'Building a custom tilemap grid with interactive soil states (tilled, watered, planted).'
      ],
      discoveries: 'Building a game made me appreciate clean state management. When entities update every single frame, having simple and decoupled state logic makes debugging so much easier.'
    }
  ];

  function getStoredProjects() {
    try {
      const stored = localStorage.getItem('curious_dev_all_projects');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Fallback to defaults
    }
    return [...defaultProjects];
  }

  function saveAllProjects(projectsList) {
    try {
      localStorage.setItem('curious_dev_all_projects', JSON.stringify(projectsList));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  }

  // =========================================================================
  // OWNER MODE STATE & CONTROLLER
  // =========================================================================
  let isOwnerMode = sessionStorage.getItem('curious_dev_owner_mode') === 'true';
  const projectsGrid = document.getElementById('projectsGrid');
  let currentFilter = 'all';

  function setOwnerMode(active) {
    isOwnerMode = active;
    sessionStorage.setItem('curious_dev_owner_mode', active ? 'true' : 'false');
    if (active) {
      document.body.classList.add('owner-mode-active');
    } else {
      document.body.classList.remove('owner-mode-active');
    }
    renderFilterButtons();
    renderProjects(currentFilter);
  }

  // Set initial class on body
  if (isOwnerMode) {
    document.body.classList.add('owner-mode-active');
  }

  // Discreet entry mechanisms
  // 1. Keyboard Shortcut (Ctrl+Shift+O, Cmd+Shift+O, or Alt+O)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && (e.key === 'O' || e.key === 'o')) ||
        (e.altKey && (e.key === 'O' || e.key === 'o'))) {
      e.preventDefault();
      initAudio();
      playTactileClick();
      if (isOwnerMode) {
        setOwnerMode(false);
      } else {
        openOwnerGateModal();
      }
    }
  });

  // 2. Hidden Brand Seal Triple-Click
  let stampClickCount = 0;
  let stampClickTimer = null;
  const brandSeals = document.querySelectorAll('.brand-kanji, .stamp-seal, .portrait-stamp');
  brandSeals.forEach(seal => {
    seal.addEventListener('click', () => {
      stampClickCount++;
      clearTimeout(stampClickTimer);
      stampClickTimer = setTimeout(() => {
        stampClickCount = 0;
      }, 1500);

      if (stampClickCount >= 3) {
        stampClickCount = 0;
        initAudio();
        playTactileClick();
        if (!isOwnerMode) {
          openOwnerGateModal();
        } else {
          setOwnerMode(false);
        }
      }
    });
  });

  // Owner Gate Modal handlers
  const ownerGateModal = document.getElementById('ownerGateModal');
  const ownerGateBackdrop = document.getElementById('ownerGateBackdrop');
  const ownerGateCloseBtn = document.getElementById('ownerGateCloseBtn');
  const cancelOwnerGateBtn = document.getElementById('cancelOwnerGateBtn');
  const confirmOwnerGateBtn = document.getElementById('confirmOwnerGateBtn');

  function openOwnerGateModal() {
    if (!ownerGateModal) return;
    initAudio();
    playTactileClick();
    ownerGateModal.classList.add('open');
    ownerGateModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeOwnerGateModal() {
    if (!ownerGateModal) return;
    initAudio();
    playTactileClick();
    ownerGateModal.classList.remove('open');
    ownerGateModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (ownerGateCloseBtn) ownerGateCloseBtn.addEventListener('click', closeOwnerGateModal);
  if (ownerGateBackdrop) ownerGateBackdrop.addEventListener('click', closeOwnerGateModal);
  if (cancelOwnerGateBtn) cancelOwnerGateBtn.addEventListener('click', closeOwnerGateModal);
  if (confirmOwnerGateBtn) {
    confirmOwnerGateBtn.addEventListener('click', () => {
      closeOwnerGateModal();
      setOwnerMode(true);
    });
  }

  // Owner Status Bar button triggers
  const ownerAddProjectBtn = document.getElementById('ownerAddProjectBtn');
  const ownerExportBtn = document.getElementById('ownerExportBtn');
  const ownerExitBtn = document.getElementById('ownerExitBtn');

  if (ownerAddProjectBtn) {
    ownerAddProjectBtn.addEventListener('click', () => {
      initAudio();
      playTactileClick();
      openNewProjectModal();
    });
  }

  if (ownerExportBtn) {
    ownerExportBtn.addEventListener('click', () => {
      initAudio();
      playTactileClick();
      openExportModal();
    });
  }

  if (ownerExitBtn) {
    ownerExitBtn.addEventListener('click', () => {
      initAudio();
      playTactileClick();
      setOwnerMode(false);
    });
  }

  // =========================================================================
  // DYNAMIC CATEGORY & FILTER RENDERING
  // =========================================================================
  function getUniqueCategories() {
    const allProjects = getStoredProjects();
    const standard = ['all', 'game', 'web', 'system'];
    const custom = [];
    allProjects.forEach(p => {
      if (p.category && !standard.includes(p.category) && !custom.includes(p.category)) {
        custom.push(p.category);
      }
    });
    return { standard, custom };
  }

  function renderFilterButtons() {
    const filterContainer = document.querySelector('.filter-buttons');
    if (!filterContainer) return;

    const { custom } = getUniqueCategories();
    let buttonsHtml = `
      <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">ALL CHAPTERS</button>
      <button class="filter-btn ${currentFilter === 'game' ? 'active' : ''}" data-filter="game">GAME DEV</button>
      <button class="filter-btn ${currentFilter === 'web' ? 'active' : ''}" data-filter="web">WEB CRAFT</button>
      <button class="filter-btn ${currentFilter === 'system' ? 'active' : ''}" data-filter="system">SYSTEM / TOOLS</button>
    `;

    custom.forEach(cat => {
      const label = cat.toUpperCase();
      buttonsHtml += `
        <button class="filter-btn ${currentFilter === cat ? 'active' : ''}" data-filter="${cat}">${label}</button>
      `;
    });

    if (isOwnerMode) {
      buttonsHtml += `
        <button class="filter-btn ${currentFilter === 'upcoming' ? 'active' : ''}" data-filter="upcoming">IN PROGRESS (+)</button>
      `;
    }

    filterContainer.innerHTML = buttonsHtml;

    // Bind filter clicks
    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        initAudio();
        playTactileClick();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderProjects(currentFilter);
      });
    });
  }

  // =========================================================================
  // PROJECT GRID RENDERING (PUBLIC VS OWNER SEPARATION)
  // =========================================================================
  function renderProjects(filter = 'all') {
    if (!projectsGrid) return;
    currentFilter = filter;
    projectsGrid.innerHTML = '';

    const allProjects = getStoredProjects();
    const filtered = allProjects.filter(p => filter === 'all' || p.category === filter);

    filtered.forEach((p, index) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('data-category', p.category);
      card.setAttribute('data-tech', p.technologies ? p.technologies.join(' ') : '');
      card.setAttribute('id', `project-${p.id}`);

      // Visual box rendering
      let visualHtml = '';
      if (p.isInteractiveMock) {
        visualHtml = `
          <div class="p-screen pixel-preview">
            <div class="game-demo-mock">
              <div class="mock-grid">
                <div class="mock-tile">🌱</div>
                <div class="mock-tile">🌾</div>
                <div class="mock-tile">💧</div>
                <div class="mock-tile">🧑‍🌾</div>
                <div class="mock-tile">🌙</div>
                <div class="mock-tile">🌽</div>
              </div>
              <div class="mock-hud">
                <span>TIME: 22:45 [NIGHT PHASE]</span>
                <span>ENERGY: 84%</span>
              </div>
            </div>
          </div>
        `;
      } else if (p.image) {
        visualHtml = `
          <div class="p-screen">
            <img src="${p.image}" alt="${p.title} preview" class="p-screen-img" loading="lazy">
          </div>
        `;
      } else {
        visualHtml = `
          <div class="p-screen pixel-preview" style="align-items: center; justify-content: center;">
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--gold-primary); text-align: center;">
              <span>[ PROJECT ARCHIVE // ACTIVE LOG ]</span>
            </div>
          </div>
        `;
      }

      // Owner-only card action bar
      let ownerControlsHtml = '';
      if (isOwnerMode) {
        ownerControlsHtml = `
          <div class="card-owner-bar">
            <span class="card-owner-left">OWNER CONTROLS</span>
            <div class="card-owner-btns">
              ${index > 0 ? `<button type="button" class="btn-owner-action btn-owner-up" data-id="${p.id}" title="Move Up">▲</button>` : ''}
              ${index < allProjects.length - 1 ? `<button type="button" class="btn-owner-action btn-owner-down" data-id="${p.id}" title="Move Down">▼</button>` : ''}
              <button type="button" class="btn-owner-action btn-owner-edit" data-id="${p.id}">✏ EDIT</button>
              <button type="button" class="btn-owner-action btn-owner-delete" data-id="${p.id}">✕ DELETE</button>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        ${ownerControlsHtml}
        <div class="project-card-header">
          <div class="p-header-top">
            <span class="p-num">${p.chapter || 'ENTRY'}</span>
            <span class="p-status">${p.status || 'COMPLETED'}</span>
          </div>
          <h3 class="p-title">${p.title}</h3>
          <p class="p-genre">${p.genre}</p>
          <blockquote class="p-quote">"${p.quote}"</blockquote>
        </div>

        <div class="p-visual-box">
          ${visualHtml}
          <div class="p-tags">
            ${p.technologies ? p.technologies.map(t => `<span class="p-tag">${t}</span>`).join('') : ''}
          </div>
        </div>

        <div class="p-breakdown">
          <div class="breakdown-item">
            <h4 class="b-label"><span class="b-icon">🎯</span> WANTED TO MAKE</h4>
            <p class="b-text">${p.wantedToMake}</p>
          </div>
          <div class="breakdown-item">
            <h4 class="b-label"><span class="b-icon">🧠</span> LEARNED</h4>
            <p class="b-text">${p.learned}</p>
          </div>
          <div class="breakdown-item">
            <h4 class="b-label"><span class="b-icon">⚙</span> BUILT</h4>
            <p class="b-text">${p.built}</p>
          </div>
          <div class="breakdown-item">
            <h4 class="b-label"><span class="b-icon">🚀</span> IMPROVE</h4>
            <p class="b-text">${p.improve}</p>
          </div>
        </div>

        <div class="p-actions">
          <button class="btn btn-outline view-details-btn" data-project="${p.id}">
            <span>INSPECT DEV NOTES</span> <span>↗</span>
          </button>
          ${p.githubUrl ? `
            <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
              <span>VIEW ON GITHUB</span> <span>⌥</span>
            </a>
          ` : ''}
          ${p.liveUrl ? `
            <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
              <span>LIVE DEMO</span> <span>→</span>
            </a>
          ` : ''}
        </div>
      `;

      projectsGrid.appendChild(card);
    });

    // Append the Plus (+) Card
    // In Owner Mode: Active "+ ADD NEW PROJECT" card
    // In Public Mode: Editorial teaser "NEXT EXPERIMENT // IN PROGRESS"
    if (filter === 'all' || filter === 'upcoming') {
      const nextChapterNum = allProjects.length + 1;
      const plusCard = document.createElement('article');
      plusCard.className = 'project-card project-card-plus';
      plusCard.setAttribute('data-category', 'upcoming');
      plusCard.setAttribute('data-tech', 'All Future Explorations');

      if (isOwnerMode) {
        plusCard.setAttribute('role', 'button');
        plusCard.setAttribute('tabindex', '0');
        plusCard.setAttribute('aria-label', 'Add a new project experiment');
        plusCard.innerHTML = `
          <div class="plus-card-inner">
            <div class="plus-icon-wrap" aria-hidden="true">+</div>
            <span class="plus-badge">CHAPTER 0${nextChapterNum} // IN PROGRESS</span>
            <h3 class="plus-title">ADD NEW PROJECT</h3>
            <p class="plus-desc">
              "Curate and log the next experiment using the standardized 4-pillar story breakdown."
            </p>
            <button type="button" class="plus-btn-trigger">
              <span>+ LOG NEW EXPERIMENT</span>
              <span>→</span>
            </button>
          </div>
        `;
        plusCard.addEventListener('click', () => {
          initAudio();
          playTactileClick();
          openNewProjectModal();
        });
      } else {
        // Public View: Clean finished teaser
        plusCard.innerHTML = `
          <div class="plus-card-inner">
            <div class="plus-icon-wrap" aria-hidden="true">★</div>
            <span class="plus-badge">CHAPTER 0${nextChapterNum} // IN PROGRESS</span>
            <h3 class="plus-title">NEXT EXPERIMENT</h3>
            <p class="plus-desc">
              "I'm continuously exploring new ideas, writing code, and learning. When a build is complete, it will be logged right here."
            </p>
            <div class="plus-status-indicator" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--gold-primary); font-weight: 700;">
              <span>● EXPERIMENTS IN PROGRESS</span>
            </div>
          </div>
        `;
      }

      projectsGrid.appendChild(plusCard);
    }

    // Bind Owner Action Buttons if in owner mode
    if (isOwnerMode) {
      // Edit buttons
      const editBtns = projectsGrid.querySelectorAll('.btn-owner-edit');
      editBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-id');
          openEditProjectModal(pId);
        });
      });

      // Delete buttons
      const deleteBtns = projectsGrid.querySelectorAll('.btn-owner-delete');
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-id');
          openDeleteConfirmModal(pId);
        });
      });

      // Reorder buttons
      const upBtns = projectsGrid.querySelectorAll('.btn-owner-up');
      upBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-id');
          reorderProject(pId, -1);
        });
      });

      const downBtns = projectsGrid.querySelectorAll('.btn-owner-down');
      downBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-id');
          reorderProject(pId, 1);
        });
      });
    }

    // Rebind view details buttons
    const viewDetailBtns = projectsGrid.querySelectorAll('.view-details-btn');
    viewDetailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const projId = btn.getAttribute('data-project');
        openProjectModal(projId);
      });
    });
  }

  // Reorder helper
  function reorderProject(projectId, direction) {
    const list = getStoredProjects();
    const index = list.findIndex(p => p.id === projectId);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    initAudio();
    playTactileClick();

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    saveAllProjects(list);
    renderProjects(currentFilter);
  }

  // --- ARSENAL INTERACTIVE TOOL LINKS ---
  const toolChips = document.querySelectorAll('.tool-chip');
  const feedbackText = document.getElementById('toolFeedbackText');

  toolChips.forEach(chip => {
    chip.addEventListener('click', () => {
      initAudio();
      playTactileClick();

      toolChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const toolName = chip.getAttribute('data-tool');
      const connectedProjects = chip.getAttribute('data-projects') || '';

      const projectCards = document.querySelectorAll('.project-card');
      let matchedCount = 0;
      projectCards.forEach(card => {
        const cardTech = card.getAttribute('data-tech') || '';
        if (cardTech.toLowerCase().includes(toolName.toLowerCase())) {
          card.classList.add('highlighted-by-tool');
          matchedCount++;
        } else {
          card.classList.remove('highlighted-by-tool');
        }
      });

      if (feedbackText) {
        if (connectedProjects.includes('Night Harvest')) {
          feedbackText.innerHTML = `<strong>${toolName}</strong> was used to build: <span style="color: var(--gold-primary); font-weight: 700;">Night Harvest</span>. Highlighted in the project archive!`;
        } else {
          feedbackText.innerHTML = `<strong>${toolName}</strong> is part of my study workbench and foundation for upcoming projects.`;
        }
      }

      const projectsSec = document.getElementById('what-i-build');
      if (projectsSec && window.innerWidth < 900) {
        projectsSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // MODAL 1: PROJECT DEV NOTES DEEP DIVE & IMAGE GALLERY
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openProjectModal(projectId) {
    const allProjects = getStoredProjects();
    const data = allProjects.find(p => p.id === projectId);
    if (!data || !modalContent) return;

    initAudio();
    playTactileClick();

    // Build Gallery HTML if images exist
    let galleryHtml = '';
    const images = [];
    if (data.image) images.push(data.image);
    if (Array.isArray(data.gallery)) {
      data.gallery.forEach(img => {
        if (img && !images.includes(img)) images.push(img);
      });
    }

    if (images.length > 0) {
      galleryHtml = `
        <div class="modal-gallery-container">
          <div class="modal-main-image-wrap">
            <img src="${images[0]}" alt="${data.title}" class="modal-main-image" id="modalMainImg">
          </div>
          ${images.length > 1 ? `
            <div class="modal-thumbnails-strip">
              ${images.map((img, i) => `
                <button type="button" class="modal-thumb-btn ${i === 0 ? 'active' : ''}" data-img="${img}" aria-label="View preview ${i + 1}">
                  <img src="${img}" alt="Thumbnail ${i + 1}">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    // Challenges list
    const challengesList = data.challenges && data.challenges.length > 0 ? data.challenges : [
      data.wantedToMake,
      data.learned,
      data.built,
      data.improve
    ];

    modalContent.innerHTML = `
      <div class="modal-project-header">
        <div class="p-header-top">
          <span class="p-num">${data.chapter || 'DEV LOG'}</span>
          <span class="p-status">${data.status || 'LOGGED'}</span>
        </div>
        <h3 class="modal-project-title">${data.title}</h3>
        <p class="p-genre">${data.genre}</p>
        <div class="modal-meta-bar">
          <span><strong>TECH:</strong> ${data.technologies ? data.technologies.join(', ') : 'Custom Stack'}</span>
          <span><strong>TIMELINE:</strong> ${data.duration || 'Exploration Phase'}</span>
        </div>
      </div>

      ${galleryHtml}

      <div class="modal-body-section">
        <h4 class="b-label"><span class="b-icon">📜</span> PROJECT OVERVIEW</h4>
        <p class="modal-summary">${data.description || data.summary || data.quote}</p>

        <h4 class="b-label" style="margin-top: 1.5rem;"><span class="b-icon">⚙</span> WHAT I TACKLED &amp; LEARNED</h4>
        <ul class="modal-challenges-list">
          ${challengesList.map(c => `<li>${c}</li>`).join('')}
        </ul>

        <h4 class="b-label" style="margin-top: 1.5rem;"><span class="b-icon">💡</span> BIGGEST TAKEAWAY</h4>
        <blockquote class="modal-quote">"${data.discoveries || data.learned}"</blockquote>
      </div>

      <div class="modal-actions-bar">
        ${data.githubUrl ? `
          <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <span>VIEW GITHUB REPOSITORY</span> <span>→</span>
          </a>
        ` : ''}
        ${data.liveUrl ? `
          <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <span>LIVE DEMO</span> <span>↗</span>
          </a>
        ` : ''}
      </div>
    `;

    // Interactive Gallery thumbnail switcher
    const thumbBtns = modalContent.querySelectorAll('.modal-thumb-btn');
    const modalMainImg = document.getElementById('modalMainImg');
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        initAudio();
        playTactileClick();
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newSrc = btn.getAttribute('data-img');
        if (modalMainImg && newSrc) {
          modalMainImg.src = newSrc;
        }
      });
    });

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

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  // =========================================================================
  // MODAL 2: PROJECT CREATOR & EDITOR WORKBENCH
  // =========================================================================
  const newProjectModal = document.getElementById('newProjectModal');
  const newProjectBackdrop = document.getElementById('newProjectBackdrop');
  const newProjectCloseBtn = document.getElementById('newProjectCloseBtn');
  const cancelProjectBtn = document.getElementById('cancelProjectBtn');
  const newProjectForm = document.getElementById('newProjectForm');

  const npModalHeaderBadge = document.getElementById('npModalHeaderBadge');
  const npModalHeaderTitle = document.getElementById('npModalHeaderTitle');
  const saveProjectBtnText = document.getElementById('saveProjectBtnText');
  const npEditId = document.getElementById('npEditId');

  const npCategory = document.getElementById('npCategory');
  const npCustomCategoryGroup = document.getElementById('npCustomCategoryGroup');
  const npCustomCategory = document.getElementById('npCustomCategory');

  // Custom category toggle
  if (npCategory) {
    npCategory.addEventListener('change', () => {
      if (npCategory.value === 'custom') {
        npCustomCategoryGroup.style.display = 'block';
        npCustomCategory.required = true;
      } else {
        npCustomCategoryGroup.style.display = 'none';
        npCustomCategory.required = false;
      }
    });
  }

  // Image uploader elements
  const npImageUrl = document.getElementById('npImageUrl');
  const npImageFile = document.getElementById('npImageFile');
  const npImagePreview = document.getElementById('npImagePreview');
  const npImagePlaceholder = document.getElementById('npImagePlaceholder');
  const npClearImageBtn = document.getElementById('npClearImageBtn');
  let currentUploadedImage = '';

  function setPreviewImage(src) {
    currentUploadedImage = src;
    if (src) {
      if (npImagePreview) {
        npImagePreview.src = src;
        npImagePreview.style.display = 'block';
      }
      if (npImagePlaceholder) npImagePlaceholder.style.display = 'none';
    } else {
      if (npImagePreview) {
        npImagePreview.src = '';
        npImagePreview.style.display = 'none';
      }
      if (npImagePlaceholder) npImagePlaceholder.style.display = 'flex';
      if (npImageUrl) npImageUrl.value = '';
      if (npImageFile) npImageFile.value = '';
    }
  }

  if (npImageUrl) {
    npImageUrl.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      setPreviewImage(val);
    });
  }

  if (npImageFile) {
    npImageFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (npClearImageBtn) {
    npClearImageBtn.addEventListener('click', () => {
      initAudio();
      playTactileClick();
      setPreviewImage('');
    });
  }

  function openNewProjectModal() {
    if (!newProjectModal) return;
    newProjectForm.reset();
    setPreviewImage('');
    npEditId.value = '';
    if (npCustomCategoryGroup) npCustomCategoryGroup.style.display = 'none';
    if (npModalHeaderBadge) npModalHeaderBadge.textContent = 'LOGBOOK // NEW CHAPTER DRAFT';
    if (npModalHeaderTitle) npModalHeaderTitle.textContent = 'LOG A NEW EXPERIMENT';
    if (saveProjectBtnText) saveProjectBtnText.textContent = 'SAVE TO PORTFOLIO ARCHIVE';

    newProjectModal.classList.add('open');
    newProjectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openEditProjectModal(projectId) {
    const list = getStoredProjects();
    const proj = list.find(p => p.id === projectId);
    if (!proj || !newProjectModal) return;

    initAudio();
    playTactileClick();

    npEditId.value = proj.id;
    document.getElementById('npTitle').value = proj.title || '';

    // Category handling
    const standardCategories = ['web', 'game', 'system'];
    if (standardCategories.includes(proj.category)) {
      npCategory.value = proj.category;
      if (npCustomCategoryGroup) npCustomCategoryGroup.style.display = 'none';
      if (npCustomCategory) npCustomCategory.value = '';
    } else {
      npCategory.value = 'custom';
      if (npCustomCategoryGroup) npCustomCategoryGroup.style.display = 'block';
      if (npCustomCategory) npCustomCategory.value = proj.category || '';
    }

    document.getElementById('npGenre').value = proj.genre || '';
    document.getElementById('npTechnologies').value = proj.technologies ? proj.technologies.join(', ') : '';
    document.getElementById('npQuote').value = proj.quote || '';
    document.getElementById('npDescription').value = proj.description || '';
    document.getElementById('npWanted').value = proj.wantedToMake || '';
    document.getElementById('npLearned').value = proj.learned || '';
    document.getElementById('npBuilt').value = proj.built || '';
    document.getElementById('npImprove').value = proj.improve || '';
    document.getElementById('npGithub').value = proj.githubUrl || '';
    document.getElementById('npLive').value = proj.liveUrl || '';

    setPreviewImage(proj.image || '');

    if (npModalHeaderBadge) npModalHeaderBadge.textContent = `LOGBOOK // EDITING ENTRY`;
    if (npModalHeaderTitle) npModalHeaderTitle.textContent = `EDIT ${proj.title}`;
    if (saveProjectBtnText) saveProjectBtnText.textContent = 'UPDATE EXPERIMENT LOG';

    newProjectModal.classList.add('open');
    newProjectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeNewProjectModal() {
    if (!newProjectModal) return;
    initAudio();
    playTactileClick();
    newProjectModal.classList.remove('open');
    newProjectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (newProjectCloseBtn) newProjectCloseBtn.addEventListener('click', closeNewProjectModal);
  if (newProjectBackdrop) newProjectBackdrop.addEventListener('click', closeNewProjectModal);
  if (cancelProjectBtn) cancelProjectBtn.addEventListener('click', closeNewProjectModal);

  // Form Submission (Add or Edit)
  if (newProjectForm) {
    newProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();
      playTactileClick();

      const editId = npEditId.value;
      const title = document.getElementById('npTitle').value.trim();
      let category = npCategory.value;
      if (category === 'custom') {
        category = (npCustomCategory.value.trim() || 'custom').toLowerCase().replace(/\s+/g, '-');
      }

      const genre = document.getElementById('npGenre').value.trim();
      const technologiesStr = document.getElementById('npTechnologies').value.trim();
      const quote = document.getElementById('npQuote').value.trim();
      const description = document.getElementById('npDescription').value.trim();
      const wantedToMake = document.getElementById('npWanted').value.trim();
      const learned = document.getElementById('npLearned').value.trim();
      const built = document.getElementById('npBuilt').value.trim();
      const improve = document.getElementById('npImprove').value.trim();
      const githubUrl = document.getElementById('npGithub').value.trim();
      const liveUrl = document.getElementById('npLive').value.trim();

      const techList = technologiesStr.split(',').map(t => t.trim()).filter(Boolean);
      const list = getStoredProjects();

      if (editId) {
        // Update existing project
        const index = list.findIndex(p => p.id === editId);
        if (index !== -1) {
          const existing = list[index];
          list[index] = {
            ...existing,
            title: title.toUpperCase(),
            category: category,
            genre: genre.toUpperCase(),
            quote: quote.replace(/^["']|["']$/g, ''),
            description: description,
            image: currentUploadedImage || existing.image,
            gallery: currentUploadedImage ? [currentUploadedImage] : existing.gallery,
            wantedToMake: wantedToMake,
            learned: learned,
            built: built,
            improve: improve,
            technologies: techList.length > 0 ? techList : existing.technologies,
            githubUrl: githubUrl,
            liveUrl: liveUrl,
            challenges: [wantedToMake, learned, built, improve],
            discoveries: learned
          };
        }
      } else {
        // Create new project
        const nextIndex = list.length + 1;
        const newProject = {
          id: `project-${Date.now()}`,
          chapter: `ENTRY 0${nextIndex} // ${category.toUpperCase()}`,
          status: 'LOGGED EXPERIMENT',
          title: title.toUpperCase(),
          category: category,
          genre: genre.toUpperCase(),
          quote: quote.replace(/^["']|["']$/g, ''),
          description: description,
          image: currentUploadedImage,
          gallery: currentUploadedImage ? [currentUploadedImage] : [],
          isInteractiveMock: false,
          wantedToMake: wantedToMake,
          learned: learned,
          built: built,
          improve: improve,
          technologies: techList.length > 0 ? techList : ['HTML5', 'CSS3', 'JavaScript'],
          githubUrl: githubUrl,
          liveUrl: liveUrl,
          duration: 'Recent Experiment',
          challenges: [wantedToMake, learned, built, improve],
          discoveries: learned
        };
        list.push(newProject);
      }

      saveAllProjects(list);
      renderFilterButtons();
      renderProjects(currentFilter);

      newProjectForm.reset();
      setPreviewImage('');
      closeNewProjectModal();
    });
  }

  // =========================================================================
  // MODAL 3: DELETE CONFIRMATION
  // =========================================================================
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteConfirmBackdrop = document.getElementById('deleteConfirmBackdrop');
  const deleteConfirmCloseBtn = document.getElementById('deleteConfirmCloseBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteModalProjectTitle = document.getElementById('deleteModalProjectTitle');
  const deleteModalMessage = document.getElementById('deleteModalMessage');
  let pendingDeleteId = null;

  function openDeleteConfirmModal(projectId) {
    const list = getStoredProjects();
    const proj = list.find(p => p.id === projectId);
    if (!proj || !deleteConfirmModal) return;

    initAudio();
    playTactileClick();

    pendingDeleteId = projectId;
    if (deleteModalProjectTitle) deleteModalProjectTitle.textContent = `DELETE "${proj.title}"?`;
    if (deleteModalMessage) {
      deleteModalMessage.innerHTML = `Are you sure you want to delete <strong>${proj.title}</strong>? This action will permanently remove this chapter from the current dataset.`;
    }

    deleteConfirmModal.classList.add('open');
    deleteConfirmModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteConfirmModal() {
    if (!deleteConfirmModal) return;
    initAudio();
    playTactileClick();
    deleteConfirmModal.classList.remove('open');
    deleteConfirmModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    pendingDeleteId = null;
  }

  if (deleteConfirmCloseBtn) deleteConfirmCloseBtn.addEventListener('click', closeDeleteConfirmModal);
  if (deleteConfirmBackdrop) deleteConfirmBackdrop.addEventListener('click', closeDeleteConfirmModal);
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (!pendingDeleteId) return;
      initAudio();
      playTactileClick();

      let list = getStoredProjects();
      list = list.filter(p => p.id !== pendingDeleteId);
      saveAllProjects(list);

      closeDeleteConfirmModal();
      renderFilterButtons();
      renderProjects(currentFilter);
    });
  }

  // =========================================================================
  // MODAL 4: EXPORT REPO DATA MODAL
  // =========================================================================
  const exportDataModal = document.getElementById('exportDataModal');
  const exportDataBackdrop = document.getElementById('exportDataBackdrop');
  const exportDataCloseBtn = document.getElementById('exportDataCloseBtn');
  const exportCodeBlock = document.getElementById('exportCodeBlock');
  const copyExportBtn = document.getElementById('copyExportBtn');
  const copyExportText = document.getElementById('copyExportText');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');

  function openExportModal() {
    if (!exportDataModal) return;
    const list = getStoredProjects();
    const formattedCode = `// PASTE THIS INTO const defaultProjects IN app.js:\nconst defaultProjects = ${JSON.stringify(list, null, 2)};`;

    if (exportCodeBlock) {
      exportCodeBlock.value = formattedCode;
    }

    exportDataModal.classList.add('open');
    exportDataModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeExportModal() {
    if (!exportDataModal) return;
    initAudio();
    playTactileClick();
    exportDataModal.classList.remove('open');
    exportDataModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (exportDataCloseBtn) exportDataCloseBtn.addEventListener('click', closeExportModal);
  if (exportDataBackdrop) exportDataBackdrop.addEventListener('click', closeExportModal);

  if (copyExportBtn && exportCodeBlock) {
    copyExportBtn.addEventListener('click', () => {
      initAudio();
      playTactileClick();
      exportCodeBlock.select();
      navigator.clipboard.writeText(exportCodeBlock.value).then(() => {
        if (copyExportText) copyExportText.textContent = '✓ CODE COPIED TO CLIPBOARD!';
        setTimeout(() => {
          if (copyExportText) copyExportText.textContent = '📋 COPY CODE TO CLIPBOARD';
        }, 3000);
      });
    });
  }

  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', () => {
      initAudio();
      playTactileClick();
      const list = getStoredProjects();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(list, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'projects.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // --- GLOBAL KEYBOARD ACCESSIBILITY (ESC CLOSES ALL OPEN MODALS) ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('open')) closeProjectModal();
      if (newProjectModal && newProjectModal.classList.contains('open')) closeNewProjectModal();
      if (ownerGateModal && ownerGateModal.classList.contains('open')) closeOwnerGateModal();
      if (deleteConfirmModal && deleteConfirmModal.classList.contains('open')) closeDeleteConfirmModal();
      if (exportDataModal && exportDataModal.classList.contains('open')) closeExportModal();
    }
  });

  // Initial render
  renderFilterButtons();
  renderProjects('all');

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
