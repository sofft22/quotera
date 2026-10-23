<script>
  let pageView = $state('input'); 
  let rawText = $state("");

  let recentQuotes = $state([
    { id: "Q-1029", customer: "John Doe", amount: 825000, date: "Oct 22, 2026" },
    { id: "Q-1028", customer: "Jane Smith", amount: 330000, date: "Oct 21, 2026" },
    { id: "Q-1027", customer: "Acme Corp", amount: 1200000, date: "Oct 20, 2026" },
  ]);

  let customer = $state({ name: "John Doe", contact: "0801 234 5678" });
  let quoteItems = $state([
    { id: 1, name: "Makita Angle Grinder 720W", price: 95000, qty: 2 },
    { id: 2, name: "DeWalt DCD771 Cordless Drill", price: 140000, qty: 1 },
  ]);

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
    if (isNaN(val)) return "₦0";
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  }

  function updateQty(id, newQty) {
    const item = quoteItems.find(i => i.id === id);
    if (item) item.qty = Math.max(1, Number(newQty));
  }

  function removeItem(id) {
    quoteItems = quoteItems.filter(i => i.id !== id);
  }

  function downloadPDF() {
    window.print();
  }

  function generateQuote() {
    if (!rawText.trim()) return;
    setTimeout(() => {
      pageView = 'builder';
    }, 500);
  }
</script>

<svelte:head>
  <title>New Quote | Quotera</title>
  <style>
    .quote-row {
      border-bottom: 1px solid #F3F4F6;
      transition: background-color 0.2s;
    }
    .quote-row:hover {
      background-color: #F9FAFB;
    }
    .quote-row:last-child {
      border-bottom: none;
    }
    
    @media (max-width: 640px) {
      .table-container { margin: 0 -8px; }
      th, td { padding: 12px 4px !important; }
      th { font-size: 10px !important; }
      td { font-size: 13px !important; }
    }

    @media print {
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; }
      .no-print { display: none !important; }
      @page { margin: 10mm; }
    }
  </style>
</svelte:head>

<!-- Outer wrapper with almost zero padding -->
<div style="max-width: 1000px; margin: 0 auto; padding: 8px;">

  <!-- ========================================== -->
  <!-- PAGE VIEW 1: INPUT SCREEN                  -->
  <!-- ========================================== -->
  {#if pageView === 'input'}
    <div style="margin-bottom: 16px; padding-left: 4px;">
      <h1 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; margin: 0; color: #24503C; letter-spacing: -0.02em;">
        New <span style="color: #C4513D;">Quote</span>
      </h1>
    </div>

    <!-- THE BOX -->
    <div style="margin-bottom: 32px;">
      <div style="display: flex; flex-direction: column; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 8px 24px rgba(48, 59, 56, 0.06); overflow: hidden;">
        <textarea 
          bind:value={rawText}
          placeholder="Paste that messy message here..."
          style="width: 100%; min-height: 120px; padding: 16px; border: none; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.5; color: #303B38; background: transparent; resize: vertical; outline: none; box-sizing: border-box;"
        ></textarea>
        
        <div style="padding: 10px 12px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6; display: flex;">
          <button onclick={generateQuote} style="background-color: #24503C; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%;">
            Generate Quote
          </button>
        </div>
      </div>
    </div>

    <!-- QUOTE HISTORY SECTION -->
    <div style="width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-left: 4px;">
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; color: #303B38; margin: 0;">Quote History</h2>
        <a href="/quotes" style="color: #24503C; font-weight: 600; font-size: 13px; text-decoration: none;">View all →</a>
      </div>

      <div class="table-container">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead style="border-bottom: 1px solid #E5E7EB;">
            <tr>
              <th style="padding: 12px 4px; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase;">Customer</th>
              <th style="padding: 12px 4px; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase;">Amount</th>
              <th style="padding: 12px 4px; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; text-align: right;">Date</th>
            </tr>
          </thead>
          <tbody>
            {#each recentQuotes as quote}
              <tr class="quote-row">
                <td style="padding: 12px 4px; font-size: 14px; font-weight: 600; color: #303B38;">{quote.customer}</td>
                <td style="padding: 12px 4px; font-size: 14px; font-weight: 600; color: #303B38;">{formatCurrency(quote.amount)}</td>
                <td style="padding: 12px 4px; font-size: 13px; color: #6B7280; text-align: right;">{quote.date}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <!-- ========================================== -->
  <!-- PAGE VIEW 2: BUILDER SCREEN                -->
  <!-- ========================================== -->
  {#if pageView === 'builder'}
    
    <!-- TOP: EDIT BOX -->
    <div class="no-print" style="background: #ffffff; border-radius: 12px; border: 1px solid #E5E7EB; padding: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="font-family: 'Manrope'; font-size: 16px; font-weight: 800; color: #303B38; margin: 0;">Edit Quote</h2>
        <button onclick={() => pageView = 'input'} style="background: none; border: none; color: #6B7280; font-weight: 600; font-size: 13px; cursor: pointer;">← Back</button>
      </div>

      <!-- Customer Info -->
      <div style="margin-bottom: 12px;">
        <input type="text" bind:value={customer.name} placeholder="Customer Name" style="width: 100%; padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 13px; margin-bottom: 6px; box-sizing: border-box;" />
        <input type="text" bind:value={customer.contact} placeholder="Phone or Email" style="width: 100%; padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 13px; box-sizing: border-box;" />
      </div>

      <!-- Items -->
      <div style="margin-bottom: 12px;">
        {#each quoteItems as item (item.id)}
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #F3F4F6;">
            <div style="flex: 1; padding-right: 8px;">
              <!-- Removed the price under the name -->
              <div style="font-size: 12px; font-weight: 600; color: #303B38; line-height: 1.3;">{item.name}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="number" value={item.qty} oninput={(e) => updateQty(item.id, e.target.value)} style="width: 40px; padding: 6px; border: 1px solid #E5E7EB; border-radius: 6px; text-align: center; font-size: 12px; outline: none;" min="1" />
              <div style="font-weight: 600; font-size: 12px; color: #303B38; width: 60px; text-align: right;">{formatCurrency(item.price * item.qty)}</div>
              <button onclick={() => removeItem(item.id)} style="background: none; border: none; color: #DC2626; cursor: pointer; font-size: 13px; padding: 0;">✕</button>
            </div>
          </div>
        {/each}
      </div>

      <!-- Adjustments -->
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #303B38; width: 80px;">
            <input type="checkbox" bind:checked={includeDiscount} style="width: 14px; height: 14px; accent-color: #24503C;" /> Discount
          </label>
          <select bind:value={discountType} style="flex: 1; padding: 6px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 11px; color: #6B7280; outline: none;">
            <option value="percentage">%</option>
            <option value="flat">₦</option>
          </select>
          <input type="number" bind:value={discountValue} placeholder="0" style="width: 50px; padding: 6px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 11px; text-align: center; outline: none;" />
        </div>
        
        <div style="display: flex; align-items: center; gap: 6px;">
          <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #303B38; width: 80px;">
            <input type="checkbox" bind:checked={includeDelivery} style="width: 14px; height: 14px; accent-color: #24503C;" /> Delivery
          </label>
          <input type="number" bind:value={deliveryFee} placeholder="Amount" style="flex: 1; padding: 6px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 11px; outline: none;" />
        </div>

        <div style="display: flex; align-items: center; gap: 6px;">
          <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #303B38; width: 80px;">
            <input type="checkbox" bind:checked={includeVAT} style="width: 14px; height: 14px; accent-color: #24503C;" /> VAT
          </label>
          <input type="number" placeholder="7.5" value="7.5" style="width: 50px; padding: 6px; border: 1px solid #E5E7EB; border-radius: 6px; font-size: 11px; text-align: center; outline: none;" disabled />
          <span style="font-size: 11px; color: #6B7280;">%</span>
        </div>
      </div>
    </div>

    <!-- BOTTOM: PREVIEW (The PDF Document) -->
    <div class="print-area" style="background: #ffffff; border-radius: 12px; border: 1px solid #E5E7EB; padding: 12px; font-family: 'Inter', sans-serif; color: #303B38; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
      
      <!-- PDF Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 2px solid #F3F4F6; padding-bottom: 12px;">
        <div style="max-width: 50%;">
          <div style="font-family: 'Manrope'; font-size: 18px; font-weight: 900; letter-spacing: -0.03em; color: #24503C;">Quotera.</div>
          <div style="font-size: 10px; color: #6B7280; margin-top: 2px; line-height: 1.4;">Your Company Address<br/>your@email.com</div>
        </div>
        <div style="text-align: right; max-width: 50%;">
          <h1 style="font-family: 'Manrope'; font-size: 14px; margin: 0 0 2px 0; color: #303B38; text-transform: uppercase;">Quotation</h1>
          <div style="font-size: 10px; color: #6B7280;">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <!-- Customer Info -->
      <div style="margin-bottom: 12px;">
        <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #9CA3AF; margin-bottom: 2px;">Prepared For</div>
        <div style="font-size: 12px; font-weight: 700; color: #303B38;">{customer.name}</div>
        <div style="font-size: 10px; color: #6B7280;">{customer.contact}</div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <th style="text-align: left; padding: 6px 0; font-size: 9px; text-transform: uppercase; color: #6B7280;">Item</th>
            <th style="text-align: center; padding: 6px 0; font-size: 9px; text-transform: uppercase; color: #6B7280;">Qty</th>
            <th style="text-align: right; padding: 6px 0; font-size: 9px; text-transform: uppercase; color: #6B7280;">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each quoteItems as item}
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 8px 0; font-size: 11px; font-weight: 600; line-height: 1.3;">{item.name}</td>
              <td style="padding: 8px 0; text-align: center; font-size: 11px;">{item.qty}</td>
              <td style="padding: 8px 0; text-align: right; font-size: 11px; font-weight: 600;">{formatCurrency(item.price * item.qty)}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
        <div style="width: 160px;">
          <div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 10px; color: #4B5563;">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {#if includeDiscount}
            <div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 10px; color: #DC2626;">
              <span>Discount:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          {/if}
          {#if includeDelivery && deliveryFee > 0}
            <div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 10px; color: #4B5563;">
              <span>Delivery:</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          {/if}
          {#if includeVAT}
            <div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 10px; color: #4B5563;">
              <span>VAT (7.5%):</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
          {/if}
          <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; font-weight: 800; color: #24503C; border-top: 1px solid #E5E7EB; margin-top: 2px;">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM BUTTON -->
    <div class="no-print" style="margin-top: 12px;">
      <button onclick={downloadPDF} style="width: 100%; background: #24503C; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 15px; cursor: pointer;">
        Download PDF
      </button>
    </div>
  {/if}

</div>