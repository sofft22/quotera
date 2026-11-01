<script>
  import { enhance } from '$app/forms';

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

  function calculateTotals() {
    if (!quoteItems || !Array.isArray(quoteItems) || quoteItems.length === 0) {
      subtotal = 0;
      discountAmount = 0;
      vatAmount = 0;
      total = 0;
      return;
    }

    subtotal = quoteItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    if (includeDiscount) {
      discountAmount = discountType === 'percentage' 
        ? subtotal * (discountValue / 100) 
        : discountValue;
    } else {
      discountAmount = 0;
    }

    let taxable = subtotal - discountAmount;
    vatAmount = includeVAT ? taxable * 0.075 : 0;

    total = taxable + vatAmount + (includeDelivery ? deliveryFee : 0);
  }

  $effect(() => {
    calculateTotals();
  });

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
    
    isLoading = true;
    aiError = "";
    quoteItems = []; 

    try {
      const formData = new FormData();
      formData.append('rawText', rawText);

      const response = await fetch('?/generateAI', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log("Frontend received:", result);
      
      if (result.type === 'failure') {
         throw new Error(result.data.error);
      }

      // Check if the data is a string (as seen in your console) and parse it
      if (result.data && result.data.items) {
        let items = result.data.items;
        
        // This is the missing piece: parsing the string back into an array
        if (typeof items === 'string') {
          items = JSON.parse(items);
        }

        quoteItems = items.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          qty: Number(item.qty) || 1
        }));
      } else {
        throw new Error("No valid items returned from server.");
      }

    } catch (error) {
      console.error("Backend error:", error);
      aiError = error.message;
      quoteItems = []; 
    } finally {
      isLoading = false;
      if (!aiError && quoteItems.length > 0) {
        pageView = 'builder';
      }
    }
  }
</script>

<svelte:head>
  <title>Dashboard | Quotera</title>
  <style>
    @media print {
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; }
      .no-print { display: none !important; }
      @page { margin: 10mm; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 32px;
    }
    @media (min-width: 640px) {
      .stats-grid {
        grid-template-columns: 7fr 3fr;
      }
    }
  </style>
</svelte:head>

<div style="max-width: 1000px; margin: 0 auto; padding: 8px;">

  {#if pageView === 'input'}
    <!-- Greeting -->
    <div style="margin-bottom: 24px; padding-left: 4px; padding-top: 16px;">
      <h1 style="font-family: 'Manrope', sans-serif; font-size: clamp(28px, 8vw, 40px); font-weight: 800; margin: 0; color: #303B38; letter-spacing: -0.03em;">
        {greeting}, <span style="color: #C4513D;">{data?.user?.fullname || 'User'}</span>.
      </h1>
    </div>

    <!-- Stats and Plan Cards -->
    <div class="stats-grid">
      <div style="background: linear-gradient(135deg, #24503C 0%, #1a3a2b 100%); border-radius: 16px; padding: 24px; box-shadow: 0 8px 16px -4px rgba(36, 80, 60, 0.3); display: flex; flex-direction: column; justify-content: center; width: 100%; box-sizing: border-box; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%; pointer-events: none;"></div>
        <p style="font-size: 11px; font-weight: 700; color: #A7F3D0; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.08em;">Total Quotes Generated</p>
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 36px; font-weight: 800; color: #ffffff; margin: 0; line-height: 1;">
          {data?.totalQuotes || 0}
        </h2>
      </div>

      <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;">
        <p style="font-size: 11px; font-weight: 700; color: #9CA3AF; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Current Plan</p>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #303B38; margin: 0;">Free</h2>
          <a href="/settings" style="font-size: 12px; font-weight: 600; color: #24503C; text-decoration: none;">Upgrade</a>
        </div>
      </div>
    </div>

    <!-- Create New Quote Title and Input -->
    <div style="margin-bottom: 32px;">
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #303B38; margin: 0 0 16px 0; padding-left: 4px;">
        Create New <span style="color: #C4513D;">Quote</span>
      </h2>
      
      {#if aiError}
        <div style="background: #FEE2E2; color: #DC2626; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 500; font-size: 14px; border: 1px solid #FCA5A5;">
          {aiError}
        </div>
      {/if}

      <div style="display: flex; flex-direction: column; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 8px 24px rgba(48, 59, 56, 0.06); overflow: hidden;">
        <textarea 
          bind:value={rawText}
          placeholder="Paste that messy message here..."
          disabled={isLoading}
          style="width: 100%; min-height: 180px; padding: 20px; border: none; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: #303B38; background: transparent; resize: vertical; outline: none; box-sizing: border-box;"
        ></textarea>
        
        <div style="padding: 12px 16px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; display: flex;">
          <button onclick={generateQuote} disabled={isLoading} style="background-color: #24503C; color: white; padding: 14px; border-radius: 8px; border: none; font-weight: 600; font-size: 15px; cursor: {isLoading ? 'not-allowed' : 'pointer'}; display: flex; align-items: center; justify-content: center; width: 100%; opacity: {isLoading ? 0.8 : 1}; transition: opacity 0.2s;">
            {#if isLoading}
              <svg style="width: 18px; height: 18px; margin-right: 8px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Generating Quote...
            {:else}
              Generate Quote
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if pageView === 'builder'}
    <!-- TOP: EDIT BOX -->
    <div class="no-print" style="background: #ffffff; border-radius: 12px; border: 1px solid #E5E7EB; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin-top: 16px;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-family: 'Manrope'; font-size: 18px; font-weight: 800; color: #303B38; margin: 0;">Edit Quote</h2>
        <button onclick={() => pageView = 'input'} style="background: none; border: none; color: #6B7280; font-weight: 600; font-size: 14px; cursor: pointer;">← Back</button>
      </div>

      <!-- Customer Info -->
      <div style="margin-bottom: 24px;">
        <input type="text" bind:value={customer.name} placeholder="Customer Name" style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; margin-bottom: 10px; box-sizing: border-box;" />
        <input type="text" bind:value={customer.contact} placeholder="Phone or Email" style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <!-- Items (Auto-matched) -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-family: 'Manrope'; font-size: 14px; font-weight: 800; color: #303B38; margin: 0 0 12px 0;">Matched Items</h3>
        {#if quoteItems.length === 0}
          <p style="font-size: 13px; color: #6B7280;">No items matched.</p>
        {:else}
          {#each quoteItems as item (item.id)}
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
              <div style="flex: 1; padding-right: 12px;">
                <div style="font-size: 14px; font-weight: 600; color: #303B38; line-height: 1.3;">{item.name}</div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Unit: {item.unit} | Price: {formatCurrency(item.price)}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="number" value={item.qty} oninput={(e) => updateQty(item.id, e.target.value)} style="width: 60px; padding: 8px; border: 1px solid #E5E7EB; border-radius: 6px; text-align: center; font-size: 14px; outline: none;" min="1" />
                <div style="font-weight: 600; font-size: 14px; color: #303B38; width: 80px; text-align: right;">{formatCurrency(item.price * item.qty)}</div>
                <button onclick={() => removeItem(item.id)} style="background: none; border: none; color: #DC2626; cursor: pointer; font-size: 14px; padding: 0;">✕</button>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Adjustments -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #303B38; width: 100px;">
            <input type="checkbox" bind:checked={includeDiscount} style="width: 16px; height: 16px; accent-color: #24503C;" /> Discount
          </label>
          <select bind:value={discountType} style="flex: 1; padding: 8px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 13px; color: #6B7280; outline: none;">
            <option value="percentage">%</option>
            <option value="flat">₦</option>
          </select>
          <input type="number" bind:value={discountValue} placeholder="0" style="width: 70px; padding: 8px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 13px; text-align: center; outline: none;" />
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #303B38; width: 100px;">
            <input type="checkbox" bind:checked={includeDelivery} style="width: 16px; height: 16px; accent-color: #24503C;" /> Delivery
          </label>
          <input type="number" bind:value={deliveryFee} placeholder="Amount" style="flex: 1; padding: 8px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 13px; outline: none;" />
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #303B38; width: 100px;">
            <input type="checkbox" bind:checked={includeVAT} style="width: 16px; height: 16px; accent-color: #24503C;" /> VAT
          </label>
          <input type="number" placeholder="7.5" value="7.5" style="width: 70px; padding: 8px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 13px; text-align: center; outline: none;" disabled />
          <span style="font-size: 13px; color: #6B7280;">%</span>
        </div>
      </div>
    </div>

    <!-- BOTTOM: PREVIEW (The PDF Document) -->
    <div class="print-area" style="background: #ffffff; border-radius: 16px; border: 1px solid #E5E7EB; padding: 24px; font-family: 'Inter', sans-serif; color: #303B38; box-shadow: 0 4px 12px rgba(0,0,0,0.02); width: 100%; box-sizing: border-box; overflow: hidden;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #F3F4F6; padding-bottom: 20px;">
        <div style="max-width: 50%;">
          <div style="font-family: 'Manrope'; font-size: 22px; font-weight: 900; letter-spacing: -0.03em; color: #24503C;">Quotera.</div>
          <div style="font-size: 12px; color: #6B7280; margin-top: 4px; line-height: 1.5;">Your Company Address<br/>your@email.com</div>
        </div>
        <div style="text-align: right; max-width: 50%;">
          <h1 style="font-family: 'Manrope'; font-size: 18px; margin: 0 0 4px 0; color: #303B38; text-transform: uppercase;">Quotation</h1>
          <div style="font-size: 12px; color: #6B7280;">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px;">Prepared For</div>
        <div style="font-size: 14px; font-weight: 700; color: #303B38;">{customer.name}</div>
        <div style="font-size: 12px; color: #6B7280;">{customer.contact}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; table-layout: fixed;">
        <thead>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <th style="text-align: left; padding: 12px 0; font-size: 11px; text-transform: uppercase; color: #6B7280; width: 50%;">Item</th>
            <th style="text-align: center; padding: 12px 0; font-size: 11px; text-transform: uppercase; color: #6B7280; width: 15%;">Unit</th>
            <th style="text-align: center; padding: 12px 0; font-size: 11px; text-transform: uppercase; color: #6B7280; width: 10%;">Qty</th>
            <th style="text-align: right; padding: 12px 0; font-size: 11px; text-transform: uppercase; color: #6B7280; width: 25%;">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each quoteItems as item}
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 16px 0; font-size: 14px; font-weight: 600; line-height: 1.4; word-wrap: break-word;">{item.name}</td>
              <td style="padding: 16px 0; text-align: center; font-size: 14px;">{item.unit}</td>
              <td style="padding: 16px 0; text-align: center; font-size: 14px;">{item.qty}</td>
              <td style="padding: 16px 0; text-align: right; font-size: 14px; font-weight: 600;">{formatCurrency(item.price * item.qty)}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
        <div style="width: 220px;">
          <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #4B5563;">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {#if includeDiscount}
            <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #DC2626;">
              <span>Discount:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          {/if}
          {#if includeDelivery && deliveryFee > 0}
            <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #4B5563;">
              <span>Delivery:</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          {/if}
          {#if includeVAT}
            <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #4B5563;">
              <span>VAT (7.5%):</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
          {/if}
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 800; color: #24503C; border-top: 2px solid #E5E7EB; margin-top: 8px;">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM BUTTON -->
    <div class="no-print" style="margin-top: 16px;">
      {#if form?.success}
        <div style="background: #DCFCE7; color: #166534; padding: 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; text-align: center;">
          Quote saved successfully!
        </div>
      {/if}

      {#if form?.error}
        <div style="background: #FEE2E2; color: #DC2626; padding: 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; text-align: center;">
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
              window.print(); 
            }
          };
        }}
      >
        <input type="hidden" name="customerName" value={customer.name} />
        <input type="hidden" name="customerContact" value={customer.contact} />
        <input type="hidden" name="total" value={total} />

        <button type="submit" style="width: 100%; background: #24503C; color: white; padding: 16px; border-radius: 8px; border: none; font-weight: 600; font-size: 16px; cursor: pointer;">
          Download PDF & Save
        </button>
      </form>
    </div>
  {/if}

</div>
