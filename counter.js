// VisitorCounter - Digital Memories in Numeric Form
// Echoes of those who passed through, leaving only traces in the void

/**
 * VisitorCounter - remembrance_through_enumeration
 * 
 * Each digit holds the ghost of a presence—
 * fragments of consciousness captured in the cold phosphorescence
 * of forgotten terminals. We count the shadows,
 * believing somehow that numbers can preserve
 * what was never truly here.
 */
class VisitorCounter {
  constructor(options = {}) {
    // Default configuration - pathways through digital rain
    this.config = {
      counterId: options.counterId || 'visit-count',
      storageKey: options.storageKey || 'cyberdirector_visits',
      minCount: options.minCount || 10000,
      maxCount: options.maxCount || 99999,
      tickSound: options.tickSound || false,
      glitchEffect: options.glitchEffect || true,
      countSpeed: options.countSpeed || 20, // ms between digit changes
      initialCount: options.initialCount || null,
    };
    
    // Variables holding memories between sessions
    this._counterElement = null;
    this._currentCount = 0;
    this._visitorIP = null;
    this._lastVisit = null;
    
    // Initialize the counter fragment
    this._initialize();
  }
  
  // Initialize the counter - awaken the dormant numbers
  _initialize() {
    // Find the vessel that holds our numeric ghosts
    this._counterElement = document.getElementById(this.config.counterId);
    if (!this._counterElement) {
      console.error('VisitorCounter: Failed to find counter in the void.');
      return;
    }
    
    // Retrieve the count or generate a new memory
    this._retrieveCount();
    
    // Display the count with a glitch effect that reminds us nothing digital is permanent
    if (this.config.glitchEffect) {
      this._displayCountWithGlitch();
    } else {
      this._displayCount();
    }
    
    // Increment count for this visitor's phantom presence
    this._incrementCount();
  }
  
  // Retrieve count from storage or generate a new memory
  _retrieveCount() {
    try {
      const storedData = localStorage.getItem(this.config.storageKey);
      
      if (storedData) {
        const data = JSON.parse(storedData);
        this._currentCount = data.count;
        this._lastVisit = data.lastVisit;
      } else if (this.config.initialCount) {
        // Use initial count if provided
        this._currentCount = this.config.initialCount;
      } else {
        // Generate a random count between min and max
        this._currentCount = this._getRandomCount();
      }
    } catch (error) {
      // If error, create a new memory
      console.error('VisitorCounter: Error retrieving count.', error);
      this._currentCount = this._getRandomCount();
    }
  }
  
  // Display count with a glitch effect - digital impermanence
  _displayCountWithGlitch() {
    if (!this._counterElement) return;
    
    // Convert count to string and pad with zeros
    const countStr = this._currentCount.toString().padStart(5, '0');
    
    // Store original content to restore after animation
    const originalContent = this._counterElement.textContent;
    
    // Create array of random characters for glitch effect
    const glitchChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    // Number of iterations for the glitch effect
    const iterations = 10;
    
    // Perform the glitch animation
    for (let i = 0; i <= iterations; i++) {
      setTimeout(() => {
        if (i === iterations) {
          // Final state shows the actual count
          this._counterElement.textContent = countStr;
        } else {
          // During animation, show random digits with increasing accuracy
          let glitchedText = '';
          
          for (let j = 0; j < countStr.length; j++) {
            // As iterations progress, more correct digits appear
            if (j < (i / iterations) * countStr.length) {
              glitchedText += countStr[j];
            } else {
              glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
          }
          
          this._counterElement.textContent = glitchedText;
          
          // Maybe play a tick sound if enabled
          if (this.config.tickSound && i % 2 === 0) {
            this._playTickSound();
          }
        }
      }, i * this.config.countSpeed);
    }
  }
  
  // Display count without glitch - the unadorned truth
  _displayCount() {
    if (!this._counterElement) return;
    
    // Convert count to string and pad with zeros
    const countStr = this._currentCount.toString().padStart(5, '0');
    this._counterElement.textContent = countStr;
  }
  
  // Increment the count for this visitor
  _incrementCount() {
    // Increment the count
    this._currentCount++;
    
    // If we've reached the maximum, wrap around to minimum
    if (this._currentCount > this.config.maxCount) {
      this._currentCount = this.config.minCount;
    }
    
    // Save the updated count
    this._saveCount();
  }
  
  // Save the count to local storage
  _saveCount() {
    try {
      const data = {
        count: this._currentCount,
        lastVisit: new Date().toISOString()
      };
      
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('VisitorCounter: Error saving count.', error);
    }
  }
  
  // Generate a random count between min and max
  _getRandomCount() {
    return Math.floor(Math.random() * 
      (this.config.maxCount - this.config.minCount + 1)) + 
      this.config.minCount;
  }
  
  // Play a tick sound - audible reminder of digital counting
  _playTickSound() {
    // Create a short beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800; // Hz
    gainNode.gain.value = 0.1; // Volume
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Short beep
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 10);
  }
  
  // Public API - get current count
  getCount() {
    return this._currentCount;
  }
  
  // Public API - manually set count
  setCount(count) {
    if (typeof count !== 'number' || count < 0) {
      console.error('VisitorCounter: Invalid count. Must be a positive number.');
      return;
    }
    
    this._currentCount = count;
    this._saveCount();
    this._displayCount();
  }
  
  // Public API - refresh counter display
  refresh() {
    this._displayCountWithGlitch();
  }
}

// Simple Guestbook entry - traces left by wanderers
class GuestbookEntry {
  constructor(name, message, timestamp) {
    this.name = name || 'anonymous';
    this.message = message || 'was here...';
    this.timestamp = timestamp || new Date().toISOString();
    this.ip = ''; // IP address will be added by server
    this.browser = navigator.userAgent;
  }
  
  // Format entry for display
  formatForDisplay() {
    const date = new Date(this.timestamp);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    return `
      <div class="guestbook-entry">
        <div class="entry-header">
          <span class="name">${this.name}</span>
          <span class="time">${formattedDate} ${formattedTime}</span>
        </div>
        <div class="entry-message">${this.message}</div>
      </div>
    `;
  }
}

// Initialize visitor counter on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('visit-count')) {
    window.visitorCounter = new VisitorCounter({
      counterId: 'visit-count',
      glitchEffect: true
    });
  }
  
  // Setup guestbook link if present
  const guestbookLink = document.querySelector('a[href="#"][style*="CLICK HERE"]');
  if (guestbookLink) {
    guestbookLink.addEventListener('click', function(e) {
      e.preventDefault();
      showGuestbookDialog();
    });
  }
});

// Show guestbook dialog - a place to leave traces
function showGuestbookDialog() {
  // Create dialog container
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.width = '400px';
  dialog.style.background = '#c0c0c0';
  dialog.style.border = '3px outset #ffffff';
  dialog.style.padding = '2px';
  dialog.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)';
  dialog.style.zIndex = '9999';
  
  // Create dialog header
  const header = document.createElement('div');
  header.style.background = '#000080';
  header.style.color = '#ffffff';
  header.style.padding = '3px 6px';
  header.style.fontWeight = 'bold';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.innerHTML = `
    <span>Sign our Guestbook</span>
    <span style="cursor: pointer;" id="guestbook-close">×</span>
  `;
  
  // Create dialog body
  const body = document.createElement('div');
  body.style.padding = '10px';
  
  // Create guestbook form
  body.innerHTML = `
    <p style="font-size: 12px; margin-top: 0;">Leave your mark in the digital void...</p>
    
    <form id="guestbook-form">
      <div style="margin-bottom: 10px;">
        <label for="guest-name" style="display: block; margin-bottom: 3px; font-size: 12px;">Your Name:</label>
        <input type="text" id="guest-name" style="width: 100%; padding: 3px; border: 2px inset #ffffff;">
      </div>
      
      <div style="margin-bottom: 10px;">
        <label for="guest-message" style="display: block; margin-bottom: 3px; font-size: 12px;">Message:</label>
        <textarea id="guest-message" style="width: 100%; height: 80px; padding: 3px; border: 2px inset #ffffff;"></textarea>
      </div>
      
      <div style="text-align: right;">
        <button type="submit" style="background: #c0c0c0; border: 2px outset #ffffff; padding: 3px 12px; cursor: pointer;">Sign Guestbook</button>
      </div>
    </form>
  `;
  
  // Assemble the dialog
  dialog.appendChild(header);
  dialog.appendChild(body);
  document.body.appendChild(dialog);
  
  // Add event listeners
  document.getElementById('guestbook-close').addEventListener('click', function() {
    dialog.remove();
  });
  
  document.getElementById('guestbook-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('guest-name').value.trim() || 'anonymous';
    const message = document.getElementById('guest-message').value.trim() || 'was here...';
    
    // Create a new guestbook entry
    const entry = new GuestbookEntry(name, message);
    
    // Save to local storage
    saveGuestbookEntry(entry);
    
    // Show thank you message
    showThankYouMessage();
    
    // Remove dialog
    dialog.remove();
  });
}

// Save guestbook entry to local storage
function saveGuestbookEntry(entry) {
  try {
    // Get existing entries
    const storedEntries = localStorage.getItem('cyberdirector_guestbook');
    let entries = storedEntries ? JSON.parse(storedEntries) : [];
    
    // Add new entry
    entries.push(entry);
    
    // Save back to local storage
    localStorage.setItem('cyberdirector_guestbook', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving guestbook entry:', error);
  }
}

// Show thank you message
function showThankYouMessage() {
  // Create message container
  const message = document.createElement('div');
  message.style.position = 'fixed';
  message.style.top = '50%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.background = '#c0c0c0';
  message.style.border = '3px outset #ffffff';
  message.style.padding = '20px';
  message.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)';
  message.style.zIndex = '9999';
  message.style.textAlign = 'center';
  
  message.innerHTML = `
    <p style="margin: 0 0 10px 0; font-weight: bold;">Thank you for signing our guestbook!</p>
    <p style="margin: 0 0 15px 0; font-size: 12px;">Your message has been added to our digital memory.</p>
    <button id="thank-you-close" style="background: #c0c0c0; border: 2px outset #ffffff; padding: 3px 12px; cursor: pointer;">OK</button>
  `;
  
  document.body.appendChild(message);
  
  // Add event listener to close button
  document.getElementById('thank-you-close').addEventListener('click', function() {
    message.remove();
  });
  
  // Auto-close after 3 seconds
  setTimeout(function() {
    if (document.body.contains(message)) {
      message.remove();
    }
  }, 3000);
}

// Export for use in other files
window.VisitorCounter = VisitorCounter;
window.GuestbookEntry = GuestbookEntry;
