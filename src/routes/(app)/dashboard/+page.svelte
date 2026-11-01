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

    try {
      const formData = new FormData();
      formData.append('rawText', rawText);

      const response = await fetch('?/generateAI', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.type === 'failure') {
         throw new Error(result.data.error);
      }

      const extractedItems = result.data.items;
      let nextId = 1;
      quoteItems = extractedItems.map(item => ({
        id: nextId++,
        name: item.name,
        price: 0, 
        qty: item.qty || 1
      }));

    } catch (error) {
      console.error("Backend error:", error);
      aiError = error.message;
      quoteItems = [{ id: 1, name: "Custom Item (Please edit)", price: 0, qty: 1 }];
    } finally {
      isLoading = false;
      pageView = 'builder';
    }
  }
</script>

<svelte:head>
  <title>Dashboard | Quotera</title>
  <style>
    .input-clean {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 15px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-clean:focus {
      border-color: #24503C;
      box-shadow: 0 0 0 3px rgba(36, 80, 60, 0.1);
    }
    @media print {
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; background: white; }
      .no-print { display: none !important; }
      @page { margin: 10mm; }
    }
  </style>
</svelte:head>

<div style="max-width: 900px; margin: 0 auto; padding: 32px 24px;">

  {#if pageView === 'input'}
    <!-- Greeting -->
    <div style="margin-bottom: 32px;">
      <h1 style="font-family: 'Manrope', sans-serif; font-size: clamp(24px, 5vw, 36px); font-weight: 800; margin: 0 0 8px 0; color: #303B38; letter-spacing: -0.03em;">
        {greeting}, <span style="color: #C4513D;">{data?.user?.fullname || 'User'}</span>.
      </h1>
      <p style="color: #6B7280; font-size: 15px; margin: 0;">Here is an overview of your business.</p>
    </div>

    <!-- Single Stat Card: Total Quotes -->
    <div style="margin-bottom: 40px;">
      <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); display: inline-block; min-width: 240px;">
        <p style="font-size: 12px; font-weight: 700; color: #6B7280; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Quotes Generated</p>
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 800; color: #303B38; margin: 0;">{data?.totalQuotes}</h2>
      </div>
    </div>

    <!-- Text Box -->
    <div>
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #303B38; margin: 0 0 16px 0;">Create New Quote</h2>
      
      {#if aiError}
        <div style="background: #FEE2E2; color: #DC2626; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 500; font-size: 14px; border: 1px solid #FCA5A5;">
          {aiError}
        </div>
      {/if}

      <div style="background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden;">
        <textarea 
          bind:value={rawText}
          placeholder="Paste the customer's messy WhatsApp message or email here..."
          disabled={isLoading}
          style="width: 100%; min-height: 160px; padding: 24px; border: none; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: #303B38; background: transparent; resize: vertical; outline: none; box-sizing: border-box;"
        ></textarea>
        
        <div style="padding: 16px 24px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end;">
          <button onclick={generateQuote} disabled={isLoading} style="background-color: #24503C; color: white; padding: 14px 32px; border-radius: 8px; border: none; font-weight: 600; font-size: 15px; cursor: {isLoading ? 'not-allowed' : 'pointer'}; display: flex; align-items: center; justify-content: center; opacity: {isLoading ? 0.7 : 1}; box-shadow: 0 4px 6px -1px rgba(36, 80, 60, 0.2);">
            {#if isLoading}
              <svg style="width: 18px; height: 18px; margin-right: 8px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Extracting...
            {:else}
              Generate Quote
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if pageView === 'builder'}
    <!-- Builder Header -->
    <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
      <div>
        <h1 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; margin: 0; color: #303B38; letter-spacing: -0.02em;">Review Quote</h1>
      </div>
      <button onclick={() => pageView = 'input'} style="background: #ffffff; border: 1px solid #E5E7EB; color: #4B5563; font-weight: 600; font-size: 14px; padding: 10px 16px; border-radius: 8px; cursor: pointer;">
        ← Back
      </button>
    </div>

    <!-- Edit Card -->
    <div class="no-print" style="background: #ffffff; border-radius: 16px; border: 1px solid #E5E7EB; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 24px;">
      <h2 style="font-family: 'Manrope'; font-size: 18px; font-weight: 800; color: #303B38; margin: 0 0 20px 0;">Edit Details</h2>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 8px;">Customer Name</label>
        <input type="text" bind:value={customer.name} placeholder="e.g. John Doe" class="input-clean" style="margin-bottom: 12px;" />
        
        <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 8px;">Contact</label>
        <input type="text" bind:value={customer.contact} placeholder="Phone or Email" class="input-clean" />
      </div>

      <div style="margin-bottom: 20px;">
        {#each quoteItems as item (item.id)}
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F3F4F6;">
            <div style="flex: 1; padding-right: 12px;">
              <div style="font-size: 14px; font-weight: 600; color: #303B38;">{item.name}</div>
              <input type="number" bind:value={item.price} placeholder="Price (₦)" class="input-clean" style="margin-top: 8px; width: 120px; padding: 8px 12px; font-size: 13px;" />
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="display: flex; align-items: center; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px;">
                <button onclick={() => updateQty(item.id, item.qty - 1)} style="background: none; border: none; padding: 6px 10px; cursor: pointer; color: #6B7280;">-</button>
                <input type="number" value={item.qty} oninput={(e) => updateQty(item.id, e.target.value)} style="width: 32px; padding: 6px 0; border: none; background: transparent; text-align: center; font-size: 13px; font-weight: 600; outline: none;" min="1" />
                <button onclick={() => updateQty(item.id, item.qty + 1)} style="background: none; border: none; padding: 6px 10px; cursor: pointer; color: #6B7280;">+</button>
              </div>
              <div style="font-weight: 700; font-size: 14px; color: #303B38; width: 80px; text-align: right;">{formatCurrency(item.price * item.qty)}</div>
              <button onclick={() => removeItem(item.id)} style="background: none; border: none; color: #DC2626; cursor: pointer; font-size: 16px;">✕</button>
            </div>
          </div>
        {/each}
      </div>

      <div style="background: #F9FAFB; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #303B38;">
            <input type="checkbox" bind:checked={includeDiscount} style="width: 16px; height: 16px; accent-color: #24503C;" /> Discount
          </label>
          {#if includeDiscount}
            <div style="display: flex; gap: 8px;">
              <select bind:value={discountType} class="input-clean" style="padding: 6px 10px; font-size: 13px;">
                <option value="percentage">%</option>
                <option value="flat">₦</option>
              </select>
              <input type="number" bind:value={discountValue} placeholder="0" class="input-clean" style="width: 70px; padding: 6px 10px; font-size: 13px;" />
            </div>
          {/if}
        </div>
        
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #303B38;">
            <input type="checkbox" bind:checked={includeDelivery} style="width: 16px; height: 16px; accent-color: #24503C;" /> Delivery
          </label>
          {#if includeDelivery}
            <input type="number" bind:value={deliveryFee} placeholder="Amount (₦)" class="input-clean" style="width: 100px; padding: 6px 10px; font-size: 13px;" />
          {/if}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #303B38;">
            <input type="checkbox" bind:checked={includeVAT} style="width: 16px; height: 16px; accent-color: #24503C;" /> VAT (7.5%)
          </label>
        </div>
      </div>
    </div>

    <!-- PDF Preview -->
    <div class="print-area" style="background: #ffffff; border-radius: 16px; border: 1px solid #E5E7EB; padding: 32px; font-family: 'Inter', sans-serif; color: #303B38; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #F3F4F6; padding-bottom: 16px;">
        <div>
          <div style="font-family: 'Manrope'; font-size: 20px; font-weight: 900; color: #24503C;">Quotera.</div>
          <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">Your Company Address<br/>your@email.com</div>
        </div>
        <div style="text-align: right;">
          <h1 style="font-family: 'Manrope'; font-size: 16px; margin: 0 0 4px 0; color: #303B38; text-transform: uppercase;">Quotation</h1>
          <div style="font-size: 11px; color: #6B7280;">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px;">Prepared For</div>
        <div style="font-size: 14px; font-weight: 700; color: #303B38;">{customer.name || "Customer Name"}</div>
        <div style="font-size: 12px; color: #6B7280;">{customer.contact || "Contact Info"}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <th style="text-align: left; padding: 8px 0; font-size: 10px; text-transform: uppercase; color: #6B7280;">Item</th>
            <th style="text-align: center; padding: 8px 0; font-size: 10px; text-transform: uppercase; color: #6B7280;">Qty</th>
            <th style="text-align: right; padding: 8px 0; font-size: 10px; text-transform: uppercase; color: #6B7280;">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each quoteItems as item}
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 12px 0; font-size: 13px; font-weight: 600;">{item.name}</td>
              <td style="padding: 12px 0; text-align: center; font-size: 13px;">{item.qty}</td>
              <td style="padding: 12px 0; text-align: right; font-size: 13px; font-weight: 600;">{formatCurrency(item.price * item.qty)}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
        <div style="width: 200px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #4B5563;">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {#if includeDiscount}
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #DC2626;">
              <span>Discount:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          {/if}
          {#if includeDelivery && deliveryFee > 0}
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #4B5563;">
              <span>Delivery:</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          {/if}
          {#if includeVAT}
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #4B5563;">
              <span>VAT (7.5%):</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
          {/if}
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 16px; font-weight: 800; color: #24503C; border-top: 2px solid #E5E7EB; margin-top: 8px;">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="no-print">
      {#if form?.success}
        <div style="background: #DCFCE7; color: #166534; padding: 16px; border-radius: 12px; margin-bottom: 16px; font-weight: 600; text-align: center; border: 1px solid #BBF7D0;">
          Quote saved successfully!
        </div>
      {/if}

      {#if form?.error}
        <div style="background: #FEE2E2; color: #DC2626; padding: 16px; border-radius: 12px; margin-bottom: 16px; font-weight: 600; text-align: center; border: 1px solid #FCA5A5;">
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

        <button type="submit" style="width: 100%; background: #24503C; color: white; padding: 16px; border-radius: 12px; border: none; font-weight: 700; font-size: 16px; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(36, 80, 60, 0.2);">
          Download PDF & Save
        </button>
      </form>
    </div>
  {/if}

</div>
