<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  let { data, form } = $props();
  
  let greeting = "Good morning";
  if (typeof window !== 'undefined') {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    else if (hour >= 17 || hour < 5) greeting = "Good evening";
  }

  let pageView = $state('input'); 
  let rawText = $state("");
  let isLoading = $state(false); 
  let aiError = $state("");

  let customer = $state({ name: "New Customer", contact: "" });
  let quoteItems = $state([]);

  let includeDiscount = $state(false);
  let discountType = $state("percentage");
  let discountValue = $state(0);
  let includeDelivery = $state(false);
  let deliveryFee = $state(0);
  let includeVAT = $state(false);

  let subtotal = $state(0);
  let discountAmount = $state(0);
  let vatAmount = $state(0);
  let total = $state(0);

  // PDF Generation State
  let html2canvas;
  let jsPDF;
  let isDownloading = $state(false);
  let hiddenPdfRef;

  onMount(async () => {
    const html2canvasModule = await import('html2canvas');
    html2canvas = html2canvasModule.default;
    const jspdfModule = await import('jspdf');
    jsPDF = jspdfModule.jsPDF;
  });

  function calculateTotals() {
    if (!quoteItems || !Array.isArray(quoteItems) || quoteItems.length === 0) {
      subtotal = 0; discountAmount = 0; vatAmount = 0; total = 0; return;
    }
    subtotal = quoteItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    if (includeDiscount) {
      discountAmount = discountType === 'percentage' ? subtotal * (discountValue / 100) : discountValue;
    } else { discountAmount = 0; }
    let taxable = subtotal - discountAmount;
    vatAmount = includeVAT ? taxable * 0.075 : 0;
    total = taxable + vatAmount + (includeDelivery ? deliveryFee : 0);
  }

  $effect(() => { calculateTotals(); });

  function formatCurrency(val) {
    if (isNaN(val) || val === null) return "₦0";
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  }

  function updateQty(id, newQty) {
    const item = quoteItems.find(i => i.id === id);
    if (item) item.qty = Math.max(1, Number(newQty));
  }

  function removeItem(id) {
    quoteItems = quoteItems.filter(i => i.id !== id);
  }

  async function generateQuote() {
    if (!rawText.trim() || isLoading) return;
    isLoading = true; aiError = ""; quoteItems = []; 

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });
      if (!response.ok) throw new Error("Failed to generate");
      const result = await response.json();
      
      if (result.items && Array.isArray(result.items)) {
        quoteItems = result.items.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          qty: Number(item.qty) || 1
        }));
      } else { throw new Error("No items found."); }
    } catch (error) {
      aiError = error.message; quoteItems = []; 
    } finally {
      isLoading = false;
      if (!aiError && quoteItems.length > 0) pageView = 'builder';
    }
  }

  // Handle Download Direct
  const handleDownload = async () => {
    if (!hiddenPdfRef || !html2canvas || !jsPDF) return;
    isDownloading = true;

    try {
      const canvas = await html2canvas(hiddenPdfRef, { scale: 2, backgroundColor: "#FFFFFF", useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = canvas.width * 0.264583; 
      const pdfHeight = canvas.height * 0.264583;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [pdfWidth, pdfHeight] });
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Quotera_Quote.pdf`);
    } catch (error) {
      alert("Error generating PDF");
    } finally {
      isDownloading = false;
    }
  };
</script>

<svelte:head>
  <title>Dashboard | Quotera</title>
  <style>
    @media print { .no-print { display: none !important; } }
    .stats-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 32px; }
    @media (min-width: 640px) { .stats-grid { grid-template-columns: 7fr 3fr; } }
    
    /* Increased padding for inputs */
    input[type="text"], input[type="number"], select {
      padding: 14px 16px !important;
      font-size: 15px !important;
    }
  </style>
</svelte:head>

<div style="max-width: 1000px; margin: 0 auto; padding: 8px;">

  {#if pageView === 'input'}
    <div style="margin-bottom: 32px; padding-left: 4px; padding-top: 16px;">
      <h1 style="font-family: 'Manrope', sans-serif; font-size: clamp(28px, 8vw, 42px); font-weight: 800; margin: 0; color: #303B38; letter-spacing: -0.03em;">
        {greeting}, <span style="color: #C4513D;">{data?.user?.fullname || 'User'}</span>.
      </h1>
    </div>

    <div class="stats-grid">
      <div style="background: linear-gradient(135deg, #24503C 0%, #1a3a2b 100%); border-radius: 16px; padding: 32px 24px; box-shadow: 0 8px 16px -4px rgba(36, 80, 60, 0.3); display: flex; flex-direction: column; justify-content: center; width: 100%; box-sizing: border-box;">
        <p style="font-size: 12px; font-weight: 700; color: #A7F3D0; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.08em;">Total Quotes Generated</p>
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 42px; font-weight: 800; color: #ffffff; margin: 0; line-height: 1;">{data?.totalQuotes || 0}</h2>
      </div>
      <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;">
        <p style="font-size: 12px; font-weight: 700; color: #9CA3AF; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Current Plan</p>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 800; color: #303B38; margin: 0;">Free</h2>
          <a href="/settings" style="font-size: 14px; font-weight: 600; color: #24503C; text-decoration: none;">Upgrade</a>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 40px;">
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 800; color: #303B38; margin: 0 0 20px 0; padding-left: 4px;">
        Create New <span style="color: #C4513D;">Quote</span>
      </h2>
      
      {#if aiError}
        <div style="background: #FEE2E2; color: #DC2626; padding: 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 500; font-size: 15px; border: 1px solid #FCA5A5;">{aiError}</div>
      {/if}

      <div style="display: flex; flex-direction: column; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 8px 24px rgba(48, 59, 56, 0.06); overflow: hidden;">
        <textarea bind:value={rawText} placeholder="Paste that messy message here..." disabled={isLoading}
          style="width: 100%; min-height: 200px; padding: 24px; border: none; font-family: 'Inter', sans-serif; font-size: 17px; line-height: 1.6; color: #303B38; background: transparent; resize: vertical; outline: none; box-sizing: border-box;"></textarea>
        
        <div style="padding: 16px 24px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; display: flex;">
          <button onclick={generateQuote} disabled={isLoading} style="background-color: #24503C; color: white; padding: 18px; border-radius: 8px; border: none; font-weight: 600; font-size: 16px; cursor: {isLoading ? 'not-allowed' : 'pointer'}; display: flex; align-items: center; justify-content: center; width: 100%; opacity: {isLoading ? 0.8 : 1}; transition: opacity 0.2s;">
            {#if isLoading}
              <svg style="width: 20px; height: 20px; margin-right: 10px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
              Generating Quote...
            {:else} Generate Quote {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if pageView === 'builder'}
    <div class="no-print" style="background: #ffffff; border-radius: 16px; border: 1px solid #E5E7EB; padding: 32px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin-top: 16px;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="font-family: 'Manrope'; font-size: 22px; font-weight: 800; color: #303B38; margin: 0;">Edit Quote</h2>
        <button onclick={() => pageView = 'input'} style="background: none; border: none; color: #6B7280; font-weight: 600; font-size: 15px; cursor: pointer;">← Back</button>
      </div>

      <div style="margin-bottom: 32px; display: flex; flex-direction: column; gap: 16px;">
        <input type="text" bind:value={customer.name} placeholder="Customer Name" style="width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; box-sizing: border-box;" />
        <input type="text" bind:value={customer.contact} placeholder="Phone or Email" style="width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; box-sizing: border-box;" />
      </div>

      <div style="margin-bottom: 32px;">
        <h3 style="font-family: 'Manrope'; font-size: 16px; font-weight: 800; color: #303B38; margin: 0 0 16px 0;">Matched Items</h3>
        {#if quoteItems.length === 0}
          <p style="font-size: 15px; color: #6B7280;">No items matched.</p>
        {:else}
          {#each quoteItems as item (item.id)}
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #F3F4F6;">
              <div style="flex: 1; padding-right: 16px;">
                <div style="font-size: 16px; font-weight: 600; color: #303B38; line-height: 1.4;">{item.name}</div>
                <div style="font-size: 14px; color: #6B7280; margin-top: 6px;">Unit: {item.unit} | Price: {formatCurrency(item.price)}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 16px;">
                <input type="number" value={item.qty} oninput={(e) => updateQty(item.id, e.target.value)} style="width: 70px; border: 1px solid #E5E7EB; border-radius: 6px; text-align: center; outline: none;" min="1" />
                <div style="font-weight: 700; font-size: 16px; color: #303B38; width: 100px; text-align: right;">{formatCurrency(item.price * item.qty)}</div>
                <button onclick={() => removeItem(item.id)} style="background: none; border: none; color: #DC2626; cursor: pointer; font-size: 16px; padding: 0;">✕</button>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #303B38; width: 120px;">
            <input type="checkbox" bind:checked={includeDiscount} style="width: 18px; height: 18px; accent-color: #24503C;" /> Discount
          </label>
          <select bind:value={discountType} style="flex: 1; border: 1px solid #E5E7EB; border-radius: 8px; color: #6B7280; outline: none;">
            <option value="percentage">%</option>
            <option value="flat">₦</option>
          </select>
          <input type="number" bind:value={discountValue} placeholder="0" style="width: 90px; border: 1px solid #E5E7EB; border-radius: 8px; text-align: center; outline: none;" />
        </div>
        
        <div style="display: flex; align-items: center; gap: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #303B38; width: 120px;">
            <input type="checkbox" bind:checked={includeDelivery} style="width: 18px; height: 18px; accent-color: #24503C;" /> Delivery
          </label>
          <input type="number" bind:value={deliveryFee} placeholder="Amount" style="flex: 1; border: 1px solid #E5E7EB; border-radius: 8px; outline: none;" />
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #303B38; width: 120px;">
            <input type="checkbox" bind:checked={includeVAT} style="width: 18px; height: 18px; accent-color: #24503C;" /> VAT (7.5%)
          </label>
        </div>
      </div>
    </div>

    <!-- ON-SCREEN PREVIEW (Visible to user) -->
    <div style="background: #ffffff; border-radius: 16px; border: 1px solid #E5E7EB; padding: 32px; font-family: 'Inter', sans-serif; color: #303B38; box-shadow: 0 4px 12px rgba(0,0,0,0.02); width: 100%; box-sizing: border-box; overflow: hidden;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #F3F4F6; padding-bottom: 24px;">
        <div style="max-width: 50%;">
          <div style="font-family: 'Manrope'; font-size: 24px; font-weight: 900; letter-spacing: -0.03em; color: #24503C;">Quotera.</div>
          <div style="font-size: 13px; color: #6B7280; margin-top: 6px; line-height: 1.5;">Your Company Address<br/>your@email.com</div>
        </div>
        <div style="text-align: right; max-width: 50%;">
          <h1 style="font-family: 'Manrope'; font-size: 20px; margin: 0 0 6px 0; color: #303B38; text-transform: uppercase;">Quotation</h1>
          <div style="font-size: 13px; color: #6B7280;">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9CA3AF; margin-bottom: 6px;">Prepared For</div>
        <div style="font-size: 16px; font-weight: 700; color: #303B38;">{customer.name}</div>
        <div style="font-size: 14px; color: #6B7280; margin-top: 2px;">{customer.contact}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px; table-layout: fixed;">
        <thead>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <th style="text-align: left; padding: 12px 0; font-size: 12px; text-transform: uppercase; color: #6B7280; width: 50%;">Item</th>
            <th style="text-align: center; padding: 12px 0; font-size: 12px; text-transform: uppercase; color: #6B7280; width: 15%;">Unit</th>
            <th style="text-align: center; padding: 12px 0; font-size: 12px; text-transform: uppercase; color: #6B7280; width: 10%;">Qty</th>
            <th style="text-align: right; padding: 12px 0; font-size: 12px; text-transform: uppercase; color: #6B7280; width: 25%;">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each quoteItems as item}
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 16px 0; font-size: 15px; font-weight: 600; line-height: 1.4; word-wrap: break-word;">{item.name}</td>
              <td style="padding: 16px 0; text-align: center; font-size: 15px;">{item.unit}</td>
              <td style="padding: 16px 0; text-align: center; font-size: 15px;">{item.qty}</td>
              <td style="padding: 16px 0; text-align: right; font-size: 15px; font-weight: 600;">{formatCurrency(item.price * item.qty)}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
        <div style="width: 260px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; color: #4B5563;">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {#if includeDiscount}
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; color: #DC2626;">
              <span>Discount:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          {/if}
          {#if includeDelivery && deliveryFee > 0}
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; color: #4B5563;">
              <span>Delivery:</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          {/if}
          {#if includeVAT}
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; color: #4B5563;">
              <span>VAT (7.5%):</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
          {/if}
          <div style="display: flex; justify-content: space-between; padding: 16px 0 8px 0; font-size: 22px; font-weight: 800; color: #24503C; border-top: 2px solid #E5E7EB; margin-top: 8px;">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM BUTTON -->
    <div class="no-print" style="margin-top: 24px;">
      {#if form?.success}
        <div style="background: #DCFCE7; color: #166534; padding: 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; text-align: center; font-size: 16px;">
          Quote saved successfully!
        </div>
      {/if}

      {#if form?.error}
        <div style="background: #FEE2E2; color: #DC2626; padding: 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; text-align: center; font-size: 16px;">
          {form.error}
        </div>
      {/if}

      <form 
        method="POST" 
        action="?/saveQuote" 
        use:enhance={() => {
          return async ({ result, update }) => {
            await update(); 
            if (result.type === 'success') {
              handleDownload(); // Trigger direct download instead of print
            }
          };
        }}
      >
        <input type="hidden" name="customerName" value={customer.name} />
        <input type="hidden" name="customerContact" value={customer.contact} />
        <input type="hidden" name="total" value={total} />
        <input type="hidden" name="itemsJson" value={JSON.stringify(quoteItems)} />
        <input type="hidden" name="subtotal" value={subtotal} />
        <input type="hidden" name="discount" value={discountAmount} />
        <input type="hidden" name="delivery" value={includeDelivery ? deliveryFee : 0} />
        <input type="hidden" name="vat" value={vatAmount} />

        <button type="submit" disabled={isDownloading} style="width: 100%; background: #24503C; color: white; padding: 18px; border-radius: 8px; border: none; font-weight: 600; font-size: 16px; cursor: {isDownloading ? 'not-allowed' : 'pointer'}; opacity: {isDownloading ? 0.7 : 1};">
          {isDownloading ? 'Generating PDF...' : 'Download PDF & Save'}
        </button>
      </form>
    </div>
  {/if}

</div>

<!-- HIDDEN PDF TEMPLATE (For direct download) -->
<div style="position: absolute; top: 0; left: 0; z-index: -1; opacity: 0; pointer-events: none;">
  {#if pageView === 'builder'}
    <div bind:this={hiddenPdfRef} style="width: 800px; background: white; padding: 50px; font-family: 'Inter', sans-serif; color: #303B38;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; border-bottom: 2px solid #F3F4F6; padding-bottom: 25px;">
        <div>
          <div style="font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 900; letter-spacing: -0.03em; color: #24503C;">Quotera.</div>
          <div style="font-size: 14px; color: #6B7280; margin-top: 6px; line-height: 1.6;">Your Company Address<br/>your@email.com</div>
        </div>
        <div style="text-align: right;">
          <h1 style="font-family: 'Manrope', sans-serif; font-size: 26px; font-weight: 800; margin: 0 0 6px 0; color: #303B38; text-transform: uppercase;">Quotation</h1>
          <div style="font-size: 14px; color: #6B7280;">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style="margin-bottom: 40px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9CA3AF; margin-bottom: 6px; letter-spacing: 0.05em;">Prepared For</div>
        <div style="font-size: 20px; font-weight: 800; color: #303B38;">{customer.name || "Customer"}</div>
        <div style="font-size: 15px; color: #6B7280; margin-top: 4px;">{customer.contact || "Contact Info"}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; table-layout: fixed;">
        <thead>
          <tr style="border-bottom: 2px solid #E5E7EB;">
            <th style="text-align: left; padding: 16px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #6B7280; width: 40%;">Item</th>
            <th style="text-align: center; padding: 16px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #6B7280; width: 15%;">Unit</th>
            <th style="text-align: center; padding: 16px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #6B7280; width: 10%;">Qty</th>
            <th style="text-align: right; padding: 16px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #6B7280; width: 15%;">Price</th>
            <th style="text-align: right; padding: 16px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #6B7280; width: 20%;">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each quoteItems as item}
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 20px 0; font-size: 16px; font-weight: 600; line-height: 1.5; word-wrap: break-word;">{item.name}</td>
              <td style="padding: 20px 0; text-align: center; font-size: 15px; font-weight: 500;">{item.unit}</td>
              <td style="padding: 20px 0; text-align: center; font-size: 15px; font-weight: 500;">{item.qty}</td>
              <td style="padding: 20px 0; text-align: right; font-size: 15px;">{formatCurrency(item.price)}</td>
              <td style="padding: 20px 0; text-align: right; font-size: 16px; font-weight: 700;">{formatCurrency(item.price * item.qty)}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 320px;">
          <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #4B5563;">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {#if includeDiscount}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #DC2626; font-weight: 500;">
              <span>Discount:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          {/if}
          {#if includeDelivery && deliveryFee > 0}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #4B5563;">
              <span>Delivery:</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          {/if}
          {#if includeVAT}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #4B5563;">
              <span>VAT (7.5%):</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
          {/if}
          <div style="display: flex; justify-content: space-between; padding: 20px 0 10px 0; font-size: 24px; font-weight: 800; color: #24503C; border-top: 3px solid #E5E7EB; margin-top: 10px;">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid #F3F4F6; padding-top: 30px; text-align: center;">
        <p style="font-size: 13px; color: #9CA3AF; margin: 0;">Thank you for your business. If you have any questions, please contact us.</p>
      </div>

    </div>
  {/if}
</div>
