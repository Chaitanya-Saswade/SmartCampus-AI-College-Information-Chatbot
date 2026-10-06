const icons = {
    mark: '<svg viewBox="0 0 24 24"><path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z"/><path d="M6.5 12v4.2c3.5 2.5 7.5 2.5 11 0V12M21 10v6"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.6-.8L4 20l1.2-3.5A7.2 7.2 0 0 1 4 12c0-4.2 3.6-7.5 8-7.5s8 2.8 8 7Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>',
    history: '<svg viewBox="0 0 24 24"><path d="M3.5 12a8.5 8.5 0 1 0 2.4-5.9L3.5 8.5"/><path d="M3.5 4.5v4h4M12 7.5V12l3 2"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M4 19.5V11M10 19.5V5M16 19.5v-7M22 19.5H2"/></svg>',
    users: '<svg viewBox="0 0 24 24"><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 4a3.5 3.5 0 0 1 0 6.8M21 20v-1.5a4 4 0 0 0-3-3.9"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Z"/><path d="M10.3 13.7 21 3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></svg>',
    notice: '<svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    logout: '<svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l-.8 5Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 13h11l1-13M9 7V4h6v3"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    cap: '<svg viewBox="0 0 24 24"><path d="m2 9 10-6 10 6-10 6L2 9Z"/><path d="M6 11.5V17c3.8 2.6 8.2 2.6 12 0v-5.5M22 9v7"/></svg>',
};
const icon = (name) => `<span class="icon" aria-hidden="true">${icons[name] || icons.grid}</span>`;
const state = {
    user: null,
    page: 'overview',
    authMode: 'login',
    boot: null,
    chat: [],
    guide: 'Admissions',
    collection: 'faqs',
    adminStats: null,
    adminQuestions: [],
    students: [],
    records: [],
    modal: null,
    loading: false
};
const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
let toastTimer;

const esc = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const nice = (value = '') => String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const initials = (name = '') => name.split(/\s+/).map((part) => part[0] || '').slice(0, 2).join('').toUpperCase();
const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
const formatTime = (value) => value ? new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

async function api(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers: {...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
}

function showToast(message, error = false) {
    toast.textContent = message;
    toast.classList.toggle('error', error);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2700);
}

function setPage(page) {
    state.page = page;
    state.modal = null;
    render();
    if (page === 'chat') loadChat();
    if (page === 'guide') loadGuide();
    if (page === 'manager') loadRecords();
    if (page === 'admin' || page === 'activity') loadAdmin();
}

function renderAuth() {
    const register = state.authMode === 'register';
    app.innerHTML = `<main class="auth-layout">
    <section class="auth-aside"><div class="brand"><span class="brand-mark">${icons.mark}</span><span>SmartCampus</span></div>
      <div class="auth-copy"><span class="eyebrow">Your campus, in the know</span><h1 class="serif">College life,<br>made clearer.</h1><p>Find the answers you need, meet your next opportunity, and make every day on campus count.</p></div>
      <div class="auth-foot"><span class="live-dot"></span> Student support, whenever you need it</div></section>
    <section class="auth-panel"><div class="auth-card">
      <span class="eyebrow">${register ? 'Get started' : 'Welcome back'}</span>
      <h2>${register ? 'Create your account' : 'Sign in to campus'}</h2>
      <p>${register ? 'Join your campus community and get answers in a few seconds.' : 'Your campus information and student assistant, all in one place.'}</p>
      <form id="auth-form">
        ${register ? `<div class="field"><label for="auth-name">Full name</label><input id="auth-name" name="name" autocomplete="name" placeholder="e.g. Ananya Rao" required></div>` : ''}
        <div class="field"><label for="auth-email">College email</label><input id="auth-email" name="email" type="email" autocomplete="email" placeholder="you@smartcampus.edu" required></div>
        <div class="field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="${register ? '8' : '1'}" autocomplete="${register ? 'new-password' : 'current-password'}" placeholder="${register ? 'At least 8 characters' : 'Enter your password'}" required></div>
        <p class="form-error" id="auth-error"></p>
        <button class="button button-primary" style="width:100%" type="submit">${register ? 'Create student account' : 'Sign in'} ${icon('arrow')}</button>
      </form>
      <div class="auth-switch">${register ? 'Already have an account?' : 'New to SmartCampus?'} <button class="text-button" data-action="auth-switch">${register ? 'Sign in' : 'Create account'}</button></div>
      ${register ? '' : `<div class="demo-box"><div class="demo-head"><span>Demo access</span><span class="pill">Ready to explore</span></div>
        <div class="demo-choice"><span>Student</span><code>student@smartcampus.edu</code><button class="text-button" data-demo="student">Use</button></div>
        <div class="demo-choice"><span>Administrator</span><code>admin@smartcampus.edu</code><button class="text-button" data-demo="admin">Use</button></div>
      </div>`}
    </div></section>
  </main>`;
}

const studentNav = [['overview', 'Overview', 'grid'], ['chat', 'Ask SmartCampus', 'chat'], ['history', 'Chat history', 'history'], ['guide', 'College guide', 'book']];
const adminNav = [['admin', 'Admin overview', 'chart'], ['manager', 'Content manager', 'book'], ['activity', 'Students & activity', 'users']];
const pageNames = { overview: 'Overview', chat: 'Ask SmartCampus', history: 'Chat history', guide: 'College guide', admin: 'Admin overview', manager: 'Content manager', activity: 'Students & activity' };

function navButton([page, label, symbol]) {
  return `<button class="nav-item ${state.page === page ? 'active' : ''}" data-page="${page}">${icon(symbol)}<span>${label}</span></button>`;
}
function renderShell() {
  const admin = state.user.role === 'admin';
  app.innerHTML = `<div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand"><span class="brand-mark">${icons.mark}</span><span>SmartCampus</span></div>
      <div class="nav-label">Student space</div><nav class="nav-list">${studentNav.map(navButton).join('')}</nav>
      ${admin ? `<div class="nav-label">Administration</div><nav class="nav-list">${adminNav.map(navButton).join('')}</nav>` : ''}
      <div class="sidebar-spacer"></div>
      <div class="sidebar-note"><strong>Need a quick answer?</strong><p>Ask about admissions, fees, exams, student life and more.</p></div>
      <div class="user-block"><div class="avatar">${esc(initials(state.user.name))}</div><div class="user-meta"><strong>${esc(state.user.name)}</strong><span>${admin ? 'Campus administrator' : 'Student account'}</span></div><button class="logout-button" title="Sign out" aria-label="Sign out" data-action="logout">${icon('logout')}</button></div>
    </aside>
    <div class="main-column">
      <header class="topbar"><div style="display:flex;align-items:center;gap:13px"><button class="icon-button mobile-menu" data-action="menu" aria-label="Open navigation">${icon('menu')}</button><div class="breadcrumb">SmartCampus <strong>${esc(pageNames[state.page] || 'Overview')}</strong></div></div>
        <div class="topbar-right"><span class="today">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span><button class="icon-button" title="Campus updates" aria-label="Campus updates" data-page="overview">${icon('notice')}</button></div>
      </header><main class="main-content" id="main-content">${renderCurrentPage()}</main>
    </div>
  </div>${state.modal ? renderModal() : ''}`;
}

function heading(eyebrow, title, description, action = '') {
  return `<div class="page-heading"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${title}</h1><p>${description}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ''}</div>`;
}
function statCard(label, value, symbol, note = '') {
  return `<div class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon(symbol)}</span></div><strong>${value}</strong>${note ? `<span class="muted" style="font-size:9px">${note}</span>` : ''}</div>`;
}
function renderOverview() {
  const boot = state.boot || {};
  const announcements = boot.announcements || [];
  const recent = boot.recent_questions || [];
  const quick = [['Admissions', 'How do I apply?'], ['Courses', 'Which engineering courses do you offer?'], ['Fees', 'What is the Computer Engineering fee?'], ['Examinations', 'When are semester exams?'], ['Scholarships', 'What scholarships are available?'], ['Placements', 'Tell me about placements.']];
  return `${heading('Student dashboard', `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${esc(state.user.name.split(' ')[0])}`, 'A clearer view of campus life starts here.')}
    <section class="welcome-banner"><div class="welcome-copy"><span class="eyebrow">Your campus companion</span><h2>Make campus work for you.</h2><p>Get a quick, reliable answer on courses, fees, exams and the things that make student life easier.</p></div><div class="welcome-art" aria-hidden="true"><span class="art-sun"></span><span class="art-book">${icons.book}</span></div></section>
    <section class="stat-grid">${statCard('Questions asked', boot.question_count ?? 0, 'chat', 'Your conversation history')}${statCard('Information topics', (boot.categories || []).length, 'book', 'One place to find answers')}${statCard('Campus updates', announcements.length, 'notice', 'Latest announcements')}${statCard('Student community', boot.student_count ?? '—', 'users', 'Registered on SmartCampus')}</section>
    <div class="dashboard-grid"><section><div class="surface ask-panel"><h2>What would you like to know?</h2><p>Ask in your own words. Your campus assistant is ready.</p><form class="ask-form" data-form="quick-ask"><input name="question" placeholder="Ask about courses, exams, campus life…" aria-label="Ask a question"><button title="Ask SmartCampus" aria-label="Ask SmartCampus">${icon('send')}</button></form></div>
      <div class="section-head"><h2>Popular questions</h2><button class="link-button" data-page="chat">Open assistant →</button></div><div class="quick-grid">${quick.map(([cat, q]) => `<button class="quick-link" data-ask="${esc(q)}">${icon('spark')}<span>${esc(q)}</span></button>`).join('')}</div>
      <div class="section-head"><h2>Your recent questions</h2><button class="link-button" data-page="history">View history →</button></div><div class="surface surface-pad">${recent.length ? recent.map((item) => `<div class="activity-row"><div><strong>${esc(item.question)}</strong><p>${esc(item.category)} · ${esc(item.answer.slice(0, 78))}${item.answer.length > 78 ? '…' : ''}</p></div><time>${formatDate(item.created_at)}</time></div>`).join('') : '<div class="empty-state"><strong>Your questions will show up here</strong>Start a chat to build your personal answer history.</div>'}</div>
    </section><section><div class="section-head" style="margin-top:0"><h2>Campus updates</h2><span class="pill">Latest</span></div><div class="surface surface-pad">${announcements.length ? announcements.map((item) => `<article class="announcement"><span class="announcement-mark">${icon('notice')}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.body)}</p><time>${esc(item.tag)}${item.published_at ? ` · ${formatDate(item.published_at)}` : ''}</time></div></article>`).join('') : '<div class="empty-state">No campus updates yet.</div>'}</div>
      <div class="section-head"><h2>Explore campus</h2><button class="link-button" data-page="guide">All topics →</button></div><div class="category-row">${(boot.categories || []).slice(0, 8).map((category) => `<button class="category-chip" data-category="${esc(category)}">${esc(category)}</button>`).join('')}</div>
    </section></div>`;
}

const suggested = ['What courses are available?', 'How much is the Computer Engineering fee?', 'When are semester exams?', 'Does the college provide hostel?', 'What scholarships are available?', 'Tell me about placements.'];
function messageMarkup(message) {
  const time = formatTime(message.created_at);
  return `<div class="message user"><span class="message-mark">${esc(initials(state.user.name).slice(0, 1))}</span><div><div class="message-bubble">${esc(message.question)}</div><div class="message-meta">You · ${time}</div></div></div>
    <div class="message"><span class="message-mark">${icon('spark')}</span><div><div class="message-bubble">${esc(message.answer)}</div><div class="message-meta">SmartCampus · ${esc(message.category)}${time ? ` · ${time}` : ''}</div></div></div>`;
}
function renderChat() {
  const messages = state.chat;
  return `${heading('Campus assistant', 'Ask SmartCampus', 'A question in your words. A useful answer from your college knowledge base.', `<button class="button button-quiet" data-page="history">${icon('history')} Chat history</button>`)}
    <div class="chat-layout"><section class="surface chat-panel"><div class="chat-header"><span class="bot-avatar">${icon('spark')}</span><div><strong>SmartCampus assistant</strong><span>College information, made simple</span></div><span class="online-status"><i class="live-dot"></i> Ready</span></div>
      <div class="messages" id="messages">${messages.length ? messages.map(messageMarkup).join('') : `<div class="message"><span class="message-mark">${icon('spark')}</span><div><div class="message-bubble">Hello, ${esc(state.user.name.split(' ')[0])}! I can help you find information about courses, admissions, fees, exams, scholarships and life on campus. What would you like to know?</div><div class="message-meta">SmartCampus · Just now</div></div></div>`}</div>
      <div class="chat-compose"><form class="ask-form" data-form="chat"><input name="question" placeholder="Write your question…" aria-label="Write your question" maxlength="1000" autocomplete="off"><button aria-label="Send question" title="Send question">${icon('send')}<span>Ask</span></button></form><p>Answers are matched against the college knowledge base. Please verify time-sensitive details.</p></div>
    </section><aside class="chat-aside"><section class="surface"><h3>Suggested questions</h3><div class="suggestion-list">${suggested.map((q) => `<button class="suggestion" data-ask="${esc(q)}">${esc(q)}</button>`).join('')}</div></section>
      <section class="surface"><h3>Browse by topic</h3><div class="category-row" style="flex-wrap:wrap;overflow:visible">${(state.boot?.categories || []).map((c) => `<button class="category-chip" data-category="${esc(c)}">${esc(c)}</button>`).join('')}</div></section>
      <section class="surface tip-card"><h3>${icon('spark')} Helpful tip</h3><p>Ask a specific question, such as a course name or department, for the most relevant answer.</p></section></aside></div>`;
}
function renderHistory() {
  return `${heading('Your activity', 'Chat history', 'Pick up where you left off or revisit a campus answer.', `<button class="button button-primary" data-page="chat">${icon('chat')} Ask a question</button>`)}
    ${state.chat.length ? `<div class="history-list">${[...state.chat].reverse().map((item) => `<article class="history-item"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p><div class="history-meta"><span class="pill">${esc(item.category)}</span><time>${formatDate(item.created_at)}${item.created_at ? ` · ${formatTime(item.created_at)}` : ''}</time></div></article>`).join('')}</div>` : '<div class="empty-state"><strong>No conversations yet</strong>Ask SmartCampus your first question to start a history.</div>'}`;
}

function renderGuide() {
  const categories = state.boot?.categories || [];
  const faqs = state.records || [];
  const items = faqs.filter((item) => state.guide === 'All topics' || item.category === state.guide);
  const collectionMap = { Courses: 'courses', Departments: 'departments', Faculty: 'faculty', Fees: 'fees', Announcements: 'announcements' };
  const extra = collectionMap[state.guide];
  const extraRows = extra ? state.guideRecords || [] : [];
  let cards = items.map((item) => `<article class="guide-card"><div class="guide-card-top"><h3>${esc(item.question)}</h3><span class="pill">${esc(item.category)}</span></div><p>${esc(item.answer)}</p></article>`);
  if (extraRows.length) cards = cards.concat(extraRows.map((item) => guideDataCard(extra, item)));
  return `${heading('College information', 'College guide', 'Browse verified information across your campus.', `<button class="button button-quiet" data-page="chat">${icon('chat')} Ask instead</button>`)}
    <div class="category-row">${['All topics', ...categories, 'Courses', 'Departments', 'Faculty', 'Fees', 'Announcements'].map((c) => `<button class="category-chip ${state.guide === c ? 'active' : ''}" data-guide="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    ${state.loading ? '<div class="loading">Loading college information…</div>' : cards.length ? `<div class="guide-layout"><div class="guide-content">${cards.join('')}</div></div>` : '<div class="empty-state"><strong>Nothing here just yet</strong>Choose another topic or ask the assistant.</div>'}`;
}
function guideDataCard(collection, item) {
  const values = { courses: [[item.degree, item.name], ['Duration', item.duration], ['Seats', item.seats], ['Department', item.department]],
    departments: [['Code', item.code], ['Head of department', item.head], ['Building', item.building]],
    faculty: [[item.title, item.name], ['Department', item.department], ['Email', item.email], ['Specialization', item.specialization]],
    fees: [['Academic year', item.academic_year], ['Tuition', `Rs. ${Number(item.tuition).toLocaleString('en-IN')}`], ['Additional fees', `Rs. ${Number(item.other_fees).toLocaleString('en-IN')}`], ['Notes', item.notes]],
    announcements: [['Update', item.tag], ['Published', formatDate(item.published_at)]] }[collection] || [];
  const title = item.name || item.program || item.title;
  return `<article class="guide-card"><div class="guide-card-top"><h3>${esc(title)}</h3><span class="pill">${esc(nice(collection))}</span></div>${item.description ? `<p>${esc(item.description)}</p>` : ''}${item.body ? `<p>${esc(item.body)}</p>` : ''}${values.map(([label, value]) => `<div class="detail-line"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</article>`;
}

function renderAdmin() {
  const stats = state.adminStats;
  if (!stats) return `${heading('Administration', 'Campus overview', 'A live view of student questions and information activity.') }<div class="loading">Loading campus analytics…</div>`;
  const maximum = Math.max(1, ...stats.categories.map((item) => item.count));
  return `${heading('Administration', 'Campus overview', 'A live view of student questions and information activity.', `<button class="button button-quiet" data-page="activity">${icon('users')} Student activity</button>`)}
    <section class="stat-grid">${statCard('Registered students', stats.total_students, 'users', 'Student accounts')}${statCard('Questions asked', stats.total_questions, 'chat', 'Across all student sessions')}${statCard('Knowledge entries', stats.total_faqs, 'book', 'Indexed for chatbot search')}${statCard('Topics covered', (state.boot?.categories || []).length, 'grid', 'College information categories')}</section>
    <div class="admin-grid"><section class="surface surface-pad"><div class="section-head" style="margin:0 0 18px"><h2>Popular categories</h2><span class="pill">All time</span></div><div class="bar-list">${stats.categories.length ? stats.categories.slice().sort((a,b) => b.count-a.count).map((item) => `<div class="bar-item"><span>${esc(item.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, item.count / maximum * 100)}%"></div></div><strong>${item.count}</strong></div>`).join('') : '<div class="empty-state">Student questions will reveal popular topics here.</div>'}</div></section>
      <section class="surface surface-pad"><div class="section-head" style="margin:0 0 8px"><h2>Recent questions</h2><button class="link-button" data-page="activity">View activity →</button></div>${stats.recent.length ? stats.recent.map((item) => `<div class="activity-row"><div><strong>${esc(item.question)}</strong><p>${esc(item.student_name)} · ${esc(item.category)}</p></div><time>${formatDate(item.created_at)}</time></div>`).join('') : '<div class="empty-state"><strong>No student questions yet</strong>Activity will appear here after the first chat.</div>'}</section></div>
    <div class="section-head"><h2>Manage campus information</h2></div><div class="quick-grid">${[['faqs','FAQs'],['courses','Courses'],['departments','Departments'],['faculty','Faculty'],['fees','Fees'],['announcements','Announcements']].map(([key,label]) => `<button class="quick-link" data-collection="${key}">${icon('book')}<span>${label}</span>${icon('arrow')}</button>`).join('')}</div>`;
}
function renderActivity() {
  const stats = state.adminStats;
  return `${heading('Administration', 'Students & activity', 'Explore student engagement and recent questions.', `<button class="button button-quiet" data-page="admin">${icon('chart')} Analytics overview</button>`)}
    <div class="admin-grid"><section class="surface surface-pad"><div class="section-head" style="margin:0 0 9px"><h2>Student accounts</h2><span class="pill">${state.students.length} students</span></div><div class="student-list">${state.students.length ? state.students.map((student) => `<div class="student-row"><div><strong>${esc(student.name)}</strong><span>${esc(student.email)} · Joined ${formatDate(student.created_at)}</span></div><span class="pill">${student.question_count} questions</span></div>`).join('') : '<div class="empty-state">No student accounts have registered yet.</div>'}</div></section>
      <section class="surface surface-pad"><div class="section-head" style="margin:0 0 8px"><h2>Student questions</h2><span class="pill">${stats?.total_questions || 0} total</span></div>${state.adminQuestions.length ? state.adminQuestions.map((item) => `<div class="activity-row"><div><strong>${esc(item.question)}</strong><p>${esc(item.student_name)} · ${esc(item.student_email)} · ${esc(item.category)}</p></div><time>${formatDate(item.created_at)}</time></div>`).join('') : '<div class="empty-state">No chat activity yet.</div>'}</section></div>`;
}

const schemas = {
  faqs: { label: 'FAQs', fields: [['category','Category','select',['Admissions','Courses','Departments','Faculty','Fees','Examinations','Scholarships','Placements','Hostel','Library','Transportation','Facilities','Events','Contact information']], ['question','Question','text'], ['aliases','Search phrases','textarea'], ['answer','Answer','textarea']] },
  courses: { label: 'Courses', fields: [['name','Course name','text'], ['degree','Degree','text'], ['duration','Duration','text'], ['seats','Seats','number'], ['department','Department','text'], ['description','Description','textarea']] },
  departments: { label: 'Departments', fields: [['name','Department name','text'], ['code','Code','text'], ['head','Head of department','text'], ['building','Building','text'], ['description','Description','textarea']] },
  faculty: { label: 'Faculty', fields: [['name','Name','text'], ['title','Title','text'], ['department','Department','text'], ['email','Email','email'], ['specialization','Specialization','text']] },
  fees: { label: 'Fees', fields: [['program','Program','text'], ['academic_year','Academic year','text'], ['tuition','Tuition (Rs.)','number'], ['other_fees','Additional fees (Rs.)','number'], ['notes','Notes','text']] },
  announcements: { label: 'Announcements', fields: [['title','Title','text'], ['body','Announcement','textarea'], ['tag','Category tag','text']] },
};
function renderManager() {
  const schema = schemas[state.collection];
  const rows = state.records;
  const keys = schema.fields.map(([key]) => key);
  const title = schema.label;
  const singular = { faqs: 'FAQ', courses: 'course', departments: 'department', faculty: 'faculty member', fees: 'fee', announcements: 'announcement' }[state.collection];
  return `${heading('Administration', 'Content manager', 'Keep the student knowledge base current and useful.', `<button class="button button-primary" data-action="new-record">${icon('plus')} Add ${singular}</button>`)}
    <div class="tab-row">${Object.entries(schemas).map(([key, value]) => `<button class="tab-button ${state.collection === key ? 'active' : ''}" data-collection="${key}">${esc(value.label)}</button>`).join('')}</div>
    <section class="surface"><div class="table-wrap"><table class="data-table"><thead><tr>${keys.map((key) => `<th>${esc(nice(key))}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${rows.length ? rows.map((row) => `<tr>${keys.map((key) => `<td>${esc(String(row[key] ?? '').slice(0, 135))}${String(row[key] || '').length > 135 ? '…' : ''}</td>`).join('')}<td><div class="table-actions"><button class="table-action" title="Edit record" aria-label="Edit record" data-action="edit-record" data-id="${row.id}">${icons.edit}</button><button class="table-action delete" title="Delete record" aria-label="Delete record" data-action="delete-record" data-id="${row.id}">${icons.trash}</button></div></td></tr>`).join('') : `<tr><td colspan="${keys.length + 1}" class="muted">No records yet. Add the first ${esc(title.toLowerCase().replace(/s$/, ''))}.</td></tr>`}</tbody></table></div></section>`;
}
function renderCurrentPage() {
  switch (state.page) {
    case 'chat': return renderChat();
    case 'history': return renderHistory();
    case 'guide': return renderGuide();
    case 'admin': return renderAdmin();
    case 'activity': return renderActivity();
    case 'manager': return renderManager();
    default: return renderOverview();
  }
}

function renderModal() {
  const schema = schemas[state.collection];
  const editing = state.modal.mode === 'edit';
  const record = state.modal.record || {};
  return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${editing ? 'Edit' : 'Add'} ${esc(schema.label.replace(/s$/, ''))}</h2><p>Changes appear in the student knowledge base immediately.</p></div><button class="icon-button" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>
    <form data-form="record"><div class="modal-grid">${schema.fields.map(([key, label, type, options]) => `<div class="field ${type === 'textarea' ? 'full' : ''}"><label for="record-${key}">${esc(label)}</label>${type === 'textarea' ? `<textarea id="record-${key}" name="${key}" required>${esc(record[key] || '')}</textarea>` : type === 'select' ? `<select id="record-${key}" name="${key}">${options.map((option) => `<option ${record[key] === option ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select>` : `<input id="record-${key}" name="${key}" type="${type}" value="${esc(record[key] ?? '')}" ${type === 'number' ? 'min="0"' : ''} required>`}</div>`).join('')}</div><p class="form-error" id="record-error"></p><div class="modal-actions"><button class="button button-quiet" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">${editing ? 'Save changes' : 'Add record'}</button></div></form></section></div>`;
}

function render() {
  if (!state.user) return renderAuth();
  if (state.user.role !== 'admin' && ['admin','manager','activity'].includes(state.page)) state.page = 'overview';
  renderShell();
}
async function loadBootstrap() {
  state.boot = await api('/api/bootstrap');
  state.user = state.boot.user;
}
async function loadChat() {
  try { state.chat = (await api('/api/chat')).messages; render(); scrollMessages(); }
  catch (error) { showToast(error.message, true); }
}
async function loadGuide() {
  state.loading = true; render();
  try {
    const [faqData, specific] = await Promise.all([
      api('/api/data/faqs'),
      ({ Courses: 'courses', Departments: 'departments', Faculty: 'faculty', Fees: 'fees', Announcements: 'announcements' }[state.guide])
        ? api(`/api/data/${({ Courses: 'courses', Departments: 'departments', Faculty: 'faculty', Fees: 'fees', Announcements: 'announcements' }[state.guide])}`)
        : Promise.resolve({ items: [] }),
    ]);
    state.records = faqData.items;
    state.guideRecords = specific.items;
  } catch (error) { showToast(error.message, true); }
  state.loading = false; render();
}
async function loadRecords() {
  try { state.records = (await api(`/api/data/${state.collection}`)).items; render(); }
  catch (error) { showToast(error.message, true); }
}
async function loadAdmin() {
  try {
    const [stats, students, questions] = await Promise.all([
      api('/api/admin/stats'), api('/api/admin/students'),
      state.page === 'activity' ? api('/api/admin/questions') : Promise.resolve({ questions: [] }),
    ]);
    state.adminStats = stats;
    state.students = students.students;
    state.adminQuestions = questions.questions;
    render();
  } catch (error) { showToast(error.message, true); }
}
function scrollMessages() { const target = document.querySelector('#messages'); if (target) target.scrollTop = target.scrollHeight; }
async function submitQuestion(question, navigate = true) {
  const clean = question.trim();
  if (!clean) return;
  if (navigate && state.page !== 'chat') { state.page = 'chat'; state.chat = []; render(); }
  const formInput = document.querySelector('[data-form="chat"] input');
  if (formInput) formInput.value = '';
  const button = document.querySelector('[data-form="chat"] button');
  if (button) button.disabled = true;
  try {
    const result = await api('/api/chat', { method: 'POST', body: JSON.stringify({ question: clean }) });
    state.chat.push(result.message);
    if (state.page === 'chat') { render(); scrollMessages(); }
    state.boot.question_count = (state.boot.question_count || 0) + 1;
    state.boot.recent_questions = [result.message, ...(state.boot.recent_questions || [])].slice(0, 4);
  } catch (error) { showToast(error.message, true); }
  finally { const liveButton = document.querySelector('[data-form="chat"] button'); if (liveButton) liveButton.disabled = false; }
}

app.addEventListener('click', async (event) => {
  const control = event.target.closest('[data-page], [data-action], [data-ask], [data-category], [data-guide], [data-collection], [data-demo]');
  if (!control) return;
  if (control.dataset.page) { setPage(control.dataset.page); document.querySelector('#sidebar')?.classList.remove('open'); document.querySelector('.sidebar-backdrop')?.remove(); return; }
  if (control.dataset.ask) { await submitQuestion(control.dataset.ask); return; }
  if (control.dataset.category) {
    const prompts = { Admissions: 'What is the admission process?', Courses: 'What courses are available?', Departments: 'Who is the HOD of Computer Engineering?', Faculty: 'How do I find faculty members?', Fees: 'How much is the Computer Engineering fee?', Examinations: 'When are semester exams?', Scholarships: 'What scholarships are available?', Placements: 'Tell me about placements.', Hostel: 'Does the college provide hostel?', Library: 'What are the library hours?', Transportation: 'Is college transport available?', Facilities: 'What facilities are on campus?', Events: 'What events are coming up?', 'Contact information': 'How can I contact the college?' };
    state.page = 'chat'; render(); await submitQuestion(prompts[control.dataset.category] || `Tell me about ${control.dataset.category.toLowerCase()}.`, false); return;
  }
  if (control.dataset.guide) { state.guide = control.dataset.guide; await loadGuide(); return; }
  if (control.dataset.collection) { state.collection = control.dataset.collection; state.page = 'manager'; state.modal = null; render(); await loadRecords(); return; }
  if (control.dataset.demo) {
    document.querySelector('#auth-email').value = `${control.dataset.demo}@smartcampus.edu`;
    document.querySelector('#auth-password').value = control.dataset.demo === 'admin' ? 'Admin@123' : 'Student@123';
    document.querySelector('#auth-form').requestSubmit(); return;
  }
  switch (control.dataset.action) {
    case 'auth-switch': state.authMode = state.authMode === 'login' ? 'register' : 'login'; render(); break;
    case 'logout': await api('/api/auth/logout', { method: 'POST' }); state.user = null; state.boot = null; state.page = 'overview'; render(); break;
    case 'menu': {
      const sidebar = document.querySelector('#sidebar');
      sidebar.classList.toggle('open');
      if (sidebar.classList.contains('open')) { const backdrop = document.createElement('div'); backdrop.className = 'sidebar-backdrop'; backdrop.onclick = () => { sidebar.classList.remove('open'); backdrop.remove(); }; document.body.append(backdrop); }
      else document.querySelector('.sidebar-backdrop')?.remove();
      break;
    }
    case 'new-record': state.modal = { mode: 'new', record: {} }; render(); break;
    case 'edit-record': { const record = state.records.find((item) => item.id === Number(control.dataset.id)); state.modal = { mode: 'edit', record }; render(); break; }
    case 'close-modal': state.modal = null; render(); break;
    case 'dismiss-modal': if (event.target === control) { state.modal = null; render(); } break;
    case 'delete-record': {
      const record = state.records.find((item) => item.id === Number(control.dataset.id));
      if (!window.confirm(`Delete “${record?.question || record?.name || record?.title || record?.program}”? This cannot be undone.`)) return;
      try { await api(`/api/admin/data/${state.collection}?id=${control.dataset.id}`, { method: 'DELETE' }); showToast('Record deleted.'); await loadRecords(); }
      catch (error) { showToast(error.message, true); }
      break;
    }
  }
});

app.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!form.matches('form')) return;
  event.preventDefault();
  if (form.id === 'auth-form') {
    const data = Object.fromEntries(new FormData(form));
    const route = state.authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    try {
      await api(route, { method: 'POST', body: JSON.stringify(data) });
      await loadBootstrap(); state.page = state.user.role === 'admin' ? 'admin' : 'overview'; state.authMode = 'login'; await loadChat();
      if (state.user.role === 'admin') await loadAdmin();
      else render();
    } catch (error) { const target = document.querySelector('#auth-error'); if (target) target.textContent = error.message; }
    return;
  }
  if (form.dataset.form === 'quick-ask' || form.dataset.form === 'chat') {
    const question = new FormData(form).get('question') || '';
    if (form.dataset.form === 'quick-ask') { state.page = 'chat'; render(); }
    await submitQuestion(question, false); return;
  }
  if (form.dataset.form === 'record') {
    const data = Object.fromEntries(new FormData(form));
    for (const [key, value] of Object.entries(data)) if (schemas[state.collection].fields.find(([field]) => field === key)?.[2] === 'number') data[key] = Number(value);
    const editing = state.modal.mode === 'edit';
    if (editing) data.id = state.modal.record.id;
    try {
      await api(`/api/admin/data/${state.collection}`, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(data) });
      state.modal = null; showToast(editing ? 'Changes saved.' : 'Record added.'); await loadRecords();
      if (state.page === 'admin') { state.adminStats = null; await loadAdmin(); }
    } catch (error) { const target = document.querySelector('#record-error'); if (target) target.textContent = error.message; }
  }
});

async function start() {
  try {
    const data = await api('/api/me');
    state.user = data.user;
    if (state.user) {
      await loadBootstrap(); state.page = state.user.role === 'admin' ? 'admin' : 'overview'; await loadChat();
      if (state.user.role === 'admin') await loadAdmin();
    }
    else render();
  } catch { render(); }
}
start();