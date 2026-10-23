<svelte:head>
  <title>Create Account | Quotera</title>
</svelte:head>

<div class="register-wrapper">
  
  <a href="/" class="brand-logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 217 176" width="36" height="30"><defs><linearGradient id="teal" x1="0" y1="22" x2="0" y2="148" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a7270"/><stop offset=".4" stop-color="#1c5658"/><stop offset=".75" stop-color="#0e4345"/></linearGradient><linearGradient id="arc" x1="72" y1="0" x2="158" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#dc5159"/><stop offset="1" stop-color="#f08358"/></linearGradient><linearGradient id="check" x1="125" y1="60" x2="195" y2="120" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4844e"/><stop offset=".42" stop-color="#ee7a54"/><stop offset=".58" stop-color="#d95955"/><stop offset="1" stop-color="#dc5560"/></linearGradient></defs><path fill="#24503C" d="M86.5 64.2L86.5 74.8C82.5 75.5 69.5 77.5 62.8 79.3C56 81.2 51.6 82.9 46.2 86C40.9 89.2 34.3 95.1 30.9 98.3C27.5 101.4 27.1 102.8 25.8 105C24.6 107.2 23.7 110.2 23.2 111.2L39.5 102.5C40.8 105.1 44.9 113.8 47.4 118C49.9 122.2 51.6 124.4 54.4 127.5C57.3 130.6 60.8 133.9 64.5 136.5C68.2 139.2 72.4 141.7 76.8 143.5C81.1 145.3 86 146.6 90.8 147.4C95.5 148.1 100.4 148.4 105.2 148C110.1 147.7 115.6 146.6 119.8 145.2C123.9 143.9 128.5 140.9 130.2 140L114 120.8C111.4 121.1 103.3 122.9 98.5 122.6C93.7 122.2 89.3 121.1 85 118.7C80.7 116.3 75.2 111.1 72.4 108.2C69.7 105.4 69.4 103.8 68.5 101.8C67.6 99.7 67.2 97 67 96C69 95.7 76 94.4 79.2 94.3C82.5 94.2 85.5 95.3 86.8 95.5L86.2 106.5L117.5 85C116.4 84.1 116.2 83 111 79.5C105.8 76.1 90.6 66.8 86.5 64.2Z"/><path fill="#24503C" d="M39 84.2C43.3 82.5 58.3 79.3 64.9 73.5C71.6 67.8 74.9 55.1 78.7 49.8C82.5 44.4 84.6 43.9 87.8 41.6C90.9 39.2 94.2 37.3 97.8 35.9C101.3 34.4 105.2 33.4 109 32.9C112.8 32.4 116.8 32.2 120.8 32.7C124.8 33.2 129 34.4 133 35.8C137 37.3 143 40.6 145 41.5C144.1 40.6 142 37.9 139.7 36.1C137.5 34.3 135.7 32.5 131.5 30.5C127.3 28.5 120.8 25.4 114.8 24.1C108.7 22.9 101.4 22.4 95.2 22.9C89.1 23.4 83.3 24.7 77.8 27C72.2 29.3 66.5 32.7 61.8 36.5C57 40.3 52.7 44.7 49.3 49.8C45.9 54.8 42.9 62.4 41.2 67C39.4 71.6 39.3 74.6 39 77.5C38.6 80.4 39 83.1 39 84.2Z"/><path fill="url(#arc)" d="M72 61C73.9 59.7 80.2 54.9 83.5 53C86.8 51.1 88.7 50.4 91.8 49.6C94.8 48.8 98.7 48.2 102 48.3C105.3 48.4 108.3 49 111.5 50C114.7 51.1 118.1 52.6 121 54.5C123.9 56.5 126.8 59.2 128.9 61.8C131.1 64.3 132.4 66.5 133.9 69.8C135.4 73 137.3 79.5 138 81.5L158 62C157.2 60.2 155.4 54.3 153.2 51C151.1 47.7 148.7 44.9 145.2 42.3C141.8 39.8 137.5 37.3 132.8 35.7C128 34 122 32.7 117 32.5C112 32.3 107 33.1 102.5 34.3C98 35.5 94.3 37.1 90.2 39.7C86.2 42.3 81.5 46.2 78.4 49.8C75.4 53.3 73.1 59.1 72 61Z"/><path fill="url(#check)" d="M104.8 100.8L121.8 88.8L131 96.8C148 75 182 47 212.5 31C168 70 158 100 153 121L173.5 147.5L143.8 147.5Z"/></svg>
    Quotera<span>.</span>
  </a>

  <div class="auth-card">
    
    <div class="header">
      <h1>Create an account.</h1>
      <p>Start generating quotes in seconds.</p>
    </div>

    <form method="POST">
      
      <div class="input-group">
        <label for="fullname">Full Name</label>
        <input 
          type="text" 
          id="fullname" 
          name="fullname" 
          placeholder="John Doe" 
          required 
        />
      </div>

      <div class="input-group">
        <label for="email">Email address</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="you@company.com" 
          required 
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="At least 8 characters" 
          required 
        />
      </div>

      <!-- TERMS CHECKBOX (The required attribute stops submission) -->
      <div class="terms-group">
        <input type="checkbox" id="terms" name="terms" required />
        <label for="terms">
          I agree to the <a href="/legal/terms" target="_blank">Terms</a> and <a href="/legal/privacy" target="_blank">Privacy Policy</a>.
        </label>
      </div>

      <button type="submit" class="submit-btn">
        Create account
      </button>
    </form>

    <p class="footer-text">
      Already have an account? 
      <a href="/login" class="text-link">Log in</a>
    </p>

  </div>
  
  <div class="footer-links">
    <a href="/legal/privacy">Privacy</a>
    <a href="/legal/terms">Terms</a>
  </div>

</div>

<style>
  .register-wrapper {
    min-height: 100vh;
    background-color: #EEF2EE;
    background-image: radial-gradient(circle at 50% 0%, rgba(196, 81, 61, 0.12) 0%, rgba(238, 242, 238, 1) 60%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px; 
    font-family: 'Inter', system-ui, sans-serif;
    box-sizing: border-box;
  }

  @media (min-width: 480px) {
    .register-wrapper {
      padding: 24px;
    }
  }

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
    font-size: 32px;
    color: #303B38;
    text-decoration: none;
    margin-bottom: 32px;
    letter-spacing: -0.03em;
  }

  .brand-logo span {
    color: #C4513D;
  }

  .auth-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: none; 
    border-radius: 16px;
    padding: 24px; 
    
    width: 100%;
    max-width: 420px;
    box-sizing: border-box;
    
    box-shadow: 0 24px 48px -12px rgba(48, 59, 56, 0.15); 
  }

  @media (min-width: 480px) {
    .auth-card {
      padding: 32px; 
      border-radius: 20px;
    }
  }

  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  .header h1 {
    font-family: 'Manrope', sans-serif;
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 6px 0;
    color: #303B38;
    letter-spacing: -0.02em;
  }

  .header p {
    color: #6B7280;
    margin: 0;
    font-size: 13px;
  }

  .input-group {
    margin-bottom: 16px; 
  }

  .input-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #303B38;
    margin-bottom: 6px;
  }

  .input-group input {
    width: 100%;
    padding: 10px 14px; 
    border: 1px solid rgba(48, 59, 56, 0.08);
    border-radius: 8px;
    font-size: 14px; 
    color: #303B38;
    background-color: #ffffff;
    box-sizing: border-box;
    outline: none;
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }

  .input-group input::placeholder {
    color: #D1D5DB; 
    font-size: 14px;
  }

  .input-group input:focus {
    border-color: #24503C;
    box-shadow: 0 0 0 3px rgba(36, 80, 60, 0.1);
  }

  /* Adjusted Terms Group */
  .terms-group {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    margin-top: 12px;
  }

  /* The checkbox is now clearly visible and required */
  .terms-group input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #24503C;
    margin-right: 8px;
    margin-top: 1px;
    cursor: pointer;
    flex-shrink: 0;
    /* Adding a border so it's clearly an interactive box */
    border: 1px solid #d1d5db; 
  }

  .terms-group label {
    font-size: 12px;
    color: #6B7280;
    line-height: 1.4;
    cursor: pointer;
    user-select: none;
  }

  .terms-group a {
    color: #24503C;
    font-weight: 600;
    text-decoration: none;
  }

  .terms-group a:hover {
    text-decoration: underline;
  }

  .submit-btn {
    width: 100%;
    background: #24503C;
    color: white;
    padding: 12px; 
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .submit-btn:hover {
    background: #1a3a2b;
  }

  .footer-text {
    text-align: center;
    margin: 20px 0 0 0;
    font-size: 13px;
    color: #6B7280;
  }

  .text-link {
    color: #24503C;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .text-link:hover {
    opacity: 0.7;
  }

  .footer-links {
    margin-top: 32px;
    display: flex;
    gap: 24px;
    font-size: 13px;
    color: #9CA3AF;
  }

  .footer-links a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: #303B38;
  }
</style>