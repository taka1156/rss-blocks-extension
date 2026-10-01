const DEFAULTS = [
  'https://zenn.dev/feed',
  'https://qiita.com/popular-items/feed.atom',
  'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
];
const MAX_ITEMS = 15;
const input = document.getElementById('urlInput');
const groupsEl = document.getElementById('groups');
const ungroupedGrid = document.getElementById('ungroupedGrid');
const thumbToggle = document.getElementById('thumbToggle');
const feedForm = document.getElementById('feedForm');
const addPanel = document.getElementById('addPanel');
const addPanelToggle = document.getElementById('addPanelToggle');
const addPanelClose = document.getElementById('addPanelClose');
const settingsPanel = document.getElementById('settingsPanel');
const settingsToggle = document.getElementById('settingsToggle');
const settingsClose = document.getElementById('settingsClose');
const importSettingsInput = document.getElementById('importSettings');
const feedTab = document.getElementById('feedTab');
const shortcutTab = document.getElementById('shortcutTab');
const shortcutForm = document.getElementById('shortcutForm');
const shortcutUrlInput = document.getElementById('shortcutUrl');
const shortcutList = document.getElementById('shortcutList');
let drag = null;
let sideOpen = true;
let shortcuts = [];
const $ = (id) => document.getElementById(id);
const pane = $('pane'),
  player = $('player'),
  frame = $('articleFrame');
let articleUrl = '';
let activeArticleTarget = null;

const paneResizeHandle = $('paneResizeHandle');
let paneWidth = Math.max(380, window.innerWidth * 0.42);
let activeAudioTarget = null;
function setPaneWidth(width) {
  const minWidth = Math.min(280, window.innerWidth * 0.25);
  const maxWidth = window.innerWidth * 0.8;
  paneWidth = Math.round(Math.max(minWidth, Math.min(maxWidth, width)));
  document.documentElement.style.setProperty('--pane-width', `${paneWidth}px`);
  paneResizeHandle.setAttribute('aria-valuemin', Math.round(minWidth));
  paneResizeHandle.setAttribute('aria-valuemax', Math.round(maxWidth));
  paneResizeHandle.setAttribute('aria-valuenow', paneWidth);
}
setPaneWidth(paneWidth);
window.addEventListener('resize', () => setPaneWidth(paneWidth));
function setAudioPlaying(playing) {
  if (!activeAudioTarget) return;
  const { block, item, button } = activeAudioTarget;
  block.classList.toggle('playing', playing);
  item.classList.toggle('audio-playing', playing);
  button.classList.toggle('playing', playing);
  button.textContent = '▶';
  button.title = playing ? '再生中' : '再生';
  button.setAttribute('aria-label', button.title);
}
player.addEventListener('play', () => setAudioPlaying(true));
player.addEventListener('pause', () => {
  if (player.paused) setAudioPlaying(false);
});
player.addEventListener('ended', () => {
  if (!player.ended) return;
  setAudioPlaying(false);
  activeAudioTarget = null;
});
paneResizeHandle.addEventListener('pointerdown', (event) => {
  paneResizeHandle.setPointerCapture(event.pointerId);
  setPaneWidth(window.innerWidth - event.clientX);
});
paneResizeHandle.addEventListener('pointermove', (event) => {
  if (paneResizeHandle.hasPointerCapture(event.pointerId)) {
    setPaneWidth(window.innerWidth - event.clientX);
  }
});
paneResizeHandle.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  const currentWidth = pane.getBoundingClientRect().width;
  setPaneWidth(currentWidth + (event.key === 'ArrowLeft' ? 16 : -16));
});

const updatePane = () =>
  document.body.classList.toggle(
    'pane-open',
    pane.classList.contains('has-article') ||
      pane.classList.contains('has-audio'),
  );
function setArticleTarget(target) {
  activeArticleTarget?.block.classList.remove('reading');
  activeArticleTarget?.item.classList.remove('article-reading');
  if (activeArticleTarget) activeArticleTarget.label.hidden = true;
  activeArticleTarget = target;
  activeArticleTarget?.block.classList.add('reading');
  activeArticleTarget?.item.classList.add('article-reading');
  if (activeArticleTarget) activeArticleTarget.label.hidden = false;
}

function openArticle(url, title, target) {
  setArticleTarget(target);
  articleUrl = url;
  frame.src = url;
  $('articleTitle').textContent = title || url;
  pane.classList.add('has-article');
  updatePane();
}

function closeArticle() {
  setArticleTarget(null);
  frame.src = 'about:blank';
  pane.classList.remove('has-article');
  updatePane();
}

function playAudio(url, title, target) {
  setAudioPlaying(false);
  activeAudioTarget = target;
  player.pause();
  player.src = url;
  $('audioTitle').textContent = title;
  pane.classList.add('has-audio');
  updatePane();
  player.play().catch(() => {});
}

function closeAudio() {
  setAudioPlaying(false);
  activeAudioTarget = null;
  player.pause();
  player.removeAttribute('src');
  player.load();
  pane.classList.remove('has-audio');
  updatePane();
}

function bindLink(a, it, target) {
  a.href = it.link;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.addEventListener('click', (e) => {
    if (!sideOpen || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey)
      return;
    e.preventDefault();
    openArticle(it.link, it.title, target);
  });
} // { kind: "feed" | "group", el }

const normFeed = (f) =>
  typeof f === 'string'
    ? { url: f, title: '', color: '', group: '' }
    : { title: '', color: '', group: '', ...f };

// DOMを正として保存（並び順・所属グループもDOMから取得）
async function persist() {
  const feeds = [];
  for (const grid of document.querySelectorAll('.grid')) {
    for (const b of grid.querySelectorAll(':scope > .block')) {
      b._feed.group = grid.dataset.group || '';
      feeds.push({ ...b._feed });
    }
  }
  const groups = [...groupsEl.querySelectorAll(':scope > .group')].map(
    (g) => g._group,
  );
  try {
    await chrome.storage.sync.set({ feeds, groups });
  } catch (e) {
    alert(`保存できませんでした: ${e.message}`);
  }
}

function renderShortcuts(items) {
  shortcuts = items;
  shortcutList.replaceChildren();
  for (const shortcut of shortcuts) {
    let url;
    try {
      url = new URL(shortcut.url);
    } catch {
      continue;
    }
    const entry = document.createElement('div');
    entry.className = 'shortcut-entry';
    const link = document.createElement('a');
    link.className = 'shortcut-link';
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = url.href;
    const icon = document.createElement('img');
    icon.className = 'shortcut-icon';
    icon.alt = '';
    icon.src = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url.href)}&sz=64`;
    const fallback = document.createElement('span');
    fallback.className = 'shortcut-fallback';
    fallback.textContent = url.hostname.replace(/^www\./, '').charAt(0).toUpperCase();
    fallback.hidden = true;
    icon.addEventListener('error', () => {
      icon.hidden = true;
      fallback.hidden = false;
    });
    const label = document.createElement('span');
    label.textContent = url.hostname.replace(/^www\./, '');
    link.append(icon, fallback, label);
    const remove = document.createElement('button');
    remove.className = 'icon remove shortcut-remove';
    remove.type = 'button';
    remove.title = `${label.textContent} を削除`;
    remove.setAttribute('aria-label', `${label.textContent} を削除`);
    remove.textContent = '×';
    remove.addEventListener('click', async () => {
      const next = shortcuts.filter((item) => item.url !== shortcut.url);
      try {
        await chrome.storage.sync.set({ shortcuts: next });
        renderShortcuts(next);
      } catch (error) {
        alert(`保存できませんでした: ${error.message}`);
      }
    });
    entry.append(link, remove);
    shortcutList.append(entry);
  }
}

async function addShortcut(event) {
  event.preventDefault();
  let url;
  try {
    url = new URL(shortcutUrlInput.value.trim());
  } catch {
    return alert('URLの形式が正しくありません');
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    return alert('httpまたはhttpsのURLを入力してください');
  }
  if (shortcuts.some((shortcut) => shortcut.url === url.href)) {
    return alert('このURLは既に登録されています');
  }
  const next = [...shortcuts, { url: url.href }];
  try {
    await chrome.storage.sync.set({ shortcuts: next });
    renderShortcuts(next);
    shortcutForm.reset();
    return true;
  } catch (error) {
    alert(`保存できませんでした: ${error.message}`);
  }
}

async function exportSettings() {
  const { feeds, groups = [], shortcuts: savedShortcuts = [] } =
    await chrome.storage.sync.get(['feeds', 'groups', 'shortcuts']);
  const data = {
    version: 1,
    shortcuts: savedShortcuts,
    groups,
    feeds: (feeds ?? DEFAULTS).map((feed) => {
      const normalized = normFeed(feed);
      return {
        url: normalized.url,
        title: normalized.title,
        color: normalized.color,
        group: normalized.group,
      };
    }),
  };
  const blobUrl = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'rss-blocks-settings.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

function validateSettings(data) {
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.shortcuts) ||
    !Array.isArray(data.groups) ||
    !Array.isArray(data.feeds)
  ) {
    throw new Error('設定ファイルの形式が正しくありません');
  }
  const validWebUrl = (value) => {
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  };
  if (
    data.shortcuts.some((shortcut) => !validWebUrl(shortcut?.url)) ||
    data.groups.some(
      (group) =>
        typeof group?.id !== 'string' ||
        typeof group.title !== 'string' ||
        typeof group.color !== 'string' ||
        typeof group.collapsed !== 'boolean',
    ) ||
    data.feeds.some(
      (feed) =>
        !validWebUrl(feed?.url) ||
        typeof feed.title !== 'string' ||
        typeof feed.color !== 'string' ||
        typeof feed.group !== 'string',
    )
  ) {
    throw new Error('設定に不正なURLまたはデータがあります');
  }
  return {
    shortcuts: data.shortcuts.map(({ url }) => ({ url })),
    groups: data.groups.map(({ id, title, color, collapsed }) => ({
      id,
      title,
      color,
      collapsed,
    })),
    feeds: data.feeds.map(({ url, title, color, group }) => ({
      url,
      title,
      color,
      group,
    })),
  };
}

async function importSettings(file) {
  try {
    const settings = validateSettings(JSON.parse(await file.text()));
    if (!confirm('ショートカット、グループ、フィードの設定を置き換えます。'))
      return;
    await chrome.storage.sync.set(settings);
    await render();
    settingsPanel.close();
  } catch (error) {
    alert(`インポートできませんでした: ${error.message}`);
  } finally {
    importSettingsInput.value = '';
  }
}

/* ---------- フィード解析 ---------- */
const text = (el, sel) => el.querySelector(sel)?.textContent.trim() ?? '';

function findThumb(n, base) {
  const attr = (tag, a) => n.getElementsByTagName(tag)[0]?.getAttribute(a);
  let u = attr('media:thumbnail', 'url') || attr('itunes:image', 'href');
  if (!u) {
    const mc = n.getElementsByTagName('media:content')[0];
    const type = mc?.getAttribute('type') || mc?.getAttribute('medium') || '';
    if (mc && !type.startsWith('video')) u = mc.getAttribute('url');
  }
  if (!u) {
    for (const e of n.querySelectorAll("enclosure, link[rel='enclosure']")) {
      if ((e.getAttribute('type') || '').startsWith('image')) {
        u = e.getAttribute('url') || e.getAttribute('href');
        break;
      }
    }
  }
  if (!u) {
    for (const tag of [
      'content:encoded',
      'description',
      'content',
      'summary',
    ]) {
      const m = (n.getElementsByTagName(tag)[0]?.textContent || '').match(
        /<img[^>]+src=["']([^"']+)["']/i,
      );
      if (m) {
        u = m[1];
        break;
      }
    }
  }
  if (!u) return '';
  try {
    return new URL(u, base).href;
  } catch {
    return '';
  }
}

function findAudio(n, base) {
  const isAudio = (type, url) =>
    type.startsWith('audio') || /\.(mp3|m4a|aac|ogg|oga|wav)(\?|$)/i.test(url);
  const cands = [
    ...n.querySelectorAll("enclosure, link[rel='enclosure']"),
    ...n.getElementsByTagName('media:content'),
  ];
  for (const e of cands) {
    const url = e.getAttribute('url') || e.getAttribute('href') || '';
    if (url && isAudio(e.getAttribute('type') || '', url)) {
      try {
        return new URL(url, base).href;
      } catch {}
    }
  }
  return '';
}

function parseFeed(xml, base) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('XMLを解析できません');
  const title =
    text(doc, 'channel > title') || text(doc, 'feed > title') || '(無題)';
  const resolve = (u) => {
    try {
      return u ? new URL(u, base).href : '';
    } catch {
      return '';
    }
  };
  const root =
    doc.querySelector('channel') ||
    doc.querySelector('feed') ||
    doc.documentElement;
  const direct = (name) => [...root.children].find((c) => c.tagName === name);
  const channelImage = resolve(
    text(doc, 'channel > image > url') ||
      direct('itunes:image')?.getAttribute('href') ||
      direct('media:thumbnail')?.getAttribute('url') ||
      text(doc, 'feed > logo') ||
      text(doc, 'feed > icon'),
  );
  const items = [...doc.querySelectorAll('item, entry')]
    .slice(0, MAX_ITEMS)
    .map((n) => {
      const linkEl = n.querySelector('link');
      const link =
        linkEl?.getAttribute('href') || linkEl?.textContent.trim() || '';
      const date =
        text(n, 'pubDate') || text(n, 'published') || text(n, 'updated');
      return {
        title: text(n, 'title') || link,
        link,
        date,
        thumb: findThumb(n, base) || channelImage,
        audio: findAudio(n, base),
      };
    });
  return { title, items };
}

function fmtDate(s) {
  const d = new Date(s);
  return isNaN(d)
    ? ''
    : d.toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' });
}

/* ---------- 共通：編集フォームの色操作 ---------- */
function bindColorForm(form, target, current, onApply) {
  let cleared = !current.color;
  form.color.value = current.color || '#2563eb';
  form.color.addEventListener('input', () => {
    cleared = false;
    target.style.setProperty(
      target.classList.contains('group') ? '--gc' : 'border-color',
      form.color.value,
    );
  });
  form.querySelector('.reset-color').addEventListener('click', () => {
    cleared = true;
    target.style.removeProperty(
      target.classList.contains('group') ? '--gc' : 'border-color',
    );
  });
  form.querySelector('.cancel').addEventListener('click', () => {
    form.hidden = true;
    onApply(null);
  });
  return () => (cleared ? '' : form.color.value);
}

const colorFields = `
  <label>枠線の色
    <span class="color-row">
      <input name="color" type="color">
      <button type="button" class="sub reset-color">標準に戻す</button>
    </span>
  </label>
  <div class="form-btns">
    <button type="submit">保存</button>
    <button type="button" class="sub cancel">キャンセル</button>
  </div>`;

/* ---------- フィードブロック ---------- */
function createBlock(feed) {
  const block = document.createElement('section');
  block.className = 'block';
  block._feed = feed;
  if (feed.color) block.style.borderColor = feed.color;

  block.innerHTML = `
    <div class="block-head">
      <span class="handle" title="ドラッグして移動">⠿</span>
      <h2><span></span><small></small></h2>
      <div class="actions">
        <button class="icon edit" title="編集">✎</button>
        <button class="icon remove" title="削除">×</button>
      </div>
    </div>
    <form class="edit-form" hidden>
      <label>タイトル<input name="title" placeholder="空欄ならフィードのタイトルを使用"></label>
      <label>URL<input name="url" type="url" required></label>
      ${colorFields}
    </form>
    <div class="status">読み込み中…</div>`;

  const nameEl = block.querySelector('h2 span');
  nameEl.textContent = feed.title || feed.url;
  block.querySelector('h2 small').textContent = feed.url;

  block.querySelector('.remove').addEventListener('click', () => {
    block.remove();
    persist();
  });

  const form = block.querySelector('.edit-form');
  const getColor = bindColorForm(form, block, feed, (x) => {
    if (x === null) block.style.borderColor = feed.color || '';
  });
  block.querySelector('.edit').addEventListener('click', () => {
    form.title.value = feed.title;
    form.url.value = feed.url;
    form.hidden = !form.hidden;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = form.url.value.trim();
    const dup = [...document.querySelectorAll('.block')].some(
      (b) => b !== block && b._feed.url === url,
    );
    if (dup) return alert('そのURLは既に登録されています');
    const nb = createBlock({
      ...feed,
      url,
      title: form.title.value.trim(),
      color: getColor(),
    });
    block.replaceWith(nb);
    persist();
  });

  // ドラッグ（ハンドルを掴んだときだけ有効）
  const handle = block.querySelector('.handle');
  handle.addEventListener('mousedown', () => (block.draggable = true));
  handle.addEventListener('mouseup', () => (block.draggable = false));
  block.addEventListener('dragstart', (e) => {
    if (!block.draggable) return;
    e.stopPropagation();
    drag = { kind: 'feed', el: block };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', feed.url);
    e.dataTransfer.setDragImage(block.querySelector('.block-head'), 20, 16);
    requestAnimationFrame(() => block.classList.add('dragging'));
  });
  block.addEventListener('dragend', endDrag(block));

  loadItems(block, feed, nameEl);
  return block;
}

async function loadItems(block, feed, nameEl) {
  const status = block.querySelector('.status');
  try {
    const res = await fetch(feed.url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { title, items } = parseFeed(await res.text(), feed.url);
    if (!feed.title) nameEl.textContent = title;
    const ul = document.createElement('ul');
    for (const it of items) {
      const li = document.createElement('li');
      const articleTarget = { block, item: li };
      if (it.thumb) {
        const ta = document.createElement('a');
        ta.className = 'thumb-link';
        bindLink(ta, it, articleTarget);
        const img = new Image();
        img.className = 'thumb';
        img.alt = '';
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => ta.remove());
        img.src = it.thumb;
        ta.append(img);
        li.append(ta);
      }
      const body = document.createElement('div');
      body.className = 'item-body';
      const readingLabel = document.createElement('span');
      readingLabel.className = 'article-reading-label';
      readingLabel.textContent = '閲覧中';
      readingLabel.hidden = true;
      const a = document.createElement('a');
      a.textContent = it.title;
      articleTarget.label = readingLabel;
      bindLink(a, it, articleTarget);
      const time = document.createElement('time');
      time.textContent = fmtDate(it.date);
      body.append(a, readingLabel, time);
      if (it.audio) {
        const pb = document.createElement('button');
        pb.className = 'play';
        pb.textContent = '▶';
        pb.title = '再生';
        pb.setAttribute('aria-label', '再生');
        pb.addEventListener('click', () =>
          playAudio(it.audio, it.title, { block, item: li, button: pb }),
        );
        body.append(pb);
      }
      li.append(body);
      ul.append(li);
    }
    status.replaceWith(ul);
  } catch (e) {
    status.textContent = `取得失敗: ${e.message}`;
    status.classList.add('error');
  }
}

/* ---------- グループ ---------- */
function createGroup(group, openEdit = false) {
  const el = document.createElement('section');
  el.className = 'group';
  el._group = group;
  el.innerHTML = `
    <div class="group-head">
      <span class="handle" title="ドラッグして並べ替え">⠿</span>
      <button class="icon toggle" title="開閉"></button>
      <h2 class="gtitle"></h2>
      <div class="actions">
        <button class="icon edit" title="編集">✎</button>
        <button class="icon remove" title="グループを削除（中のブロックは残ります）">×</button>
      </div>
    </div>
    <form class="edit-form" hidden>
      <label>グループ名<input name="title" required></label>
      ${colorFields}
    </form>
    <div class="grid" data-group="${group.id}"></div>`;

  const apply = () => {
    if (group.color) el.style.setProperty('--gc', group.color);
    else el.style.removeProperty('--gc');
    el.classList.toggle('collapsed', !!group.collapsed);
    el.querySelector('.toggle').textContent = group.collapsed ? '▸' : '▾';
    el.querySelector('.gtitle').textContent = group.title || '(無題のグループ)';
  };
  apply();

  el.querySelector('.toggle').addEventListener('click', () => {
    group.collapsed = !group.collapsed;
    apply();
    persist();
  });
  el.querySelector('.remove').addEventListener('click', () => {
    if (
      !confirm('グループを削除します（中のブロックはグループ外に残ります）。')
    )
      return;
    ungroupedGrid.append(...el.querySelectorAll(':scope > .grid > .block'));
    el.remove();
    persist();
  });

  const form = el.querySelector('.edit-form');
  const getColor = bindColorForm(form, el, group, (x) => {
    if (x === null) apply();
  });
  el.querySelector('.edit').addEventListener('click', () => {
    form.title.value = group.title;
    form.hidden = !form.hidden;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    group.title = form.title.value.trim();
    group.color = getColor();
    apply();
    form.hidden = true;
    persist();
  });
  if (openEdit) {
    form.title.value = group.title;
    form.hidden = false;
  }

  const handle = el.querySelector('.handle');
  handle.addEventListener('mousedown', () => (el.draggable = true));
  handle.addEventListener('mouseup', () => (el.draggable = false));
  el.addEventListener('dragstart', (e) => {
    if (!el.draggable) return;
    drag = { kind: 'group', el };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', group.id);
    e.dataTransfer.setDragImage(el.querySelector('.group-head'), 20, 16);
    requestAnimationFrame(() => el.classList.add('dragging'));
  });
  el.addEventListener('dragend', endDrag(el));
  return el;
}

/* ---------- ドラッグ&ドロップ ---------- */
function endDrag(el) {
  return () => {
    el.draggable = false;
    el.classList.remove('dragging');
    document
      .querySelectorAll('.grid.over')
      .forEach((g) => g.classList.remove('over'));
    drag = null;
    persist();
  };
}

document.addEventListener('dragover', (e) => {
  if (!drag) return;
  if (drag.kind === 'feed') {
    const zone = e.target.closest?.('.grid');
    if (!zone) return;
    e.preventDefault();
    document
      .querySelectorAll('.grid.over')
      .forEach((g) => g !== zone && g.classList.remove('over'));
    zone.classList.add('over');
    const over = e.target.closest('.block');
    if (over && over !== drag.el && over.parentNode === zone) {
      const r = over.getBoundingClientRect();
      zone.insertBefore(
        drag.el,
        e.clientX < r.left + r.width / 2 ? over : over.nextSibling,
      );
    } else if (e.target === zone) {
      const others = [...zone.querySelectorAll(':scope > .block')].filter(
        (b) => b !== drag.el,
      );
      const last = others[others.length - 1];
      if (!last) zone.appendChild(drag.el);
      else {
        const r = last.getBoundingClientRect();
        if (e.clientY > r.bottom || (e.clientY > r.top && e.clientX > r.right))
          zone.appendChild(drag.el);
      }
    }
  } else {
    if (!groupsEl.contains(e.target)) return;
    e.preventDefault();
    const over = e.target.closest('.group');
    if (over && over !== drag.el) {
      const r = over.getBoundingClientRect();
      const sameRow =
        Math.abs(drag.el.getBoundingClientRect().top - r.top) < 40;
      const before = sameRow
        ? e.clientX < r.left + r.width / 2
        : e.clientY < r.top + r.height / 2;
      groupsEl.insertBefore(drag.el, before ? over : over.nextSibling);
    }
  }
});
document.addEventListener('drop', (e) => drag && e.preventDefault());

/* ---------- 初期化・操作 ---------- */
async function render() {
  const {
    feeds,
    groups,
    shortcuts: savedShortcuts,
    thumbs,
    sideOpen: side,
  } = await chrome.storage.sync.get([
    'feeds',
    'groups',
    'shortcuts',
    'thumbs',
    'sideOpen',
  ]);
  sideOpen = side !== false;
  $('sideToggle').checked = sideOpen;
  thumbToggle.checked = thumbs !== false;
  document.body.classList.toggle('no-thumbs', thumbs === false);
  groupsEl.replaceChildren();
  ungroupedGrid.replaceChildren();
  renderShortcuts(savedShortcuts ?? []);
  const gridById = new Map();
  for (const g of groups ?? []) {
    const el = createGroup(g);
    groupsEl.append(el);
    gridById.set(g.id, el.querySelector('.grid'));
  }
  for (const f of (feeds ?? DEFAULTS).map(normFeed)) {
    (gridById.get(f.group) || ungroupedGrid).append(createBlock(f));
  }
}

function addFeed() {
  const url = input.value.trim();
  if (!url) return;
  try {
    new URL(url);
  } catch {
    return alert('URLの形式が正しくありません');
  }
  const dup = [...document.querySelectorAll('.block')].find(
    (b) => b._feed.url === url,
  );
  if (dup) {
    dup.scrollIntoView({ behavior: 'smooth', block: 'center' });
    dup.classList.add('flash');
    setTimeout(() => dup.classList.remove('flash'), 1500);
    return alert('そのURLは既に登録されています');
  }
  ungroupedGrid.append(createBlock({ url, title: '', color: '', group: '' }));
  input.value = '';
  persist();
  return true;
}

function selectAddTab(tab) {
  const showFeed = tab === feedTab;
  feedTab.setAttribute('aria-selected', showFeed);
  shortcutTab.setAttribute('aria-selected', !showFeed);
  feedTab.tabIndex = showFeed ? 0 : -1;
  shortcutTab.tabIndex = showFeed ? -1 : 0;
  document.getElementById('feedPanel').hidden = !showFeed;
  document.getElementById('shortcutPanel').hidden = showFeed;
}

addPanelToggle.addEventListener('click', () => {
  addPanel.showModal();
  addPanelToggle.setAttribute('aria-expanded', 'true');
  (feedTab.getAttribute('aria-selected') === 'true' ? input : shortcutUrlInput).focus();
});
addPanelClose.addEventListener('click', () => addPanel.close());
addPanel.addEventListener('close', () => addPanelToggle.setAttribute('aria-expanded', 'false'));
addPanel.addEventListener('click', (event) => {
  if (event.target === addPanel) addPanel.close();
});
settingsToggle.addEventListener('click', () => settingsPanel.showModal());
settingsClose.addEventListener('click', () => settingsPanel.close());
settingsPanel.addEventListener('click', (event) => {
  if (event.target === settingsPanel) settingsPanel.close();
});
document.getElementById('exportSettings').addEventListener('click', () => {
  exportSettings().catch((error) =>
    alert(`エクスポートできませんでした: ${error.message}`),
  );
});
importSettingsInput.addEventListener('change', () => {
  const [file] = importSettingsInput.files;
  if (file) importSettings(file);
});
feedTab.addEventListener('click', () => selectAddTab(feedTab));
shortcutTab.addEventListener('click', () => selectAddTab(shortcutTab));
for (const tab of [feedTab, shortcutTab]) {
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextTab = event.key === 'Home'
      ? feedTab
      : event.key === 'End'
        ? shortcutTab
        : tab === feedTab
          ? shortcutTab
          : feedTab;
    selectAddTab(nextTab);
    nextTab.focus();
  });
}
feedForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (addFeed()) addPanel.close();
});
shortcutForm.addEventListener('submit', async (event) => {
  if (await addShortcut(event)) addPanel.close();
});
document.getElementById('refreshBtn').addEventListener('click', render);
document.getElementById('addGroupBtn').addEventListener('click', () => {
  const g = {
    id: Date.now().toString(36),
    title: '新しいグループ',
    color: '',
    collapsed: false,
  };
  groupsEl.append(createGroup(g, true));
  persist();
});
thumbToggle.addEventListener('change', () => {
  document.body.classList.toggle('no-thumbs', !thumbToggle.checked);
  chrome.storage.sync.set({ thumbs: thumbToggle.checked });
});
$('sideToggle').addEventListener('change', () => {
  sideOpen = $('sideToggle').checked;
  chrome.storage.sync.set({ sideOpen });
});
$('articleClose').addEventListener('click', closeArticle);
$('articleOpen').addEventListener(
  'click',
  () => articleUrl && window.open(articleUrl, '_blank', 'noopener'),
);
$('audioClose').addEventListener('click', closeAudio);
render();
