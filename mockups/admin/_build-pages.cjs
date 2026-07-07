// Build admin mockup pages from shared sidebar + per-page main content.
// Run: node _build-pages.cjs
const fs = require('fs');
const path = require('path');

const HERE = __dirname;

// ==================================================
// Shared sidebar template — active link is marked via {{ACTIVE:key}}
// ==================================================
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

function page(title, activeKey, mainHTML, extraStyle = '') {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} — Alnilam Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../assets/css/theme.css" />
${extraStyle ? `<style>${extraStyle}</style>` : ''}
</head>
<body>
<div class="admin-layout">
${sidebar(activeKey)}
<main class="main-content">
${mainHTML}
</main>
</div>
</body>
</html>
`;
}

// ==================================================
// PAGE CONTENTS
// ==================================================

const PAGES = {};

// ---------- Phase 2 completion ----------

PAGES['order-detail'] = {
  title: 'Order Detail',
  active: 'orders',
  main: `
  <div style="display:flex;align-items:center;gap:.5rem;font-size:.8125rem;color:var(--text-tertiary);margin-bottom:.75rem;">
    <a href="orders.html" style="color:var(--accent-primary);text-decoration:none;">← Orders</a>
    <span>·</span><span>#ORD-2026-0847</span>
  </div>
  <div class="main-header">
    <div><div class="eyebrow mb-1">ORDER #ORD-2026-0847</div><h1>Epsilon Standard — Retainer Bulan #2</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Contact Client</button>
      <button class="btn btn-outline btn-sm">Contact Creator</button>
      <button class="btn btn-accent btn-sm">Refund / Adjust</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 340px;gap:2rem;">
    <div>
      <!-- Status timeline -->
      <div class="card mb-4">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Order Timeline</h3></div>
        <div style="padding:1.5rem;">
          <div style="position:relative;padding-left:2.5rem;">
            <div style="position:absolute;left:1rem;top:.5rem;bottom:.5rem;width:2px;background:var(--border-subtle);"></div>
            ${['Order placed','Payment received','Brief submitted','Creator assigned','In progress','Delivered','Approved by client'].map((step,i)=>{
              const done = i<5; const active = i===4;
              return `<div style="display:flex;gap:1rem;margin-bottom:1rem;position:relative;">
                <div style="position:absolute;left:-2.5rem;width:32px;height:32px;border-radius:50%;background:${done?'var(--accent-primary)':'var(--bg-secondary)'};color:${done?'white':'var(--text-tertiary)'};display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;border:2px solid ${active?'var(--accent-primary)':'transparent'};">${done?'✓':i+1}</div>
                <div><div style="font-weight:${active?800:600};color:${done?'var(--text-primary)':'var(--text-tertiary)'};">${step}</div><div style="font-size:.75rem;color:var(--text-tertiary);">${done?`July ${i+1}, 2026 · 10:${20+i*5} AM`:'Pending'}</div></div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Line items -->
      <div class="card mb-4">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Line Items</h3></div>
        <table style="width:100%;">
          <thead><tr style="background:var(--bg-secondary);"><th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Item</th><th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Qty</th><th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Subtotal</th></tr></thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:1rem 1.5rem;"><div style="font-weight:600;">Epsilon Standard</div><div style="font-size:.8125rem;color:var(--text-tertiary);">25 design + 6 reels + 2 SPHERE/bln · Bulan #2 dari 3</div></td><td style="text-align:center;">1</td><td style="text-align:right;padding:1rem 1.5rem;font-weight:700;">Rp 4.999.000</td></tr>
            <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:1rem 1.5rem;"><div style="font-weight:600;">Add-on: Rush Delivery</div><div style="font-size:.8125rem;color:var(--text-tertiary);">+3 hari lebih cepat</div></td><td style="text-align:center;">1</td><td style="text-align:right;padding:1rem 1.5rem;font-weight:700;">Rp 500.000</td></tr>
            <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:.75rem 1.5rem;color:var(--text-tertiary);">Subtotal</td><td></td><td style="text-align:right;padding:.75rem 1.5rem;color:var(--text-secondary);">Rp 5.499.000</td></tr>
            <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:.5rem 1.5rem;color:var(--text-tertiary);">Voucher (WELCOME10)</td><td></td><td style="text-align:right;padding:.5rem 1.5rem;color:#059669;">- Rp 549.900</td></tr>
            <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:.5rem 1.5rem;color:var(--text-tertiary);">PPN 11%</td><td></td><td style="text-align:right;padding:.5rem 1.5rem;color:var(--text-secondary);">Rp 544.501</td></tr>
            <tr><td style="padding:1rem 1.5rem;font-weight:800;font-size:1.0625rem;">Grand Total</td><td></td><td style="text-align:right;padding:1rem 1.5rem;font-weight:900;font-size:1.25rem;color:var(--accent-primary);">Rp 5.493.601</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Deliverables tracking -->
      <div class="card">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;"><h3 style="font-weight:700;">Deliverables · Progress <span style="color:var(--accent-primary);">18/33</span></h3><div style="width:150px;height:8px;background:var(--bg-secondary);border-radius:4px;overflow:hidden;"><div style="width:55%;height:100%;background:var(--accent-primary);"></div></div></div>
        <div style="padding:1.5rem;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
            <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;"><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Static Designs</div><div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin-top:.25rem;">15 / 25 <span style="font-size:.8125rem;color:var(--text-tertiary);">delivered</span></div></div>
            <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;"><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Short Reels</div><div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin-top:.25rem;">3 / 6 <span style="font-size:.8125rem;color:var(--text-tertiary);">delivered</span></div></div>
            <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;"><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Sphere Items</div><div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin-top:.25rem;">0 / 2 <span style="font-size:.8125rem;color:var(--text-tertiary);">delivered</span></div></div>
            <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;"><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Revisi Digunakan</div><div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin-top:.25rem;">2 / 5</div></div>
          </div>
        </div>
      </div>
    </div>

    <aside>
      <!-- Client -->
      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">CLIENT</div>
        <div style="padding:1rem 1.25rem;">
          <div style="display:flex;gap:.75rem;align-items:center;margin-bottom:.75rem;"><div style="width:44px;height:44px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">D</div><div><div style="font-weight:700;">Diana Brand Manager</div><div style="font-size:.75rem;color:var(--text-tertiary);">PT Kopi Kenangan · Since 2024</div></div></div>
          <div style="font-size:.8125rem;color:var(--text-secondary);line-height:1.5;">📧 diana@kopikenangan.id<br />📞 +62 811 2345 6789<br />🏢 Jakarta</div>
        </div>
      </div>

      <!-- Creator -->
      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">ASSIGNED CREATOR</div>
        <div style="padding:1rem 1.25rem;">
          <div style="display:flex;gap:.75rem;align-items:center;margin-bottom:.75rem;"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" style="width:44px;height:44px;border-radius:50%;object-fit:cover;" /><div><div style="font-weight:700;">Rifqi Handoko</div><div style="font-size:.75rem;color:var(--text-tertiary);"><span style="color:#F59E0B;">★</span> 4.9 · Elite</div></div></div>
          <button class="btn btn-outline btn-sm" style="width:100%;">Reassign</button>
        </div>
      </div>

      <!-- Payment -->
      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">PAYMENT</div>
        <div style="padding:1rem 1.25rem;font-size:.875rem;">
          <div style="display:flex;justify-content:space-between;padding:.375rem 0;"><span style="color:var(--text-tertiary);">Method</span><span style="font-weight:600;">Midtrans · BCA VA</span></div>
          <div style="display:flex;justify-content:space-between;padding:.375rem 0;"><span style="color:var(--text-tertiary);">Status</span><span class="badge badge-success">PAID</span></div>
          <div style="display:flex;justify-content:space-between;padding:.375rem 0;"><span style="color:var(--text-tertiary);">Escrow</span><span style="font-weight:600;color:#F59E0B;">Held</span></div>
          <div style="display:flex;justify-content:space-between;padding:.375rem 0;"><span style="color:var(--text-tertiary);">TXN ID</span><span style="font-family:monospace;font-size:.75rem;">TXN-8472365</span></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">QUICK ACTIONS</div>
        <div style="padding:.75rem;display:flex;flex-direction:column;gap:.5rem;">
          <button class="btn btn-outline btn-sm">Extend Deadline</button>
          <button class="btn btn-outline btn-sm">Add Note</button>
          <button class="btn btn-outline btn-sm">Trigger Refund</button>
          <button class="btn btn-outline btn-sm" style="color:var(--danger);">Cancel Order</button>
        </div>
      </div>
    </aside>
  </div>
`
};

PAGES['user-detail'] = {
  title: 'User Detail',
  active: 'users',
  main: `
  <div style="display:flex;align-items:center;gap:.5rem;font-size:.8125rem;color:var(--text-tertiary);margin-bottom:.75rem;">
    <a href="users.html" style="color:var(--accent-primary);text-decoration:none;">← Users</a>
    <span>·</span><span>Diana Brand Manager</span>
  </div>

  <div class="main-header">
    <div style="display:flex;gap:1rem;align-items:center;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.5rem;">D</div>
      <div><div class="eyebrow mb-1">CLIENT · #USR-4728</div><h1>Diana Brand Manager</h1><div style="display:flex;gap:.5rem;margin-top:.5rem;"><span class="badge badge-success">ACTIVE</span><span class="badge">EMAIL VERIFIED</span><span class="badge">KYC APPROVED</span></div></div>
    </div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Message</button>
      <button class="btn btn-outline btn-sm">Impersonate</button>
      <button class="btn btn-outline btn-sm" style="color:var(--danger);">Suspend</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Total Spent</div><div class="kpi-value">Rp 18.4M</div><div class="kpi-change">Lifetime</div></div>
    <div class="kpi-card"><div class="kpi-label">Orders</div><div class="kpi-value">14</div><div class="kpi-change">Since Aug 2024</div></div>
    <div class="kpi-card"><div class="kpi-label">Active Retainer</div><div class="kpi-value">1</div><div class="kpi-change">Epsilon Standard</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg Order</div><div class="kpi-value">Rp 1.3M</div><div class="kpi-change">→ trending up</div></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 320px;gap:2rem;">
    <div>
      <div class="card mb-3">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Order History</h3></div>
        <table style="width:100%;font-size:.875rem;">
          <thead><tr style="background:var(--bg-secondary);"><th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Order</th><th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Product</th><th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Date</th><th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Amount</th><th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Status</th></tr></thead>
          <tbody>
            ${[
              ['ORD-2026-0847','Epsilon Standard','5 Jul 2026','5.493K','IN PROGRESS','warning'],
              ['ORD-2026-0621','Epsilon Standard','5 Jun 2026','4.999K','COMPLETED','success'],
              ['ORD-2026-0410','Epsilon Standard','5 May 2026','4.999K','COMPLETED','success'],
              ['ORD-2026-0287','Sphere Brand Foundation','12 Apr 2026','2.499K','COMPLETED','success'],
              ['ORD-2026-0154','Atom Neutron','20 Feb 2026','799K','COMPLETED','success'],
            ].map(r=>`<tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:.875rem 1.5rem;"><a href="order-detail.html" style="color:var(--accent-primary);font-weight:600;font-family:monospace;font-size:.8125rem;">#${r[0]}</a></td><td style="padding:.875rem;">${r[1]}</td><td style="padding:.875rem;color:var(--text-tertiary);">${r[2]}</td><td style="text-align:right;padding:.875rem 1.5rem;font-weight:700;">Rp ${r[3]}</td><td style="padding:.875rem;text-align:center;"><span class="badge badge-${r[5]}">${r[4]}</span></td></tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="card">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Activity Log</h3></div>
        <div style="padding:0;">
          ${[
            ['5 Jul 2026 · 10:14','Placed order #ORD-2026-0847','order'],
            ['3 Jul 2026 · 15:22','Left review 5★ for creator Rifqi','review'],
            ['1 Jul 2026 · 09:33','Started video meeting with creator','meeting'],
            ['28 Jun 2026 · 14:11','Approved deliverable batch 3','approval'],
            ['15 Jun 2026 · 11:02','Updated profile info','profile'],
          ].map(a=>`<div style="padding:.875rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;font-size:.875rem;"><span>${a[1]}</span><span style="color:var(--text-tertiary);font-size:.8125rem;">${a[0]}</span></div>`).join('')}
        </div>
      </div>
    </div>

    <aside>
      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">CONTACT INFO</div>
        <div style="padding:1rem 1.25rem;font-size:.875rem;line-height:1.7;">
          <div style="color:var(--text-tertiary);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.25rem;">Email</div><div style="margin-bottom:.75rem;">diana@kopikenangan.id</div>
          <div style="color:var(--text-tertiary);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.25rem;">Phone</div><div style="margin-bottom:.75rem;">+62 811 2345 6789</div>
          <div style="color:var(--text-tertiary);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.25rem;">Company</div><div style="margin-bottom:.75rem;">PT Kopi Kenangan</div>
          <div style="color:var(--text-tertiary);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.25rem;">City</div><div>Jakarta, Indonesia</div>
        </div>
      </div>

      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">ACCOUNT META</div>
        <div style="padding:1rem 1.25rem;font-size:.8125rem;line-height:1.7;">
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">User ID</span><span style="font-family:monospace;">USR-4728</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">Joined</span><span>Aug 15, 2024</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">Last login</span><span>2 hours ago</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">2FA</span><span style="color:var(--success);">Enabled</span></div>
        </div>
      </div>

      <div class="card">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">TAGS &amp; NOTES</div>
        <div style="padding:1rem 1.25rem;">
          <div style="display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.75rem;"><span class="badge">VIP</span><span class="badge">HIGH LTV</span><span class="badge">RETAINER-ACTIVE</span></div>
          <textarea placeholder="Add internal note..." class="form-input" style="min-height:80px;font-size:.8125rem;"></textarea>
        </div>
      </div>
    </aside>
  </div>
`
};

PAGES['creators'] = {
  title: 'Creators',
  active: 'creators',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">PEOPLE · CREATORS</div><h1>Creators · 499 total</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Export CSV</button>
      <button class="btn btn-accent btn-sm">+ Invite Creator</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Elite</div><div class="kpi-value" style="color:#F59E0B;">45</div><div class="kpi-change">✦ Top tier</div></div>
    <div class="kpi-card"><div class="kpi-label">Pro</div><div class="kpi-value">142</div><div class="kpi-change">◆ Established</div></div>
    <div class="kpi-card"><div class="kpi-label">Rising</div><div class="kpi-value">312</div><div class="kpi-change">◇ Growing</div></div>
    <div class="kpi-card"><div class="kpi-label">Pending Approval</div><div class="kpi-value" style="color:#F59E0B;">23</div><div class="kpi-change">Awaiting review</div></div>
  </div>

  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">All (499)</button>
      <button class="btn btn-ghost btn-sm">Elite (45)</button>
      <button class="btn btn-ghost btn-sm">Pro (142)</button>
      <button class="btn btn-ghost btn-sm">Rising (312)</button>
      <button class="btn btn-ghost btn-sm">Suspended (7)</button>
      <input type="search" placeholder="Search creator..." class="form-input" style="margin-left:auto;width:250px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);">
        <th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Creator</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Skill</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Level</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Tiers</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Projects</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Rating</th>
        <th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Earnings</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);"></th>
      </tr></thead>
      <tbody>
        ${[
          ['Rifqi Handoko','Video Production','Bandung','Elite','A S E SN',127,4.9,'Rp 47.2M','elite'],
          ['Amira Salsabila','Brand Designer','Jakarta','Elite','A S E',96,4.9,'Rp 38.6M','elite'],
          ['Bagas Prakoso','SEO Specialist','Remote','Elite','E SN',72,5.0,'Rp 84.1M','elite'],
          ['Sinta Pramesti','Photographer','Yogyakarta','Pro','A S E',103,4.8,'Rp 29.4M','pro'],
          ['Dimas Anggara','Copywriter','Surabaya','Pro','A S',68,4.7,'Rp 12.8M','pro'],
          ['Kayla Ramadhani','Live Host','Jakarta','Pro','A E SN',145,4.9,'Rp 54.7M','pro'],
          ['Fajar Nugroho','3D Artist','Bali','Pro','S E SN',58,4.8,'Rp 22.1M','pro'],
          ['Anisa Fitri','Social Media Designer','Bandung','Rising','A S',34,4.7,'Rp 8.4M','rising'],
        ].map(c=>`<tr style="border-bottom:1px solid var(--border-subtle);">
          <td style="padding:.875rem 1.5rem;"><a href="creator-profile-admin.html" style="display:flex;gap:.75rem;align-items:center;text-decoration:none;color:inherit;"><div style="width:36px;height:36px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">${c[0][0]}</div><div><div style="font-weight:700;">${c[0]}</div><div style="font-size:.75rem;color:var(--text-tertiary);">${c[2]}</div></div></a></td>
          <td style="padding:.875rem;">${c[1]}</td>
          <td style="padding:.875rem;text-align:center;"><span class="badge ${c[8]==='elite'?'badge-warning':c[8]==='pro'?'badge-accent':''}">${c[3]}</span></td>
          <td style="padding:.875rem;text-align:center;font-family:monospace;font-size:.75rem;font-weight:700;">${c[4]}</td>
          <td style="padding:.875rem;text-align:right;font-weight:700;">${c[5]}</td>
          <td style="padding:.875rem;text-align:center;"><span style="color:#F59E0B;">★</span> ${c[6]}</td>
          <td style="padding:.875rem 1.5rem;text-align:right;font-weight:700;color:var(--success);">${c[7]}</td>
          <td style="padding:.875rem;text-align:right;"><button class="btn btn-ghost btn-sm">···</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div style="padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;font-size:.875rem;color:var(--text-tertiary);">
      <span>Showing 1–8 of 499</span>
      <div style="display:flex;gap:.375rem;"><button class="btn btn-ghost btn-sm">← Prev</button><button class="btn btn-primary btn-sm">1</button><button class="btn btn-ghost btn-sm">2</button><button class="btn btn-ghost btn-sm">3</button><button class="btn btn-ghost btn-sm">Next →</button></div>
    </div>
  </div>
`
};

PAGES['kyc'] = {
  title: 'KYC Queue',
  active: 'kyc',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">MODERATION</div><h1>KYC Verification Queue</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Filter</button>
      <button class="btn btn-outline btn-sm">Export</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Pending Review</div><div class="kpi-value" style="color:#F59E0B;">3</div><div class="kpi-change">Awaiting action</div></div>
    <div class="kpi-card"><div class="kpi-label">Approved Today</div><div class="kpi-value" style="color:var(--success);">8</div><div class="kpi-change">This morning</div></div>
    <div class="kpi-card"><div class="kpi-label">Rejected Today</div><div class="kpi-value" style="color:var(--danger);">1</div><div class="kpi-change">Reasons documented</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg. Processing</div><div class="kpi-value">4h 32m</div><div class="kpi-change">↓ 12% vs yesterday</div></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">
    ${[
      ['Ari Wijaya','Videographer · Jakarta','KTP + NPWP + Bank BCA','Submitted 2h ago','warning'],
      ['Nisa Rahmawati','Photographer · Malang','KTP + SIM + Bank Mandiri','Submitted 6h ago','warning'],
      ['Rudi Santoso','3D Artist · Bali','KTP + Passport + Bank BRI','Submitted 1d ago','danger'],
    ].map(k=>`<div class="card" style="border-color:${k[4]==='danger'?'var(--danger)':'#F59E0B'};">
      <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);background:${k[4]==='danger'?'#FEF2F2':'#FFFBEB'};display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:.75rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:${k[4]==='danger'?'var(--danger)':'#B45309'};">${k[4]==='danger'?'⚠ URGENT · &gt;24H':'PENDING'}</div>
        <div style="font-size:.75rem;color:var(--text-tertiary);">${k[3]}</div>
      </div>
      <div style="padding:1rem 1.25rem;">
        <div style="display:flex;gap:.75rem;align-items:center;margin-bottom:1rem;">
          <div style="width:44px;height:44px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">${k[0][0]}</div>
          <div><div style="font-weight:700;">${k[0]}</div><div style="font-size:.75rem;color:var(--text-tertiary);">${k[1]}</div></div>
        </div>
        <div style="font-size:.8125rem;color:var(--text-secondary);margin-bottom:1rem;padding:.75rem;background:var(--bg-secondary);border-radius:6px;">📎 Documents: ${k[2]}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
          <button class="btn btn-outline btn-sm">Review Docs</button>
          <button class="btn btn-primary btn-sm">Approve</button>
        </div>
        <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:.5rem;color:var(--danger);">Reject with reason</button>
      </div>
    </div>`).join('')}
  </div>

  <div class="card" style="margin-top:1.5rem;">
    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Recent Decisions</h3></div>
    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);"><th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Name</th><th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Skill</th><th style="text-align:center;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Decision</th><th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Reviewer</th><th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Date</th></tr></thead>
      <tbody>
        ${[
          ['Kayla Ramadhani','Live Host','APPROVED','Admin Sarah','success','Today 09:12'],
          ['Fajar Nugroho','3D Artist','APPROVED','Admin Ari','success','Today 08:47'],
          ['Reza Aditya','Creative Director','APPROVED','Admin Ari','success','Yesterday 16:22'],
          ['Deni Setiawan','Copywriter','REJECTED','Admin Sarah','danger','Yesterday 14:08'],
        ].map(r=>`<tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:.875rem 1.5rem;font-weight:600;">${r[0]}</td><td style="padding:.875rem;color:var(--text-tertiary);">${r[1]}</td><td style="padding:.875rem;text-align:center;"><span class="badge badge-${r[4]}">${r[2]}</span></td><td style="padding:.875rem;">${r[3]}</td><td style="padding:.875rem 1.5rem;text-align:right;color:var(--text-tertiary);">${r[5]}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
`
};

// ---------- Phase 3: Finance ----------

PAGES['transactions'] = {
  title: 'Transactions',
  active: 'transactions',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">FINANCE</div><h1>Transactions</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Reconcile</button>
      <button class="btn btn-outline btn-sm">Export CSV</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">GMV Today</div><div class="kpi-value">Rp 12.4M</div><div class="kpi-change">↑ 24.3% vs yesterday</div></div>
    <div class="kpi-card"><div class="kpi-label">Successful Txns</div><div class="kpi-value">147</div><div class="kpi-change">98.6% success rate</div></div>
    <div class="kpi-card"><div class="kpi-label">Pending</div><div class="kpi-value" style="color:#F59E0B;">8</div><div class="kpi-change">Awaiting confirmation</div></div>
    <div class="kpi-card"><div class="kpi-label">Failed</div><div class="kpi-value" style="color:var(--danger);">2</div><div class="kpi-change">Auto-retry active</div></div>
  </div>

  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">All (2,847)</button>
      <button class="btn btn-ghost btn-sm">Success (2,806)</button>
      <button class="btn btn-ghost btn-sm">Pending (8)</button>
      <button class="btn btn-ghost btn-sm">Failed (12)</button>
      <button class="btn btn-ghost btn-sm">Refunded (21)</button>
      <input type="search" placeholder="Search TXN ID, order, user..." class="form-input" style="margin-left:auto;width:280px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);">
        <th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">TXN ID</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Order</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">User</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Method</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Gross</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Fee</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Net</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Status</th>
        <th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Time</th>
      </tr></thead>
      <tbody>
        ${[
          ['TXN-8472365','ORD-0847','Diana BM','Midtrans · BCA VA','5.493K','109.9K','5.383K','PAID','success','2h ago'],
          ['TXN-8472364','ORD-0846','Andi Setiawan','Midtrans · GoPay','799K','16K','783K','PAID','success','3h ago'],
          ['TXN-8472363','ORD-0845','Ria Cahyani','Xendit · OVO','1.499K','30K','1.469K','PAID','success','4h ago'],
          ['TXN-8472362','ORD-0844','PT Wardah','BCA Transfer','29.999K','—','29.999K','PAID','success','5h ago'],
          ['TXN-8472361','ORD-0843','Budi Handoko','Midtrans · Mandiri VA','399K','8K','391K','PENDING','warning','6h ago'],
          ['TXN-8472360','ORD-0842','Kartika Sari','Midtrans · CC','2.499K','75K','2.424K','PAID','success','7h ago'],
          ['TXN-8472359','ORD-0841','Farhan Yusuf','Xendit · DANA','249K','5K','244K','FAILED','danger','8h ago'],
          ['TXN-8472358','ORD-0840','MS Glow','Midtrans · CC','7.999K','240K','7.759K','PAID','success','12h ago'],
        ].map(t=>`<tr style="border-bottom:1px solid var(--border-subtle);">
          <td style="padding:.75rem 1.5rem;font-family:monospace;font-size:.75rem;font-weight:700;color:var(--accent-primary);">${t[0]}</td>
          <td style="padding:.75rem;"><a href="order-detail.html" style="font-family:monospace;font-size:.75rem;color:var(--accent-primary);text-decoration:none;">#${t[1]}</a></td>
          <td style="padding:.75rem;">${t[2]}</td>
          <td style="padding:.75rem;font-size:.8125rem;color:var(--text-secondary);">${t[3]}</td>
          <td style="padding:.75rem;text-align:right;">Rp ${t[4]}</td>
          <td style="padding:.75rem;text-align:right;color:var(--text-tertiary);">${t[5]==='—'?'—':`Rp ${t[5]}`}</td>
          <td style="padding:.75rem;text-align:right;font-weight:700;">Rp ${t[6]}</td>
          <td style="padding:.75rem;text-align:center;"><span class="badge badge-${t[8]}">${t[7]}</span></td>
          <td style="padding:.75rem 1.5rem;text-align:right;color:var(--text-tertiary);font-size:.75rem;">${t[9]}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div style="padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;font-size:.875rem;color:var(--text-tertiary);">
      <span>Showing 1–8 of 2,847</span>
      <div style="display:flex;gap:.375rem;"><button class="btn btn-ghost btn-sm">← Prev</button><button class="btn btn-primary btn-sm">1</button><button class="btn btn-ghost btn-sm">2</button><button class="btn btn-ghost btn-sm">3</button><button class="btn btn-ghost btn-sm">Next →</button></div>
    </div>
  </div>
`
};

PAGES['payouts'] = {
  title: 'Payouts',
  active: 'payouts',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">FINANCE</div><h1>Creator Payouts</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Batch Payout</button>
      <button class="btn btn-accent btn-sm">Run Payout Now</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Pending Payouts</div><div class="kpi-value" style="color:#F59E0B;">Rp 42.7M</div><div class="kpi-change">147 creators</div></div>
    <div class="kpi-card"><div class="kpi-label">Paid This Month</div><div class="kpi-value" style="color:var(--success);">Rp 108M</div><div class="kpi-change">↑ 22% vs last month</div></div>
    <div class="kpi-card"><div class="kpi-label">Held (Escrow)</div><div class="kpi-value">Rp 87M</div><div class="kpi-change">Waiting delivery approval</div></div>
    <div class="kpi-card"><div class="kpi-label">Next Cycle</div><div class="kpi-value">7 days</div><div class="kpi-change">Auto-run · Fri 15 Jul</div></div>
  </div>

  <div style="background:var(--accent-highlight);border:1px solid var(--accent-light);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;gap:.75rem;align-items:center;"><svg width="24" height="24" fill="none" stroke="var(--accent-primary)" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><div><div style="font-weight:700;color:var(--accent-primary);">Payout cycle: Weekly (setiap Jumat)</div><div style="font-size:.8125rem;color:var(--text-secondary);">Creator harus ada saldo minimum Rp 100K untuk auto-payout. Under-threshold di-roll ke cycle berikutnya.</div></div></div>
    <a href="settings.html" style="color:var(--accent-primary);font-size:.875rem;font-weight:600;text-decoration:none;">Configure →</a>
  </div>

  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">Pending (147)</button>
      <button class="btn btn-ghost btn-sm">Processing (12)</button>
      <button class="btn btn-ghost btn-sm">Paid (2,847)</button>
      <button class="btn btn-ghost btn-sm">Failed (3)</button>
      <input type="search" placeholder="Search creator..." class="form-input" style="margin-left:auto;width:250px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);">
        <th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Creator</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Bank Account</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Orders</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Gross</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Fee 15%</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Net Payout</th>
        <th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Action</th>
      </tr></thead>
      <tbody>
        ${[
          ['Rifqi Handoko','BCA · 8471 3627 15','8','Rp 12.4M','Rp 1.86M','Rp 10.54M'],
          ['Amira Salsabila','Mandiri · 1420 8746 92','5','Rp 8.7M','Rp 1.305M','Rp 7.395M'],
          ['Bagas Prakoso','BCA · 3624 8792 44','2','Rp 22.4M','Rp 3.36M','Rp 19.04M'],
          ['Sinta Pramesti','BRI · 0473 0192 8447','6','Rp 6.2M','Rp 930K','Rp 5.27M'],
          ['Kayla Ramadhani','BCA · 6482 3721 09','12','Rp 14.8M','Rp 2.22M','Rp 12.58M'],
          ['Fajar Nugroho','Mandiri · 1750 4829 63','3','Rp 4.5M','Rp 675K','Rp 3.825M'],
        ].map(p=>`<tr style="border-bottom:1px solid var(--border-subtle);">
          <td style="padding:.875rem 1.5rem;"><div style="display:flex;gap:.5rem;align-items:center;"><input type="checkbox" style="margin-right:.25rem;" /><div><div style="font-weight:700;">${p[0]}</div></div></div></td>
          <td style="padding:.875rem;font-family:monospace;font-size:.75rem;color:var(--text-secondary);">${p[1]}</td>
          <td style="padding:.875rem;text-align:right;">${p[2]}</td>
          <td style="padding:.875rem;text-align:right;">${p[3]}</td>
          <td style="padding:.875rem;text-align:right;color:var(--text-tertiary);">${p[4]}</td>
          <td style="padding:.875rem;text-align:right;font-weight:800;color:var(--success);">${p[5]}</td>
          <td style="padding:.875rem 1.5rem;text-align:right;"><button class="btn btn-primary btn-sm">Payout Now</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div style="padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;font-size:.875rem;background:var(--bg-secondary);">
      <span style="color:var(--text-tertiary);">6 selected · Total: <strong style="color:var(--success);">Rp 58.65M</strong></span>
      <button class="btn btn-accent btn-sm">Payout Selected (6)</button>
    </div>
  </div>
`
};

PAGES['refunds'] = {
  title: 'Refunds',
  active: 'refunds',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">FINANCE</div><h1>Refunds</h1></div>
    <button class="btn btn-accent btn-sm">+ Manual Refund</button>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Pending</div><div class="kpi-value" style="color:#F59E0B;">4</div><div class="kpi-change">Awaiting approval</div></div>
    <div class="kpi-card"><div class="kpi-label">Refunded This Month</div><div class="kpi-value">Rp 4.2M</div><div class="kpi-change">21 refunds</div></div>
    <div class="kpi-card"><div class="kpi-label">Refund Rate</div><div class="kpi-value">2.4%</div><div class="kpi-change">Industry benchmark: 5%</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg. Processing</div><div class="kpi-value">2.3 days</div><div class="kpi-change">↓ Faster than SLA</div></div>
  </div>

  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">All</button>
      <button class="btn btn-ghost btn-sm">Pending (4)</button>
      <button class="btn btn-ghost btn-sm">Approved</button>
      <button class="btn btn-ghost btn-sm">Rejected</button>
      <button class="btn btn-ghost btn-sm">Completed</button>
      <input type="search" placeholder="Search refund..." class="form-input" style="margin-left:auto;width:250px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);">
        <th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Refund ID</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Order</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Requested by</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Reason</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Amount</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Status</th>
        <th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Action</th>
      </tr></thead>
      <tbody>
        ${[
          ['RFD-2026-041','ORD-0847','Diana BM','Deliverable tidak sesuai brief','Rp 549K (partial)','PENDING','warning'],
          ['RFD-2026-040','ORD-0801','Andi S.','Creator unresponsive &gt; 7 hari','Rp 799K (full)','PENDING','warning'],
          ['RFD-2026-039','ORD-0798','Ria C.','Duplicate order (accidental)','Rp 1.499K (full)','PENDING','warning'],
          ['RFD-2026-038','ORD-0765','Farhan Y.','Quality issue after 2 revisi','Rp 250K (partial)','APPROVED','success'],
          ['RFD-2026-037','ORD-0752','Kartika S.','Cancel before creator assigned','Rp 2.499K (full)','COMPLETED','success'],
          ['RFD-2026-036','ORD-0741','Budi H.','Miscommunication brief','Rp 199K (partial)','REJECTED','danger'],
        ].map(r=>`<tr style="border-bottom:1px solid var(--border-subtle);">
          <td style="padding:.875rem 1.5rem;font-family:monospace;font-size:.75rem;font-weight:700;color:var(--accent-primary);">${r[0]}</td>
          <td style="padding:.875rem;"><a href="order-detail.html" style="font-family:monospace;font-size:.75rem;color:var(--accent-primary);text-decoration:none;">#${r[1]}</a></td>
          <td style="padding:.875rem;">${r[2]}</td>
          <td style="padding:.875rem;color:var(--text-secondary);font-size:.8125rem;">${r[3]}</td>
          <td style="padding:.875rem;text-align:right;font-weight:700;">${r[4]}</td>
          <td style="padding:.875rem;text-align:center;"><span class="badge badge-${r[6]}">${r[5]}</span></td>
          <td style="padding:.875rem 1.5rem;text-align:right;">${r[5]==='PENDING'?'<button class="btn btn-primary btn-sm">Review</button>':'<button class="btn btn-ghost btn-sm">View</button>'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
`
};

PAGES['vouchers'] = {
  title: 'Vouchers',
  active: 'vouchers',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">FINANCE</div><h1>Vouchers &amp; Promotions</h1></div>
    <button class="btn btn-accent btn-sm">+ New Voucher</button>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Active Vouchers</div><div class="kpi-value">8</div><div class="kpi-change">2 expiring this week</div></div>
    <div class="kpi-card"><div class="kpi-label">Redemptions This Month</div><div class="kpi-value">347</div><div class="kpi-change">↑ 42% vs last</div></div>
    <div class="kpi-card"><div class="kpi-label">Total Discount Given</div><div class="kpi-value">Rp 8.7M</div><div class="kpi-change">GMV impact: Rp 68M</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg. Basket +</div><div class="kpi-value">+18%</div><div class="kpi-change">With voucher applied</div></div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem;">
    ${[
      ['WELCOME10','New user first order','10% off (max Rp 500K)','247 / 1000','Active','success','5 Jul – 31 Dec 2026'],
      ['ATOM50','Atom tier only','Rp 50K off','89 / 500','Active','success','1 Jul – 31 Aug 2026'],
      ['EPSILONFIRST','Epsilon first month','20% off first month','43 / 200','Active','success','15 Jun – 15 Sep 2026'],
      ['RAMADAN25','Ramadan campaign','25% off (max 1M)','520 / ∞','EXPIRED','','1 Mar – 30 Apr 2026'],
    ].map(v=>`<div class="card">
      <div style="padding:1.25rem 1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem;">
          <div><div style="font-family:monospace;font-size:1.125rem;font-weight:900;color:var(--accent-primary);letter-spacing:.05em;">${v[0]}</div><div style="font-size:.8125rem;color:var(--text-tertiary);margin-top:.25rem;">${v[1]}</div></div>
          <span class="badge badge-${v[5]||'default'}">${v[4]}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.75rem;">
          <div style="padding:.5rem .75rem;background:var(--bg-secondary);border-radius:6px;"><div style="font-size:.6875rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Discount</div><div style="font-weight:700;color:var(--text-primary);">${v[2]}</div></div>
          <div style="padding:.5rem .75rem;background:var(--bg-secondary);border-radius:6px;"><div style="font-size:.6875rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Usage</div><div style="font-weight:700;color:var(--text-primary);">${v[3]}</div></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:1px solid var(--border-subtle);">
          <span style="font-size:.75rem;color:var(--text-tertiary);">📅 ${v[6]}</span>
          <div style="display:flex;gap:.375rem;"><button class="btn btn-ghost btn-sm">Edit</button><button class="btn btn-ghost btn-sm">Duplicate</button></div>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <div class="card">
    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Recent Redemptions</h3></div>
    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);"><th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Voucher</th><th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Order</th><th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">User</th><th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Discount</th><th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Time</th></tr></thead>
      <tbody>
        ${[['WELCOME10','ORD-0847','Diana BM','Rp 549K','2h ago'],['ATOM50','ORD-0846','Andi S.','Rp 50K','3h ago'],['EPSILONFIRST','ORD-0844','PT Wardah','Rp 6M','5h ago']].map(r=>`<tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:.75rem 1.5rem;font-family:monospace;font-weight:700;color:var(--accent-primary);">${r[0]}</td><td style="padding:.75rem;font-family:monospace;font-size:.75rem;">#${r[1]}</td><td style="padding:.75rem;">${r[2]}</td><td style="padding:.75rem;text-align:right;font-weight:700;color:#059669;">- ${r[3]}</td><td style="padding:.75rem 1.5rem;text-align:right;color:var(--text-tertiary);font-size:.75rem;">${r[4]}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
`
};

// ---------- Phase 4: Communication & Projects ----------

PAGES['projects'] = {
  title: 'Projects',
  active: 'projects',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">MARKETPLACE</div><h1>Projects · 147 aktif</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Kanban View</button>
      <button class="btn btn-outline btn-sm">Export</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);">
    <div class="kpi-card"><div class="kpi-label">Assigned</div><div class="kpi-value">18</div><div class="kpi-change">Menunggu creator start</div></div>
    <div class="kpi-card"><div class="kpi-label">In Progress</div><div class="kpi-value" style="color:var(--accent-primary);">92</div><div class="kpi-change">Sedang dikerjakan</div></div>
    <div class="kpi-card"><div class="kpi-label">Under Review</div><div class="kpi-value" style="color:#F59E0B;">14</div><div class="kpi-change">Menunggu approval</div></div>
    <div class="kpi-card"><div class="kpi-label">Delivered</div><div class="kpi-value" style="color:var(--success);">21</div><div class="kpi-change">Selesai bulan ini</div></div>
    <div class="kpi-card"><div class="kpi-label">Overdue</div><div class="kpi-value" style="color:var(--danger);">2</div><div class="kpi-change">Perlu intervensi</div></div>
  </div>

  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">Semua (147)</button>
      <button class="btn btn-ghost btn-sm">Assigned</button>
      <button class="btn btn-ghost btn-sm">In Progress</button>
      <button class="btn btn-ghost btn-sm">Under Review</button>
      <button class="btn btn-ghost btn-sm">Delivered</button>
      <button class="btn btn-ghost btn-sm" style="color:var(--danger);">Overdue (2)</button>
      <input type="search" placeholder="Search project..." class="form-input" style="margin-left:auto;width:250px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);">
        <th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Project</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Client</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Creator</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Progress</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Deadline</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Status</th>
        <th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Action</th>
      </tr></thead>
      <tbody>
        ${[
          ['PRJ-0847','Epsilon Standard #2','Diana BM','Rifqi H.',55,'12 Jul','IN PROGRESS','warning'],
          ['PRJ-0846','Brand Foundation','PT Wardah','Amira S.',80,'8 Jul','UNDER REVIEW','warning'],
          ['PRJ-0845','Atom Neutron','Andi Setiawan','Anisa F.',30,'15 Jul','IN PROGRESS','warning'],
          ['PRJ-0844','Supernova Giant #4','MS Glow','Bagas P.',65,'20 Jul','IN PROGRESS','warning'],
          ['PRJ-0843','Product Video','Erigo','Rifqi H.',95,'6 Jul','UNDER REVIEW','warning'],
          ['PRJ-0842','Live Commerce 8h','Kopi Kenangan','Kayla R.',100,'3 Jul','DELIVERED','success'],
          ['PRJ-0841','Packaging Pro','Haus Coffee','Fajar N.',45,'2 Jul','OVERDUE','danger'],
        ].map(p=>`<tr style="border-bottom:1px solid var(--border-subtle);">
          <td style="padding:.875rem 1.5rem;"><a href="project-detail.html" style="text-decoration:none;color:inherit;"><div style="font-family:monospace;font-size:.75rem;font-weight:700;color:var(--accent-primary);">#${p[0]}</div><div style="font-weight:600;margin-top:.125rem;">${p[1]}</div></a></td>
          <td style="padding:.875rem;">${p[2]}</td>
          <td style="padding:.875rem;">${p[3]}</td>
          <td style="padding:.875rem;"><div style="display:flex;align-items:center;gap:.5rem;"><div style="width:100px;height:6px;background:var(--bg-secondary);border-radius:3px;overflow:hidden;"><div style="width:${p[4]}%;height:100%;background:${p[4]>=100?'var(--success)':p[7]==='danger'?'var(--danger)':'var(--accent-primary)'};"></div></div><span style="font-size:.75rem;font-weight:700;color:var(--text-secondary);">${p[4]}%</span></div></td>
          <td style="padding:.875rem;font-size:.8125rem;color:${p[7]==='danger'?'var(--danger)':'var(--text-secondary)'};font-weight:${p[7]==='danger'?700:400};">${p[5]}</td>
          <td style="padding:.875rem;text-align:center;"><span class="badge badge-${p[7]}">${p[6]}</span></td>
          <td style="padding:.875rem 1.5rem;text-align:right;"><a href="project-detail.html" class="btn btn-ghost btn-sm">View →</a></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
`
};

PAGES['project-detail'] = {
  title: 'Project Detail',
  active: 'projects',
  main: `
  <div style="display:flex;align-items:center;gap:.5rem;font-size:.8125rem;color:var(--text-tertiary);margin-bottom:.75rem;">
    <a href="projects.html" style="color:var(--accent-primary);text-decoration:none;">← Projects</a>
    <span>·</span><span>#PRJ-0847</span>
  </div>

  <div class="main-header">
    <div><div class="eyebrow mb-1">PROJECT #PRJ-0847</div><h1>Epsilon Standard — Kopi Kenangan Bulan #2</h1><div style="display:flex;gap:.5rem;margin-top:.5rem;"><span class="badge badge-warning">IN PROGRESS</span><span class="badge">Rp 5.499K</span><span class="badge">Deadline 12 Jul</span></div></div>
    <div style="display:flex;gap:.5rem;">
      <a href="chat-room.html" class="btn btn-outline btn-sm">💬 Open Chat</a>
      <a href="meeting-room.html" class="btn btn-outline btn-sm">📹 Meeting</a>
      <button class="btn btn-accent btn-sm">Mark Complete</button>
    </div>
  </div>

  <!-- Progress overview -->
  <div class="card mb-4">
    <div style="padding:1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1rem;">
        <div><div style="font-weight:800;font-size:1.125rem;">Overall Progress</div><div style="font-size:.8125rem;color:var(--text-tertiary);">18 / 33 deliverables (55%)</div></div>
        <div style="font-size:2rem;font-weight:900;color:var(--accent-primary);">55%</div>
      </div>
      <div style="height:12px;background:var(--bg-secondary);border-radius:6px;overflow:hidden;margin-bottom:1rem;">
        <div style="width:55%;height:100%;background:linear-gradient(90deg,var(--accent-primary),var(--accent-light));border-radius:6px;"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;">
        <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:var(--text-primary);">15<span style="font-size:.875rem;color:var(--text-tertiary);">/25</span></div><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;">Design</div></div>
        <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:var(--text-primary);">3<span style="font-size:.875rem;color:var(--text-tertiary);">/6</span></div><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;">Reels</div></div>
        <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:var(--text-primary);">0<span style="font-size:.875rem;color:var(--text-tertiary);">/2</span></div><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;">Sphere Items</div></div>
        <div style="padding:.75rem;background:var(--bg-secondary);border-radius:8px;text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:var(--text-primary);">2<span style="font-size:.875rem;color:var(--text-tertiary);">/5</span></div><div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;">Revisi Used</div></div>
      </div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 340px;gap:2rem;">
    <div>
      <!-- Deliverables -->
      <div class="card mb-4">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-weight:700;">Deliverables</h3>
          <button class="btn btn-outline btn-sm">+ Upload Delivery</button>
        </div>
        <div style="padding:1rem 1.5rem;">
          ${[
            ['Feed Instagram — Batch 3 (5 files)','15 Jul','Awaiting approval','warning','5 files · 12MB'],
            ['Reels Product Highlight','12 Jul','Approved by client','success','1 file · 45MB'],
            ['Feed Instagram — Batch 2 (5 files)','8 Jul','Approved','success','5 files · 15MB'],
            ['Reels Behind The Scene','5 Jul','Revision requested','danger','1 file · 38MB — "Kurang dinamis"'],
            ['Feed Instagram — Batch 1 (5 files)','2 Jul','Approved','success','5 files · 14MB'],
          ].map(d=>`<div style="display:flex;align-items:center;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--border-subtle);">
            <div style="width:44px;height:44px;background:${d[3]==='success'?'#D1FAE5':d[3]==='danger'?'#FEE2E2':'#FEF3C7'};color:${d[3]==='success'?'#059669':d[3]==='danger'?'#DC2626':'#B45309'};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;">${d[3]==='success'?'✓':d[3]==='danger'?'↺':'⏳'}</div>
            <div style="flex:1;"><div style="font-weight:700;">${d[0]}</div><div style="font-size:.75rem;color:var(--text-tertiary);margin-top:.125rem;">📎 ${d[4]}</div></div>
            <div style="text-align:right;"><div style="font-size:.75rem;color:var(--text-tertiary);">${d[1]}</div><span class="badge badge-${d[3]}" style="font-size:.6875rem;margin-top:.25rem;">${d[2]}</span></div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Recent activity -->
      <div class="card">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Recent Activity</h3></div>
        <div style="padding:1.25rem 1.5rem;position:relative;">
          <div style="position:absolute;left:2rem;top:2rem;bottom:2rem;width:2px;background:var(--border-subtle);"></div>
          ${[
            ['Rifqi H.','uploaded 5 files "Feed Instagram — Batch 3"','2 hours ago','upload'],
            ['Diana BM','requested revision on "Reels BTS"','5 hours ago','revision'],
            ['Rifqi H.','delivered "Reels Product Highlight"','Yesterday','deliver'],
            ['Diana BM','approved "Feed Instagram — Batch 2"','2 days ago','approve'],
            ['Rifqi H.','started work on Batch 3','3 days ago','start'],
          ].map(a=>`<div style="display:flex;gap:1rem;padding:.5rem 0;position:relative;">
            <div style="width:32px;height:32px;border-radius:50%;background:white;border:2px solid var(--accent-primary);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--accent-primary);flex-shrink:0;z-index:1;font-size:.875rem;">${a[0][0]}</div>
            <div style="flex:1;padding:.375rem 0;"><span style="font-weight:700;">${a[0]}</span> <span style="color:var(--text-secondary);">${a[1]}</span><div style="font-size:.75rem;color:var(--text-tertiary);margin-top:.125rem;">${a[2]}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <aside>
      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">PARTICIPANTS</div>
        <div style="padding:1rem 1.25rem;">
          <div style="display:flex;gap:.75rem;align-items:center;margin-bottom:1rem;"><div style="width:40px;height:40px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">D</div><div style="flex:1;"><div style="font-weight:700;font-size:.9375rem;">Diana BM</div><div style="font-size:.75rem;color:var(--text-tertiary);">Client · PT Kopi Kenangan</div></div><span style="width:8px;height:8px;background:var(--success);border-radius:50%;"></span></div>
          <div style="display:flex;gap:.75rem;align-items:center;"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" /><div style="flex:1;"><div style="font-weight:700;font-size:.9375rem;">Rifqi Handoko</div><div style="font-size:.75rem;color:var(--text-tertiary);">Creator · Elite</div></div><span style="width:8px;height:8px;background:var(--success);border-radius:50%;"></span></div>
        </div>
      </div>

      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">TIMELINE</div>
        <div style="padding:1rem 1.25rem;font-size:.8125rem;line-height:1.9;">
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">Started</span><span>5 Jul 2026</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">Deadline</span><span style="font-weight:700;">12 Jul 2026</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">Days left</span><span style="color:#F59E0B;font-weight:700;">7 days</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-tertiary);">Extensions</span><span>0 used</span></div>
        </div>
      </div>

      <div class="card">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:700;font-size:.875rem;">ADMIN ACTIONS</div>
        <div style="padding:.75rem;display:flex;flex-direction:column;gap:.5rem;">
          <button class="btn btn-outline btn-sm">Extend Deadline</button>
          <button class="btn btn-outline btn-sm">Reassign Creator</button>
          <button class="btn btn-outline btn-sm">Escalate to Dispute</button>
          <button class="btn btn-outline btn-sm">Add Admin Note</button>
        </div>
      </div>
    </aside>
  </div>
`
};

PAGES['chats'] = {
  title: 'Chats',
  active: 'chats',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">COMMUNICATION</div><h1>Chats Monitor</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Filter</button>
      <button class="btn btn-outline btn-sm">Broadcast</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Active Chats</div><div class="kpi-value">147</div><div class="kpi-change">↑ 12 new today</div></div>
    <div class="kpi-card"><div class="kpi-label">Unread (Admin)</div><div class="kpi-value" style="color:#F59E0B;">7</div><div class="kpi-change">Requires attention</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg. Response Time</div><div class="kpi-value">42m</div><div class="kpi-change">↓ 8% vs last week</div></div>
    <div class="kpi-card"><div class="kpi-label">Flagged Conversations</div><div class="kpi-value" style="color:var(--danger);">3</div><div class="kpi-change">Auto-detected</div></div>
  </div>

  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">All (147)</button>
      <button class="btn btn-ghost btn-sm">Unread (7)</button>
      <button class="btn btn-ghost btn-sm">Flagged (3)</button>
      <button class="btn btn-ghost btn-sm">Admin-joined (5)</button>
      <button class="btn btn-ghost btn-sm">Idle &gt; 3d (12)</button>
      <input type="search" placeholder="Search chat, user, project..." class="form-input" style="margin-left:auto;width:280px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <div>
      ${[
        ['ORD-0847','Diana BM','Rifqi H.','Terima kasih, saya tunggu revisi batch 3-nya ya','2m ago',3,'active'],
        ['ORD-0841','Haus Coffee','Fajar N.','Kapan bisa selesai kak?','15m ago',1,'flagged'],
        ['ORD-0846','PT Wardah','Amira S.','File final sudah saya kirim via drive','1h ago',0,'active'],
        ['ORD-0845','Andi Setiawan','Anisa F.','Boleh minta preview dulu?','2h ago',2,'active'],
        ['ORD-0842','Kopi Kenangan','Kayla R.','Session live sudah selesai 🎉','5h ago',0,'active'],
        ['ORD-0844','MS Glow','Bagas P.','SEO audit report attached','Yesterday',0,'active'],
        ['ORD-0839','Erigo','Rifqi H.','Refund request submitted','2 days ago',1,'flagged'],
      ].map(c=>`<a href="chat-room.html" style="display:flex;align-items:center;padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);text-decoration:none;color:inherit;gap:1rem;${c[6]==='flagged'?'background:#FEF2F2;':''}">
        <div style="display:flex;position:relative;">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">${c[1][0]}</div>
          <div style="width:40px;height:40px;border-radius:50%;background:var(--accent-light);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;margin-left:-12px;border:2px solid white;">${c[2][0]}</div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.25rem;">
            <div style="display:flex;gap:.5rem;align-items:center;"><span style="font-weight:700;">${c[1]} ↔ ${c[2]}</span><span style="font-family:monospace;font-size:.6875rem;color:var(--text-tertiary);">#${c[0]}</span>${c[6]==='flagged'?'<span class="badge badge-danger" style="font-size:.6875rem;">FLAGGED</span>':''}</div>
            <span style="font-size:.75rem;color:var(--text-tertiary);">${c[4]}</span>
          </div>
          <div style="font-size:.875rem;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c[3]}</div>
        </div>
        ${c[5]>0?`<span style="min-width:22px;height:22px;padding:0 6px;background:var(--accent-primary);color:white;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:.6875rem;font-weight:800;">${c[5]}</span>`:''}
      </a>`).join('')}
    </div>
  </div>
`
};

PAGES['chat-room'] = {
  title: 'Chat Room',
  active: 'chats',
  extraStyle: `
    .main-content { padding: 0 !important; height: 100vh; overflow: hidden; }
    .chat-layout { display: grid; grid-template-columns: 300px 1fr 280px; height: 100vh; }
    .chat-list { border-right: 1px solid var(--border-subtle); background: var(--bg-secondary); overflow-y: auto; }
    .chat-list-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-subtle); background: white; }
    .chat-list-item { padding: .875rem 1.25rem; border-bottom: 1px solid var(--border-subtle); cursor: pointer; display: flex; gap: .625rem; align-items: center; }
    .chat-list-item:hover { background: white; }
    .chat-list-item.active { background: white; border-left: 3px solid var(--accent-primary); }
    .chat-main { display: flex; flex-direction: column; background: white; overflow: hidden; }
    .chat-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 1rem; background: white; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; background: linear-gradient(180deg, var(--bg-secondary) 0%, white 100%); }
    .msg { display: flex; gap: .625rem; max-width: 70%; }
    .msg.mine { align-self: flex-end; flex-direction: row-reverse; }
    .msg.admin { align-self: center; max-width: 90%; }
    .msg-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .75rem; color: white; }
    .msg-body { background: white; padding: .625rem .875rem; border-radius: 12px; border: 1px solid var(--border-subtle); }
    .msg.mine .msg-body { background: var(--accent-primary); color: white; border-color: var(--accent-primary); }
    .msg.admin .msg-body { background: #FEF3C7; color: #92400E; border-color: #FDE68A; text-align: center; font-size: .8125rem; }
    .msg-time { font-size: .6875rem; color: var(--text-tertiary); margin-top: .25rem; }
    .msg.mine .msg-time { text-align: right; }
    .msg-name { font-size: .75rem; font-weight: 700; color: var(--accent-primary); margin-bottom: .125rem; }
    .chat-input-wrap { padding: 1rem 1.5rem; border-top: 1px solid var(--border-subtle); background: white; }
    .chat-input-row { display: flex; gap: .5rem; align-items: flex-end; }
    .chat-input-row textarea { flex: 1; min-height: 44px; max-height: 120px; padding: .625rem .875rem; border: 1px solid var(--border-default); border-radius: 22px; font-family: inherit; font-size: .9375rem; resize: none; }
    .chat-sidebar { border-left: 1px solid var(--border-subtle); background: var(--bg-secondary); overflow-y: auto; padding: 1.25rem; }
    .file-attachment { display: inline-flex; align-items: center; gap: .5rem; padding: .5rem .875rem; background: white; border: 1px solid var(--border-subtle); border-radius: 8px; font-size: .8125rem; }
  `,
  main: `
  <div class="chat-layout">
    <!-- Chat list -->
    <div class="chat-list">
      <div class="chat-list-header">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem;">
          <a href="chats.html" style="color:var(--accent-primary);text-decoration:none;">←</a>
          <div style="font-weight:800;font-size:1rem;">Active Chats</div>
          <span class="badge badge-accent" style="margin-left:auto;">7</span>
        </div>
        <input type="search" placeholder="Search..." class="form-input" style="width:100%;font-size:.8125rem;padding:.5rem .75rem;" />
      </div>
      ${[
        ['Diana ↔ Rifqi','#ORD-0847','Ok saya tunggu revisi...','2m',3,true],
        ['Haus ↔ Fajar','#ORD-0841','Kapan bisa selesai kak?','15m',1,false],
        ['Wardah ↔ Amira','#ORD-0846','File sudah dikirim','1h',0,false],
        ['Andi ↔ Anisa','#ORD-0845','Boleh preview dulu?','2h',2,false],
        ['Kopi K. ↔ Kayla','#ORD-0842','Session selesai 🎉','5h',0,false],
        ['MS Glow ↔ Bagas','#ORD-0844','SEO audit attached','Yesterday',0,false],
      ].map(c=>`<div class="chat-list-item ${c[5]?'active':''}">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.875rem;flex-shrink:0;">${c[0][0]}</div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:700;font-size:.875rem;">${c[0]}</span><span style="font-size:.6875rem;color:var(--text-tertiary);">${c[3]}</span></div>
          <div style="font-family:monospace;font-size:.6875rem;color:var(--text-tertiary);">${c[1]}</div>
          <div style="font-size:.75rem;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c[2]}</div>
        </div>
        ${c[4]>0?`<span style="min-width:18px;height:18px;padding:0 5px;background:var(--accent-primary);color:white;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.625rem;font-weight:800;">${c[4]}</span>`:''}
      </div>`).join('')}
    </div>

    <!-- Chat main -->
    <div class="chat-main">
      <div class="chat-header">
        <div style="display:flex;position:relative;">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">D</div>
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" style="width:40px;height:40px;border-radius:50%;object-fit:cover;margin-left:-12px;border:2px solid white;" />
        </div>
        <div style="flex:1;">
          <div style="font-weight:800;">Diana BM ↔ Rifqi Handoko</div>
          <div style="font-size:.75rem;color:var(--text-tertiary);"><a href="order-detail.html" style="color:var(--accent-primary);font-family:monospace;text-decoration:none;">#ORD-0847</a> · Both online · <span style="color:var(--success);">●</span> Active now</div>
        </div>
        <div style="display:flex;gap:.5rem;">
          <a href="meeting-room.html" class="btn btn-outline btn-sm">📹 Video Call</a>
          <button class="btn btn-outline btn-sm">👁 Watch Mode</button>
          <button class="btn btn-outline btn-sm" style="color:var(--danger);">🚩 Flag</button>
        </div>
      </div>

      <div class="chat-messages">
        <div class="msg admin"><div class="msg-body">⚠ Admin (Sarah) joined this conversation in watch mode · 3 hours ago</div></div>

        <div class="msg">
          <div class="msg-avatar" style="background:var(--accent-primary);">D</div>
          <div><div class="msg-name">Diana BM</div><div class="msg-body">Halo mas Rifqi, saya sudah lihat batch 2 kemarin. Overall bagus, tapi untuk feed #5 apakah bisa lebih vibrant colornya?</div><div class="msg-time">10:24 AM</div></div>
        </div>

        <div class="msg mine">
          <div class="msg-avatar" style="background:var(--accent-light);">R</div>
          <div><div class="msg-body">Baik kak Diana, noted. Untuk feed #5 saya akan naikin saturation +15 dan brighten shadows. Preview sore ini ya.</div><div class="msg-time">10:31 AM</div></div>
        </div>

        <div class="msg">
          <div class="msg-avatar" style="background:var(--accent-primary);">D</div>
          <div><div class="msg-name">Diana BM</div><div class="msg-body">Perfect. Btw untuk batch 3, saya kirim referensi mood board via drive ya. Cek DM.</div><div class="msg-time">10:33 AM</div></div>
        </div>

        <div class="msg mine">
          <div class="msg-avatar" style="background:var(--accent-light);">R</div>
          <div><div class="msg-body">Sip kak, on it.</div><div class="msg-time">10:34 AM</div></div>
        </div>

        <div class="msg">
          <div class="msg-avatar" style="background:var(--accent-primary);">D</div>
          <div><div class="msg-name">Diana BM</div><div class="msg-body" style="padding:.5rem;"><div class="file-attachment"><span>📎</span><div><div style="font-weight:700;font-size:.8125rem;">MoodBoard_KopiKenangan_JulEd.pdf</div><div style="color:var(--text-tertiary);font-size:.6875rem;">2.4 MB · PDF</div></div></div></div><div class="msg-time">10:35 AM</div></div>
        </div>

        <div class="msg mine">
          <div class="msg-avatar" style="background:var(--accent-light);">R</div>
          <div><div class="msg-body">Received. Wah design directionnya lebih warm-tone ya. Nice, ini nge-align banget sama campaign Ramadan-nya.</div><div class="msg-time">10:41 AM</div></div>
        </div>

        <div class="msg">
          <div class="msg-avatar" style="background:var(--accent-primary);">D</div>
          <div><div class="msg-name">Diana BM</div><div class="msg-body">Yes exactly! Terima kasih, saya tunggu revisi batch 3-nya ya 😊</div><div class="msg-time">Just now</div></div>
        </div>
      </div>

      <div class="chat-input-wrap">
        <div style="font-size:.75rem;color:var(--text-tertiary);margin-bottom:.5rem;padding:.5rem;background:#FEF3C7;border-radius:6px;">⚠ You are in <strong>Watch Mode</strong> — messages you send will be marked as [Admin] and visible to both parties.</div>
        <div class="chat-input-row">
          <button style="width:40px;height:40px;background:var(--bg-secondary);border:1px solid var(--border-subtle);border-radius:50%;font-size:1.125rem;cursor:pointer;">📎</button>
          <textarea placeholder="Type as admin (yellow highlight)..."></textarea>
          <button class="btn btn-primary" style="height:44px;">Send</button>
        </div>
      </div>
    </div>

    <!-- Right sidebar: project context -->
    <aside class="chat-sidebar">
      <div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.75rem;">PROJECT CONTEXT</div>
      <div style="background:white;border:1px solid var(--border-subtle);border-radius:10px;padding:1rem;margin-bottom:1rem;">
        <div style="font-family:monospace;font-size:.75rem;color:var(--accent-primary);font-weight:700;">#ORD-0847</div>
        <div style="font-weight:800;margin:.25rem 0;">Epsilon Standard Bulan #2</div>
        <div style="font-size:.75rem;color:var(--text-tertiary);">55% complete · 7 days left</div>
        <a href="order-detail.html" class="btn btn-outline btn-sm" style="width:100%;margin-top:.75rem;">View Order</a>
      </div>

      <div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.75rem;">SHARED FILES (12)</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem;">
        ${['MoodBoard_Kopi.pdf','Batch2_Feed_Final.zip','Brief_Bulan2.docx','Reference_Warm.jpg'].map(f=>`<div style="display:flex;gap:.5rem;align-items:center;padding:.5rem;background:white;border:1px solid var(--border-subtle);border-radius:6px;font-size:.75rem;"><span>📄</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f}</span></div>`).join('')}
      </div>

      <div style="font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.75rem;">ADMIN NOTES</div>
      <textarea placeholder="Internal admin note..." style="width:100%;min-height:80px;padding:.625rem;border:1px solid var(--border-default);border-radius:8px;font-size:.8125rem;font-family:inherit;"></textarea>
    </aside>
  </div>
`
};

PAGES['meetings'] = {
  title: 'Video Meetings',
  active: 'meetings',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">COMMUNICATION</div><h1>Video Meetings</h1></div>
    <button class="btn btn-accent btn-sm">+ Schedule Meeting</button>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Meetings Today</div><div class="kpi-value">12</div><div class="kpi-change">3 upcoming, 9 done</div></div>
    <div class="kpi-card"><div class="kpi-label">Live Now</div><div class="kpi-value" style="color:var(--danger);">◉ 2</div><div class="kpi-change">Real-time monitoring</div></div>
    <div class="kpi-card"><div class="kpi-label">Total This Month</div><div class="kpi-value">247</div><div class="kpi-change">Avg 42 min/session</div></div>
    <div class="kpi-card"><div class="kpi-label">Server Load</div><div class="kpi-value" style="color:var(--success);">14%</div><div class="kpi-change">WebRTC · healthy</div></div>
  </div>

  <!-- Live meetings -->
  <div class="card mb-4" style="border-color:var(--danger);">
    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);background:#FEF2F2;display:flex;justify-content:space-between;align-items:center;">
      <div style="display:flex;gap:.75rem;align-items:center;"><span style="width:10px;height:10px;background:var(--danger);border-radius:50%;animation:pulse 1.5s infinite;"></span><h3 style="font-weight:800;color:var(--danger);">LIVE NOW · 2 meetings</h3></div>
      <button class="btn btn-outline btn-sm" style="color:var(--danger);border-color:var(--danger);">Join as Admin (silent)</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">
      ${[
        ['ORD-0846','Kick-off Meeting Amira','PT Wardah × Amira Salsabila','12:32','Started 32m ago'],
        ['ORD-0844','Strategy Q3 Review','MS Glow × Bagas Prakoso','04:11','Started 11m ago'],
      ].map((m,i)=>`<div style="padding:1.25rem 1.5rem;${i===0?'border-right:1px solid var(--border-subtle);':''}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem;">
          <div><div style="font-family:monospace;font-size:.75rem;color:var(--accent-primary);font-weight:700;">#${m[0]}</div><div style="font-weight:700;margin-top:.125rem;">${m[1]}</div></div>
          <span class="badge badge-danger">● LIVE</span>
        </div>
        <div style="font-size:.8125rem;color:var(--text-secondary);margin-bottom:.75rem;">${m[2]}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:1px solid var(--border-subtle);"><span style="font-size:.75rem;color:var(--text-tertiary);">${m[4]} · Duration ${m[3]}</span><a href="meeting-room.html" class="btn btn-outline btn-sm">Monitor →</a></div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Meetings list -->
  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">All</button>
      <button class="btn btn-ghost btn-sm">Upcoming</button>
      <button class="btn btn-ghost btn-sm">Completed</button>
      <button class="btn btn-ghost btn-sm">Recorded (128)</button>
      <button class="btn btn-ghost btn-sm">Cancelled</button>
      <input type="search" placeholder="Search meeting..." class="form-input" style="margin-left:auto;width:250px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);">
        <th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Meeting</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Order</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Participants</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Schedule</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Duration</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Status</th>
        <th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Action</th>
      </tr></thead>
      <tbody>
        ${[
          ['Kick-off Meeting Amira','ORD-0846','PT Wardah, Amira S.','Today 15:00','32m','LIVE','danger'],
          ['Revision Discussion','ORD-0847','Diana BM, Rifqi H.','Tomorrow 10:00','—','SCHEDULED','warning'],
          ['Final Preview Session','ORD-0843','Erigo, Rifqi H.','Today 09:00','48m','COMPLETED','success'],
          ['Strategy Bulan Ini','ORD-0844','MS Glow, Bagas P.','Yesterday 14:00','1h 12m','COMPLETED · Recorded','success'],
          ['Onboarding Session','ORD-0821','Andi S., Anisa F.','2 days ago','25m','COMPLETED','success'],
        ].map(m=>`<tr style="border-bottom:1px solid var(--border-subtle);">
          <td style="padding:.875rem 1.5rem;font-weight:600;">${m[0]}</td>
          <td style="padding:.875rem;"><a href="order-detail.html" style="font-family:monospace;font-size:.75rem;color:var(--accent-primary);text-decoration:none;">#${m[1]}</a></td>
          <td style="padding:.875rem;color:var(--text-secondary);">${m[2]}</td>
          <td style="padding:.875rem;text-align:right;">${m[3]}</td>
          <td style="padding:.875rem;text-align:right;color:var(--text-tertiary);">${m[4]}</td>
          <td style="padding:.875rem;text-align:center;"><span class="badge badge-${m[6]}">${m[5]}</span></td>
          <td style="padding:.875rem 1.5rem;text-align:right;"><a href="meeting-room.html" class="btn btn-ghost btn-sm">${m[5]==='LIVE'?'Monitor':m[5].includes('COMPLETED')?'Recording':'Join'}</a></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <style>
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .5; transform: scale(1.2); }
    }
  </style>
`
};

PAGES['meeting-room'] = {
  title: 'Meeting Room',
  active: 'meetings',
  extraStyle: `
    body { background: #0A0F1C; }
    .main-content { padding: 0 !important; height: 100vh; overflow: hidden; background: #0A0F1C; color: white; }
    .meeting-layout { display: grid; grid-template-rows: 60px 1fr 100px; height: 100vh; background: #0A0F1C; }
    .meeting-header { padding: 0 1.5rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.4); backdrop-filter: blur(20px); }
    .meeting-body { display: grid; grid-template-columns: 1fr 320px; padding: 1rem 1.5rem; gap: 1rem; overflow: hidden; }
    .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; align-content: center; }
    .video-tile { background: linear-gradient(135deg, #1E293B, #0F172A); border-radius: 12px; aspect-ratio: 16/9; position: relative; overflow: hidden; border: 2px solid transparent; }
    .video-tile.speaking { border-color: var(--accent-primary); box-shadow: 0 0 0 4px rgba(28,77,141,.3); }
    .video-tile img { width: 100%; height: 100%; object-fit: cover; }
    .video-tile-label { position: absolute; bottom: 12px; left: 12px; padding: .375rem .75rem; background: rgba(0,0,0,.7); backdrop-filter: blur(10px); border-radius: 6px; font-size: .8125rem; font-weight: 600; display: flex; align-items: center; gap: .375rem; }
    .video-tile-status { position: absolute; top: 12px; right: 12px; display: flex; gap: .375rem; }
    .video-tile-status .icon { width: 30px; height: 30px; background: rgba(0,0,0,.6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .75rem; backdrop-filter: blur(10px); }
    .video-tile-status .icon.muted { background: var(--danger); }
    .video-tile-avatar { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .video-tile-avatar div { width: 100px; height: 100px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; color: white; }
    .meeting-side { display: flex; flex-direction: column; gap: 1rem; overflow: hidden; }
    .side-panel { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; backdrop-filter: blur(20px); overflow: hidden; }
    .side-panel-header { padding: .875rem 1rem; border-bottom: 1px solid rgba(255,255,255,.1); font-size: .75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.6); }
    .side-panel-body { padding: .75rem 1rem; }
    .participant-row { display: flex; align-items: center; gap: .625rem; padding: .5rem 0; font-size: .875rem; }
    .participant-row .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }
    .chat-side-msg { padding: .5rem .75rem; background: rgba(255,255,255,.05); border-radius: 8px; margin-bottom: .5rem; font-size: .8125rem; }
    .chat-side-msg strong { color: var(--accent-light); }
    .meeting-controls { padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,.4); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,.1); }
    .ctrl-btn { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); color: white; font-size: 1.25rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
    .ctrl-btn:hover { background: rgba(255,255,255,.2); }
    .ctrl-btn.active { background: var(--accent-primary); }
    .ctrl-btn.danger { background: var(--danger); }
    .ctrl-btn.muted { background: var(--danger); }
    .rec-indicator { display: inline-flex; align-items: center; gap: .375rem; padding: .375rem .625rem; background: rgba(239,68,68,.15); border: 1px solid rgba(239,68,68,.4); border-radius: 20px; font-size: .75rem; color: #FCA5A5; font-weight: 700; }
    .rec-indicator .dot { width: 8px; height: 8px; background: #EF4444; border-radius: 50%; animation: pulse 1.5s infinite; }
  `,
  main: `
  <div class="meeting-layout">
    <!-- Header -->
    <div class="meeting-header">
      <a href="meetings.html" style="color:rgba(255,255,255,.7);text-decoration:none;">←</a>
      <div>
        <div style="font-size:.75rem;color:rgba(255,255,255,.5);font-family:monospace;">#ORD-0846 · Meeting Room</div>
        <div style="font-weight:800;">Kick-off Meeting — PT Wardah × Amira Salsabila</div>
      </div>
      <div style="margin-left:auto;display:flex;gap:.75rem;align-items:center;">
        <div class="rec-indicator"><span class="dot"></span>REC · 32:14</div>
        <span style="font-size:.8125rem;color:rgba(255,255,255,.6);">👁 Admin monitoring (silent)</span>
        <span style="padding:.375rem .625rem;background:rgba(255,255,255,.1);border-radius:20px;font-size:.75rem;color:rgba(255,255,255,.7);font-family:monospace;">HD 1080p · 42ms</span>
      </div>
    </div>

    <!-- Body -->
    <div class="meeting-body">
      <div class="video-grid">
        <!-- Client video -->
        <div class="video-tile speaking">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800" alt="" />
          <div class="video-tile-label"><span style="width:8px;height:8px;background:var(--success);border-radius:50%;"></span>Diana BM (Wardah) · Speaking</div>
          <div class="video-tile-status"><div class="icon">🎤</div><div class="icon">🎥</div></div>
        </div>

        <!-- Creator video -->
        <div class="video-tile">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800" alt="" />
          <div class="video-tile-label">Amira Salsabila</div>
          <div class="video-tile-status"><div class="icon">🎤</div><div class="icon">🎥</div></div>
        </div>

        <!-- Screen share -->
        <div class="video-tile" style="grid-column: span 2; aspect-ratio: 16/8;">
          <div style="position:absolute;inset:0;background:linear-gradient(135deg,#F1F5F9,#CBD5E1);padding:1.5rem;">
            <div style="background:white;padding:1.5rem;border-radius:8px;height:100%;color:#0F172A;">
              <div style="font-size:.75rem;letter-spacing:.1em;color:#64748B;text-transform:uppercase;font-weight:700;margin-bottom:.5rem;">Brand Foundation Deck · Slide 3/12</div>
              <div style="font-size:1.5rem;font-weight:900;margin-bottom:1rem;color:#0F2854;">Target Audience — Wardah Q3 2026</div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;font-size:.75rem;">
                <div style="padding:.75rem;background:#F1F5F9;border-radius:6px;"><strong>Primary:</strong> Wanita 18-30</div>
                <div style="padding:.75rem;background:#F1F5F9;border-radius:6px;"><strong>Secondary:</strong> Mahasiswi</div>
                <div style="padding:.75rem;background:#F1F5F9;border-radius:6px;"><strong>Aspirasi:</strong> Modern hijabers</div>
              </div>
            </div>
          </div>
          <div class="video-tile-label"><span>📺</span>Screen sharing by Amira</div>
        </div>
      </div>

      <!-- Side panels -->
      <div class="meeting-side">
        <div class="side-panel">
          <div class="side-panel-header">Participants (3)</div>
          <div class="side-panel-body">
            <div class="participant-row"><span class="dot"></span><div style="width:32px;height:32px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;">D</div><div style="flex:1;"><div>Diana BM <span style="color:rgba(255,255,255,.4);font-size:.75rem;">· Host</span></div></div><span>🎤</span></div>
            <div class="participant-row"><span class="dot"></span><div style="width:32px;height:32px;border-radius:50%;background:var(--accent-light);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;">A</div><div style="flex:1;">Amira Salsabila</div><span>🎤</span></div>
            <div class="participant-row"><span class="dot" style="background:#F59E0B;"></span><div style="width:32px;height:32px;border-radius:50%;background:#F59E0B;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;">S</div><div style="flex:1;">Admin Sarah <span style="color:rgba(255,255,255,.4);font-size:.75rem;">· 👁 Silent</span></div></div>
          </div>
        </div>

        <div class="side-panel" style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
          <div class="side-panel-header">Chat</div>
          <div class="side-panel-body" style="flex:1;overflow-y:auto;">
            <div class="chat-side-msg"><strong>Diana BM</strong> · 12:32 · Hi Amira, thanks for jumping on!</div>
            <div class="chat-side-msg"><strong>Amira</strong> · 12:33 · Halo kak, siap 🙂</div>
            <div class="chat-side-msg"><strong>Diana BM</strong> · 12:45 · Slide 3 ini yg butuh alignment, apakah target audience-nya masih valid?</div>
            <div class="chat-side-msg"><strong>Amira</strong> · 12:48 · Kalau boleh saran, mungkin kita bisa add "young professionals" juga sebagai segment kedua</div>
            <div class="chat-side-msg" style="background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3);"><strong style="color:#FCD34D;">[Admin] Sarah</strong> · 12:52 · Note: adjust brief nya di project detail nanti ya, saya update</div>
          </div>
          <div style="padding:.75rem 1rem;border-top:1px solid rgba(255,255,255,.1);"><input type="text" placeholder="Type message..." style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:.5rem .75rem;color:white;font-size:.875rem;" /></div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="meeting-controls">
      <div style="display:flex;gap:.75rem;">
        <button class="ctrl-btn">🎤</button>
        <button class="ctrl-btn">🎥</button>
        <button class="ctrl-btn">📺</button>
        <button class="ctrl-btn">✋</button>
        <button class="ctrl-btn active">💬</button>
      </div>
      <div style="text-align:center;">
        <div style="font-size:.6875rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em;">Meeting ID · MTG-2026-847</div>
        <div style="font-size:.875rem;font-family:monospace;color:rgba(255,255,255,.7);">alnilam.id/mtg/8f2a-3b4c-9d1e</div>
      </div>
      <div style="display:flex;gap:.75rem;">
        <button class="ctrl-btn">👥</button>
        <button class="ctrl-btn">⚙</button>
        <button class="ctrl-btn danger">📞</button>
      </div>
    </div>
  </div>
`
};

PAGES['notifications'] = {
  title: 'Notifications',
  active: 'notifications',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">COMMUNICATION</div><h1>Notifications</h1></div>
    <button class="btn btn-accent btn-sm">+ New Template</button>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Sent Today</div><div class="kpi-value">1,247</div><div class="kpi-change">Email + In-app + WA</div></div>
    <div class="kpi-card"><div class="kpi-label">Delivery Rate</div><div class="kpi-value" style="color:var(--success);">98.4%</div><div class="kpi-change">Above SLA</div></div>
    <div class="kpi-card"><div class="kpi-label">Open Rate</div><div class="kpi-value">42%</div><div class="kpi-change">Email · industry avg 21%</div></div>
    <div class="kpi-card"><div class="kpi-label">Failed / Bounced</div><div class="kpi-value" style="color:var(--danger);">20</div><div class="kpi-change">Auto-cleaned</div></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
    ${[
      ['📧','Email','SendGrid','ACTIVE','487 sent today · 41% open','success'],
      ['🔔','In-App','WebSocket · Redis','ACTIVE','624 delivered · 78% clicked','success'],
      ['💬','WhatsApp','WA Cloud API','ACTIVE','136 sent · 92% read','success'],
    ].map(c=>`<div class="card">
      <div style="padding:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
          <div style="font-size:2rem;">${c[0]}</div>
          <span class="badge badge-${c[5]}">${c[3]}</span>
        </div>
        <div style="font-weight:800;font-size:1.125rem;">${c[1]}</div>
        <div style="font-size:.75rem;color:var(--text-tertiary);margin-top:.125rem;margin-bottom:.75rem;">${c[2]}</div>
        <div style="font-size:.8125rem;color:var(--text-secondary);padding-top:.75rem;border-top:1px solid var(--border-subtle);">${c[4]}</div>
      </div>
    </div>`).join('')}
  </div>

  <div class="card">
    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Notification Templates (24)</h3></div>
    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);">
        <th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Template</th>
        <th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Trigger</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Channels</th>
        <th style="text-align:right;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Sent (30d)</th>
        <th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Status</th>
        <th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Action</th>
      </tr></thead>
      <tbody>
        ${[
          ['Welcome — New Client','user.registered (client)','📧 🔔',847,'ACTIVE','success'],
          ['Welcome — New Creator','user.registered (creator)','📧 🔔',243,'ACTIVE','success'],
          ['Order Placed Confirmation','order.created','📧 🔔 💬',1420,'ACTIVE','success'],
          ['Payment Received','payment.success','📧 🔔',1398,'ACTIVE','success'],
          ['Creator Assigned','order.creator_assigned','🔔 💬',1287,'ACTIVE','success'],
          ['Deliverable Uploaded','project.deliverable_added','🔔',3421,'ACTIVE','success'],
          ['Revision Requested','project.revision_requested','📧 🔔 💬',847,'ACTIVE','success'],
          ['Order Completed','order.completed','📧 🔔',1120,'ACTIVE','success'],
          ['Payout Processed','payout.completed','📧 🔔',412,'ACTIVE','success'],
          ['KYC Approved','user.kyc_approved','📧 🔔',87,'ACTIVE','success'],
          ['Refund Approved','refund.approved','📧 🔔 💬',34,'ACTIVE','success'],
          ['Meeting Reminder (1h)','meeting.reminder_1h','🔔 💬',247,'PAUSED','warning'],
        ].map(t=>`<tr style="border-bottom:1px solid var(--border-subtle);">
          <td style="padding:.75rem 1.5rem;font-weight:600;">${t[0]}</td>
          <td style="padding:.75rem;font-family:monospace;font-size:.75rem;color:var(--text-secondary);">${t[1]}</td>
          <td style="padding:.75rem;text-align:center;font-size:1rem;">${t[2]}</td>
          <td style="padding:.75rem;text-align:right;font-weight:700;">${t[3].toLocaleString()}</td>
          <td style="padding:.75rem;text-align:center;"><span class="badge badge-${t[5]}">${t[4]}</span></td>
          <td style="padding:.75rem 1.5rem;text-align:right;"><button class="btn btn-ghost btn-sm">Edit</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
`
};

// ---------- Phase 5: Advanced ----------

PAGES['analytics'] = {
  title: 'Analytics',
  active: 'analytics',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">OVERVIEW</div><h1>Analytics</h1></div>
    <div style="display:flex;gap:.5rem;">
      <select class="form-select" style="width:180px;font-size:.875rem;padding:.5rem .75rem;">
        <option>Last 30 days</option>
        <option>Last 7 days</option>
        <option>Last 90 days</option>
        <option>Year to date</option>
      </select>
      <button class="btn btn-accent btn-sm">Export PDF</button>
    </div>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">GMV</div><div class="kpi-value">Rp 428M</div><div class="kpi-change">↑ 24.3% vs prev period</div></div>
    <div class="kpi-card"><div class="kpi-label">Platform Revenue</div><div class="kpi-value">Rp 64.2M</div><div class="kpi-change">15% take rate</div></div>
    <div class="kpi-card"><div class="kpi-label">Active Users</div><div class="kpi-value">3,240</div><div class="kpi-change">↑ 18% MoM</div></div>
    <div class="kpi-card"><div class="kpi-label">Repeat Client Rate</div><div class="kpi-value">62%</div><div class="kpi-change">↑ 4pt vs last quarter</div></div>
  </div>

  <!-- GMV chart -->
  <div class="card mb-4">
    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
      <div><h3 style="font-weight:800;font-size:1.125rem;">GMV Trend</h3><div style="font-size:.8125rem;color:var(--text-tertiary);">Daily gross merchandise volume</div></div>
      <div style="display:flex;gap:.375rem;"><button class="btn btn-outline btn-sm" style="background:var(--accent-primary);color:white;">GMV</button><button class="btn btn-ghost btn-sm">Orders</button><button class="btn btn-ghost btn-sm">Users</button></div>
    </div>
    <div style="padding:1.5rem;">
      <svg viewBox="0 0 1000 260" style="width:100%;height:260px;">
        <defs>
          <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1C4D8D" stop-opacity=".4"/><stop offset="100%" stop-color="#1C4D8D" stop-opacity="0"/></linearGradient>
        </defs>
        <!-- grid -->
        ${[0,1,2,3,4].map(i=>`<line x1="0" y1="${40+i*45}" x2="1000" y2="${40+i*45}" stroke="#E2E8F0" stroke-dasharray="2 2"/>`).join('')}
        ${[0,1,2,3,4].map(i=>`<text x="0" y="${45+i*45}" fill="#94A3B8" font-size="11">Rp ${20-i*5}M</text>`).join('')}
        <!-- area -->
        <path d="M20,180 L80,150 L140,165 L200,120 L260,105 L320,140 L380,90 L440,110 L500,75 L560,95 L620,60 L680,80 L740,55 L800,70 L860,45 L920,60 L980,40 L980,240 L20,240 Z" fill="url(#gmvGrad)"/>
        <!-- line -->
        <path d="M20,180 L80,150 L140,165 L200,120 L260,105 L320,140 L380,90 L440,110 L500,75 L560,95 L620,60 L680,80 L740,55 L800,70 L860,45 L920,60 L980,40" fill="none" stroke="#1C4D8D" stroke-width="3"/>
        <!-- points -->
        ${[[20,180],[80,150],[140,165],[200,120],[260,105],[320,140],[380,90],[440,110],[500,75],[560,95],[620,60],[680,80],[740,55],[800,70],[860,45],[920,60],[980,40]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="white" stroke="#1C4D8D" stroke-width="2"/>`).join('')}
        <!-- labels -->
        ${['1','3','5','7','9','11','13','15','17','19','21','23','25','27','29'].map((d,i)=>`<text x="${60+i*65}" y="255" fill="#94A3B8" font-size="10" text-anchor="middle">${d}</text>`).join('')}
      </svg>
    </div>
  </div>

  <!-- 2-col: category breakdown + top creators -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
    <div class="card">
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:800;">Revenue by Tier</h3></div>
      <div style="padding:1.5rem;">
        ${[['Atom','#7C3AED',12,15,'Rp 51.4M'],['Sphere','#059669',18,24,'Rp 102.7M'],['Epsilon','#1C4D8D',48,52,'Rp 222.5M'],['Supernova','#DC2626',22,9,'Rp 51.4M']].map(t=>`<div style="margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;font-size:.875rem;margin-bottom:.375rem;"><span style="font-weight:700;color:${t[1]};">${t[0]}</span><span style="font-weight:700;">${t[4]} <span style="color:var(--text-tertiary);font-size:.75rem;">(${t[2]}%)</span></span></div>
          <div style="height:10px;background:var(--bg-secondary);border-radius:5px;overflow:hidden;"><div style="width:${t[2]}%;height:100%;background:${t[1]};"></div></div>
          <div style="font-size:.75rem;color:var(--text-tertiary);margin-top:.25rem;">${t[3]} orders this month</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:800;">Top Creators (by GMV)</h3></div>
      <div style="padding:.5rem 0;">
        ${[
          ['Rifqi Handoko','Elite · Video','Rp 47.2M',127,4.9],
          ['Bagas Prakoso','Elite · SEO','Rp 84.1M',72,5.0],
          ['Kayla Ramadhani','Pro · Live','Rp 54.7M',145,4.9],
          ['Amira Salsabila','Elite · Design','Rp 38.6M',96,4.9],
          ['Sinta Pramesti','Pro · Photo','Rp 29.4M',103,4.8],
        ].map((c,i)=>`<div style="display:flex;gap:.75rem;align-items:center;padding:.75rem 1.5rem;border-bottom:1px solid var(--border-subtle);">
          <div style="width:32px;height:32px;border-radius:50%;background:${i===0?'#FBBF24':i===1?'#94A3B8':'#B45309'};color:white;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.75rem;">${i+1}</div>
          <div style="flex:1;"><div style="font-weight:700;font-size:.875rem;">${c[0]}</div><div style="font-size:.75rem;color:var(--text-tertiary);">${c[1]} · ${c[3]} projects · <span style="color:#F59E0B;">★</span> ${c[4]}</div></div>
          <div style="font-weight:800;color:var(--success);">${c[2]}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Funnel + Retention -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
    <div class="card">
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:800;">Conversion Funnel</h3></div>
      <div style="padding:1.5rem;">
        ${[['Visitors',12420,100,'#BDE8F5'],['Sign-up',2847,22.9,'#4988C4'],['First Browse',1892,15.2,'#1C4D8D'],['Add to Cart',687,5.5,'#0F2854'],['Checkout',412,3.3,'#C9A66B'],['Paid',387,3.1,'#059669']].map((f,i)=>`<div style="margin-bottom:.75rem;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.375rem;"><span style="font-weight:700;font-size:.9375rem;">${f[0]}</span><span><strong>${f[1].toLocaleString()}</strong> <span style="color:var(--text-tertiary);font-size:.8125rem;">${f[2]}%</span></span></div>
          <div style="height:32px;background:var(--bg-secondary);border-radius:6px;overflow:hidden;position:relative;"><div style="width:${f[2]}%;height:100%;background:${f[3]};border-radius:6px;display:flex;align-items:center;padding-left:.75rem;color:white;font-size:.75rem;font-weight:700;">${i>0?'↓ '+((f[1]/(i===0?12420:[12420,2847,1892,687,412][i-1])*100).toFixed(0))+'%':''}</div></div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:800;">Cohort Retention</h3></div>
      <div style="padding:1.5rem;overflow-x:auto;">
        <table style="width:100%;font-size:.75rem;border-collapse:collapse;">
          <thead><tr><th style="text-align:left;padding:.375rem;">Cohort</th><th>M0</th><th>M1</th><th>M2</th><th>M3</th><th>M4</th><th>M5</th></tr></thead>
          <tbody>
            ${[
              ['Feb 2026',[100,68,54,48,42,38]],
              ['Mar 2026',[100,72,58,52,46,'—']],
              ['Apr 2026',[100,74,62,56,'—','—']],
              ['May 2026',[100,78,64,'—','—','—']],
              ['Jun 2026',[100,81,'—','—','—','—']],
              ['Jul 2026',[100,'—','—','—','—','—']],
            ].map(r=>`<tr><td style="padding:.375rem;font-weight:700;">${r[0]}</td>${r[1].map(v=>{
              if(v==='—')return '<td style="text-align:center;padding:.25rem;color:#94A3B8;">—</td>';
              const alpha=v/100;
              return `<td style="text-align:center;padding:.25rem;"><div style="background:rgba(28,77,141,${alpha});color:${v>50?'white':'var(--text-primary)'};padding:.375rem;border-radius:4px;font-weight:600;">${v}%</div></td>`;
            }).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
`
};

PAGES['disputes'] = {
  title: 'Disputes',
  active: 'disputes',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">MODERATION</div><h1>Disputes</h1></div>
    <button class="btn btn-outline btn-sm">Export</button>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Open Disputes</div><div class="kpi-value" style="color:var(--danger);">2</div><div class="kpi-change">Requires immediate action</div></div>
    <div class="kpi-card"><div class="kpi-label">Resolved This Month</div><div class="kpi-value" style="color:var(--success);">14</div><div class="kpi-change">Avg 3.2 days</div></div>
    <div class="kpi-card"><div class="kpi-label">Client-Favor Rate</div><div class="kpi-value">64%</div><div class="kpi-change">Historical</div></div>
    <div class="kpi-card"><div class="kpi-label">Escalated to Legal</div><div class="kpi-value">1</div><div class="kpi-change">This year</div></div>
  </div>

  <!-- Urgent disputes -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
    ${[
      ['DSP-2026-014','ORD-0847','Diana BM','Rifqi H.','Quality — batch 3 tidak sesuai brief','Opened 6h ago','Rp 5.493K','critical'],
      ['DSP-2026-013','ORD-0839','Erigo','Rifqi H.','Missed deadline · project overdue 5 hari','Opened 1d ago','Rp 3.5M','urgent'],
    ].map(d=>`<div class="card" style="border-color:${d[7]==='critical'?'var(--danger)':'#F59E0B'};overflow:hidden;">
      <div style="padding:1rem 1.25rem;background:${d[7]==='critical'?'#FEF2F2':'#FFFBEB'};display:flex;justify-content:space-between;align-items:center;">
        <div style="font-family:monospace;font-size:.75rem;font-weight:900;color:${d[7]==='critical'?'var(--danger)':'#B45309'};">${d[0]}</div>
        <span class="badge badge-${d[7]==='critical'?'danger':'warning'}">${d[7]==='critical'?'⚠ CRITICAL':'⚠ URGENT'}</span>
      </div>
      <div style="padding:1.25rem;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.5rem;">
          <div><div style="font-weight:800;font-size:1rem;">${d[4]}</div><div style="font-size:.8125rem;color:var(--text-secondary);margin-top:.25rem;"><a href="order-detail.html" style="color:var(--accent-primary);text-decoration:none;font-family:monospace;">#${d[1]}</a> · ${d[2]} ↔ ${d[3]}</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:1rem 0;font-size:.8125rem;">
          <div style="padding:.5rem .75rem;background:var(--bg-secondary);border-radius:6px;"><span style="color:var(--text-tertiary);text-transform:uppercase;font-size:.6875rem;letter-spacing:.05em;font-weight:700;">Opened</span><div style="font-weight:700;">${d[5]}</div></div>
          <div style="padding:.5rem .75rem;background:var(--bg-secondary);border-radius:6px;"><span style="color:var(--text-tertiary);text-transform:uppercase;font-size:.6875rem;letter-spacing:.05em;font-weight:700;">Amount at stake</span><div style="font-weight:700;">${d[6]}</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
          <button class="btn btn-outline btn-sm">Review Evidence</button>
          <button class="btn btn-primary btn-sm">Open Case</button>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <!-- Resolved -->
  <div class="card">
    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-subtle);"><h3 style="font-weight:700;">Recent Resolutions</h3></div>
    <table style="width:100%;font-size:.875rem;">
      <thead><tr style="background:var(--bg-secondary);"><th style="text-align:left;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">ID</th><th style="text-align:left;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Case</th><th style="text-align:center;padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Outcome</th><th style="padding:.75rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Resolver</th><th style="text-align:right;padding:.75rem 1.5rem;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-tertiary);">Days</th></tr></thead>
      <tbody>
        ${[
          ['DSP-012','Kualitas: revisi tidak final','FULL REFUND (client)','Admin Ari','success','2d'],
          ['DSP-011','Deadline missed 2 hari','PARTIAL REFUND (Rp 500K)','Admin Sarah','success','3d'],
          ['DSP-010','Miscommunication brief','MEDIATION (kedua pihak setuju)','Admin Sarah','warning','4d'],
          ['DSP-009','Creator cancel mendadak','FULL REFUND + creator strike 1','Admin Ari','success','1d'],
          ['DSP-008','Client tidak respond &gt; 14 hari','CASE CLOSED (client abandon)','Admin Sarah','danger','7d'],
        ].map(d=>`<tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:.75rem 1.5rem;font-family:monospace;font-size:.75rem;font-weight:700;">${d[0]}</td><td style="padding:.75rem;">${d[1]}</td><td style="padding:.75rem;text-align:center;"><span class="badge badge-${d[4]}">${d[2]}</span></td><td style="padding:.75rem;">${d[3]}</td><td style="padding:.75rem 1.5rem;text-align:right;color:var(--text-tertiary);">${d[5]}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
`
};

PAGES['audit-log'] = {
  title: 'Audit Log',
  active: 'audit-log',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">MODERATION</div><h1>Audit Log</h1></div>
    <div style="display:flex;gap:.5rem;">
      <button class="btn btn-outline btn-sm">Filter</button>
      <button class="btn btn-outline btn-sm">Export</button>
    </div>
  </div>

  <div style="background:var(--accent-highlight);border:1px solid var(--accent-light);border-radius:12px;padding:1rem 1.25rem;margin-bottom:1.5rem;display:flex;gap:.75rem;align-items:center;">
    <svg width="20" height="20" fill="none" stroke="var(--accent-primary)" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
    <div style="font-size:.875rem;color:var(--text-primary);"><strong>All admin actions are logged.</strong> Retention: 2 years. Cryptographically signed and tamper-evident. <a href="#" style="color:var(--accent-primary);font-weight:600;">Verify integrity →</a></div>
  </div>

  <div class="card">
    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;gap:.75rem;flex-wrap:wrap;align-items:center;">
      <select class="form-select" style="width:180px;font-size:.875rem;padding:.5rem .75rem;"><option>All actors</option><option>Admin Sarah</option><option>Admin Ari</option><option>System</option></select>
      <select class="form-select" style="width:180px;font-size:.875rem;padding:.5rem .75rem;"><option>All actions</option><option>User modifications</option><option>Financial</option><option>Data export</option><option>Login/Auth</option></select>
      <select class="form-select" style="width:160px;font-size:.875rem;padding:.5rem .75rem;"><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select>
      <input type="search" placeholder="Search..." class="form-input" style="margin-left:auto;width:250px;font-size:.875rem;padding:.5rem .75rem;" />
    </div>

    <div style="padding:0;">
      ${[
        ['10:24:31','Admin Sarah','APPROVED KYC','user:USR-8472 (Rudi Santoso)','172.24.10.44','info'],
        ['10:18:04','Admin Ari','TRIGGERED PAYOUT','payout:PYT-2026-041 · Rp 10.54M · to Rifqi Handoko','172.24.10.12','warning'],
        ['10:14:22','System','AUTO_REFUND','refund:RFD-041 · Rp 549K · order abandoned','—','info'],
        ['10:04:15','Admin Sarah','JOINED CHAT (silent)','chat:ORD-0847 · Diana ↔ Rifqi · Watch mode','172.24.10.44','info'],
        ['09:47:33','Admin Ari','EDITED PRODUCT','product:PRD-2841 · Epsilon Standard · price unchanged, description updated','172.24.10.12','info'],
        ['09:32:11','Admin Sarah','REJECTED KYC','user:USR-8489 (Deni Setiawan) · Reason: dokumen tidak valid','172.24.10.44','danger'],
        ['09:18:47','System','WEBHOOK_RECEIVED','midtrans:payment.settlement · TXN-8472365 · Rp 5.493K','—','info'],
        ['09:15:22','Admin Ari','SUSPENDED USER','user:USR-7621 (Andi Setiawan) · Reason: TOS violation','172.24.10.12','danger'],
        ['08:47:03','Admin Sarah','CREATED VOUCHER','voucher:WELCOME10 · 10% off · 1000 usage cap','172.24.10.44','warning'],
        ['08:32:11','System','SESSION_EXPIRED','user:admin-3 · Session timeout after 8h','—','info'],
        ['08:14:55','Admin Ari','LOGIN','user:admin-2 · 2FA verified','172.24.10.12','info'],
        ['08:12:04','Admin Sarah','LOGIN','user:admin-1 · 2FA verified','172.24.10.44','info'],
      ].map(a=>`<div style="display:grid;grid-template-columns:110px 160px 200px 1fr 130px;padding:.75rem 1.5rem;border-bottom:1px solid var(--border-subtle);align-items:center;font-size:.8125rem;">
        <div style="font-family:monospace;color:var(--text-tertiary);">${a[0]}</div>
        <div style="font-weight:700;">${a[1]}</div>
        <div><span class="badge badge-${a[5]}" style="font-family:monospace;font-size:.6875rem;">${a[2]}</span></div>
        <div style="color:var(--text-secondary);font-family:monospace;font-size:.75rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a[3]}</div>
        <div style="font-family:monospace;font-size:.75rem;color:var(--text-tertiary);text-align:right;">${a[4]}</div>
      </div>`).join('')}
    </div>
    <div style="padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;font-size:.875rem;color:var(--text-tertiary);">
      <span>Showing last 12 entries · 2,847 total this month</span>
      <button class="btn btn-outline btn-sm">Load more</button>
    </div>
  </div>
`
};

PAGES['support'] = {
  title: 'Support Tickets',
  active: 'support',
  main: `
  <div class="main-header">
    <div><div class="eyebrow mb-1">MODERATION</div><h1>Support Tickets</h1></div>
    <button class="btn btn-accent btn-sm">+ Create Ticket</button>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
    <div class="kpi-card"><div class="kpi-label">Open Tickets</div><div class="kpi-value">18</div><div class="kpi-change">5 unassigned</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg. First Response</div><div class="kpi-value">1h 42m</div><div class="kpi-change">Below SLA (2h)</div></div>
    <div class="kpi-card"><div class="kpi-label">Resolved Today</div><div class="kpi-value" style="color:var(--success);">14</div><div class="kpi-change">CSAT avg 4.6/5</div></div>
    <div class="kpi-card"><div class="kpi-label">Backlog &gt; 24h</div><div class="kpi-value" style="color:#F59E0B;">3</div><div class="kpi-change">Needs escalation</div></div>
  </div>

  <div style="display:grid;grid-template-columns:280px 1fr;gap:1.5rem;">
    <!-- Left: filters -->
    <aside>
      <div class="card mb-3">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:800;font-size:.875rem;">Priority</div>
        <div style="padding:.5rem 0;">
          <a href="#" style="display:flex;justify-content:space-between;padding:.5rem 1.25rem;color:inherit;text-decoration:none;font-size:.875rem;background:var(--bg-secondary);"><span>All</span><span style="color:var(--text-tertiary);">42</span></a>
          <a href="#" style="display:flex;justify-content:space-between;padding:.5rem 1.25rem;color:inherit;text-decoration:none;font-size:.875rem;"><span style="color:var(--danger);">🔴 Urgent</span><span style="color:var(--text-tertiary);">3</span></a>
          <a href="#" style="display:flex;justify-content:space-between;padding:.5rem 1.25rem;color:inherit;text-decoration:none;font-size:.875rem;"><span style="color:#F59E0B;">🟡 High</span><span style="color:var(--text-tertiary);">8</span></a>
          <a href="#" style="display:flex;justify-content:space-between;padding:.5rem 1.25rem;color:inherit;text-decoration:none;font-size:.875rem;"><span>🔵 Normal</span><span style="color:var(--text-tertiary);">21</span></a>
          <a href="#" style="display:flex;justify-content:space-between;padding:.5rem 1.25rem;color:inherit;text-decoration:none;font-size:.875rem;"><span style="color:var(--text-tertiary);">⚪ Low</span><span style="color:var(--text-tertiary);">10</span></a>
        </div>
      </div>
      <div class="card">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);font-weight:800;font-size:.875rem;">Category</div>
        <div style="padding:.5rem 0;">
          ${['Payment issue (12)','Account access (8)','Order questions (14)','Feature request (5)','Bug report (3)'].map(c=>`<a href="#" style="display:block;padding:.5rem 1.25rem;color:inherit;text-decoration:none;font-size:.875rem;">${c}</a>`).join('')}
        </div>
      </div>
    </aside>

    <!-- Right: tickets -->
    <div class="card">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
        <div style="font-weight:800;">All Open Tickets · 18</div>
        <div style="display:flex;gap:.5rem;"><input type="search" placeholder="Search..." class="form-input" style="width:220px;font-size:.875rem;padding:.5rem .75rem;" /><select class="form-select" style="width:150px;font-size:.875rem;padding:.5rem .75rem;"><option>Sort: Priority</option><option>Newest</option><option>SLA at risk</option></select></div>
      </div>

      ${[
        ['TCK-0089','🔴','Cannot access account after password reset','Andi Setiawan (client)','Account access','Unassigned','5m ago','urgent'],
        ['TCK-0088','🟡','Payment stuck at "pending" for 3 hours','PT Wardah','Payment issue','Admin Sarah','1h ago','high'],
        ['TCK-0087','🔴','Withdrew wrong amount to bank','Rifqi Handoko (creator)','Payment issue','Admin Ari','2h ago','urgent'],
        ['TCK-0086','🟡','Voucher WELCOME10 not applying','Kartika Sari','Order questions','Admin Sarah','3h ago','high'],
        ['TCK-0085','🔵','How to change payout bank account?','Amira Salsabila (creator)','Account access','Admin Ari','5h ago','normal'],
        ['TCK-0084','⚪','Feature request: dark mode','Bagas Prakoso (creator)','Feature request','Unassigned','1d ago','low'],
      ].map(t=>`<a href="#" style="display:grid;grid-template-columns:80px 30px 1fr 160px 130px 120px 100px;gap:1rem;padding:1rem 1.5rem;border-bottom:1px solid var(--border-subtle);align-items:center;text-decoration:none;color:inherit;font-size:.875rem;">
        <div style="font-family:monospace;font-size:.75rem;font-weight:700;color:var(--accent-primary);">${t[0]}</div>
        <div style="font-size:1.125rem;">${t[1]}</div>
        <div><div style="font-weight:700;">${t[2]}</div><div style="font-size:.75rem;color:var(--text-tertiary);margin-top:.125rem;">${t[3]}</div></div>
        <div style="font-size:.8125rem;color:var(--text-secondary);">${t[4]}</div>
        <div style="font-size:.8125rem;">${t[5]==='Unassigned'?`<span style="color:var(--danger);font-weight:700;">${t[5]}</span>`:t[5]}</div>
        <div style="font-size:.75rem;color:var(--text-tertiary);">${t[6]}</div>
        <div style="text-align:right;"><button class="btn btn-outline btn-sm">Open →</button></div>
      </a>`).join('')}
    </div>
  </div>
`
};

// ==================================================
// WRITE
// ==================================================

for (const [slug, def] of Object.entries(PAGES)) {
  const html = page(def.title, def.active, def.main, def.extraStyle || def.style || '');
  const outPath = path.join(HERE, `${slug}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`✓ ${slug}.html (${html.length} bytes)`);
}
console.log(`\nDone. Generated ${Object.keys(PAGES).length} pages.`);
