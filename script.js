// Mock data - REPLACE THIS WITH YOUR GOOGLE SHEETS API LATER
const mockStock = [
  { id: 1, name: "Maize Flour", price: 120, stock: 50 },
  { id: 2, name: "Rice 1kg", price: 200, stock: 30 },
  { id: 3, name: "Sugar 2kg", price: 350, stock: 20 }
];

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const updateBtn = document.getElementById('updateBtn');
  let currentItem = null;

  searchBtn.addEventListener('click', searchStock);
  updateBtn.addEventListener('click', updateStock);

  async function searchStock() {
    const itemName = document.getElementById('searchItem').value.trim();
    const resultsDiv = document.getElementById('stockResults');
    
    if (!itemName) {
      resultsDiv.innerHTML = '<p class="error">Please enter an item name</p>';
      return;
    }

    // SIMULATED SEARCH - REPLACE WITH REAL API CALL
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundItem = mockStock.find(item => 
        item.name.toLowerCase().includes(itemName.toLowerCase())
      );

      if (!foundItem) {
        resultsDiv.innerHTML = '<p class="error">Item not found</p>';
        document.getElementById('stockForm').style.display = 'none';
        return;
      }

      currentItem = foundItem;
      resultsDiv.innerHTML = `
        <div class="stock-card">
          <h3>${foundItem.name}</h3>
          <p>Price: KSh ${foundItem.price}</p>
          <p>Current Stock: <span class="stock-count">${foundItem.stock}</span></p>
        </div>
      `;
      document.getElementById('stockForm').style.display = 'block';
      
      console.log('Found item:', foundItem); // Check browser console
    } catch (error) {
      console.error('Search failed:', error);
      resultsDiv.innerHTML = `<p class="error">Search error: ${error.message}</p>`;
    }
  }

  function updateStock() {
    if (!currentItem) return;
    
    const qtyInput = document.getElementById('adjustQty');
    const qty = parseInt(qtyInput.value);
    const isAdd = document.getElementById('adjustType').value === 'add';

    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    // Simulate update - REPLACE WITH REAL API CALL
    try {
      const newStock = isAdd ? 
        currentItem.stock + qty : 
        currentItem.stock - qty;

      if (newStock < 0) {
        alert('Cannot reduce stock below 0');
        return;
      }

      currentItem.stock = newStock;
      document.querySelector('.stock-count').textContent = newStock;
      qtyInput.value = '';
      
      console.log('Updated stock:', currentItem); // Check browser console
      alert(`Stock updated successfully! New stock: ${newStock}`);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update stock');
    }
  }
});
