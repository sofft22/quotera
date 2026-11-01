<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let isModalOpen = $state(false);
  let isEditing = $state(false);
  let currentProduct = $state({ id: null, name: "", unit: "", price: "" });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  function openAddModal() {
    isEditing = false;
    currentProduct = { id: null, name: "", unit: "", price: "" };
    isModalOpen = true;
  }

  function openEditModal(product) {
    isEditing = true;
    currentProduct = { ...product }; 
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<svelte:head>
  <title>Price List | Quotera</title>
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
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .list-row:active, .list-row:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .col-name { flex: 1; padding-right: 12px; font-weight: 500; color: #303B38; font-size: 14px; line-height: 1.4; }
  .col-unit { width: 60px; text-align: center; font-size: 12px; color: #6B7280; font-weight: 500; }
  .col-amount { width: 100px; text-align: right; font-weight: 600; color: #303B38; font-size: 14px; }

  @media (max-width: 480px) {
    .col-unit { width: 50px; font-size: 11px; }
    .col-amount { width: 90px; font-size: 13px; }
    .col-name { font-size: 13px; }
  }

  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(48, 59, 56, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-end; 
    justify-content: center;
    z-index: 9999;
  }

  @media (min-width: 769px) {
    .modal-overlay { align-items: center; }
  }

  .modal-content {
    background-color: #ffffff;
    width: 100%;
    max-width: 500px;
    border-radius: 24px 24px 0 0; 
    padding: 32px 24px;
    box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
    box-sizing: border-box;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: 769px) {
    .modal-content { border-radius: 20px; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
</style>

<div class="page-wrapper">
  
  <div class="header-row">
    <div>
      <h1 style="font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; margin: 0 0 6px 0; color: #303B38; letter-spacing: -0.02em;">Price List</h1>
      <p style="color: #6B7280; margin: 0; font-size: 13px;">Tap any row to edit.</p>
    </div>
    
    <button onclick={openAddModal} style="background-color: #24503C; color: white; padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background-color 0.2s;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Add Item
    </button>
  </div>

  <div class="table-container">
    
    <div class="table-header">
      <span class="col-name">Item Name</span>
      <span class="col-unit">Unit</span>
      <span class="col-amount">Price</span>
    </div>

    {#if data.products && data.products.length > 0}
      {#each data.products as product (product.id)}
        <div class="list-row" onclick={() => openEditModal(product)} role="button" tabindex="0">
          <span class="col-name">{product.name}</span>
          <span class="col-unit">{product.unit}</span>
          <span class="col-amount">{formatCurrency(product.price)}</span>
        </div>
      {/each}
    {:else}
      <div style="padding: 32px 8px; text-align: center; color: #6B7280; font-size: 14px;">
        Your price list is empty. Add your first item to get started.
      </div>
    {/if}

  </div>
</div>

{#if isModalOpen}
  <div class="modal-overlay" onclick={closeModal} role="presentation">
    <div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #303B38; margin: 0;">
          {isEditing ? 'Edit Item' : 'Add Item'}
        </h2>
        <button onclick={closeModal} style="background: none; border: none; cursor: pointer; color: #9CA3AF; padding: 4px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {#if form?.error}
        <div style="background: #FEE2E2; color: #DC2626; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; font-weight: 600;">
          {form.error}
        </div>
      {/if}

      <form 
        method="POST" 
        action={isEditing ? '?/edit' : '?/add'} 
        use:enhance={() => {
          return async ({ result, update }) => {
            await update();
            if (result.type === 'success') closeModal();
          };
        }}
      >
        {#if isEditing}
          <input type="hidden" name="id" value={currentProduct.id} />
        {/if}

        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px;">Item Name</label>
          <input type="text" name="name" bind:value={currentProduct.name} placeholder="e.g. Makita Angle Grinder 720W" required style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 8px; font-family: 'Inter'; font-size: 15px; box-sizing: border-box;" />
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <div style="flex: 1;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px;">Unit</label>
            <input type="text" name="unit" bind:value={currentProduct.unit} placeholder="Piece" required style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 8px; font-family: 'Inter'; font-size: 15px; box-sizing: border-box;" />
          </div>
          <div style="flex: 1;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #303B38; margin-bottom: 6px;">Price (₦)</label>
            <input type="number" name="price" bind:value={currentProduct.price} placeholder="0.00" required style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 8px; font-family: 'Inter'; font-size: 15px; box-sizing: border-box;" />
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          {#if isEditing}
            <button 
              type="button" 
              onclick={async () => {
                const formData = new FormData();
                formData.append('id', currentProduct.id);
                const res = await fetch('?/delete', { method: 'POST', body: formData });
                if (res.ok) {
                  window.location.reload(); 
                }
              }} 
              style="background: none; border: none; color: #DC2626; font-weight: 600; font-size: 14px; cursor: pointer; padding: 0;"
            >
              Delete Item
            </button>
          {:else}
            <div></div> 
          {/if}
          
          <button type="submit" style="background: #24503C; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; cursor: pointer;">
            Save
          </button>
        </div>
      </form>

    </div>
  </div>
{/if}
