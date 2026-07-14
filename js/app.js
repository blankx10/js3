// 公共交互脚本：导航、轮播、筛选、标签切换、弹窗、内容管理与工具功能

const STORAGE_KEY = 'jx3-site-state-v1';

const defaultState = {
  site: {
    name: '青岩万花综合大学',
    slogan: '剑网3师门主页',
    createdAt: '2024年10月20日',
    visitorCount: '128,420',
    intro: '今天已守望 1 天，团本与江湖同在。'
  },
  rankList: [
    
  ],
  announcements: [
    
  ],
  members: [
    ],
  gallery: [
    ],
  posts: [
    ],
  stats: [
   ],
  summary: { totalRuns: 0, totalXuan: 0}
};

let appState = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(defaultState);
    const parsed = JSON.parse(saved);
    return { ...structuredClone(defaultState), ...parsed, members: parsed.members || defaultState.members, gallery: parsed.gallery || defaultState.gallery, posts: parsed.posts || defaultState.posts, stats: parsed.stats || defaultState.stats, announcements: parsed.announcements || defaultState.announcements, summary: { ...defaultState.summary, ...(parsed.summary || {}) } };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function renderAnnouncementTicker() {
  const container = document.getElementById('announcement-list');
  if (!container) return;
  container.innerHTML = appState.announcements.map((item) => `<span>${item}</span>`).join('');
}

function renderHomeFeed() {
  const container = document.getElementById('home-feed-list');
  if (!container) return;
  container.innerHTML = appState.posts.slice(0, 4).map((post) => `
    <article class="rounded-2xl border border-gold/20 bg-[#0c2b31] p-4">
      <p class="text-sm text-gold">【${post.tag}】${post.author}</p>
      <p class="mt-2 text-slate-300">${post.content}</p>
      <p class="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">${post.time}</p>
    </article>
  `).join('');
}

function renderHomeRank() {
  const container = document.getElementById('home-rank-list');
  if (!container) return;
  container.innerHTML = appState.rankList.map((entry, index) => `
    <div class="flex items-center justify-between rounded-2xl border border-gold/20 bg-[#0c2b31] px-4 py-3">
      <span>${index + 1}. ${entry.split('|')[0].trim()}</span>
      <span class="text-gold">${entry.split('|')[1].trim()}</span>
    </div>
  `).join('');
}

function renderMembers() {
  const treeContainer = document.getElementById('member-tree');
  const cardsContainer = document.getElementById('member-cards');
  if (!treeContainer && !cardsContainer) return;

  const [root, ...rest] = appState.members;
  if (treeContainer) {
    treeContainer.innerHTML = `
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="tree-node rounded-2xl border border-gold/30 bg-[#102d33] p-4 text-center">
          <p class="font-display text-xl text-gold"></p>
          <p class="mt-1 text-sm text-slate-300">${root.name}</p>
          <p class="text-xs text-slate-400">${root.type} / ${root.title} / ${root.visits}场</p>
        </div>
        <div class="flex flex-wrap gap-4">
          ${rest.slice(0, 2).map((member) => `
            <a href="profile.html" class="tree-node rounded-2xl border border-gold/30 bg-[#122f36] p-4 text-center" data-type="${member.type}" data-status="${member.status}">
              <p class="font-display text-lg text-gold">${member.title}</p>
              <p class="mt-1 text-sm text-slate-300">${member.name}</p>
              <p class="text-xs text-slate-400">${member.type} / ${member.status}</p>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (cardsContainer) {
    cardsContainer.innerHTML = appState.members.map((member) => `
      <article class="member-card rounded-[22px] border border-gold/30 bg-[#0c2b31] p-4" data-type="${member.type}" data-status="${member.status}">
        <div class="flex items-center gap-3">
          <img src="${member.avatar}" alt="成员头像" class="h-14 w-14 rounded-full border border-gold/40" />
          <div>
            <p class="font-display text-xl text-gold">${member.name}</p>
            <p class="text-sm text-slate-400">${member.type} / ${member.title} / 参团 ${member.visits} 次</p>
          </div>
        </div>
        <p class="mt-3 text-sm text-slate-300">${member.description}</p>
      </article>
    `).join('');
  }
}

function renderGallery() {
  const container = document.getElementById('gallery-grid');
  if (!container) return;
  container.innerHTML = appState.gallery.map((item) => `
    <article class="gallery-card mb-4 overflow-hidden rounded-[24px] border border-gold/20 bg-[#0c2b31]" data-tag="${item.tag}">
      <img src="${item.image}" alt="${item.title}" class="h-48 w-full object-cover" />
      <div class="p-4">
        <p class="text-sm text-gold">${item.title}</p>
        <p class="mt-2 text-slate-300">${item.description}</p>
      </div>
    </article>
  `).join('');
}

function renderFeed() {
  const container = document.getElementById('feed-list');
  if (!container) return;
  container.innerHTML = appState.posts.map((post) => `
    <article class="rounded-[20px] border border-gold/20 bg-[#0c2b31] p-4">
      <div class="flex items-center justify-between">
        <p class="font-semibold text-gold">${post.author}</p>
        <span class="text-sm text-slate-400">${post.time}</span>
      </div>
      <p class="mt-3 text-slate-300">${post.content}</p>
    </article>
  `).join('');
}



  const tableBody = document.getElementById('stats-table-body');
  if (tableBody) {
    tableBody.innerHTML = appState.stats.map((row) => `
      <tr class="border-t border-gold/10">
        <td class="p-3">${row.time}</td>
        <td class="p-3">${row.name}</td>
        <td class="p-3">${row.members}</td>
        <td class="p-3 text-gold">${row.status}</td>
        <td class="p-3">${row.drop}</td>
      </tr>
    `).join('');
  }
function renderStatsPage() {
  const summaryContainer = document.getElementById('stats-summary');
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="rounded-[20px] border border-gold/20 bg-[#0c2b31] p-4"><p class="text-sm text-slate-400">本周开团</p><p class="mt-2 text-3xl font-semibold">${appState.summary.totalRuns}</p></div>
      <div class="rounded-[20px] border border-gold/20 bg-[#0c2b31] p-4"><p class="text-sm text-slate-400">本周掉落</p><p class="mt-2 text-3xl font-semibold">${appState.summary.totalXuan}</p></div>
      <div class="rounded-[20px] border border-gold/20 bg-[#0c2b31] p-4"><p class="text-sm text-slate-400">记忆分红</p><p class="mt-2 text-3xl font-semibold">${appState.summary.totalTie}</p></div>
    `;
  }
}

function renderProfilePage() {
  const panel = document.getElementById('profile-panel');
  const member = appState.members[0];
  if (panel && member) {
    panel.innerHTML = `
      <div class="rounded-[24px] border border-gold/20 bg-[#0c2b31] p-6">
        <img src="${member.avatar}" alt="大头像" class="mx-auto h-32 w-32 rounded-full border border-gold/50 object-cover" />
        <p class="mt-4 text-center font-display text-3xl text-gold">${member.name}</p>
        <p class="mt-2 text-center text-slate-400">${member.type} / ${member.title}</p>
        <p class="mt-4 text-center italic text-slate-300">“江湖有路，仍愿携手同行。”</p>
        <div class="mt-6 space-y-3 text-sm text-slate-300">
          <div class="flex items-center justify-between border-b border-gold/20 pb-2">QQ 号<span>${member.qq || '未填写'}</span></div>
          <div class="flex items-center justify-between border-b border-gold/20 pb-2">简介<span>${member.description || '未填写'}</span></div>
        </div>
      </div>
    `;
  }
}

function renderAdminPanel() {
  const announcementAdmin = document.getElementById('announcement-admin-list');
  if (announcementAdmin) {
    announcementAdmin.innerHTML = appState.announcements.map((item, index) => `
      <div class="admin-list-item rounded-xl border border-gold/20 bg-[#112c33] p-3 text-sm text-slate-200">
        <div class="flex items-center justify-between gap-3">
          <span>${item}</span>
          <button class="text-gold" data-remove-announcement="${index}">移除</button>
        </div>
      </div>
    `).join('');
  }

  const memberAdmin = document.getElementById('member-admin-list');
  if (memberAdmin) {
    memberAdmin.innerHTML = appState.members.map((member, index) => `
      <div class="admin-list-item rounded-xl border border-gold/20 bg-[#112c33] p-3 text-sm text-slate-200">
        <div class="flex items-center justify-between gap-3">
          <span>${member.name} · ${member.type} · ${member.status}</span>
          <button class="text-gold" data-remove-member="${index}">移除</button>
        </div>
      </div>
    `).join('');
  }

  const galleryAdmin = document.getElementById('gallery-admin-list');
  if (galleryAdmin) {
    galleryAdmin.innerHTML = appState.gallery.map((item, index) => `
      <div class="admin-list-item rounded-xl border border-gold/20 bg-[#112c33] p-3 text-sm text-slate-200">
        <div class="flex items-center justify-between gap-3">
          <span>${item.title} · ${item.tag}</span>
          <button class="text-gold" data-remove-gallery="${index}">移除</button>
        </div>
      </div>
    `).join('');
  }

  const postAdmin = document.getElementById('post-admin-list');
  if (postAdmin) {
    postAdmin.innerHTML = appState.posts.map((post, index) => `
      <div class="admin-list-item rounded-xl border border-gold/20 bg-[#112c33] p-3 text-sm text-slate-200">
        <div class="flex items-center justify-between gap-3">
          <span>${post.author} · ${post.tag}</span>
          <button class="text-gold" data-remove-post="${index}">移除</button>
        </div>
      </div>
    `).join('');
  }

  const statsAdmin = document.getElementById('stats-admin-list');
  if (statsAdmin) {
    statsAdmin.innerHTML = appState.stats.map((row, index) => `
      <div class="admin-list-item rounded-xl border border-gold/20 bg-[#112c33] p-3 text-sm text-slate-200">
        <div class="flex items-center justify-between gap-3">
          <span>${row.time} · ${row.name}</span>
          <button class="text-gold" data-remove-stat="${index}">移除</button>
        </div>
      </div>
    `).join('');
  }
}

function bindAdminForms() {
  const announcementForm = document.getElementById('announcement-form');
  if (announcementForm) {
    announcementForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.getElementById('announcement-input');
      if (!input || !input.value.trim()) return;
      appState.announcements = input.value.split('\n').map((line) => line.trim()).filter(Boolean);
      saveState();
      renderAnnouncementTicker();
      renderHomeFeed();
      renderAdminPanel();
      input.value = '';
    });
  }

  const memberForm = document.getElementById('member-form');
  if (memberForm) {
    memberForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const member = {
        id: Date.now(),
        name: document.getElementById('member-name').value.trim(),
        title: document.getElementById('member-title').value.trim() || '新成员',
        type: document.getElementById('member-type').value.trim() || '',
        status: document.getElementById('member-status').value.trim() || '在线',
        description: document.getElementById('member-description').value.trim() || '新加入师门',
        visits: Number(document.getElementById('member-visits').value) || 0,
        avatar: 'images/portrait-1.svg'
      };
      if (!member.name) return;
      appState.members.unshift(member);
      saveState();
      renderMembers();
      renderProfilePage();
      renderAdminPanel();
      memberForm.reset();
    });
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fileInput = document.getElementById('profile-avatar');
      const file = fileInput && fileInput.files[0];
      let avatar = appState.members[0]?.avatar || 'images/portrait-1.svg';
      if (file) avatar = await readFileAsDataUrl(file);
      const firstMember = appState.members[0] || { id: Date.now() };
      const updatedMember = {
        ...firstMember,
        name: document.getElementById('profile-name').value.trim() || firstMember.name,
        title: document.getElementById('profile-title').value.trim() || firstMember.title,
        type: document.getElementById('profile-type').value.trim() || firstMember.type,
        qq: document.getElementById('profile-qq').value.trim() || firstMember.qq || '未填写',
        description: document.getElementById('profile-description').value.trim() || firstMember.description,
        avatar
      };
      appState.members[0] = updatedMember;
      saveState();
      renderMembers();
      renderProfilePage();
      profileForm.reset();
    });
  }

  const galleryForm = document.getElementById('gallery-form');
  if (galleryForm) {
    galleryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fileInput = document.getElementById('gallery-image');
      const titleInput = document.getElementById('gallery-title');
      const descInput = document.getElementById('gallery-description');
      const tagInput = document.getElementById('gallery-tag');
      const file = fileInput.files[0];
      let image = 'images/hero-banner.svg';
      if (file) {
        image = await readFileAsDataUrl(file);
      }
      appState.gallery.unshift({
        id: Date.now(),
        title: titleInput.value.trim() || '新照片',
        description: descInput.value.trim() || '更新内容',
        tag: tagInput.value.trim() || '日常',
        image
      });
      saveState();
      renderGallery();
      renderAdminPanel();
      galleryForm.reset();
    });
  }

  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const author = document.getElementById('post-author').value.trim();
      const content = document.getElementById('post-content').value.trim();
      const tag = document.getElementById('post-tag').value.trim() || '其他';
      if (!author || !content) return;
      const now = new Date();
      const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      appState.posts.unshift({ id: Date.now(), author, content, time, tag });
      saveState();
      renderFeed();
      renderHomeFeed();
      renderAdminPanel();
      postForm.reset();
    });
  }

  const statsForm = document.getElementById('stats-form');
  if (statsForm) {
    statsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const time = document.getElementById('stats-time').value.trim();
      const name = document.getElementById('stats-name').value.trim();
      const members = document.getElementById('stats-members').value.trim();
      const status = document.getElementById('stats-status').value.trim();
      const drop = document.getElementById('stats-drop').value.trim();
      if (!time || !name) return;
      appState.stats.unshift({ time, name, members, status, drop });
      saveState();
      renderStatsPage();
      renderAdminPanel();
      statsForm.reset();
    });
  }

  document.addEventListener('click', (event) => {
    const removeAnnouncement = event.target.getAttribute('data-remove-announcement');
    if (removeAnnouncement !== null) {
      appState.announcements.splice(Number(removeAnnouncement), 1);
      saveState();
      renderAnnouncementTicker();
      renderAdminPanel();
    }

    const removeMember = event.target.getAttribute('data-remove-member');
    if (removeMember !== null) {
      appState.members.splice(Number(removeMember), 1);
      saveState();
      renderMembers();
      renderAdminPanel();
    }

    const removeGallery = event.target.getAttribute('data-remove-gallery');
    if (removeGallery !== null) {
      appState.gallery.splice(Number(removeGallery), 1);
      saveState();
      renderGallery();
      renderAdminPanel();
    }

    const removePost = event.target.getAttribute('data-remove-post');
    if (removePost !== null) {
      appState.posts.splice(Number(removePost), 1);
      saveState();
      renderFeed();
      renderHomeFeed();
      renderAdminPanel();
    }

    const removeStat = event.target.getAttribute('data-remove-stat');
    if (removeStat !== null) {
      appState.stats.splice(Number(removeStat), 1);
      saveState();
      renderStatsPage();
      renderAdminPanel();
    }
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setupMobileNav() {
  const mobileNavToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }
}

function setupCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  if (slides.length && dots.length) {
    setInterval(() => showSlide(currentSlide + 1), 5000);
    dots.forEach((dot) => {
      dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide)));
    });
  }
}

function setupFilters() {
  const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));

  function applyFilters(activeFilter, items, dataAttribute) {
    items.forEach((item) => {
      const type = item.dataset[dataAttribute] || '';
      const status = item.dataset.status || '';
      const matches = activeFilter === 'all' || type === activeFilter || status === activeFilter;
      item.classList.toggle('is-hidden', !matches);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const activeFilter = button.dataset.filter || button.dataset.galleryFilter || 'all';
      const pedigreeNodes = Array.from(document.querySelectorAll('.tree-node'));
      const memberCards = Array.from(document.querySelectorAll('.member-card'));
      const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
      applyFilters(activeFilter, pedigreeNodes, 'type');
      applyFilters(activeFilter, memberCards, 'type');
      applyFilters(activeFilter, galleryCards, 'tag');
    });
  });
}

function setupTabs() {
  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabPanels.forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      const target = button.dataset.tab;
      const panel = document.querySelector(`[data-panel="${target}"]`);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });
}

function setupGalleryModal() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-card'));
  const modal = document.querySelector('[data-modal]');
  const modalImage = document.querySelector('[data-modal-image]');

  if (!modal || !modalImage) return;

  if (galleryItems.length) {
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modalImage.src = item.querySelector('img').src;
      });
    });
  }

  modal.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };
}

function setupDpsCalculator() {
  const calcForm = document.getElementById('calc-form');
  const calcResult = document.getElementById('calc-result');
  const barBase = document.getElementById('bar-base');
  const barFinal = document.getElementById('bar-final');

  if (calcForm && calcResult) {
    calcForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const attack = Number(document.getElementById('attack').value) || 0;
      const breakDef = Number(document.getElementById('break').value) || 0;
      const crit = Number(document.getElementById('crit').value) || 0;
      const eff = Number(document.getElementById('eff').value) || 0;
      const double = Number(document.getElementById('double').value) || 0;
      const skill = Number(document.getElementById('skill').value) || 0;

      const baseDps = attack * (1 + breakDef / 100) * (1 + crit / 100 + eff / 100);
      const finalDps = baseDps * skill * (1 + double / 100);

      calcResult.textContent = `${Math.round(finalDps).toLocaleString()} DPS`;
      if (barBase && barFinal) {
        barBase.style.width = `${Math.min(100, Math.round((baseDps / 40000) * 100))}%`;
        barFinal.style.width = `${Math.min(100, Math.round((finalDps / 40000) * 100))}%`;
      }
    });
  }
}

function setupMacroEditor() {
  const macroEditor = document.getElementById('macro-editor');
  const copyBtn = document.getElementById('copy-macro');
  const formatBtn = document.getElementById('format-macro');

  if (copyBtn && macroEditor) {
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(macroEditor.value);
      copyBtn.textContent = '已复制';
      setTimeout(() => {
        copyBtn.textContent = '一键复制';
      }, 1200);
    });
  }

  if (formatBtn && macroEditor) {
    formatBtn.addEventListener('click', () => {
      const lines = macroEditor.value.split('\n').filter(Boolean).map((line) => line.trim());
      macroEditor.value = lines.join('\n');
    });
  }
}

function bindHomeRankForm() {
  const form = document.getElementById('home-rank-form');
  const input = document.getElementById('home-rank-input');
  if (!form || !input) return;
  input.value = appState.rankList.join('\n');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    appState.rankList = input.value.split('\n').map((line) => line.trim()).filter(Boolean);
    saveState();
    renderHomeRank();
  });
}

function initApp() {
  setupMobileNav();
  setupCarousel();
  setupTabs();
  setupDpsCalculator();
  setupMacroEditor();
  renderAnnouncementTicker();
  renderHomeFeed();
  renderHomeRank();
  renderMembers();
  renderGallery();
  renderFeed();
  renderStatsPage();
  renderProfilePage();
  renderAdminPanel();
  setupFilters();
  setupGalleryModal();
  bindAdminForms();
  bindHomeRankForm();
}

initApp();
