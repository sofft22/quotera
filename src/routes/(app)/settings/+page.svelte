<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let companyName = $state(data.user.company_name || "");
  let companyAddress = $state(data.user.company_address || "");
  let companyContact = $state(data.user.company_contact || "");
  let logoBase64 = $state(data.user.logo_base64 || "");
  
  let headerColor = $state(data.user.header_color && data.user.header_color !== "" ? data.user.header_color : "#24503C");
  let accentColor = $state(data.user.accent_color && data.user.accent_color !== "" ? data.user.accent_color : "#C4513D");

  let isUpgradeModalOpen = $state(false);
  let isCompressing = $state(false);

  const WHATSAPP = "2347072789513"; 

  async function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    isCompressing = true;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        logoBase64 = canvas.toDataURL('image/jpeg', 0.6);
        isCompressing = false;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    logoBase64 = "";
  }
</script>

<svelte:head>
  <title>Settings | Quotera</title>
  <style>
    /* Default mobile styles */
    .page-wrap { max-width: 100%; margin: 0 auto; padding: 4px; width: 100%; box-sizing: border-box; }
    .card { background: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(48, 59, 56, 0.03); box-sizing: border-box; }
    .page-title { font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; color: #303B38; margin: 0 0 4px 0; letter-spacing: -0.03em; }
    .page-desc { color: #6B7280; margin: 0; font-size: 14px; }
    .header-flex { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    .plan-box { background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 10px; padding: 8px 16px; display: flex; align-items: center; gap: 16px; }
    .form-title { font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #303B38; margin: 0 0 16px 0; letter-spacing: -0.02em; }
    .input-group { display: flex; flex-direction: column; gap: 16px; }
    .input-label { display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px; }
    .text-input { width: 100%; padding: 12px 14px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 15px; box-sizing: border-box; transition: border-color 0.2s; outline: none; color: #303B38; }
    .color-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .color-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .color-label { display: block; font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .save-btn { width: 100%; background: #24503C; color: white; padding: 14px; border-radius: 8px; border: none; font-weight: 700; font-size: 15px; cursor: pointer; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(36,80,60,0.2); transition: transform 0.1s; }

    /* Desktop styles: Makes it stretch wide and rectangular */
    @media (min-width: 769px) {
      .page-wrap { padding: 32px; max-width: 1200px; }
      .card { padding: 24px 32px; margin-bottom: 24px; }
      .page-title { font-size: 32px; margin-bottom: 8px; }
      .page-desc { font-size: 15px; }
      .form-title { font-size: 22px; margin-bottom: 24px; }
      .input-group { gap: 20px; }
      .text-input { padding: 14px 16px; font-size: 16px; }
      .save-btn { padding: 16px; font-size: 16px; margin-top: 28px; }
    }
  </style>
</svelte:head>

<div class="page-wrap">

  <div style="margin-bottom: 24px; padding-left: 4px;">
    <h1 class="page-title">Settings</h1>
    <p class="page-desc">Manage your account and PDF branding.</p>
  </div>

  <div class="card">
    <div class="header-flex">
      <div>
        <p style="font-size: 14px; font-weight: 600; color: #303B38; margin: 0;">Email Address</p>
        <p style="font-size: 15px; color: #6B7280; margin: 4px 0 0 0;">{data.user.email}</p>
      </div>
      
      <div class="plan-box">
        <div>
          <p style="font-size: 10px; font-weight: 700; color: #166534; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Current Plan</p>
          <p style="font-size: 15px; font-weight: 800; color: #14532D; margin: 2px 0 0 0;">{data.user.plan}</p>
        </div>
        <button onclick={() => isUpgradeModalOpen = true} style="background: #24503C; color: white; padding: 8px 16px; border-radius: 6px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: 0 2px 4px rgba(36,80,60,0.2); transition: all 0.2s;">
          Upgrade
        </button>
      </div>
    </div>
  </div>

  <form 
    method="POST" 
    use:enhance={() => {
      return async ({ update }) => {
        await update({ reset: false }); 
      };
    }} 
    class="card"
  >
    
    <h2 class="form-title">PDF Branding</h2>

    {#if form?.success}
      <div style="background: #DCFCE7; color: #166534; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; font-size: 14px;">
        Settings saved successfully!
      </div>
    {/if}

    {#if form?.error}
      <div style="background: #FEE2E2; color: #DC2626; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; font-size: 14px;">
        {form.error}
      </div>
    {/if}

    <div class="input-group">
      
      <div>
        <label class="input-label">Company Name</label>
        <input type="text" name="companyName" bind:value={companyName} placeholder="e.g. Acme Hardware Ltd" class="text-input" />
      </div>

      <div>
        <label class="input-label">Business Address</label>
        <input type="text" name="companyAddress" bind:value={companyAddress} placeholder="e.g. 12 Marina Road, Lagos" class="text-input" />
      </div>

      <div>
        <label class="input-label">Contact Info</label>
        <input type="text" name="companyContact" bind:value={companyContact} placeholder="e.g. sales@acme.com" class="text-input" />
      </div>

      <div style="margin-top: 4px;">
        <label class="input-label">Company Logo</label>
        <div style="display: flex; align-items: center; gap: 16px;">
          {#if logoBase64}
            <div style="position: relative; display: inline-flex;">
              <img src={logoBase64} alt="Logo Preview" style="height: 56px; width: auto; max-width: 140px; object-fit: contain; border: 1px solid #E5E7EB; border-radius: 8px; padding: 4px; background: #F9FAFB;" />
              <button type="button" onclick={removeLogo} style="position: absolute; top: -6px; right: -6px; background: #DC2626; color: white; border: 2px solid white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; padding: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">✕</button>
            </div>
          {/if}
          
          <div style="position: relative; flex: 1;">
            <input type="file" accept="image/*" onchange={handleLogoUpload} style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;" />
            <div style="border: 2px dashed #D1D5DB; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F9FAFB; transition: border-color 0.2s;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span style="font-size: 13px; font-weight: 600; color: #303B38;">Click to upload</span>
              <span style="font-size: 11px; color: #9CA3AF; margin-top: 2px;">JPG, PNG (Max 200px)</span>
            </div>
          </div>
        </div>
        {#if isCompressing}
          <p style="font-size: 12px; color: #24503C; margin-top: 6px; font-weight: 600;">Compressing image...</p>
        {/if}
        <input type="hidden" name="logoBase64" value={logoBase64} />
      </div>

      <div style="margin-top: 12px;">
        <label class="input-label" style="margin-bottom: 10px;">PDF Colors</label>
        <div class="color-grid">
          
          <div class="color-card">
            <span class="color-label">Header Banner</span>
            <div style="position: relative; width: 100%; height: 40px; border-radius: 6px; overflow: hidden; border: 1px solid #D1D5DB;">
              <input 
                type="color" 
                name="headerColor" 
                value={headerColor} 
                oninput={(e) => headerColor = e.target.value}
                style="position: absolute; top: -10px; left: -10px; width: 150%; height: 150%; cursor: pointer; border: none; padding: 0;" 
              />
            </div>
          </div>

          <div class="color-card">
            <span class="color-label">Accent Color</span>
            <div style="position: relative; width: 100%; height: 40px; border-radius: 6px; overflow: hidden; border: 1px solid #D1D5DB;">
              <input 
                type="color" 
                name="accentColor" 
                value={accentColor} 
                oninput={(e) => accentColor = e.target.value}
                style="position: absolute; top: -10px; left: -10px; width: 150%; height: 150%; cursor: pointer; border: none; padding: 0;" 
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <button type="submit" class="save-btn">
      Save Settings
    </button>
  </form>

</div>

<!-- UPGRADE MODAL -->
{#if isUpgradeModalOpen}
  <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(48, 59, 56, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px;">
    <div style="background: #EEF2EE; width: 100%; max-width: 1200px; border-radius: 24px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 48px rgba(0,0,0,0.2);">
      
      <button onclick={() => isUpgradeModalOpen = false} style="position: absolute; top: 24px; right: 24px; background: white; border: 1px solid #E5E7EB; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px; color: #6B7280; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">✕</button>
      
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 36px; font-weight: 800; color: #303B38; margin: 0 0 12px 0; letter-spacing: -0.03em;">Upgrade your plan.</h2>
        <p style="color: #6B7280; font-size: 16px; margin: 0;">Choose the plan that fits your business needs.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; align-items: start;">
        
        <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 20px; padding: 32px 24px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 6px 0; color: #303B38;">Free</h3>
          <p style="font-size: 14px; color: #6B7280; margin: 0 0 24px 0;">For testing the waters.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 36px; font-weight: 800; margin-bottom: 24px; color: #303B38;">₦0<span style="font-size: 14px; font-weight: 500; color: #6B7280;">/mo</span></div>
          <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; display: flex; flex-direction: column; gap: 12px;">
            <li style="font-size: 14px; color: #4B5563; display: flex; align-items: center; gap: 10px;"><span style="color: #24503C; font-weight: bold;">✓</span> 3 quotes / mo</li>
            <li style="font-size: 14px; color: #4B5563; display: flex; align-items: center; gap: 10px;"><span style="color: #24503C; font-weight: bold;">✓</span> 5 products</li>
          </ul>
          <button disabled style="margin-top: auto; width: 100%; background: #F3F4F6; color: #9CA3AF; padding: 14px; border-radius: 10px; border: none; font-weight: 600; font-size: 15px;">Current Plan</button>
        </div>

        <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 20px; padding: 32px 24px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 6px 0; color: #303B38;">Starter</h3>
          <p style="font-size: 14px; color: #6B7280; margin: 0 0 24px 0;">For the casual freelancer.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 36px; font-weight: 800; margin-bottom: 24px; color: #303B38;">₦2,000<span style="font-size: 14px; font-weight: 500; color: #6B7280;">/mo</span></div>
          <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; display: flex; flex-direction: column; gap: 12px;">
            <li style="font-size: 14px; color: #4B5563; display: flex; align-items: center; gap: 10px;"><span style="color: #24503C; font-weight: bold;">✓</span> 15 quotes / mo</li>
            <li style="font-size: 14px; color: #4B5563; display: flex; align-items: center; gap: 10px;"><span style="color: #24503C; font-weight: bold;">✓</span> 15 products</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to upgrade to the Starter plan (₦2,000/mo). My account email is ${data.user.email}`} target="_blank" style="margin-top: auto; display: block; text-align: center; width: 100%; background: #F3F4F6; color: #303B38; padding: 14px; border-radius: 10px; border: none; font-weight: 600; font-size: 15px; text-decoration: none; box-sizing: border-box;">Get Starter</a>
        </div>

        <div style="background: #24503C; color: white; border-radius: 20px; padding: 32px 24px; display: flex; flex-direction: column; box-shadow: 0 20px 40px -10px rgba(36,80,60,0.5); transform: scale(1.03); position: relative;">
          <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #C4513D; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;">Most Popular</div>
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 6px 0; color: white;">Pro</h3>
          <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 24px 0;">For serious business.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 36px; font-weight: 800; margin-bottom: 24px; color: white;">₦6,000<span style="font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.6);">/mo</span></div>
          <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; display: flex; flex-direction: column; gap: 12px;">
            <li style="font-size: 14px; color: white; display: flex; align-items: center; gap: 10px;"><span style="color: #A7F3D0; font-weight: bold;">✓</span> 50 quotes / mo</li>
            <li style="font-size: 14px; color: white; display: flex; align-items: center; gap: 10px;"><span style="color: #A7F3D0; font-weight: bold;">✓</span> 50 products</li>
            <li style="font-size: 14px; color: white; display: flex; align-items: center; gap: 10px;"><span style="color: #A7F3D0; font-weight: bold;">✓</span> Branded PDF</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to upgrade to the Pro plan (₦6,000/mo). My account email is ${data.user.email}`} target="_blank" style="margin-top: auto; display: block; text-align: center; width: 100%; background: #ffffff; color: #24503C; padding: 14px; border-radius: 10px; border: none; font-weight: 700; font-size: 15px; text-decoration: none; box-sizing: border-box;">Get Pro</a>
        </div>

        <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 20px; padding: 32px 24px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 6px 0; color: #303B38;">Custom</h3>
          <p style="font-size: 14px; color: #6B7280; margin: 0 0 24px 0;">For large teams and agencies.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; margin-bottom: 24px; color: #303B38; height: 44px; display: flex; align-items: center;">Let's Talk</div>
          <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; display: flex; flex-direction: column; gap: 12px;">
            <li style="font-size: 14px; color: #4B5563; display: flex; align-items: center; gap: 10px;"><span style="color: #24503C; font-weight: bold;">✓</span> Unlimited quotes</li>
            <li style="font-size: 14px; color: #4B5563; display: flex; align-items: center; gap: 10px;"><span style="color: #24503C; font-weight: bold;">✓</span> Custom features</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I run an agency and I'm interested in a Custom plan. My account email is ${data.user.email}`} target="_blank" style="margin-top: auto; display: block; text-align: center; width: 100%; background: #F3F4F6; color: #303B38; padding: 14px; border-radius: 10px; border: none; font-weight: 600; font-size: 15px; text-decoration: none; box-sizing: border-box;">Contact Sales</a>
        </div>

      </div>
    </div>
  </div>
{/if}
