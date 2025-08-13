// CyberDirector 2006 - Site Submission Handler
// Handles the submission of new sites to the directory

/**
 * Site submission handling for the CyberDirector website
 * Validates and processes user submissions for the directory
 */

// Main submission handler class
class SiteSubmissionHandler {
  constructor(localStorageKey = 'cyberdirector_submissions') {
    this.localStorageKey = localStorageKey;
    this.form = document.getElementById('submit-form');
    this.setupEventListeners();
  }
  
  // Set up event listeners
  setupEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }
  
  // Handle form submission
  handleSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const url = document.getElementById('site-url').value;
    const name = document.getElementById('site-name').value;
    const buttonUrl = document.getElementById('site-button').value;
    const description = document.getElementById('site-desc').value;
    const category = document.getElementById('category-select').value;
    
    // Validate form data
    if (!this.validateSubmission(url, name, description, category)) {
      return;
    }
    
    // Create submission object
    const submission = {
      id: Date.now(), // Use timestamp as temporary ID
      url: url,
      name: name,
      buttonUrl: buttonUrl || '',
      description: description,
      category: category,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Save submission
    this.saveSubmission(submission);
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset form
    this.form.reset();
  }
  
  // Validate the submission data
  validateSubmission(url, name, description, category) {
    let isValid = true;
    let errorMessage = '';
    
    // Check required fields
    if (!url) {
        // Save submission asynchronously
        this.saveSubmission(submission).then(() => {
          // Show success message
          this.showSuccessMessage();
          // Reset form
          this.form.reset();
        });
    } else if (!url.match(/^https?:\/\/.+/)) {
      errorMessage += 'Website URL must start with http:// or https://.\n';
      isValid = false;
    }
    
    if (!name) {
      errorMessage += 'Website Name is required.\n';
      isValid = false;
    }
    
    if (!description) {
      errorMessage += 'Description is required.\n';
      isValid = false;
    } else if (description.length > 200) {
      errorMessage += 'Description must be 200 characters or less.\n';
      isValid = false;
    }
    
    if (category === '' || category === undefined) {
      errorMessage += 'Category selection is required.\n';
      isValid = false;
    }
    
    // If not valid, show error and play sound
    if (!isValid) {
      this.playErrorSound();
      alert('ERROR! Please fix the following issues:\n\n' + errorMessage);
    }
    
    return isValid;
  }
  
  // Save the submission to local storage
  saveSubmission(submission) {
    try {
      // Get existing submissions
      const existingSubmissions = this.getSubmissions();
      
      // Add new submission
      existingSubmissions.push(submission);
      
      // Save to local storage
      localStorage.setItem(this.localStorageKey, JSON.stringify(existingSubmissions));
      
      async saveSubmission(submission) {
        try {
          const response = await fetch('https://<your-neon-project>.neon.tech/rest/v1/rpc/sites_post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              p_url: submission.url,
              p_title: submission.name,
              p_description: submission.description
            })
          });
          if (!response.ok) {
            throw new Error('Failed to submit site');
          }
          return true;
        } catch (error) {
          console.error('Error saving submission:', error);
          alert('Submission failed. Please try again later.');
          return false;
        }
      }
  
  // Show success message
  showSuccessMessage() {
    // Create a "Windows 98" style success alert
    const successBox = document.createElement('div');
    successBox.style.position = 'fixed';
    successBox.style.top = '50%';
    successBox.style.left = '50%';
    successBox.style.transform = 'translate(-50%, -50%)';
    successBox.style.width = '350px';
    successBox.style.background = '#c0c0c0';
    successBox.style.border = '3px outset #ffffff';
    successBox.style.padding = '2px';
    successBox.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)';
    successBox.style.zIndex = '9999';
    
    // Add header
    const header = document.createElement('div');
    header.style.background = '#000080';
    header.style.color = '#ffffff';
    header.style.padding = '3px 6px';
    header.style.fontWeight = 'bold';
    header.style.fontSize = '14px';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.innerHTML = `
      <span>Submission Successful</span>
      <span style="cursor: pointer;" id="success-close">×</span>
    `;
    
    // Create body
    const body = document.createElement('div');
    body.style.padding = '10px';
    body.style.fontSize = '12px';
    body.innerHTML = `
      <p><b>Thank you for your submission!</b></p>
      <p>Your site will be reviewed and added to the directory soon.</p>
    `;
    successBox.appendChild(header);
    successBox.appendChild(body);
    document.body.appendChild(successBox);
  }
