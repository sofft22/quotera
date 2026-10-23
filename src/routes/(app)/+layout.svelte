<script>
  import { page } from '$app/state';

  let headerHidden = $state(false);

  $effect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        headerHidden = true;
      } else if (currentScrollY < lastScrollY) {
        headerHidden = false;
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // REBUILT SVG: Hardcoded colors, tight viewBox, no invisible padding.
  const perfectSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="15 10 190 160" width="30" height="30"><path fill="#24503C" d="M86.5 64.2L86.5 74.8C82.5 75.5 69.5 77.5 62.8 79.3C56 81.2 51.6 82.9 46.2 86C40.9 89.2 34.3 95.1 30.9 98.3C27.5 101.4 27.1 102.8 25.8 105C24.6 107.2 23.7 110.2 23.2 111.2L39.5 102.5C40.8 105.1 44.9 113.8 47.4 118C49.9 122.2 51.6 124.4 54.4 127.5C57.3 130.6 60.8 133.9 64.5 136.5C68.2 139.2 72.4 141.7 76.8 143.5C81.1 145.3 86 146.6 90.8 147.4C95.5 148.1 100.4 148.4 105.2 148C110.1 147.7 115.6 146.6 119.8 145.2C123.9 143.9 128.5 140.9 130.2 140L114 120.8C111.4 121.1 103.3 122.9 98.5 122.6C93.7 122.2 89.3 121.1 85 118.7C80.7 116.3 75.2 111.1 72.4 108.2C69.7 105.4 69.4 103.8 68.5 101.8C67.6 99.7 67.2 97 67 96C69 95.7 76 94.4 79.2 94.3C82.5 94.2 85.5 95.3 86.8 95.5L86.2 106.5L117.5 85C116.4 84.1 116.2 83 111 79.5C105.8 76.1 90.6 66.8 86.5 64.2Z"/><path fill="#24503C" d="M39 84.2C43.3 82.5 58.3 79.3 64.9 73.5C71.6 67.8 74.9 55.1 78.7 49.8C82.5 44.4 84.6 43.9 87.8 41.6C90.9 39.2 94.2 37.3 97.8 35.9C101.3 34.4 105.2 33.4 109 32.9C112.8 32.4 116.8 32.2 120.8 32.7C124.8 33.2 129 34.4 133 35.8C137 37.3 143 40.6 145 41.5C144.1 40.6 142 37.9 139.7 36.1C137.5 34.3 135.7 32.5 131.5 30.5C127.3 28.5 120.8 25.4 114.8 24.1C108.7 22.9 101.4 22.4 95.2 22.9C89.1 23.4 83.3 24.7 77.8 27C72.2 29.3 66.5 32.7 61.8 36.5C57 40.3 52.7 44.7 49.3 49.8C45.9 54.8 42.9 62.4 41.2 67C39.4 71.6 39.3 74.6 39 77.5C38.6 80.4 39 83.1 39 84.2Z"/><path fill="#C4513D" d="M72 61C73.9 59.7 80.2 54.9 83.5 53C86.8 51.1 88.7 50.4 91.8 49.6C94.8 48.8 98.7 48.2 102 48.3C105.3 48.4 108.3 49 111.5 50C114.7 51.1 118.1 52.6 121 54.5C123.9 56.5 126.8 59.2 128.9 61.8C131.1 64.3 132.4 66.5 133.9 69.8C135.4 73 137.3 79.5 138 81.5L158 62C157.2 60.2 155.4 54.3 153.2 51C151.1 47.7 148.7 44.9 145.2 42.3C141.8 39.8 137.5 37.3 132.8 35.7C128 34 122 32.7 117 32.5C112 32.3 107 33.1 102.5 34.3C98 35.5 94.3 37.1 90.2 39.7C86.2 42.3 81.5 46.2 78.4 49.8C75.4 53.3 73.1 59.1 72 61Z"/><path fill="#C4513D" d="M104.8 100.8L121.8 88.8L131 96.8C148 75 182 47 212.5 31C168 70 158 100 153 121L173.5 147.5L143.8 147.5Z"/></svg>`;
</script>

<style>
  .logo-container {
    display: flex;
    align-items: center;
    gap: 4px; /* Tight spacing */
    text-decoration: none;
  }
  
  .logo-svg {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-text {
    font-family: 'Nunito', sans-serif; 
    font-weight: 900; 
    color: #303B38; 
    letter-spacing: -0.03em;
    line-height: 1;
    font-size: 24px; /* Desktop size */
    margin-top: -2px; /* Vertically aligns text with icon */
  }
  .logo-text span { color: #C4513D; }

  @media (max-width: 768px) {
    .logo-text { font-size: 22px; } /* Mobile size */
    .logo-svg svg { width: 26px; height: 26px; } /* Mobile icon size */
  }

  /* DESKTOP SIDEBAR */
  .desktop-sidebar {
    width: 260px; height: 100vh; position: fixed; top: 0; left: 0;
    background-color: #ffffff; border-right: 1px solid #E5E7EB;
    display: flex; flex-direction: column; z-index: 50;
  }

  .nav-link {
    display: block; padding: 12px 16px; color: #6B7280; 
    text-decoration: none; border-radius: 8px; font-size: 14px; 
    font-weight: 500; transition: all 0.2s;
  }
  .nav-link:hover { background-color: #F9FAFB; color: #303B38; }
  .nav-link.active { background-color: #F0FDF4; color: #24503C; font-weight: 600; }
  
  .mobile-nav { display: none; }

  /* SMART HEADER TRANSITIONS */
  .app-header {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }
  .header-hidden {
    transform: translateY(-100%);
  }

  /* DESKTOP LAYOUT */
  @media (min-width: 769px) {
    .main-wrapper {
      margin-left: 260px;
      width: calc(100% - 260px);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-header {
      display: flex; justify-content: flex-end; align-items: center;
      padding: 0 32px; height: 72px; background-color: #ffffff;
      border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 40;
    }
    .mobile-brand { display: none; }
    .mobile-logout { display: none; }
    .main-content { flex: 1; padding: 32px; }
  }
  
  /* MOBILE LAYOUT */
  @media (max-width: 768px) {
    .desktop-sidebar { display: none; }
    .desktop-links { display: none; }
    .main-wrapper { width: 100%; }
    
    .app-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 16px; height: 64px; background-color: #ffffff;
      border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 50;
    }
    .mobile-brand { display: block; }
    .mobile-logout { display: block; }

    .main-content { padding: 16px 8px; padding-bottom: 88px; }
    
    .mobile-nav {
      display: flex; position: fixed; bottom: 0; left: 0; right: 0;
      height: 64px; background: #ffffff; border-top: 1px solid #E5E7EB;
      justify-content: space-around; align-items: center; z-index: 100;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .mobile-nav-item {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #9CA3AF; text-decoration: none; font-size: 11px; font-weight: 600;
      gap: 4px; width: 25%; text-align: center; transition: color 0.2s;
    }
    .mobile-nav-item.active { color: #24503C; }
  }
</style>

<div style="display: flex; min-height: 100vh; background-color: #EEF2EE; font-family: 'Inter', system-ui, sans-serif;">
  
  <!-- DESKTOP SIDEBAR -->
  <aside class="desktop-sidebar">
    <div style="padding: 32px 24px;">
      <a href="/dashboard" class="logo-container">
        <div class="logo-svg">{@html perfectSVG}</div>
        <span class="logo-text">Quotera<span>.</span></span>
      </a>
      <p style="font-size: 11px; font-weight: 600; color: #9CA3AF; margin: 8px 0 0 0; letter-spacing: 0.05em; padding-left: 34px;">WORKSPACE</p>
    </div>

    <nav style="flex: 1; padding: 0 16px; display: flex; flex-direction: column; gap: 4px;">
      <a href="/dashboard" class="nav-link" class:active={page.url.pathname.startsWith('/dashboard')}>Dashboard</a>
      <a href="/quotes/new" class="nav-link" class:active={page.url.pathname.startsWith('/quotes/new')}>Create Quote</a>
      <a href="/price-list" class="nav-link" class:active={page.url.pathname.startsWith('/price-list')}>Price List</a>
      <a href="/settings" class="nav-link" class:active={page.url.pathname.startsWith('/settings')}>Settings</a>
    </nav>
  </aside>

  <!-- MAIN WRAPPER -->
  <div class="main-wrapper">
    
    <!-- SMART HEADER -->
    <header class="app-header" class:header-hidden={headerHidden}>
      <!-- Mobile Brand -->
      <div class="mobile-brand">
        <a href="/dashboard" class="logo-container">
          <div class="logo-svg">{@html perfectSVG}</div>
          <span class="logo-text">Quotera<span>.</span></span>
        </a>
      </div>

      <!-- Desktop Links -->
      <div class="desktop-links">
        <a href="/pricing" style="font-size: 13px; font-weight: 600; color: #6B7280; text-decoration: none;">Upgrade Plan</a>
        <div style="display: flex; align-items: center; gap: 12px; margin-left: 24px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #24503C; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px;">
            JD
          </div>
          <a href="/logout" style="color: #9CA3AF; hover: color: #DC2626; transition: color 0.2s; display: flex; align-items: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </a>
        </div>
      </div>

      <!-- Mobile Logout -->
      <div class="mobile-logout">
        <a href="/logout" style="color: #6B7280; display: flex; align-items: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </a>
      </div>
    </header>

    <!-- PAGE CONTENT -->
    <main class="main-content">
      <slot />
    </main>
  </div>

  <!-- MOBILE BOTTOM NAV -->
  <nav class="mobile-nav">
    <a href="/dashboard" class="mobile-nav-item" class:active={page.url.pathname.startsWith('/dashboard')}>
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
      <span>Home</span>
    </a>
    <a href="/quotes/new" class="mobile-nav-item" class:active={page.url.pathname.startsWith('/quotes/new')}>
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
      <span>Quote</span>
    </a>
    <a href="/price-list" class="mobile-nav-item" class:active={page.url.pathname.startsWith('/price-list')}>
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
      <span>Items</span>
    </a>
    <a href="/settings" class="mobile-nav-item" class:active={page.url.pathname.startsWith('/settings')}>
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      <span>Settings</span>
    </a>
  </nav>
</div>