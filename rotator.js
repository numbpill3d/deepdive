// CyberDirector 2006 - 88x31 Button Rotator Widget
// A rotating widget displaying random 88x31 buttons from the directory

/**
 * ButtonRotator - A dreamy carousel of digital memories
 * Each pixel holds the fading echoes of a time when connections 
 * were made through hand-crafted buttons and shared across the
 * vast digital wilderness, lost signals searching for meaning.
 */
class ButtonRotator {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      containerId: options.containerId || 'button-container',
      buttonCount: options.buttonCount || this._randomInRange(3, 5),
      refreshInterval: options.refreshInterval || null,
      fadeDuration: options.fadeDuration || 800,
      dataSource: options.dataSource || window.directoryData || [],
      emptyMessage: options.emptyMessage || 'no_signal.finding.resonance',
      exportCode: options.enableExport || true
    };
    
    // Internal memory of digital fragments
    this._buttons = [];
    this._container = null;
    this._interval = null;
    this._fadeInProgress = false;
    
    // Initialize the rotator essence
    this._initializeMemory();
  }
  
  // Initialize the memory space where buttons will exist
  _initializeMemory() {
    // Find the vessel that will contain our fragments
    this._container = document.getElementById(this.config.containerId);
    if (!this._container) {
      console.error('ButtonRotator: Container not found in the void. Connection failed.');
      return;
    }
    
    // Ensure we have buttons to display
    if (!this.config.dataSource || this.config.dataSource.length === 0) {
      this._renderEmptyState();
      return;
    }
    
    // Clone the source data to avoid memory entanglement
    this._buttons = [...this.config.dataSource];
    
    // Render the initial state of existence
    this._renderButtons();
    
    // Set up auto-refresh if configured
    if (this.config.refreshInterval) {
      this._initializeAutoRefresh();
    }
    
    // Provide embed code if enabled
    if (this.config.exportCode) {
      this._createExportCodeOption();
    }
  }
  
  // Render a set of random buttons into the container
  _renderButtons() {
    // Clear the existing content
    this._container.innerHTML = '';
    
    // Shuffle the digital memories
    const shuffledButtons = this._shuffleArray([...this._buttons]);
    
    // Select a random number of buttons to display
    const buttonsToShow = shuffledButtons.slice(0, this.config.buttonCount);
    
    // Create each button element and append to container
    buttonsToShow.forEach(button => {
      // Create anchor element
      const link = document.createElement('a');
      link.href = button.url;
      link.target = '_blank';
      link.className = 'rotator-button-link';
      link.title = button.name + ' - ' + button.description;
      
      // Create image element
      const img = document.createElement('img');
      img.src = button.buttonUrl;
      img.width = 88;
      img.height = 31;
      img.alt = button.name;
      img.className = 'button88x31';
      img.style.opacity = '0';
      img.style.transition = `opacity ${this.config.fadeDuration}ms ease`;
      
      // Append image to link and link to container
      link.appendChild(img);
      this._container.appendChild(link);
      
      // Trigger fade-in after a small delay to ensure CSS transition works
      setTimeout(() => {
        img.style.opacity = '1';
      }, 10);
    });
  }
  
  // Initialize auto-refresh functionality
  _initializeAutoRefresh() {
    // Clear any existing interval
    if (this._interval) {
      clearInterval(this._interval);
    }
    
    // Set new interval for refreshing buttons
    this._interval = setInterval(() => {
      this.refreshButtons();
    }, this.config.refreshInterval);
  }
  
  // Refresh the buttons with a new random set
  refreshButtons() {
    // Don't refresh if a fade is already in progress
    if (this._fadeInProgress) return;
    
    this._fadeInProgress = true;
    
    // Fade out existing buttons
    const buttons = this._container.querySelectorAll('.button88x31');
    buttons.forEach(button => {
      button.style.opacity = '0';
    });
    
    // Wait for fade out, then render new buttons
    setTimeout(() => {
      this._renderButtons();
      this._fadeInProgress = false;
    }, this.config.fadeDuration);
  }
  
  // Render empty state when no buttons are available
  _renderEmptyState() {
    this._container.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 10px; font-family: 'Courier New', monospace; color: #666;">
        <div style="border: 1px dashed #999; padding: 5px; width: 88px; height: 31px; display: inline-block;">
          ${this.config.emptyMessage}
        </div>
      </div>
    `;
  }
  
  // Create export code option for users to embed the widget
  _createExportCodeOption() {
    // Create container for the export option
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-code-container';
    exportContainer.style.textAlign = 'center';
    exportContainer.style.marginTop = '8px';
    exportContainer.style.fontSize = '10px';
    
    // Create the link to show the embed code
    const exportLink = document.createElement('a');
    exportLink.href = '#';
    exportLink.textContent = 'Get HTML Code for Your Site';
    exportLink.style.color = '#666666';
    exportLink.style.textDecoration = 'underline';
    
    // Event listener for showing the embed code
    exportLink.addEventListener('click', (e) => {
      e.preventDefault();
      this._showEmbedCode();
    });
    
    exportContainer.appendChild(exportLink);
    
    // Add export container after the buttons container
    if (this._container.parentNode) {
      this._container.parentNode.insertBefore(exportContainer, this._container.nextSibling);
    }
  }
  
  // Show embed code in a Windows 98-style dialog
  _showEmbedCode() {
    // Create the embed code
    const embedCode = `<!-- CyberDirector 88x31 Button Rotator Widget -->
<script src="http://cyberdirector.example.com/widget.js"></script>
<div id="cyberdirector-buttons"></div>
<script>
  new ButtonRotator({
    containerId: 'cyberdirector-buttons',
    buttonCount: ${this.config.buttonCount}
  });
</script>
<!-- End of CyberDirector Widget -->`;
    
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
      <span>Embed Button Rotator on Your Site</span>
      <span style="cursor: pointer;" id="embed-close">×</span>
    `;
    
    // Create dialog body
    const body = document.createElement('div');
    body.style.padding = '10px';
    
    // Create textarea for the code
    const textarea = document.createElement('textarea');
    textarea.value = embedCode;
    textarea.style.width = '100%';
    textarea.style.height = '120px';
    textarea.style.fontFamily = 'monospace';
    textarea.style.fontSize = '12px';
    textarea.style.padding = '5px';
    textarea.style.background = '#ffffcc';
    textarea.style.border = '2px inset #ffffff';
    textarea.style.resize = 'none';
    
    // Create instructions
    const instructions = document.createElement('p');
    instructions.style.fontSize = '11px';
    instructions.style.margin = '10px 0';
    instructions.textContent = 'Copy and paste this code to your website to display the CyberDirector button rotator!';
    
    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.style.background = '#c0c0c0';
    closeButton.style.border = '2px outset #ffffff';
    closeButton.style.padding = '3px 12px';
    closeButton.style.cursor = 'pointer';
    
    // Add elements to the dialog
    buttonContainer.appendChild(closeButton);
    body.appendChild(instructions);
    body.appendChild(textarea);
    body.appendChild(buttonContainer);
    dialog.appendChild(header);
    dialog.appendChild(body);
    
    // Add dialog to the document
    document.body.appendChild(dialog);
    
    // Auto-select the code
    textarea.select();
    
    // Add event listeners for closing
    document.getElementById('embed-close').addEventListener('click', () => {
      dialog.remove();
    });
    
    closeButton.addEventListener('click', () => {
      dialog.remove();
    });
  }
  
  // Utility: Random number between min and max (inclusive)
  _randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Utility: Shuffle array (Fisher-Yates algorithm)
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // --- Public API ---
  
  // Manually refresh the buttons
  refresh() {
    this.refreshButtons();
  }
  
  // Change the number of buttons displayed
  setButtonCount(count) {
    if (typeof count !== 'number' || count < 1) {
      console.error('ButtonRotator: Invalid button count. Must be a positive number.');
      return;
    }
    
    this.config.buttonCount = count;
    this.refreshButtons();
  }
  
  // Start automatic refresh
  startAutoRefresh(interval) {
    if (typeof interval !== 'number' || interval < 1000) {
      console.error('ButtonRotator: Invalid interval. Must be at least 1000ms.');
      return;
    }
    
    this.config.refreshInterval = interval;
    this._initializeAutoRefresh();
  }
  
  // Stop automatic refresh
  stopAutoRefresh() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
  
  // Destroy the rotator and clean up
  destroy() {
    this.stopAutoRefresh();
    if (this._container) {
      this._container.innerHTML = '';
    }
    
    // Remove export code link if present
    const exportLink = document.querySelector('.export-code-container');
    if (exportLink && exportLink.parentNode) {
      exportLink.parentNode.removeChild(exportLink);
    }
  }
}

// Initialize button rotator on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if container exists
  if (document.getElementById('button-container')) {
    // Initialize with default settings
    window.buttonRotator = new ButtonRotator({
      containerId: 'button-container',
      refreshInterval: 10000, // Refresh every 10 seconds
      enableExport: true
    });
  }
});

// Export ButtonRotator for use in other files
window.ButtonRotator = ButtonRotator;
