// Browser MCP Firefox Extension - Popup Script
document.addEventListener('DOMContentLoaded', async () => {
  const connectBtn = document.getElementById('connectBtn');
  const disconnectBtn = document.getElementById('disconnectBtn');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  
  // Get initial status
  updateStatus();
  
  // Connect button
  connectBtn.addEventListener('click', async () => {
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    
    try {
      await browser.runtime.sendMessage({ action: 'connect' });
      setTimeout(updateStatus, 500); // Give it time to connect
    } catch (error) {
      console.error('Connect error:', error);
    }
    
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect';
  });
  
  // Disconnect button
  disconnectBtn.addEventListener('click', async () => {
    try {
      await browser.runtime.sendMessage({ action: 'disconnect' });
      setTimeout(updateStatus, 500);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
  
  // Update status display
  async function updateStatus() {
    try {
      const response = await browser.runtime.sendMessage({ action: 'getStatus' });
      const connected = response.connected;
      
      statusDot.classList.toggle('connected', connected);
      statusText.textContent = connected ? 'Connected' : 'Disconnected';
      connectBtn.disabled = connected;
      disconnectBtn.disabled = !connected;
    } catch (error) {
      console.error('Status update error:', error);
      statusText.textContent = 'Error';
    }
  }
  
  // Update status periodically
  setInterval(updateStatus, 2000);
});