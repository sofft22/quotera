<script>
  let business = $state({
    name: "Acme Hardware Ltd",
    email: "sales@acme.com",
    phone: "0801 234 5678",
    address: "12 Allen Avenue, Ikeja, Lagos",
    currency: "NGN",
    defaultTerms: "Prices are valid for 30 days. Delivery takes 2-3 business days."
  });

  let isSaving = $state(false);
  let showSavedMessage = $state(false);

  function handleSave() {
    isSaving = true;
    setTimeout(() => {
      isSaving = false;
      showSavedMessage = true;
      setTimeout(() => showSavedMessage = false, 3000);
    }, 800);
  }
</script>

<svelte:head>
  <title>Settings | Quotera</title>
</svelte:head>

<div style="max-width: 800px; margin: 0 auto; padding: 16px; padding-bottom: 80px;">

  <!-- Header -->
  <div style="margin-bottom: 24px;">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; margin: 0 0 8px 0; color: #303B38; letter-spacing: -0.02em;">Settings</h1>
    <p style="color: #6B7280; margin: 0; font-size: 14px;">Manage your business profile and app preferences.</p>
  </div>

  <!-- MAIN CARD -->
  <div style="background: #ffffff; border-radius: 16px; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(48,59,56,0.04); overflow: hidden;">

    <!-- 1. BUSINESS PROFILE -->
    <div style="padding: 20px; border-bottom: 1px solid #F3F4F6;">
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800; color: #303B38; margin: 0 0 16px 0;">Business Profile</h2>
      
      <!-- Logo Upload -->
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #F9FAFB; border: 1px dashed #D1D5DB; display: flex; align-items: center; justify-content: center; color: #9CA3AF; cursor: pointer; flex-shrink: 0;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        </div>
        <div>
          <button style="background: #F9FAFB; border: 1px solid #E5E7EB; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #303B38; cursor: pointer; margin-bottom: 4px;">Upload Logo</button>
          <p style="font-size: 11px; color: #9CA3AF; margin: 0;">PNG or JPG, max 2MB.</p>
        </div>
      </div>

      <!-- Inputs -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 6px;">Company Name</label>
          <input type="text" bind:value={business.name} style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; background: #F9FAFB;" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 6px;">Contact Email</label>
          <input type="email" bind:value={business.email} style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; background: #F9FAFB;" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 6px;">Phone Number</label>
          <input type="text" bind:value={business.phone} style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; background: #F9FAFB;" />
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 6px;">Business Address</label>
          <input type="text" bind:value={business.address} style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; background: #F9FAFB;" />
        </div>
      </div>
    </div>

    <!-- 2. QUOTE DEFAULTS -->
    <div style="padding: 20px;">
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800; color: #303B38; margin: 0 0 16px 0;">Quote Defaults</h2>
      
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 6px;">Currency</label>
          <select bind:value={business.currency} style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; outline: none; background: #F9FAFB; box-sizing: border-box;">
            <option value="NGN">NGN (₦) - Nigerian Naira</option>
            <option value="USD">USD ($) - US Dollar</option>
            <option value="GBP">GBP (£) - British Pound</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 6px;">Default Terms / Notes</label>
          <textarea bind:value={business.defaultTerms} style="width: 100%; height: 80px; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; resize: vertical; box-sizing: border-box; background: #F9FAFB;"></textarea>
          <p style="font-size: 11px; color: #9CA3AF; margin-top: 6px;">This text will automatically appear on every new quote.</p>
        </div>
      </div>
    </div>

  </div>

  <!-- DANGER ZONE -->
  <div style="margin-top: 24px;">
    <h2 style="font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; color: #DC2626; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding-left: 4px;">Danger Zone</h2>
    
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <button style="text-align: left; background: #ffffff; border: 1px solid #E5E7EB; padding: 16px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #303B38; cursor: pointer;">Log out of this device</button>
      <button style="text-align: left; background: #ffffff; border: 1px solid #FEE2E2; padding: 16px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #DC2626; cursor: pointer;">Delete Account</button>
    </div>
  </div>

  <!-- STICKY SAVE BUTTON -->
  <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: rgba(238, 242, 238, 0.95); backdrop-filter: blur(8px); border-top: 1px solid #E5E7EB; z-index: 50; display: flex; justify-content: flex-end; max-width: 800px; margin: 0 auto;">
    
    {#if showSavedMessage}
      <div style="display: flex; align-items: center; gap: 6px; color: #24503C; font-weight: 600; font-size: 14px; margin-right: auto; padding-left: 4px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
        Saved
      </div>
    {/if}

    <button onclick={handleSave} disabled={isSaving} style="background: #24503C; color: white; padding: 12px 32px; border-radius: 8px; border: none; font-weight: 600; font-size: 15px; cursor: pointer; opacity: {isSaving ? 0.7 : 1};">
      {isSaving ? 'Saving...' : 'Save Changes'}
    </button>
  </div>

</div>