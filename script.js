// Google Sheets Config
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbztdQRxj-lt5QzlNn2Cz-IognjKD3vl4S79eSRC6mkuGNTa6M6bI_HaiLWTLDFRS58U/exec';
const SHEET_NAME = 'Stock';

// DOM Elements
const searchInput = document.getElementById('searchItem');
const stockResults = document.getElementById('stockResults');
const stockForm = document.getElementById('stockForm');

let currentItem = null;

async function searchStock() {
  const itemName = searchInput.value.trim();
  if (!itemName) return;

  try {
    const response = await fetch(`${SHEET_URL}?action=search&item=${encodeURIComponent(itemName)}`);
    const data = await response.json();
    
    if (data.error) {
      stockResults.innerHTML = `<p class="error">${data.error}</p>`;
      return;
    }

    currentItem = data;
    stockResults.innerHTML = `
      <div class="stock-card">
        <h3>${data.name}</h3>
        <p>Price: $${data.price}</p>
        <p>Current Stock: <span class="stock-count">${data.stock}</span></p>
      </div>
    `;
    
    stockForm.style.display = 'block';
  } catch (error) {
    stockResults.innerHTML = `<p class="error">Failed to search: ${error.message}</p>`;
  }
}

async function updateStock() {
  const qty = parseInt(document.getElementById('adjustQty').value);
  const isAdd = document.getElementById('adjustType').value === 'add';
  
  if (!currentItem || isNaN(qty) return;

  try {
    const newStock = isAdd ? currentItem.stock + qty : currentItem.stock - qty;
    
    const response = await fetch(`${SHEET_URL}?action=update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentItem.id,
        newStock: newStock
      })
    });
    
    const result = await response.json();
    if (result.success) {
      document.querySelector('.stock-count').textContent = newStock;
      currentItem.stock = newStock;
    }
  } catch (error) {
    alert(`Update failed: ${error.message}`);
  }
}
