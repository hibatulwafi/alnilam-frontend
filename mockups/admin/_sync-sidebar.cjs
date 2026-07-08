// Sync sidebar to legacy admin pages (products, orders, users, settings, product-form, login)
// that were built manually before _build-pages.cjs existed.
// Run: node _sync-sidebar.cjs
const fs = require('fs');
const path = require('path');

// Reuse sidebar builder from _build-pages
function sidebar(activeKey) {
  const isActive = (k) => k === activeKey ? 'sidebar-link active' : 'sidebar-link';
  return `<aside class="sidebar">
  <div class="sidebar-brand"><img src="../assets/img/alnilam.png" alt="Alnilam" class="nav-brand-logo" /><div><div>ALNILAM</div><div style="font-size:.6875rem;color:var(--accent-primary);letter-spacing:.1em;text-transform:uppercase;font-weight:500;">Admin</div></div></div>
  <div class="sidebar-section"><div class="sidebar-section-title">Overview</div><ul class="sidebar-nav">
    <li><a href="dashboard.html" class="${isActive('dashboard')}"><span class="sidebar-icon">◈</span><span>Dashboard</span></a></li>
    <li><a href="analytics.html" class="${isActive('analytics')}"><span class="sidebar-icon">◇</span><span>Analytics</span></a></li>
  </ul></div>
  <div class="sidebar-section"><div class="sidebar-section-title">Marketplace</div><ul class="sidebar-nav">
    <li><a href="products.html" class="${isActive('products')}"><span class="sidebar-icon">▤</span><span>Products</span></a></li>
    <li><a href="categories.html" class="${isActive('categories')}"><span class="sidebar-icon">▦</span><span>Categories</span></a></li>
    <li><a href="orders.html" class="${isActive('orders')}"><span class="sidebar-icon">▧</span><span>Orders <span class="badge badge-accent" style="margin-left:auto;padding:.125rem .375rem;font-size:.6875rem;">12</span></span></a></li>
    <li><a href="projects.html" class="${isActive('projects')}"><span class="sidebar-icon">◱</span><span>Projects</span></a></li>
  </ul></div>
  <div class="sidebar-section"><div class="sidebar-section-title">Communication</div><ul class="sidebar-nav">
    <li><a href="chats.html" class="${isActive('chats')}"><span class="sidebar-icon">✉</span><span>Chats <span class="badge badge-accent" style="margin-left:auto;padding:.125rem .375rem;font-size:.6875rem;">7</span></span></a></li>
    <li><a href="meetings.html" class="${isActive('meetings')}"><span class="sidebar-icon">◉</span><span>Video Meetings</span></a></li>
    <li><a href="notifications.html" class="${isActive('notifications')}"><span class="sidebar-icon">✱</span><span>Notifications</span></a></li>
  </ul></div>
  <div class="sidebar-section"><div class="sidebar-section-title">People</div><ul class="sidebar-nav">
    <li><a href="users.html" class="${isActive('users')}"><span class="sidebar-icon">◉</span><span>Users</span></a></li>
    <li><a href="creators.html" class="${isActive('creators')}"><span class="sidebar-icon">◎</span><span>Creators</span></a></li>
    <li><a href="kyc.html" class="${isActive('kyc')}"><span class="sidebar-icon">✎</span><span>KYC Queue <span class="badge badge-warning" style="margin-left:auto;padding:.125rem .375rem;font-size:.6875rem;">3</span></span></a></li>
  </ul></div>
  <div class="sidebar-section"><div class="sidebar-section-title">Finance</div><ul class="sidebar-nav">
    <li><a href="transactions.html" class="${isActive('transactions')}"><span class="sidebar-icon">◐</span><span>Transactions</span></a></li>
    <li><a href="payouts.html" class="${isActive('payouts')}"><span class="sidebar-icon">◑</span><span>Payouts</span></a></li>
    <li><a href="refunds.html" class="${isActive('refunds')}"><span class="sidebar-icon">◒</span><span>Refunds</span></a></li>
    <li><a href="vouchers.html" class="${isActive('vouchers')}"><span class="sidebar-icon">◓</span><span>Vouchers</span></a></li>
  </ul></div>
  <div class="sidebar-section"><div class="sidebar-section-title">Moderation</div><ul class="sidebar-nav">
    <li><a href="disputes.html" class="${isActive('disputes')}"><span class="sidebar-icon">⚠</span><span>Disputes <span class="badge badge-danger" style="margin-left:auto;padding:.125rem .375rem;font-size:.6875rem;">2</span></span></a></li>
    <li><a href="support.html" class="${isActive('support')}"><span class="sidebar-icon">♨</span><span>Support Tickets</span></a></li>
    <li><a href="audit-log.html" class="${isActive('audit-log')}"><span class="sidebar-icon">✪</span><span>Audit Log</span></a></li>
  </ul></div>
  <div class="sidebar-section"><div class="sidebar-section-title">System</div><ul class="sidebar-nav">
    <li><a href="settings.html" class="${isActive('settings')}"><span class="sidebar-icon">✧</span><span>Settings</span></a></li>
  </ul></div>
  <div style="margin-top:auto;padding-top:2rem;border-top:1px solid var(--border-subtle);"><div style="display:flex;align-items:center;gap:.75rem;padding:.75rem .875rem;"><div style="width:32px;height:32px;background:var(--accent-primary);color:var(--bg-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.875rem;">A</div><div style="flex:1;"><div style="font-size:.875rem;font-weight:600;">Admin Alnilam</div><div style="font-size:.75rem;color:var(--text-tertiary);">Super Admin</div></div><a href="../login.html" style="color:var(--text-tertiary);"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></a></div></div>
</aside>`;
}

// Legacy pages to update (name → active-key)
const LEGACY = {
  'products.html': 'products',
  'orders.html': 'orders',
  'users.html': 'users',
  'settings.html': 'settings',
  'product-form.html': 'products', // still under Products section
  'dashboard.html': 'dashboard',
};

const HERE = __dirname;

for (const [filename, activeKey] of Object.entries(LEGACY)) {
  const filePath = path.join(HERE, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`✗ ${filename} — file not found, skipping`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf-8');

  // Replace <aside class="sidebar">...</aside> with new sidebar
  const newHtml = html.replace(
    /<aside class="sidebar">[\s\S]*?<\/aside>/,
    sidebar(activeKey)
  );

  if (newHtml === html) {
    console.log(`⚠ ${filename} — no <aside class="sidebar"> found, skipped`);
    continue;
  }

  fs.writeFileSync(filePath, newHtml);
  console.log(`✓ ${filename} — sidebar synced (active: ${activeKey})`);
}
