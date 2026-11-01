<script>
  let { data } = $props();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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

  /* SEAMLESS TABLE */
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

  /* Column Alignments */
  .col-name { flex: 1; padding-right: 12px; font-weight: 500; color: #303B38; font-size: 14px; line-height: 1.4; }
  .col-date { width: 100px; text-align: center; font-size: 12px; color: #6B7280; font-weight: 500; }
  .col-amount { width: 100px; text-align: right; font-weight: 600; color: #303B38; font-size: 14px; }
  .col-action { width: 80px; text-align: right; font-weight: 600; color: #24503C; font-size: 13px; }

  @media (max-width: 480px) {
    .col-date { width: 70px; font-size: 11px; }
    .col-amount { width: 90px; font-size: 13px; }
    .col-name { font-size: 13px; }
    .col-action { width: 60px; font-size: 12px; }
  }
</style>

<div class="page-wrapper">
  
  <!-- Header -->
  <div class="header-row">
    <div>
      <h1 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; margin: 0 0 6px 0; color: #303B38; letter-spacing: -0.02em;">Quote History</h1>
      <p style="color: #6B7280; margin: 0; font-size: 13px;">Quotes are automatically removed after 30 days.</p>
    </div>
    
    <a href="/dashboard" style="background-color: #24503C; color: white; padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background-color 0.2s; text-decoration: none;">
      + New Quote
    </a>
  </div>

  <!-- Seamless List -->
  <div class="table-container">
    
    <div class="table-header">
      <span class="col-name">Customer</span>
      <span class="col-date">Date</span>
      <span class="col-amount">Amount</span>
      <span class="col-action">PDF</span>
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
            <a href="/quotes/{quote.id}" style="color: inherit; text-decoration: none;">View</a>
          </span>
        </div>
      {/each}
    {/if}

  </div>
</div>
