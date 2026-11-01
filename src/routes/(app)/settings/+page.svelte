<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let companyName = $state(data.user.company_name);
  let companyAddress = $state(data.user.company_address);
  let companyContact = $state(data.user.company_contact);
  let logoBase64 = $state(data.user.logo_base64);
  
  let headerColor = $state(data.user.header_color || "#24503C");
  let textColor = $state(data.user.text_color || "#303B38");
  let accentColor = $state(data.user.accent_color || "#C4513D");

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
</svelte:head>

<!-- Reduced outer padding to stretch properly -->
<div style="max-width: 1000px; margin: 0 auto; padding: 12px;">

  <div style="margin-bottom: 24px; padding-left: 4px;">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 800; color: #303B38; margin: 0 0 8px 0; letter-spacing: -0.03em;">Settings</h1>
    <p style="color: #6B7280; margin: 0; font-size: 15px;">Manage your account and PDF branding.</p>
  </div>

  <!-- Account & Plan Section -->
  <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(48, 59, 56, 0.04);">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div>
        <p style="font-size: 14px; font-weight: 600; color: #303B38; margin: 0;">Email Address</p>
        <p style="font-size: 15px; color: #6B7280; margin: 4px 0 0 0;">{data.user.email}</p>
      </div>
      
      <div style="background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 12px; padding: 12px 20px; display: flex; align-items: center; gap: 20px;">
        <div>
          <p style="font-size: 11px; font-weight: 700; color: #166534; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Current Plan</p>
          <p style="font-size: 16px; font-weight: 800; color: #14532D; margin: 2px 0 0 0;">{data.user.plan}</p>
        </div>
        <button onclick={() => isUpgradeModalOpen = true} style="background: #24503C; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(36,80,60,0.2); transition: all 0.2s;">
          Upgrade
        </button>
      </div>
    </div>
  </div>

  <!-- Branding Section -->
  <form 
    method="POST" 
    use:enhance={() => {
      return async ({ update }) => { await update(); };
    }} 
    style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(48, 59, 56, 0.04);"
  >
    
    <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 800; color: #303B38; margin: 0 0 24px 0; letter-spacing: -0.02em;">PDF Branding</h2>

    {#if form?.success}
      <div style="background: #DCFCE7; color: #166534; padding: 14px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 600; font-size: 15px;">
        Settings saved successfully!
      </div>
    {/if}

    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <div>
        <label style="display: block; font-size: 14px; font-weight: 600; color: #303B38; margin-bottom: 8px;">Company Name</label>
        <input type="text" name="companyName" bind:value={companyName} placeholder="e.g. Acme Hardware Ltd" style="width: 100%; padding: 14px 16px; border: 1px solid #E5E7EB; border-radius: 10px; font-size: 16px; box-sizing: border-box; transition: border-color 0.2s; outline: none; color: #303B38;" />
      </div>

      <div>
        <label style="display: block; font-size: 14px; font-weight: 600; color: #303B38; margin-bottom: 8px;">Business Address</label>
        <input type="text" name="companyAddress" bind:value={companyAddress} placeholder="e.g. 12 Marina Road, Lagos" style="width: 100%; padding: 14px 16px; border: 1px solid #E5E7EB; border-radius: 10px; font-size: 16px; box-sizing: border-box; transition: border-color 0.2s; outline: none; color: #303B38;" />
      </div>

      <div>
        <label style="display: block; font-size: 14px; font-weight: 600; color: #303B38; margin-bottom: 8px;">Contact Info</label>
        <input type="text" name="companyContact" bind:value={companyContact} placeholder="e.g. sales@acme.com" style="width: 100%; padding: 14px 16px; border: 1px solid #E5E7EB; border-radius: 10px; font-size: 16px; box-sizing: border-box; transition: border-color 0.2s; outline: none; color: #303B38;" />
      </div>

      <!-- Logo Uploader -->
      <div style="margin-top: 8px;">
        <label style="display: block; font-size: 14px; font-weight: 600; color: #303B38; margin-bottom: 8px;">Company Logo</label>
        <div style="display: flex; align-items: center; gap: 16px;">
          {#if logoBase64}
            <div style="position: relative; display: inline-flex;">
              <img src={logoBase64} alt="Logo Preview" style="height: 64px; width: auto; max-width: 160px; object-fit: contain; border: 1px solid #E5E7EB; border-radius: 10px; padding: 6px; background: #F9FAFB;" />
              <button type="button" onclick={removeLogo} style="position: absolute; top: -8px; right: -8px; background: #DC2626; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; padding: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">✕</button>
            </div>
          {/if}
          
          <div style="position: relative; flex: 1;">
            <input type="file" accept="image/*" onchange={handleLogoUpload} style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;" />
            <div style="border: 2px dashed #D1D5DB; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F9FAFB; transition: border-color 0.2s;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span style="font-size: 14px; font-weight: 600; color: #303B38;">Click to upload</span>
              <span style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">JPG, PNG (Max 200px)</span>
            </div>
          </div>
        </div>
        {#if isCompressing}
          <p style="font-size: 13px; color: #24503C; margin-top: 8px; font-weight: 600;">Compressing image...</p>
        {/if}
        <input type="hidden" name="logoBase64" value={logoBase64} />
      </div>

      <!-- Premium Standard Color Pickers -->
      <div style="margin-top: 16px;">
        <label style="display: block; font-size: 14px; font-weight: 600; color: #303B38; margin-bottom: 12px;">PDF Colors</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          
          <!-- Header Color -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <span style="display: block; font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Header</span>
            <div style="position: relative; width: 100%; height: 44px; border-radius: 8px; overflow: hidden; border: 1px solid #D1D5DB;">
              <input type="color" name="headerColor" bind:value={headerColor} style="position: absolute; top: -10px; left: -10px; width: 150%; height: 150%; cursor: pointer; border: none; padding: 0;" />
            </div>
          </div>

          <!-- Font Color -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <span style="display: block; font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Font</span>
            <div style="position: relative; width: 100%; height: 44px; border-radius: 8px; overflow: hidden; border: 1px solid #D1D5DB;">
              <input type="color" name="textColor" bind:value={textColor} style="position: absolute; top: -10px; left: -10px; width: 150%; height: 150%; cursor: pointer; border: none; padding: 0;" />
            </div>
          </div>

          <!-- Accent Color -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <span style="display: block; font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Accent</span>
            <div style="position: relative; width: 100%; height: 44px; border-radius: 8px; overflow: hidden; border: 1px solid #D1D5DB;">
              <input type="color" name="accentColor" bind:value={accentColor} style="position: absolute; top: -10px; left: -10px; width: 150%; height: 150%; cursor: pointer; border: none; padding: 0;" />
            </div>
          </div>

        </div>
      </div>
    </div>

    <button type="submit" style="width: 100%; background: #24503C; color: white; padding: 16px; border-radius: 10px; border: none; font-weight: 700; font-size: 16px; cursor: pointer; margin-top: 28px; box-shadow: 0 4px 6px -1px rgba(36,80,60,0.2); transition: transform 0.1s;">
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
