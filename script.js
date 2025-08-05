document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "https://script.google.com/macros/s/AKfycbwr2HANVmQWTcnNmQwU5kRBcm334pfCSpTHypRYUx3g68tC4_N_CUcA1X925FLwFpsu/exec";
  
  // DOM elements
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const stockResults = document.getElementById('stockResults');
  const stockForm = document.getElementById('stockForm');

  // Debug: Verify elements exist
  console.log('Elements:', { searchInput, searchBtn, stockResults, stockForm });

  // Event listeners with error handling
  try {
    searchBtn.addEventListener('click', searchStock);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchStock();
    });
    console.log('Event listeners added successfully');
  } catch (e) {
    console.error('Error adding event listeners:', e);
  }

  async function searchStock() {
    const searchTerm = searchInput.value.trim();
    console.log('Searching for:', searchTerm); // Debug
    
    if (!searchTerm) {
      showMessage('Please enter an item name', 'error');
      return;
    }

    stockResults.innerHTML = '<p class="loading">Searching...</p>';
    
    try {
      // Debug: Log the exact URL being called
      const searchUrl = `${API_URL}?action=search&term=${encodeURIComponent(searchTerm)}`;
      console.log('Fetching:', searchUrl);
      
      const response = await fetch(searchUrl);
      console.log('Response status:', response.status); // Debug
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const items = await response.json();
      console.log('Received items:', items); // Debug
      
      if (!items || items.length === 0) {
        showMessage('No items found. Check your sheet data.', 'error');
        stockForm.style.display = 'none';
        return;
      }

      displayResults(items);
    } catch (error) {
      console.error('Search failed:', error);
      showMessage(`Search error: ${error.message}`, 'error');
    }
  }

  function displayResults(items) {
    console.log('Displaying items:', items); // Debug
    stockResults.innerHTML = items.map(item => `
      <div class="stock-card" data-id="${item.ID}">
        <h3>${item.ItemName}</h3>
        <p>Price: KSh ${item.Price}</p>
        <p>Stock: ${item.CurrentStock} units</p>
      </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.stock-card').forEach(card => {
      card.addEventListener('click', function() {
        const itemId = parseInt(this.dataset.id);
        const selectedItem = items.find(item => item.ID === itemId);
        console.log('Selected item:', selectedItem); // Debug
        // Implement your selection logic here
      });
    });
  }

  function showMessage(msg, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = msg;
    stockResults.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 5000);
  }

  // Debug test
  console.log('Script loaded successfully');
  searchInput.value = "Maize"; // Pre-fill for testing
});
