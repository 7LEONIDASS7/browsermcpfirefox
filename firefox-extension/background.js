// Browser MCP Firefox Extension - Background Script
// Handles WebSocket communication with MCP server (same as Chrome version)

let websocket = null;
let isConnected = false;

// WebSocket server URL (same server as Claude Code uses)
const WS_URL = 'ws://localhost:9001';

// Connect to MCP server
function connect() {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    return;
  }
  
  websocket = new WebSocket(WS_URL);
  
  websocket.onopen = () => {
    console.log('🔌 Connected to MCP server');
    isConnected = true;
    updateIcon(true);
    
    // Send initial connection message
    const connectionMessage = {
      type: 'connection_established',
      timestamp: Date.now()
    };
    console.log('📤 Sending connection message:', connectionMessage);
    websocket.send(JSON.stringify(connectionMessage));
  };
  
  websocket.onclose = () => {
    console.log('Disconnected from MCP server');
    isConnected = false;
    updateIcon(false);
    websocket = null;
  };
  
  websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
    isConnected = false;
    updateIcon(false);
  };
  
  websocket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    console.log('📩 Received message:', message);
    
    // Handle the exact same WebSocket messages as Chrome extension
    try {
      const response = await handleMessage(message);
      console.log('📤 Sending response:', response);
      
      // Send response back to MCP server
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        const responseMessage = {
          id: message.id,
          response: response
        };
        console.log('📡 Final response message:', responseMessage);
        websocket.send(JSON.stringify(responseMessage));
      }
    } catch (error) {
      console.error('❌ Error handling message:', error);
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        const errorMessage = {
          id: message.id,
          error: error.message
        };
        console.log('📡 Sending error message:', errorMessage);
        websocket.send(JSON.stringify(errorMessage));
      }
    }
  };
}

// Handle WebSocket messages (implementing the same API as Chrome extension)
async function handleMessage(message) {
  const { type, payload } = message;
  
  // Get active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  
  if (!activeTab) {
    throw new Error('No active tab');
  }
  
  switch (type) {
    case 'browser_navigate':
      return await handleNavigate(activeTab, payload);
      
    case 'browser_go_back':
      return await handleGoBack(activeTab);
      
    case 'browser_go_forward':
      return await handleGoForward(activeTab);
      
    case 'browser_click':
      return await handleContentScript(activeTab, type, payload);
      
    case 'browser_hover':
      return await handleContentScript(activeTab, type, payload);
      
    case 'browser_type':
      return await handleContentScript(activeTab, type, payload);
      
    case 'browser_drag':
      return await handleContentScript(activeTab, type, payload);
      
    case 'browser_select_option':
      return await handleContentScript(activeTab, type, payload);
      
    case 'browser_wait':
      return await handleWait(payload);
      
    case 'browser_press_key':
      return await handleContentScript(activeTab, type, payload);
      
    case 'browser_get_console_logs':
      return await handleGetConsoleLogs(activeTab);
      
    case 'browser_screenshot':
      return await handleScreenshot(activeTab);
      
    case 'browser_snapshot':
      return await handleContentScript(activeTab, type, payload);
      
    case 'getUrl':
      return activeTab.url;
      
    case 'getTitle':
      return activeTab.title;
      
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}

// Navigation functions
async function handleNavigate(tab, payload) {
  await browser.tabs.update(tab.id, { url: payload.url });
  return { success: true, url: payload.url };
}

async function handleGoBack(tab) {
  await browser.tabs.goBack(tab.id);
  return { success: true };
}

async function handleGoForward(tab) {
  await browser.tabs.goForward(tab.id);
  return { success: true };
}

// Content script communication
async function handleContentScript(tab, type, payload) {
  return await browser.tabs.sendMessage(tab.id, { type, payload });
}

// Wait function
async function handleWait(payload) {
  const time = payload.time || 1000;
  await new Promise(resolve => setTimeout(resolve, time));
  return { success: true, waited: time };
}

// Console logs
async function handleGetConsoleLogs(tab) {
  try {
    const logs = await browser.tabs.sendMessage(tab.id, { type: 'get_console_logs' });
    return logs || [];
  } catch (error) {
    return [];
  }
}

// Screenshot
async function handleScreenshot(tab) {
  const dataUrl = await browser.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
  return dataUrl;
}

// Update extension icon
function updateIcon(connected) {
  const iconPath = connected ? 'icon32.png' : 'icon32-gray.png';
  browser.browserAction.setIcon({ path: iconPath });
  browser.browserAction.setBadgeText({ text: connected ? '✓' : '✗' });
  browser.browserAction.setBadgeBackgroundColor({ color: connected ? '#4CAF50' : '#F44336' });
}

// Handle popup messages
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'connect':
      connect();
      sendResponse({ success: true });
      break;
      
    case 'disconnect':
      if (websocket) {
        websocket.close();
      }
      sendResponse({ success: true });
      break;
      
    case 'getStatus':
      sendResponse({ connected: isConnected });
      break;
  }
  return true;
});

// Initialize
console.log('Browser MCP Firefox extension loaded');