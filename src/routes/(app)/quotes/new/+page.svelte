<script>
  import { onMount } from 'svelte';
  
  let { data } = $props();
  let html2canvas;
  let jsPDF;

  let pdfQuote = $state(null);
  let isDownloading = $state(false);
  let hiddenReceiptRef;

  onMount(async () => {
    const html2canvasModule = await import('html2canvas');
    html2canvas = html2canvasModule.default;
    
    const jspdfModule = await import('jspdf');
    jsPDF = jspdfModule.jsPDF;
  });

  const formatCurrency = (val) => {
    if (!val) return "₦0";
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const downloadPDF = (quote) => {
    pdfQuote = quote;
    isDownloading = true;

    setTimeout(async () => {
      if (!hiddenReceiptRef || !html2canvas || !jsPDF) return;

      try {
        const canvas = await html2canvas(hiddenReceiptRef, {
          scale: 2,
          backgroundColor: "#FFFFFF",
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = canvas.width * 0.264583; 
        const pdfHeight = canvas.height * 0.264583;

        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "mm",
          format: [pdfWidth, pdfHeight] 
        });

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Quotera_Quote_${quote.id}.pdf`);
      } catch (error) {
        console.error("Failed to generate PDF", error);
        alert("There was an error downloading the PDF.");
      } finally {
        isDownloading = false;
        pdfQuote = null;
      }
    }, 300);
  };
</script>

<svelte:head>
  <title>Quote History | Quotera</title>
</svelte:head>

<style>
  .page-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 16px 8px; 
    width: 100%;
    box-sizing: border-box;
  }

  @media (min-width: 769px) {
    .page-wrapper {
      padding: 32px 24px;
    }
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }

  .table-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-header {
    display: flex;
    padding: 12px 8px;
    border-bottom: 1px solid #E5E7EB;
    font-size: 11px;
    font-weight: 600;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .list-row {
    display: flex;
    align-items: center;
    padding: 16px 8px; 
    border-bottom: 1px solid #F3F4F6;
    transition: background-color 0.2s;
  }
  
  .list-row:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .col-name { flex: 1; padding-right: 12px; font-weight: 500; color: #303B38; font-size: 14px; line-height: 1.4; }
  .col-date { width: 100px; text-align: center; font-size: 12px; color: #6B7280; font-weight: 500; }
  .col-amount { width: 100px; text-align: right; font-weight: 600; color: #303B38; font-size: 14px; }
  
  .col-action { 
    width: 40px; 
    display: flex; 
    justify-content: flex-end; 
    align-items: center; 
  }

  @media (max-width: 480px) {
    .col-date { width: 70px; font-size: 11px; }
    .col-amount { width: 90px; font-size: 13px; }
    .col-name { font-size: 13px; }
    .col-action { width: 32px; }
  }
</style>

<div class="page-wrapper">
  
  <div class="header-row">
    <div>
      <h1 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; margin: 0 0 6px 0; color: #303B38; letter-spacing: -0.02em;">Quote History</h1>
      <p style="color: #6B7280; margin: 0; font-size: 13px;">Quotes are automatically removed after 30 days.</p>
    </div>
    
    <a href="/dashboard" style="background-color: #24503C; color: white; padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background-color 0.2s; text-decoration: none;">
      + New Quote
    </a>
  </div>

  <div class="table-container">
    
    <div class="table-header">
      <span class="col-name">Customer</span>
      <span class="col-date">Date</span>
      <span class="col-amount">Amount</span>
      <span class="col-action"></span>
    </div>

    {#if data.quotes.length === 0}
      <div style="padding: 32px 8px; text-align: center; color: #6B7280; font-size: 14px;">
        No recent quotes. Generate one on the dashboard.
      </div>
    {:else}
      {#each data.quotes as quote (quote.id)}
        <div class="list-row">
          <span class="col-name">{quote.customer_name}</span>
          <span class="col-date">{formatDate(quote.created_at)}</span>
          <span class="col-amount">{formatCurrency(quote.total)}</span>
          
          <span class="col-action">
            <button 
              onclick={() => downloadPDF(quote)} 
              disabled={isDownloading && pdfQuote?.id === quote.id}
              style="background: none; border: none; padding: 4px; cursor: pointer; color: #24503C; display: flex; align-items: center; justify-content: center; opacity: {isDownloading && pdfQuote?.id === quote.id ? 0.5 : 1};"
              title="Download PDF"
            >
              {#if isDownloading && pdfQuote?.id === quote.id}
                <svg style="width: 18px; height: 18px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
              {:else}
                <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              {/if}
            </button>
          </span>
        </div>
      {/each}
    {/if}

  </div>
</div>

<!-- HIDDEN PDF TEMPLATE (Bolder & Larger) -->
<div style="position: absolute; top: 0; left: 0; z-index: -1; opacity: 0; pointer-events: none;">
  {#if pdfQuote}
    <div bind:this={hiddenReceiptRef} style="width: 800px; background: white; padding: 50px; font-family: 'Inter', sans-serif; color: #303B38;">
      
      <!-- PDF Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; border-bottom: 2px solid #F3F4F6; padding-bottom: 25px;">
        <div>
          <div style="font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 900; letter-spacing: -0.03em; color: #24503C;">Quotera.</div>
          <div style="font-size: 14px; color: #6B7280; margin-top: 6px; line-height: 1.6;">Your Company Address<br/>your@email.com</div>
        </div>
        <div style="text-align: right;">
          <h1 style="font-family: 'Manrope', sans-serif; font-size: 26px; font-weight: 800; margin: 0 0 6px 0; color: #303B38; text-transform: uppercase;">Quotation</h1>
          <div style="font-size: 14px; color: #6B7280;">Date: {formatDate(pdfQuote.created_at)}</div>
          <div style="font-size: 14px; color: #6B7280;">Quote #: Q-{pdfQuote.id}</div>
        </div>
      </div>

      <!-- Customer Info -->
      <div style="margin-bottom: 40px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9CA3AF; margin-bottom: 6px; letter-spacing: 0.05em;">Prepared For</div>
        <div style="font-size: 20px; font-weight: 800; color: #303B38;">{pdfQuote.customer_name || "Customer"}</div>
        <div style="font-size: 15px; color: #6B7280; margin-top: 4px;">{pdfQuote.customer_contact || ""}</div>
      </div>

      <!-- Items Table -->
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
          {#if pdfQuote.items_json}
            {#each JSON.parse(pdfQuote.items_json) as item}
              <tr style="border-bottom: 1px solid #F3F4F6;">
                <td style="padding: 20px 0; font-size: 16px; font-weight: 600; line-height: 1.5; word-wrap: break-word;">{item.name}</td>
                <td style="padding: 20px 0; text-align: center; font-size: 15px; font-weight: 500;">{item.unit}</td>
                <td style="padding: 20px 0; text-align: center; font-size: 15px; font-weight: 500;">{item.qty}</td>
                <td style="padding: 20px 0; text-align: right; font-size: 15px;">{formatCurrency(item.price)}</td>
                <td style="padding: 20px 0; text-align: right; font-size: 16px; font-weight: 700;">{formatCurrency(item.price * item.qty)}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>

      <!-- Totals Breakdown -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 320px;">
          
          <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #4B5563;">
            <span>Subtotal:</span>
            <span>{formatCurrency(pdfQuote.subtotal)}</span>
          </div>
          
          {#if pdfQuote.discount > 0}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #DC2626; font-weight: 500;">
              <span>Discount:</span>
              <span>-{formatCurrency(pdfQuote.discount)}</span>
            </div>
          {/if}
          
          {#if pdfQuote.delivery > 0}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #4B5563;">
              <span>Delivery:</span>
              <span>{formatCurrency(pdfQuote.delivery)}</span>
            </div>
          {/if}
          
          {#if pdfQuote.vat > 0}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; color: #4B5563;">
              <span>VAT (7.5%):</span>
              <span>{formatCurrency(pdfQuote.vat)}</span>
            </div>
          {/if}
          
          <div style="display: flex; justify-content: space-between; padding: 20px 0 10px 0; font-size: 24px; font-weight: 800; color: #24503C; border-top: 3px solid #E5E7EB; margin-top: 10px;">
            <span>TOTAL:</span>
            <span>{formatCurrency(pdfQuote.total)}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #F3F4F6; padding-top: 30px; text-align: center;">
        <p style="font-size: 13px; color: #9CA3AF; margin: 0;">Thank you for your business. If you have any questions, please contact us.</p>
      </div>

    </div>
  {/if}
</div>
