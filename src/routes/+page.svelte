<script>
  import { onMount } from 'svelte';

  let navHidden = false;
  const WHATSAPP = "2347072789513";

  // CountUp Action
  function CountUp(node, { to, suffix = "", duration = 1500 }) {
    let observer;
    const update = (val) => {
      node.textContent = Math.round(val).toLocaleString() + suffix;
    };
    update(0);

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        const startTime = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - startTime) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          update(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    
    io.observe(node);
    return { destroy() { io.disconnect(); } };
  }

  // Advanced Reveal Action
  function Reveal(node, { direction = 'up', delay = 0 }) {
    node.style.opacity = '0';
    node.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
    
    if (direction === 'up') node.style.transform = 'translateY(40px)';
    if (direction === 'left') node.style.transform = 'translateX(-40px)';
    if (direction === 'right') node.style.transform = 'translateX(40px)';
    if (direction === 'scale') node.style.transform = 'scale(0.95)';

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0) translateX(0) scale(1)';
        io.unobserve(node);
      }
    }, { threshold: 0.15 });

    io.observe(node);
    return { destroy() { io.disconnect(); } };
  }

  onMount(() => {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY) {
        nav.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const I = {
    arrow: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#24503C" stroke-width="2.5" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
    cross: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 217 176" width="28" height="24"><defs><linearGradient id="teal" x1="0" y1="22" x2="0" y2="148" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a7270"/><stop offset=".4" stop-color="#1c5658"/><stop offset=".75" stop-color="#0e4345"/></linearGradient><linearGradient id="arc" x1="72" y1="0" x2="158" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#dc5159"/><stop offset="1" stop-color="#f08358"/></linearGradient><linearGradient id="check" x1="125" y1="60" x2="195" y2="120" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4844e"/><stop offset=".42" stop-color="#ee7a54"/><stop offset=".58" stop-color="#d95955"/><stop offset="1" stop-color="#dc5560"/></linearGradient></defs><path fill="#24503C" d="M86.5 64.2L86.5 74.8C82.5 75.5 69.5 77.5 62.8 79.3C56 81.2 51.6 82.9 46.2 86C40.9 89.2 34.3 95.1 30.9 98.3C27.5 101.4 27.1 102.8 25.8 105C24.6 107.2 23.7 110.2 23.2 111.2L39.5 102.5C40.8 105.1 44.9 113.8 47.4 118C49.9 122.2 51.6 124.4 54.4 127.5C57.3 130.6 60.8 133.9 64.5 136.5C68.2 139.2 72.4 141.7 76.8 143.5C81.1 145.3 86 146.6 90.8 147.4C95.5 148.1 100.4 148.4 105.2 148C110.1 147.7 115.6 146.6 119.8 145.2C123.9 143.9 128.5 140.9 130.2 140L114 120.8C111.4 121.1 103.3 122.9 98.5 122.6C93.7 122.2 89.3 121.1 85 118.7C80.7 116.3 75.2 111.1 72.4 108.2C69.7 105.4 69.4 103.8 68.5 101.8C67.6 99.7 67.2 97 67 96C69 95.7 76 94.4 79.2 94.3C82.5 94.2 85.5 95.3 86.8 95.5L86.2 106.5L117.5 85C116.4 84.1 116.2 83 111 79.5C105.8 76.1 90.6 66.8 86.5 64.2Z"/><path fill="#24503C" d="M39 84.2C43.3 82.5 58.3 79.3 64.9 73.5C71.6 67.8 74.9 55.1 78.7 49.8C82.5 44.4 84.6 43.9 87.8 41.6C90.9 39.2 94.2 37.3 97.8 35.9C101.3 34.4 105.2 33.4 109 32.9C112.8 32.4 116.8 32.2 120.8 32.7C124.8 33.2 129 34.4 133 35.8C137 37.3 143 40.6 145 41.5C144.1 40.6 142 37.9 139.7 36.1C137.5 34.3 135.7 32.5 131.5 30.5C127.3 28.5 120.8 25.4 114.8 24.1C108.7 22.9 101.4 22.4 95.2 22.9C89.1 23.4 83.3 24.7 77.8 27C72.2 29.3 66.5 32.7 61.8 36.5C57 40.3 52.7 44.7 49.3 49.8C45.9 54.8 42.9 62.4 41.2 67C39.4 71.6 39.3 74.6 39 77.5C38.6 80.4 39 83.1 39 84.2Z"/><path fill="url(#arc)" d="M72 61C73.9 59.7 80.2 54.9 83.5 53C86.8 51.1 88.7 50.4 91.8 49.6C94.8 48.8 98.7 48.2 102 48.3C105.3 48.4 108.3 49 111.5 50C114.7 51.1 118.1 52.6 121 54.5C123.9 56.5 126.8 59.2 128.9 61.8C131.1 64.3 132.4 66.5 133.9 69.8C135.4 73 137.3 79.5 138 81.5L158 62C157.2 60.2 155.4 54.3 153.2 51C151.1 47.7 148.7 44.9 145.2 42.3C141.8 39.8 137.5 37.3 132.8 35.7C128 34 122 32.7 117 32.5C112 32.3 107 33.1 102.5 34.3C98 35.5 94.3 37.1 90.2 39.7C86.2 42.3 81.5 46.2 78.4 49.8C75.4 53.3 73.1 59.1 72 61Z"/><path fill="url(#check)" d="M104.8 100.8L121.8 88.8L131 96.8C148 75 182 47 212.5 31C168 70 158 100 153 121L173.5 147.5L143.8 147.5Z"/></svg>`
  };
</script>

<svelte:head>
  <style>
    :root {
      --bg: #EEF2EE;
      --ink: #303B38;
      --muted: #6B7280;
      --line: #D1D5DB;
      --green: #24503C;
      --terra: #C4513D;
      --font: 'Inter', sans-serif;
      --serif: 'Manrope', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ─── RESTORED TYPING ANIMATION ─── */
    .typewriter h1 {
      display: inline-block;
      clip-path: inset(0 100% 0 0);
      border-right: .15em solid var(--terra);
      white-space: nowrap;
      margin: 0 auto;
      letter-spacing: -0.03em;
      animation: 
        typing 2.2s steps(35, end) forwards,
        blink-caret .75s step-end infinite;
      will-change: clip-path;
    }
    @keyframes typing {
      from { clip-path: inset(0 100% 0 0) }
      to { clip-path: inset(0 0 0 0) }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: var(--terra); }
    }

    /* ─── SMART NAVBAR ─── */
    .nav { 
      position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
      background: rgba(238, 242, 238, 0.95); 
      backdrop-filter: blur(24px); 
      border-bottom: 1px solid rgba(48,59,56,0.05);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
    }
    .nav.nav-hidden { transform: translateY(-100%); }
    .nav-inner { height: 64px; display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 0 16px; }
    
    .brand { display: flex; align-items: center; gap: 8px; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 22px; color: var(--ink); text-decoration: none; letter-spacing: -0.03em; }
    .brand span { color: var(--terra); }

    .nav-links { display: none; gap: 40px; align-items: center; }
    @media (min-width: 900px) { .nav-links { display: flex; } }
    
    .mobile-nav-header { display: flex; align-items: center; gap: 16px; }
    .nav-cta { font-size: 13px; font-weight: 600; color: #fff; background: var(--green); padding: 8px 16px; border-radius: 6px; text-decoration: none; transition: background 0.2s; }
    .nav-cta:hover { background: #1a3a2b; }

    /* ─── HERO ─── */
    .hero-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: radial-gradient(circle at 50% 0%, rgba(196, 81, 61, 0.15) 0%, rgba(238, 242, 238, 1) 60%);
    }
    
    .hero-content { display: flex; flex-direction: column; gap: 20px; max-width: 800px; width: 100%; }
    .h-hero { font-family: 'Manrope', sans-serif; font-size: clamp(36px, 9vw, 72px); font-weight: 800; line-height: 1.05; color: var(--ink); }
    .h-hero span { color: var(--terra); }
    .hero-desc { font-size: clamp(15px, 4vw, 18px); color: var(--muted); line-height: 1.6; max-width: 480px; margin: 0 auto; }
    .hero-ctas { display: flex; flex-direction: column; gap: 12px; align-items: center; width: 100%; margin-top: 12px; }
    
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; font-weight: 600; padding: 14px 24px; border-radius: 8px; text-decoration: none; background: var(--green); color: #fff; transition: all 0.2s; width: 100%; max-width: 320px; border: none; cursor: pointer; }
    .btn:hover { background: #1a3a2b; }

    /* ─── GLOBAL SECTIONS ─── */
    .section { max-width: 1200px; margin: 0 auto; }
    .sec-head { text-align: center; margin-bottom: 40px; }
    .h-section { font-family: 'Manrope', sans-serif; font-size: clamp(28px, 6vw, 42px); font-weight: 800; letter-spacing: -0.03em; color: var(--ink); }

    /* ─── STATS ─── */
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; border-top: 1px solid rgba(48,59,56,0.1); border-bottom: 1px solid rgba(48,59,56,0.1); text-align: center; max-width: 1200px; margin: 0 auto; }
    @media (min-width: 700px) { .stats { grid-template-columns: repeat(4, 1fr); gap: 40px; } }
    .stat-num { font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; color: var(--ink); }
    .stat-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-top: 4px; letter-spacing: 0.05em; }

    /* ─── WHY ─── */
    .ba { display: grid; grid-template-columns: 1fr; gap: 20px; }
    @media (min-width: 700px) { .ba { grid-template-columns: 1fr 1fr; gap: 32px; } }
    .ba-card { border-radius: 12px; }
    .ba-card.no { background: #fff; border: 1px solid var(--line); }
    .ba-card.yes { background: var(--green); color: #fff; }
    .ba-card h3 { font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 20px; }
    .ba-card ul { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    .ba-card li { display: flex; align-items: center; gap: 12px; font-size: 15px; }
    .ba-card.no li { color: var(--muted); }
    .ba-card.yes li { color: rgba(255,255,255,0.9); }
    .ba-card.yes svg { stroke: #fff; }

    /* ─── STEPS ─── */
    .steps { display: grid; grid-template-columns: 1fr; gap: 32px; }
    @media (min-width: 900px) { .steps { grid-template-columns: repeat(3, 1fr); gap: 48px; } }
    .step { border-top: 1px solid var(--line); position: relative; }
    .step::before { content: ""; position: absolute; top: -1px; left: 0; width: 40px; height: 2px; background: var(--terra); }
    .step-num { font-family: monospace; font-size: 13px; font-weight: 700; color: var(--terra); margin-bottom: 12px; }
    .step h3 { font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; margin-bottom: 10px; color: var(--ink); }
    .step p { font-size: 14px; color: var(--muted); line-height: 1.6; }

    /* ─── PRICING (Untouched) ─── */
    .plans { display: grid; grid-template-columns: 1fr; gap: 20px; align-items: start; }
    @media (min-width: 900px) { .plans { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
    .plan { padding: 28px 20px; border: 1px solid var(--line); border-radius: 16px; background: #fff; display: flex; flex-direction: column; height: fit-content; }
    .plan.pop { background: var(--green); color: #fff; border-color: var(--green); box-shadow: 0 24px 48px -12px rgba(36,80,60,0.3); }
    .plan h3 { font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; margin-bottom: 4px; }
    .plan .desc { font-size: 13px; color: var(--muted); margin-bottom: 20px; min-height: 38px; }
    .plan.pop .desc { color: rgba(255,255,255,0.7); }
    .plan .price { font-family: 'Manrope', sans-serif; font-size: 30px; font-weight: 800; margin-bottom: 20px; }
    .plan .price span { font-size: 13px; font-weight: 500; color: var(--muted); }
    .plan.pop .price span { color: rgba(255,255,255,0.6); }
    .plan ul { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
    .plan li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
    .plan.pop li { color: #fff; }
    .plan.pop li svg { stroke: #fff; }
    @media (max-width: 900px) { .hide-mobile { display: none !important; } }
    .plan .btn { margin-top: auto; width: 100%; background: var(--bg); color: var(--ink); justify-content: center; padding: 10px; font-size: 13px; }
    .plan.pop .btn { background: #fff; color: var(--green); }

    /* ─── SHORT REVIEWS (Untouched) ─── */
    .reviews-grid { display: grid; grid-template-columns: 1fr; gap: 24px; text-align: center; }
    @media (min-width: 900px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
    
    .review-card { 
      display: flex; 
      flex-direction: column; 
      position: relative; 
      padding: 16px; 
    }
    
    .review-card:not(:last-child)::after {
      content: ""; position: absolute; bottom: -12px; left: 20%; width: 60%; height: 1px; background-color: rgba(48, 59, 56, 0.08);
    }
    @media (min-width: 900px) { .review-card::after { display: none; } }

    .review-text { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; color: var(--ink); font-weight: 400; margin-bottom: 16px; }
    .review-author { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink); margin: 0; }
    .review-role { font-size: 11px; color: var(--muted); margin: 4px 0 0; }

    /* ─── FAQ (Untouched) ─── */
    .faq { display: flex; flex-direction: column; gap: 12px; max-width: 800px; margin: 0 auto; }
    .faq details { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 20px; }
    .faq summary { font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
    .faq summary::after { content: "+"; font-size: 20px; color: var(--terra); font-weight: 400; }
    .faq details[open] summary::after { content: "−"; }
    .faq p { margin-top: 12px; font-size: 14px; color: var(--muted); line-height: 1.6; }

    /* ─── FINAL CTA (Untouched) ─── */
    .final-cta { text-align: center; padding: 80px 20px; background: var(--ink); color: #fff; }
    .final-cta h2 { font-family: 'Manrope', sans-serif; font-size: clamp(28px, 6vw, 48px); font-weight: 800; margin-bottom: 16px; color: #fff; }
    .final-cta p { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px; }
    .final-cta .btn { background: var(--terra); font-size: 16px; padding: 16px 32px; color: #fff; margin: 0 auto; }
    .final-cta .btn:hover { background: #a83a29; }

    /* ─── FOOTER (Untouched) ─── */
    footer { background: var(--ink); color: #fff; padding: 48px 20px 32px; border-top: 1px solid rgba(255,255,255,0.1); }
    .fgrid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 32px 20px; text-align: left; }
    .fgrid > div:first-child { grid-column: 1 / -1; text-align: center; margin-bottom: 16px; }
    .fgrid > div:nth-child(2) { grid-column: 1 / 2; }
    .fgrid > div:nth-child(3) { grid-column: 2 / 3; }
    .fgrid > div:nth-child(4) { grid-column: 1 / -1; text-align: left; margin-top: 16px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }

    @media (min-width: 900px) {
      .fgrid { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; text-align: left; }
      .fgrid > div:first-child { grid-column: auto; text-align: left; margin-bottom: 0; }
      .fgrid > div:nth-child(2) { grid-column: auto; }
      .fgrid > div:nth-child(3) { grid-column: auto; }
      .fgrid > div:nth-child(4) { grid-column: auto; text-align: left; margin-top: 0; padding-top: 0; border-top: none; }
    }

    footer .brand { display: inline-flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 16px; font-size: 24px; color: #fff; }
    footer .brand span { color: var(--terra); }
    footer p { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; max-width: 300px; margin: 0 auto; }
    @media (min-width: 900px) { footer p { margin: 0; } }

    footer h4 { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.4); }
    footer ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
    footer a { color: #fff; text-decoration: none; font-size: 14px; transition: color 0.2s; }
    footer a:hover { color: var(--terra); }
    
    .fbot { max-width: 1200px; margin: 32px auto 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center; font-size: 13px; color: rgba(255,255,255,0.4); text-align: center; }
    @media (min-width: 700px) { .fbot { flex-direction: row; justify-content: space-between; text-align: left; } }
    .status { display: flex; align-items: center; gap: 8px; }
    .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }
  </style>
</svelte:head>

<div style="background-color: var(--bg); min-height: 100vh; font-family: var(--font); color: var(--ink); overflow-x: hidden;">
  
  <nav class={`nav ${navHidden ? 'nav-hidden' : ''}`}>
    <div class="nav-inner">
      <a href="#top" class="brand">
        {@html I.logo} Quotera<span>.</span>
      </a>
      
      <div class="nav-links">
        <a href="#how" class="nav-link" style="color: var(--muted); font-weight: 600; font-size: 14px; text-decoration: none;">How it works</a>
        <a href="#pricing" class="nav-link" style="color: var(--muted); font-weight: 600; font-size: 14px; text-decoration: none;">Pricing</a>
        <a href="#faq" class="nav-link" style="color: var(--muted); font-weight: 600; font-size: 14px; text-decoration: none;">Questions</a>
      </div>
      
      <div class="mobile-nav-header">
        <a href="/login" style="font-size: 13px; font-weight: 600; color: var(--ink); text-decoration: none; margin-right: 4px;" class="hide-mobile">Sign In</a>
        <a href="/register" class="nav-cta">Start free</a>
      </div>
    </div>
  </nav>

  <main id="top">
    <!-- HERO (INLINE PADDING ADDED) -->
    <header class="hero-wrapper" style="padding-top: 180px; padding-bottom: 140px; padding-left: 20px; padding-right: 20px;">
      <div class="hero-content" use:Reveal={{ direction: 'up', delay: 0.1 }}>
        <div class="typewriter">
          <h1 class="h-hero">
            Quote smarter, <br/><span>close faster.</span>
          </h1>
        </div>
        <p class="hero-desc">Paste a messy request. Get a flawless, branded PDF quote in seconds.</p>
        <div class="hero-ctas">
          <a href="/register" class="btn">Create your first quote {@html I.arrow}</a>
          <a href="#how" style="font-size: 14px; font-weight: 600; color: var(--ink); text-decoration: none; margin-top: 8px; border-bottom: 2px solid var(--ink); padding-bottom: 2px;">See how it works</a>
        </div>
      </div>
    </header>

    <!-- STATS (INLINE PADDING ADDED) -->
    <div class="stats" use:Reveal={{ direction: 'up' }} style="padding-top: 96px; padding-bottom: 96px; padding-left: 20px; padding-right: 20px;">
      <div><div class="stat-num" use:CountUp={{to: 5000, suffix: '+'}}>0</div><div class="stat-label">Quotes Generated</div></div>
      <div><div class="stat-num" use:CountUp={{to: 5, suffix: 's'}}>0</div><div class="stat-label">To Generate</div></div>
      <div><div class="stat-num" use:CountUp={{to: 30, suffix: '+ hrs'}}>0</div><div class="stat-label">Saved Monthly</div></div>
      <div><div class="stat-num" use:CountUp={{to: 99, suffix: '%'}}>0</div><div class="stat-label">Math Accuracy</div></div>
    </div>

    <!-- WHY (INLINE PADDING ADDED) -->
    <section class="section" style="padding-top: 140px; padding-bottom: 140px; padding-left: 20px; padding-right: 20px;">
      <div class="sec-head" use:Reveal={{ direction: 'up' }}>
        <h2 class="h-section">Still quoting from Excel?</h2>
      </div>
      <div class="ba">
        <div class="ba-card no" use:Reveal={{ direction: 'left' }} style="padding: 48px 32px;">
          <h3>The Old Way</h3>
          <ul>
            <li>{@html I.cross} Manual entry</li>
            <li>{@html I.cross} 20 minutes per quote</li>
            <li>{@html I.cross} Costly errors</li>
          </ul>
        </div>
        <div class="ba-card yes" use:Reveal={{ direction: 'right' }} style="padding: 48px 32px;">
          <h3>The Quotera Way</h3>
          <ul>
            <li>{@html I.check} Paste messy text</li>
            <li>{@html I.check} Extraction is instant</li>
            <li>{@html I.check} Flawless PDF instantly</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS (INLINE PADDING ADDED) -->
    <section class="section" id="how" style="padding-top: 140px; padding-bottom: 140px; padding-left: 20px; padding-right: 20px;">
      <div class="sec-head" use:Reveal={{ direction: 'up' }}>
        <h2 class="h-section">Three steps to close.</h2>
      </div>
      <div class="steps">
        <div class="step" use:Reveal={{ direction: 'up', delay: 0.1 }} style="padding-top: 32px;">
          <div class="step-num">01</div>
          <h3>Paste the request</h
<div class="step" use:Reveal={{ direction: 'up', delay: 0.1 }} style="padding-top: 32px;">
          <div class="step-num">01</div>
          <h3>Paste the request</h3>
          <p>Copy the exact text your customer sent you on WhatsApp or email.</p>
        </div>
        <div class="step" use:Reveal={{ direction: 'up', delay: 0.2 }} style="padding-top: 32px;">
          <div class="step-num">02</div>
          <h3>Quotera does the math</h3>
          <p>It extracts items, matches your prices, and calculates totals perfectly.</p>
        </div>
        <div class="step" use:Reveal={{ direction: 'up', delay: 0.3 }} style="padding-top: 32px;">
          <div class="step-num">03</div>
          <h3>Send the PDF</h3>
          <p>Download a beautifully branded PDF and send it to close the deal.</p>
        </div>
      </div>
    </section>

    <!-- PRICING (Untouched) -->
    <section class="section" id="pricing" style="padding-top: 60px; padding-bottom: 60px; padding-left: 20px; padding-right: 20px;">
      <div class="sec-head" use:Reveal={{ direction: 'up' }}>
        <h2 class="h-section">Simple pricing.</h2>
      </div>
      <div class="plans">
        <div class="plan" use:Reveal={{ direction: 'up', delay: 0.05 }}>
          <h3>Free</h3>
          <p class="desc">For testing the waters.</p>
          <div class="price">₦0<span>/mo</span></div>
          <ul>
            <li>{@html I.check} 3 quotes / mo</li>
            <li>{@html I.check} 5 products</li>
            <li class="hide-mobile">{@html I.check} Watermarked PDF</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to get started with the Free plan`} target="_blank" class="btn">Start Free</a>
        </div>
        <div class="plan" use:Reveal={{ direction: 'up', delay: 0.1 }}>
          <h3>Starter</h3>
          <p class="desc">For the casual freelancer.</p>
          <div class="price">₦2,000<span>/mo</span></div>
          <ul>
            <li>{@html I.check} 15 quotes / mo</li>
            <li>{@html I.check} 15 products</li>
            <li class="hide-mobile">{@html I.check} Standard PDF</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to upgrade to the Starter plan (₦2,000/mo)`} target="_blank" class="btn">Get Starter</a>
        </div>
        <div class="plan pop" use:Reveal={{ direction: 'up', delay: 0.15 }}>
          <h3>Pro</h3>
          <p class="desc">For serious business.</p>
          <div class="price">₦6,000<span>/mo</span></div>
          <ul>
            <li>{@html I.check} 50 quotes / mo</li>
            <li>{@html I.check} 50 products</li>
            <li>{@html I.check} Branded PDF</li>
            <li class="hide-mobile">{@html I.check} Advanced pricing rules</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to upgrade to the Pro plan (₦6,000/mo)`} target="_blank" class="btn">Get Pro</a>
        </div>
        <div class="plan" use:Reveal={{ direction: 'up', delay: 0.2 }}>
          <h3>Agency</h3>
          <p class="desc">For growing teams.</p>
          <div class="price">₦15,000<span>/mo</span></div>
          <ul>
            <li>{@html I.check} 50 + 25/seat quotes</li>
            <li>{@html I.check} 50 + 25/seat products</li>
            <li class="hide-mobile">{@html I.check} Team roles & approvals</li>
            <li class="hide-mobile">{@html I.check} Pricing guardrails</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to contact sales for the Agency plan`} target="_blank" class="btn">Contact Sales</a>
        </div>
      </div>
    </section>

    <!-- SHORT REVIEWS (Untouched) -->
    <section class="section" style="padding-top: 60px; padding-bottom: 60px; padding-left: 20px; padding-right: 20px;">
      <div class="sec-head" use:Reveal={{ direction: 'up' }}>
        <h2 class="h-section">Reviews.</h2>
      </div>
      <div class="reviews-grid">
        <div class="review-card" use:Reveal={{ direction: 'up', delay: 0.1 }}>
          <p class="review-text">"I used to spend 20 minutes typing out orders. Now I paste the customer's message and get a PDF instantly."</p>
          <p class="review-author">CHIOMA O.</p>
          <p class="review-role">Hair Vendor</p>
        </div>
        <div class="review-card" use:Reveal={{ direction: 'up', delay: 0.2 }}>
          <p class="review-text">"The math is always perfect. I never double-check my VAT or totals anymore. It saves me hours weekly."</p>
          <p class="review-author">DAVID A.</p>
          <p class="review-role">Hardware Supplier</p>
        </div>
        <div class="review-card" use:Reveal={{ direction: 'up', delay: 0.3 }}>
          <p class="review-text">"I was quoting in Word docs. Now Quotera takes the client's text and generates a beautiful proposal in 5 seconds."</p>
          <p class="review-author">SARAH M.</p>
          <p class="review-role">Event Planner</p>
        </div>
      </div>
    </section>

    <!-- FAQ (Untouched) -->
    <section class="section" id="faq" style="padding-top: 60px; padding-bottom: 60px; padding-left: 20px; padding-right: 20px;">
      <div class="sec-head" use:Reveal={{ direction: 'up' }}>
        <h2 class="h-section">Questions.</h2>
      </div>
      <div class="faq" use:Reveal={{ direction: 'up', delay: 0.1 }}>
        <details>
          <summary>How does the extraction work?</summary>
          <p>You paste the customer's raw text, and our engine reads it to find items and quantities that match your saved price list.</p>
        </details>
        <details>
          <summary>Can I add my company logo?</summary>
          <p>Yes. You can upload your logo, choose your brand color, and set your terms in the Settings page.</p>
        </details>
        <details>
          <summary>Is the free plan limited?</summary>
          <p>The free plan gives you 3 quotes a month. You can upgrade anytime for unlimited access.</p>
        </details>
        <details>
          <summary>What if my product names have typos?</summary>
          <p>The engine is smart enough to match typos like "Mikita grinder" to your saved "Makita Angle Grinder".</p>
        </details>
        <details>
          <summary>Can I edit the quote before sending?</summary>
          <p>Yes, you can adjust quantities and prices before generating the final PDF.</p>
        </details>
        <details>
          <summary>Do my customers need an account?</summary>
          <p>No, they just receive the PDF via WhatsApp or email. No sign-up required for them.</p>
        </details>
        <details>
          <summary>Can I use this on my phone?</summary>
          <p>Yes, Quotera is fully responsive and works perfectly on mobile browsers.</p>
        </details>
      </div>
    </section>

    <!-- FINAL CTA (Untouched) -->
    <section class="final-cta">
      <div use:Reveal={{ direction: 'scale', delay: 0.1 }}>
        <h2>Ready to close deals faster?</h2>
        <p>Join hundreds of businesses generating flawless PDFs in seconds.</p>
        <a href="/register" class="btn">Start for free today</a>
      </div>
    </section>
  </main>

  <!-- FOOTER (Untouched) -->
  <footer>
    <div class="fgrid">
      <div use:Reveal={{ direction: 'up' }}>
        <a href="#top" class="brand">
          {@html I.logo} Quotera<span>.</span>
        </a>
        <p>Quote smarter, close faster. The automated quoting engine for modern business.</p>
      </div>
      <div use:Reveal={{ direction: 'up', delay: 0.1 }}>
        <h4>Product</h4>
        <ul>
          <li><a href="#how">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>
      <div use:Reveal={{ direction: 'up', delay: 0.15 }}>
        <h4>Company</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank">Contact</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
      <div use:Reveal={{ direction: 'up', delay: 0.2 }}>
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="fbot">
      <span>© 2026 Quotera. All rights reserved.</span>
      <div class="status"><div class="dot"></div> All systems operational</div>
    </div>
  </footer>
</div>
```
