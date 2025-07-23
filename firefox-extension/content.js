// Browser MCP Firefox Extension - Content Script
// Handles DOM interactions (same functionality as Chrome extension)

class BrowserMCPContentScript {
  constructor() {
    this.consoleLogs = [];
    this.setupConsoleCapture();
    this.setupMessageListener();
  }
  
  setupConsoleCapture() {
    // Capture console logs
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.log = (...args) => {
      this.consoleLogs.push({ level: 'log', message: args.join(' '), timestamp: Date.now() });
      originalLog.apply(console, args);
    };
    
    console.warn = (...args) => {
      this.consoleLogs.push({ level: 'warn', message: args.join(' '), timestamp: Date.now() });
      originalWarn.apply(console, args);
    };
    
    console.error = (...args) => {
      this.consoleLogs.push({ level: 'error', message: args.join(' '), timestamp: Date.now() });
      originalError.apply(console, args);
    };
    
    // Keep only recent logs
    if (this.consoleLogs.length > 1000) {
      this.consoleLogs = this.consoleLogs.slice(-1000);
    }
  }
  
  setupMessageListener() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep channel open for async response
    });
  }
  
  async handleMessage(message, sender, sendResponse) {
    const { type, payload } = message;
    
    try {
      switch (type) {
        case 'browser_click':
          sendResponse(await this.handleClick(payload));
          break;
          
        case 'browser_hover':
          sendResponse(await this.handleHover(payload));
          break;
          
        case 'browser_type':
          sendResponse(await this.handleType(payload));
          break;
          
        case 'browser_drag':
          sendResponse(await this.handleDrag(payload));
          break;
          
        case 'browser_select_option':
          sendResponse(await this.handleSelectOption(payload));
          break;
          
        case 'browser_press_key':
          sendResponse(await this.handlePressKey(payload));
          break;
          
        case 'browser_snapshot':
          sendResponse(await this.handleSnapshot());
          break;
          
        case 'get_console_logs':
          sendResponse(this.consoleLogs);
          break;
          
        default:
          sendResponse({ error: `Unknown message type: ${type}` });
      }
    } catch (error) {
      console.error('Content script error:', error);
      sendResponse({ error: error.message });
    }
  }
  
  // Find element using various strategies (same as Chrome extension)
  findElement(selector) {
    // Try CSS selector
    let element = document.querySelector(selector);
    if (element) return element;
    
    // Try by ID
    element = document.getElementById(selector);
    if (element) return element;
    
    // Try by text content
    const elements = Array.from(document.querySelectorAll('*'));
    element = elements.find(el => el.textContent && el.textContent.trim() === selector);
    if (element) return element;
    
    // Try by aria-label
    element = document.querySelector(`[aria-label="${selector}"]`);
    if (element) return element;
    
    return null;
  }
  
  // Click handler
  async handleClick(payload) {
    const element = this.findElement(payload.element);
    if (!element) {
      throw new Error(`Element not found: ${payload.element}`);
    }
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await this.wait(200);
    element.click();
    
    return { success: true, element: payload.element };
  }
  
  // Hover handler
  async handleHover(payload) {
    const element = this.findElement(payload.element);
    if (!element) {
      throw new Error(`Element not found: ${payload.element}`);
    }
    
    const event = new MouseEvent('mouseover', { bubbles: true });
    element.dispatchEvent(event);
    
    return { success: true, element: payload.element };
  }
  
  // Type handler
  async handleType(payload) {
    const element = this.findElement(payload.element);
    if (!element) {
      throw new Error(`Element not found: ${payload.element}`);
    }
    
    element.focus();
    
    // Clear existing content
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.value = '';
    }
    
    // Type text
    const text = payload.text;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Simulate keydown
      const keydownEvent = new KeyboardEvent('keydown', { key: char, bubbles: true });
      element.dispatchEvent(keydownEvent);
      
      // Add character
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value += char;
      } else {
        element.textContent += char;
      }
      
      // Simulate keyup
      const keyupEvent = new KeyboardEvent('keyup', { key: char, bubbles: true });
      element.dispatchEvent(keyupEvent);
      
      await this.wait(10);
    }
    
    // Trigger change events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    return { success: true, element: payload.element, text: payload.text };
  }
  
  // Drag handler
  async handleDrag(payload) {
    const startElement = this.findElement(payload.startElement);
    const endElement = this.findElement(payload.endElement);
    
    if (!startElement || !endElement) {
      throw new Error('Start or end element not found');
    }
    
    // Simulate drag and drop
    const dragEvent = new DragEvent('dragstart', { bubbles: true });
    startElement.dispatchEvent(dragEvent);
    
    const dropEvent = new DragEvent('drop', { bubbles: true });
    endElement.dispatchEvent(dropEvent);
    
    const dragEndEvent = new DragEvent('dragend', { bubbles: true });
    startElement.dispatchEvent(dragEndEvent);
    
    return { success: true, startElement: payload.startElement, endElement: payload.endElement };
  }
  
  // Select option handler
  async handleSelectOption(payload) {
    const element = this.findElement(payload.element);
    if (!element || element.tagName !== 'SELECT') {
      throw new Error(`Select element not found: ${payload.element}`);
    }
    
    const option = payload.option;
    let optionElement = null;
    
    // Find option by value or text
    const options = Array.from(element.options);
    optionElement = options.find(opt => opt.value === option || opt.textContent.trim() === option);
    
    if (!optionElement) {
      // Try by index
      const index = parseInt(option);
      if (!isNaN(index) && index >= 0 && index < options.length) {
        optionElement = options[index];
      }
    }
    
    if (!optionElement) {
      throw new Error(`Option not found: ${option}`);
    }
    
    // Select the option
    element.value = optionElement.value;
    optionElement.selected = true;
    
    // Trigger change event
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    return { success: true, element: payload.element, option: optionElement.textContent.trim() };
  }
  
  // Press key handler
  async handlePressKey(payload) {
    const key = payload.key;
    const activeElement = document.activeElement || document.body;
    
    const keydownEvent = new KeyboardEvent('keydown', { key: key, bubbles: true });
    const keyupEvent = new KeyboardEvent('keyup', { key: key, bubbles: true });
    
    activeElement.dispatchEvent(keydownEvent);
    activeElement.dispatchEvent(keyupEvent);
    
    return { success: true, key: key };
  }
  
  // Snapshot handler (ARIA tree - same as Chrome extension)
  async handleSnapshot() {
    const snapshot = {
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      elements: []
    };
    
    // Get interactive elements
    const selectors = [
      'a[href]', 'button', 'input', 'textarea', 'select',
      '[role="button"]', '[role="link"]', '[tabindex]',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      '[aria-label]', '[onclick]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        if (this.isVisible(element)) {
          snapshot.elements.push(this.getElementInfo(element, selector, index));
        }
      });
    });
    
    return snapshot;
  }
  
  // Check if element is visible
  isVisible(element) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           rect.width > 0 && 
           rect.height > 0;
  }
  
  // Get element information
  getElementInfo(element, selector, index) {
    const rect = element.getBoundingClientRect();
    
    return {
      tagName: element.tagName.toLowerCase(),
      selector: this.generateSelector(element),
      text: element.textContent ? element.textContent.trim().substring(0, 100) : '',
      id: element.id || null,
      className: element.className || null,
      position: {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      },
      attributes: {
        href: element.href || null,
        value: element.value || null,
        type: element.type || null,
        ariaLabel: element.getAttribute('aria-label') || null
      }
    };
  }
  
  // Generate CSS selector
  generateSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    let selector = element.tagName.toLowerCase();
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    return selector;
  }
  
  // Wait utility
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize content script
new BrowserMCPContentScript();