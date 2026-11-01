<script>
  let { data } = $props();
  
  let greeting = "Good morning";
  if (typeof window !== 'undefined') {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    else if (hour >= 17 || hour < 5) greeting = "Good evening";
  }
</script>

<svelte:head>
  <title>Dashboard | Quotera</title>
</svelte:head>

<div style="max-width: 1000px; margin: 0 auto; padding: 32px 16px;">

  <!-- Greeting -->
  <div style="margin-bottom: 32px; padding-left: 4px;">
    <h1 style="font-family: 'Manrope', sans-serif; font-size: clamp(24px, 6vw, 36px); font-weight: 800; margin: 0; color: #303B38; letter-spacing: -0.03em;">
      {greeting}, <span style="color: #C4513D;">{data?.user?.fullname || 'User'}</span>.
    </h1>
    <p style="color: #6B7280; font-size: 15px; margin: 8px 0 0 0;">Here is an overview of your business.</p>
  </div>

  <!-- The Green Stats Card -->
  <div style="background: linear-gradient(135deg, #24503C 0%, #1a3a2b 100%); border-radius: 20px; padding: 32px; box-shadow: 0 12px 24px -8px rgba(36, 80, 60, 0.4); display: flex; flex-direction: column; justify-content: center; width: 100%; box-sizing: border-box; position: relative; overflow: hidden;">
    
    <!-- Subtle background decoration -->
    <div style="position: absolute; top: -20px; right: -20px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; pointer-events: none;"></div>
    <div style="position: absolute; bottom: -40px; right: 40px; width: 100px; height: 100px; background: rgba(255,255,255,0.03); border-radius: 50%; pointer-events: none;"></div>

    <p style="font-size: 12px; font-weight: 700; color: #A7F3D0; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.08em;">Total Quotes Generated</p>
    <h2 style="font-family: 'Manrope', sans-serif; font-size: clamp(48px, 10vw, 64px); font-weight: 800; color: #ffffff; margin: 0; line-height: 1;">
      {data?.totalQuotes || 0}
    </h2>
    
    <div style="margin-top: 24px; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); color: white; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(4px);">
        All time
      </span>
    </div>

  </div>

</div>
