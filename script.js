document.addEventListener('DOMContentLoaded', () => {
  // Dummy data - will replace with Google Sheets later
  const stockData = [
    { id: 1, name: "Maize Flour", price: 120, stock: 50 },
    { id: 2, name: "Rice 1kg", price: 200, stock: 30 },
    { id: 3, name: "Sugar 2kg", price: 350, stock: 20 }
  ];

  // DOM elements
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const stockResults = document.getElementById('stockResults');
  const stockForm = document.getElementById('stockForm');
  const updateBtn = document.getElementById('updateBtn');

  let currentItem = null;

  // Event listeners
  searchBtn.addEventListener('click', searchStock);
  updateBtn.addEventListener('click', updateStock);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchStock();
  });

  function searchStock() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    stockResults.innerHTML = '';
    
    if (!searchTerm) {
      showMessage('Please enter an item name', 'error');
      return;
    }

    // Simulate API call with timeout
    setTimeout(() => {
      const foundItems = stockData.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
      );

      if (foundItems.length === 0) {
        showMessage('No items found', 'error');
        stockForm.style.display = 'none';
        return;
      }

      displayResults(foundItems);
    }, 300); // Small delay to simulate network
  }

  function displayResults(items) {
    stockResults.innerHTML = items.map(item => `
      <div class="stock-card" data-id="${item.id}">
        <h3>${item.name}</h3>
        <p>Price: KSh ${item.price}</p>
        <p>Stock: <span class="stock-value">${item.stock}</span> units</p>
      </div>
    `).join('');

    // Add click handler to each result
    document.querySelectorAll('.stock-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemId = parseInt(card.dataset.id);
        currentItem = stockData.find(item => item.id === itemId);
        stockForm.style.display = 'block';
      });
    });
  }

  function updateStock() {
    if (!currentItem) return;
    
    const quantity = parseInt(document.getElementById('adjustQty').value);
    const isAdd = document.getElementById('adjustType').value === 'add';

    if (isNaN(quantity) || quantity <= 0) {
      showMessage('Please enter valid quantity', 'error');
      return;
    }

    // Update stock
    currentItem.stock = isAdd ? 
      currentItem.stock + quantity : 
      Math.max(0, currentItem.stock - quantity); // Prevent negative stock

    // Update UI
    document.querySelector('.stock-value').textContent = currentItem.stock;
    showMessage(`Stock updated! New quantity: ${currentItem.stock}`, 'success');
  }

  function showMessage(msg, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = msg;
    stockResults.prepend(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
  }

  // Debug confirmation
  console.log('POS Stock System Initialized');
});
