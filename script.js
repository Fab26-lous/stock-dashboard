document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const API_URL = "https://script.google.com/macros/s/AKfycbwr2HANVmQWTcnNmQwU5kRBcm334pfCSpTHypRYUx3g68tC4_N_CUcA1X925FLwFpsu/exec";
  
  // DOM elements
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const stockResults = document.getElementById('stockResults');
  const stockForm = document.getElementById('stockForm');
  const updateBtn = document.getElementById('updateBtn');
  const adjustQty = document.getElementById('adjustQty');
  const adjustType = document.getElementById('adjustType');

  let currentItem = null;

  // Event listeners
  searchBtn.addEventListener('click', searchStock);
  updateBtn.addEventListener('click', updateStock);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchStock();
  });

  async function searchStock() {
    const searchTerm = searchInput.value.trim();
    stockResults.innerHTML = '<p class="loading">Searching...</p>';
    
    if (!searchTerm) {
      showMessage('Please enter an item name', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}?action=search&term=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const items = await response.json();
      
      if (!items || items.length === 0) {
        showMessage('No items found', 'error');
        stockForm.style.display = 'none';
        return;
      }

      displayResults(items);
    } catch (error) {
      console.error('Search failed:', error);
      showMessage('Failed to search inventory. Please try again.', 'error');
      // Fallback to dummy data if needed
      // loadDummyData(searchTerm);
    }
  }

  function displayResults(items) {
    stockResults.innerHTML = items.map(item => `
      <div class="stock-card" data-id="${item.ID}">
        <h3>${item.ItemName}</h3>
        <p>Price: KSh ${item.Price}</p>
        <p>Stock: <span class="stock-value ${item.CurrentStock < 10 ? 'low-stock' : ''}">
          ${item.CurrentStock}
        </span> units</p>
        ${item.LastUpdated ? `<p class="updated">Last updated: ${new Date(item.LastUpdated).toLocaleString()}</p>` : ''}
      </div>
    `).join('');

    // Add click handler to each result
    document.querySelectorAll('.stock-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemId = parseInt(card.dataset.id);
        currentItem = items.find(item => item.ID === itemId);
        stockForm.style.display = 'block';
        adjustQty.value = 1;
        adjustType.value = 'reduce';
      });
    });
  }

  async function updateStock() {
    if (!currentItem) return;
    
    const quantity = parseInt(adjustQty.value);
    const isAdd = adjustType.value === 'add';
    const newStock = isAdd ? 
      currentItem.CurrentStock + quantity : 
      currentItem.CurrentStock - quantity;

    if (isNaN(quantity) {
      showMessage('Please enter a valid quantity', 'error');
      return;
    }

    if (newStock < 0) {
      showMessage('Stock cannot go below 0', 'error');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentItem.ID,
          newStock: newStock
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local display
        currentItem.CurrentStock = newStock;
        document.querySelector(`.stock-card[data-id="${currentItem.ID}"] .stock-value`).textContent = newStock;
        
        // Highlight if stock is now low
        const stockElement = document.querySelector(`.stock-card[data-id="${currentItem.ID}"] .stock-value`);
        stockElement.classList.toggle('low-stock', newStock < 10);
        
        showMessage(`Successfully updated stock to ${newStock}`, 'success');
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update failed:', error);
      showMessage(error.message, 'error');
    }
  }

  function showMessage(msg, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = msg;
    stockResults.prepend(msgDiv);
    setTimeout(() => msgDiv.remove(), 5000);
  }

  // Fallback dummy data (for testing when API fails)
  function loadDummyData(searchTerm) {
    const dummyData = [
      { ID: 1, ItemName: "Maize Flour", Price: 120, CurrentStock: 50, LastUpdated: new Date() },
      { ID: 2, ItemName: "Rice 1kg", Price: 200, CurrentStock: 30, LastUpdated: new Date() },
      { ID: 3, ItemName: "Sugar 2kg", Price: 350, CurrentStock: 20, LastUpdated: new Date() }
    ];
    
    const filtered = dummyData.filter(item => 
      item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displayResults(filtered);
    showMessage('Using offline data', 'warning');
  }

  // Initialize
  console.log('Stock system initialized');
});
