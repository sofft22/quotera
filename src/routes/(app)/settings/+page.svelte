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
</script>

<svelte:head>
  <title>Settings | Quotera</title>
</svelte:head>

<!-- Reduced outer padding: max-width is 1000px and padding is tight -->
<div style="max-width: 1000px; margin: 0 auto; padding: 16px 12px;">

  <div style="margin-bottom: 24px;">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; color: #303B38; margin: 0 0 8px 0; letter-spacing: -0.02em;">Settings</h1>
    <p style="color: #6B7280; margin: 0; font-size: 14px;">Manage your account and PDF branding.</p>
  </div>

  <!-- Account & Plan Section -->
  <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div>
        <p style="font-size: 13px; font-weight: 600; color: #303B38; margin: 0;">Email Address</p>
        <p style="font-size: 14px; color: #6B7280; margin: 4px 0 0 0;">{data.user.email}</p>
      </div>
      
      <div style="background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 16px;">
        <div>
          <p style="font-size: 10px; font-weight: 700; color: #166534; margin: 0; text-transform: uppercase;">Current Plan</p>
          <p style="font-size: 15px; font-weight: 800; color: #14532D; margin: 2px 0 0 0;">{data.user.plan}</p>
        </div>
        <button onclick={() => isUpgradeModalOpen = true} style="background: #24503C; color: white; padding: 8px 14px; border-radius: 6px; border: none; font-weight: 600; font-size: 13px; cursor: pointer;">
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
    style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);"
  >
    
    <h2 style="font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; color: #303B38; margin: 0 0 16px 0;">PDF Branding</h2>

    {#if form?.success}
      <div style="background: #DCFCE7; color: #166534; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; font-size: 14px;">
        Settings saved successfully!
      </div>
    {/if}

    <div style="display: flex; flex-direction: column; gap: 14px;">
      
      <div>
        <label style="display: block; font-size: 12px; font-weight: 600; color: #303B38; margin-bottom: 4px;">Company Name</label>
        <input type="text" name="companyName" bind:value={companyName} placeholder="e.g. Acme Hardware Ltd" style="width: 100%; padding: 10px 12px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <div>
        <label style="display: block; font-size: 12px; font-weight: 600; color: #303B38; margin-bottom: 4px;">Business Address</label>
        <input type="text" name="companyAddress" bind:value={companyAddress} placeholder="e.g. 12 Marina Road, Lagos" style="width: 100%; padding: 10px 12px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <div>
        <label style="display: block; font-size: 12px; font-weight: 600; color: #303B38; margin-bottom: 4px;">Contact Info</label>
        <input type="text" name="companyContact" bind:value={companyContact} placeholder="e.g. sales@acme.com" style="width: 100%; padding: 10px 12px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <!-- Modern Logo Uploader -->
      <div style="margin-top: 4px;">
        <label style="display: block; font-size: 12px; font-weight: 600; color: #303B38; margin-bottom: 4px;">Company Logo</label>
        <div style="display: flex; align-items: center; gap: 16px;">
          {#if logoBase64}
            <img src={logoBase64} alt="Logo Preview" style="height: 56px; width: auto; max-width: 140px; object-fit: contain; border: 1px solid #E5E7EB; border-radius: 6px; padding: 4px; background: #F9FAFB;" />
          {/if}
          
          <div style="position: relative; flex: 1;">
            <input type="file" accept="image/*" onchange={handleLogoUpload} style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;" />
            <div style="border: 1.5px dashed #D1D5DB; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F9FAFB;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span style="font-size: 12px; font-weight: 600; color: #303B38;">Click to upload</span>
              <span style="font-size: 10px; color: #9CA3AF; margin-top: 2px;">JPG, PNG (Max 200px)</span>
            </div>
          </div>
        </div>
        {#if isCompressing}
          <p style="font-size: 11px; color: #24503C; margin-top: 6px; font-weight: 600;">Compressing image...</p>
        {/if}
        <input type="hidden" name="logoBase64" value={logoBase64} />
      </div>

      <!-- Premium Color Pickers -->
      <div style="margin-top: 12px;">
        <label style="display: block; font-size: 12px; font-weight: 600; color: #303B38; margin-bottom: 10px;">PDF Colors</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          
          <!-- Header Color -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
            <div style="position: relative; width: 32px; height: 32px; border-radius: 8px; overflow: hidden; border: 1px solid #D1D5DB; flex-shrink: 0;">
              <input type="color" name="headerColor" bind:value={headerColor} style="position: absolute; top: -10px; left: -10px; width: 60px; height: 60px; cursor: pointer; border: none; padding: 0;" />
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase;">Header</span>
              <span style="font-size: 12px; font-weight: 600; color: #303B38; text-transform: uppercase;">{headerColor}</span>
            </div>
          </div>

          <!-- Font Color -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
            <div style="position: relative; width: 32px; height: 32px; border-radius: 8px; overflow: hidden; border: 1px solid #D1D5DB; flex-shrink: 0;">
              <input type="color" name="textColor" bind:value={textColor} style="position: absolute; top: -10px; left: -10px; width: 60px; height: 60px; cursor: pointer; border: none; padding: 0;" />
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase;">Font</span>
              <span style="font-size: 12px; font-weight: 600; color: #303B38; text-transform: uppercase;">{textColor}</span>
            </div>
          </div>

          <!-- Accent Color -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
            <div style="position: relative; width: 32px; height: 32px; border-radius: 8px; overflow: hidden; border: 1px solid #D1D5DB; flex-shrink: 0;">
              <input type="color" name="accentColor" bind:value={accentColor} style="position: absolute; top: -10px; left: -10px; width: 60px; height: 60px; cursor: pointer; border: none; padding: 0;" />
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase;">Accent</span>
              <span style="font-size: 12px; font-weight: 600; color: #303B38; text-transform: uppercase;">{accentColor}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <button type="submit" style="width: 100%; background: #24503C; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 15px; cursor: pointer; margin-top: 20px;">
      Save Settings
    </button>
  </form>

</div>

<!-- UPGRADE MODAL -->
{#if isUpgradeModalOpen}
  <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(48, 59, 56, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px;">
    <div style="background: #EEF2EE; width: 100%; max-width: 1200px; border-radius: 24px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 48px rgba(0,0,0,0.2);">
      
      <button onclick={() => isUpgradeModalOpen = false} style="position: absolute; top: 24px; right: 24px; background: white; border: 1px solid #E5E7EB; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 18px; color: #6B7280; display: flex; align-items: center; justify-content: center;">✕</button>
      
      <div style="text-align: center; margin-bottom: 32px;">
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 800; color: #303B38; margin: 0 0 8px 0;">Upgrade your plan.</h2>
        <p style="color: #6B7280; font-size: 15px; margin: 0;">Choose the plan that fits your business needs.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; align-items: start;">
        
        <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 28px 20px; display: flex; flex-direction: column;">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 4px 0; color: #303B38;">Free</h3>
          <p style="font-size: 13px; color: #6B7280; margin: 0 0 20px 0;">For testing the waters.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 30px; font-weight: 800; margin-bottom: 20px; color: #303B38;">₦0<span style="font-size: 13px; font-weight: 500; color: #6B7280;">/mo</span></div>
          <ul style="list-style: none; padding: 0; margin: 0 0 28px 0; display: flex; flex-direction: column; gap: 10px;">
            <li style="font-size: 13px; color: #4B5563; display: flex; align-items: center; gap: 8px;"><span style="color: #24503C;">✓</span> 3 quotes / mo</li>
            <li style="font-size: 13px; color: #4B5563; display: flex; align-items: center; gap: 8px;"><span style="color: #24503C;">✓</span> 5 products</li>
          </ul>
          <button disabled style="margin-top: auto; width: 100%; background: #F3F4F6; color: #9CA3AF; padding: 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px;">Current Plan</button>
        </div>

        <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 28px 20px; display: flex; flex-direction: column;">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 4px 0; color: #303B38;">Starter</h3>
          <p style="font-size: 13px; color: #6B7280; margin: 0 0 20px 0;">For the casual freelancer.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 30px; font-weight: 800; margin-bottom: 20px; color: #303B38;">₦2,000<span style="font-size: 13px; font-weight: 500; color: #6B7280;">/mo</span></div>
          <ul style="list-style: none; padding: 0; margin: 0 0 28px 0; display: flex; flex-direction: column; gap: 10px;">
            <li style="font-size: 13px; color: #4B5563; display: flex; align-items: center; gap: 8px;"><span style="color: #24503C;">✓</span> 15 quotes / mo</li>
            <li style="font-size: 13px; color: #4B5563; display: flex; align-items: center; gap: 8px;"><span style="color: #24503C;">✓</span> 15 products</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to upgrade to the Starter plan (₦2,000/mo). My account email is ${data.user.email}`} target="_blank" style="margin-top: auto; display: block; text-align: center; width: 100%; background: #F3F4F6; color: #303B38; padding: 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; text-decoration: none; box-sizing: border-box;">Get Starter</a>
        </div>

        <div style="background: #24503C; color: white; border-radius: 16px; padding: 28px 20px; display: flex; flex-direction: column; box-shadow: 0 12px 24px -8px rgba(36,80,60,0.4); transform: scale(1.02);">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 4px 0; color: white;">Pro</h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 0 0 20px 0;">For serious business.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 30px; font-weight: 800; margin-bottom: 20px; color: white;">₦6,000<span style="font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6);">/mo</span></div>
          <ul style="list-style: none; padding: 0; margin: 0 0 28px 0; display: flex; flex-direction: column; gap: 10px;">
            <li style="font-size: 13px; color: white; display: flex; align-items: center; gap: 8px;"><span style="color: #A7F3D0;">✓</span> 50 quotes / mo</li>
            <li style="font-size: 13px; color: white; display: flex; align-items: center; gap: 8px;"><span style="color: #A7F3D0;">✓</span> 50 products</li>
            <li style="font-size: 13px; color: white; display: flex; align-items: center; gap: 8px;"><span style="color: #A7F3D0;">✓</span> Branded PDF</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I want to upgrade to the Pro plan (₦6,000/mo). My account email is ${data.user.email}`} target="_blank" style="margin-top: auto; display: block; text-align: center; width: 100%; background: #ffffff; color: #24503C; padding: 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; text-decoration: none; box-sizing: border-box;">Get Pro</a>
        </div>

        <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 28px 20px; display: flex; flex-direction: column;">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 4px 0; color: #303B38;">Custom</h3>
          <p style="font-size: 13px; color: #6B7280; margin: 0 0 20px 0;">For large teams and agencies.</p>
          <div style="font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 800; margin-bottom: 20px; color: #303B38; height: 36px; display: flex; align-items: center;">Let's Talk</div>
          <ul style="list-style: none; padding: 0; margin: 0 0 28px 0; display: flex; flex-direction: column; gap: 10px;">
            <li style="font-size: 13px; color: #4B5563; display: flex; align-items: center; gap: 8px;"><span style="color: #24503C;">✓</span> Unlimited quotes</li>
            <li style="font-size: 13px; color: #4B5563; display: flex; align-items: center; gap: 8px;"><span style="color: #24503C;">✓</span> Custom features</li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}?text=Hi Quotera, I run an agency and I'm interested in a Custom plan. My account email is ${data.user.email}`} target="_blank" style="margin-top: auto; display: block; text-align: center; width: 100%; background: #F3F4F6; color: #303B38; padding: 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; text-decoration: none; box-sizing: border-box;">Contact Sales</a>
        </div>

      </div>
    </div>
  </div>
{/if}
