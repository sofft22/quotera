<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let companyName = $state(data.user.company_name);
  let companyAddress = $state(data.user.company_address);
  let companyContact = $state(data.user.company_contact);
  let theme = $state(data.user.theme);
  let logoBase64 = $state(data.user.logo_base64);
  
  let isUpgradeModalOpen = $state(false);
  let isCompressing = $state(false);

  const WHATSAPP = "2347072789513"; // Replace with your WhatsApp number

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
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // White background for JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG at 60% quality
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

<div style="max-width: 800px; margin: 0 auto; padding: 24px 16px;">

  <!-- Header -->
  <div style="margin-bottom: 32px;">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 800; color: #303B38; margin: 0 0 8px 0; letter-spacing: -0.02em;">Settings</h1>
    <p style="color: #6B7280; margin: 0; font-size: 15px;">Manage your account and PDF branding.</p>
  </div>

  <!-- Account & Plan Section -->
  <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
    <h2 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #303B38; margin: 0 0 20px 0;">Account & Plan</h2>
    
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div>
        <p style="font-size: 14px; font-weight: 600; color: #303B38; margin: 0;">Email Address</p>
        <p style="font-size: 15px; color: #6B7280; margin: 4px 0 0 0;">{data.user.email}</p>
      </div>
      
      <div style="background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 8px; padding: 12px 20px; display: flex; align-items: center; gap: 16px;">
        <div>
          <p style="font-size: 11px; font-weight: 700; color: #166534; margin: 0; text-transform: uppercase;">Current Plan</p>
          <p style="font-size: 16px; font-weight: 800; color: #14532D; margin: 2px 0 0 0;">{data.user.plan}</p>
        </div>
        <button onclick={() => isUpgradeModalOpen = true} style="background: #24503C; color: white; padding: 8px 16px; border-radius: 6px; border: none; font-weight: 600; font-size: 13px; cursor: pointer;">
          Upgrade
        </button>
      </div>
    </div>
  </div>

  <!-- Branding Section -->
  <form method="POST" use:enhance={() => {
    return async ({ update }) => {
      await update();
    };
  }}" style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
    
    <h2 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #303B38; margin: 0 0 20px 0;">PDF Branding</h2>

    {#if form?.success}
      <div style="background: #DCFCE7; color: #166534; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 600;">
        Settings saved successfully!
      </div>
    {/if}

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px;">Company Name</label>
        <input type="text" name="companyName" bind:value={companyName} placeholder="e.g. Acme Hardware Ltd" style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <div>
        <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px;">Business Address</label>
        <input type="text" name="companyAddress" bind:value={companyAddress} placeholder="e.g. 12 Marina Road, Lagos" style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <div>
        <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px;">Contact Info (Email or Phone)</label>
        <input type="text" name="companyContact" bind:value={companyContact} placeholder="e.g. sales@acme.com" style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <!-- Logo Upload -->
      <div style="margin-top: 8px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px;">Company Logo</label>
        <div style="display: flex; align-items: center; gap: 16px;">
          {#if logoBase64}
            <img src={logoBase64} alt="Logo Preview" style="height: 48px; width: auto; max-width: 120px; object-fit: contain; border: 1px solid #E5E7EB; border-radius: 8px; padding: 4px;" />
          {/if}
          <input type="file" accept="image/*" onchange={handleLogoUpload} style="font-size: 13px; color: #6B7280;" />
        </div>
        {#if isCompressing}
          <p style="font-size: 12px; color: #24503C; margin-top: 8px;">Compressing image...</p>
        {/if}
        <input type="hidden" name="logoBase64" value={logoBase64} />
      </div>

      <!-- Theme Selector -->
      <div style="margin-top: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 12px;">PDF Theme Color</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          
          <label style="cursor: pointer; display: block;">
            <input type="radio" name="theme" value="forest" bind:group={theme} style="display: none;" />
            <div style="border: 2px solid {theme === 'forest' ? '#24503C' : '#E5E7EB'}; border-radius: 8px; padding: 16px; text-align: center; background: {theme === 'forest' ? '#F0FDF4' : 'white'}; transition: all 0.2s;">
              <div style="width: 24px; height: 24px; background: #24503C; border-radius: 50%; margin: 0 auto 8px auto;"></div>
              <span style="font-size: 13px; font-weight: 600; color: #303B38;">Forest</span>
            </div>
          </label>

          <label style="cursor: pointer; display: block;">
            <input type="radio" name="theme" value="navy" bind:group={theme} style="display: none;" />
            <div style="border: 2px solid {theme === 'navy' ? '#1E3A8A' : '#E5E7EB'}; border-radius: 8px; padding: 16px; text-align: center; background: {theme === 'navy' ? '#EFF6FF' : 'white'}; transition: all 0.2s;">
              <div style="width: 24px; height: 24px; background: #1E3A8A; border-radius: 50%; margin: 0 auto 8px auto;"></div>
              <span style="font-size: 13px; font-weight: 600; color: #303B38;">Navy</span>
            </div>
          </label>

          <label style="cursor: pointer; display: block;">
            <input type="radio" name="theme" value="charcoal" bind:group={theme} style="display: none;" />
            <div style="border: 2px solid {theme === 'charcoal' ? '#1F2937' : '#E5E7EB'}; border-radius: 8px; padding: 16px; text-align: center; background: {theme === 'charcoal' ? '#F3F4F6' : 'white'}; transition: all 0.2s;">
              <div style="width: 24px; height: 24px; background: #1F2937; border-radius: 50%; margin: 0 auto 8px auto;"></div>
              <span style="font-size: 13px; font-weight: 600; color: #303B38;">Charcoal</span>
            </div>
          </label>

        </div>
      </div>
    </div>

    <button type="submit" style="width: 100%; background: #24503C; color: white; padding: 14px; border-radius: 8px; border: none; font-weight: 600; font-size: 16px; cursor: pointer; margin-top: 24px;">
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
        
        <!-- Free -->
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

        <!-- Starter -->
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

        <!-- Pro -->
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

        <!-- Custom -->
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
