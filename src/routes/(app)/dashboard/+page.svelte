<script>
  let greeting = "Good morning";
  let name = "John"; 

  if (typeof window !== 'undefined') {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon";
    } else if (hour >= 17 || hour < 5) {
      greeting = "Good evening";
    }
  }
</script>

<svelte:head>
  <title>Dashboard | Quotera</title>
</svelte:head>

<div style="max-width: 1000px; margin: 0 auto;">
  
  <!-- Greeting -->
  <div style="margin-bottom: 32px; padding-top: 16px;">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: clamp(22px, 6vw, 32px); font-weight: 800; margin: 0; color: #303B38; letter-spacing: -0.03em; white-space: nowrap;">
      {greeting}, <span style="color: #C4513D;">{name}</span>.
    </h1>
  </div>

  <!-- Quick Stats -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; width: 100%;">
    
    <!-- Total Value -->
    <div style="background-color: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 12px; padding: 20px; width: 100%; box-sizing: border-box;">
      <p style="font-size: 11px; font-weight: 600; color: #166534; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Total Quoted Value</p>
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; color: #14532D; margin: 0;">₦4.2M</h2>
    </div>

    <!-- Total Quotes -->
    <div style="background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; width: 100%; box-sizing: border-box;">
      <p style="font-size: 11px; font-weight: 600; color: #9CA3AF; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Quotes Generated</p>
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; color: #303B38; margin: 0;">24</h2>
    </div>
  </div>

  <!-- Extractor -->
  <div style="margin-bottom: 40px;">
    <div style="display: flex; flex-direction: column; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 8px 24px rgba(48, 59, 56, 0.06); overflow: hidden;">
      <textarea 
        placeholder="Paste that messy message here..."
        style="width: 100%; min-height: 180px; padding: 24px; border: none; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: #303B38; background: transparent; resize: vertical; outline: none; box-sizing: border-box;"
      ></textarea>
      
      <div style="padding: 20px 24px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; display: flex;">
        <button style="background-color: #24503C; color: white; padding: 16px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%;">
          Generate Quote
        </button>
      </div>
    </div>
  </div>

  <!-- Recent Quotes Table -->
  <div style="width: 100%;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; color: #303B38; margin: 0;">Recent Quotes</h2>
      <a href="/quotes" style="color: #24503C; font-weight: 600; font-size: 13px; text-decoration: none;">View all →</a>
    </div>

    <div style="overflow-x: auto; width: 100%;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr>
            <th style="padding: 12px 16px; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E5E7EB;">Customer</th>
            <th style="padding: 12px 16px; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E5E7EB;" class="hide-mobile">Quote #</th>
            <th style="padding: 12px 16px; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E5E7EB;">Amount</th>
            <th style="padding: 12px 16px; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E5E7EB; text-align: right;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 16px; font-size: 14px; font-weight: 600; color: #303B38;">John Doe</td>
            <td style="padding: 16px; font-size: 14px; color: #6B7280;" class="hide-mobile">Q-1029</td>
            <td style="padding: 16px; font-size: 14px; font-weight: 600; color: #303B38;">₦825,000</td>
            <td style="padding: 16px; text-align: right;">
              <a href="#" style="color: #24503C; font-weight: 600; font-size: 13px; text-decoration: none;">View PDF</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 16px; font-size: 14px; font-weight: 600; color: #303B38;">Jane Smith</td>
            <td style="padding: 16px; font-size: 14px; color: #6B7280;" class="hide-mobile">Q-1028</td>
            <td style="padding: 16px; font-size: 14px; font-weight: 600; color: #303B38;">₦330,000</td>
            <td style="padding: 16px; text-align: right;">
              <a href="#" style="color: #24503C; font-weight: 600; font-size: 13px; text-decoration: none;">View PDF</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px; font-size: 14px; font-weight: 600; color: #303B38;">Acme Corp</td>
            <td style="padding: 16px; font-size: 14px; color: #6B7280;" class="hide-mobile">Q-1027</td>
            <td style="padding: 16px; font-size: 14px; font-weight: 600; color: #303B38;">₦1,200,000</td>
            <td style="padding: 16px; text-align: right;">
              <a href="#" style="color: #24503C; font-weight: 600; font-size: 13px; text-decoration: none;">View PDF</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  @media (max-width: 640px) {
    .hide-mobile {
      display: none !important;
    }
  }
</style>