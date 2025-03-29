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
      errorMessage += 'Website URL is required.\n';
      isValid = false;
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
      
      return true;
    } catch (error) {
      console.error('Error saving submission:', error);
      return false;
    }
  }
  
  // Get existing submissions from local storage
  getSubmissions() {
    try {
      const submissions = localStorage.getItem(this.localStorageKey);
      return submissions ? JSON.parse(submissions) : [];
    } catch (error) {
      console.error('Error getting submissions:', error);
      return [];
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
    P+uAP+kAP+vAP+wAP+rAP+yAP+zAP+0AP+1AP+2AP+3AP+4AP+xAP+5AP+6AP+8AP+9AP++AP+7AP+/AP/AAP/BAP/CAP/DAP/EAP/FAP/GAP/HAP/IAP/JAP/KAP/LAP/MAP/NAP/OAP/PAP/QAP/RAP/SAP/TAP/UAP/VAP/WAP/XAP/YAP/ZAP/bAP/cAP/aAP/dAP/eAP/fAP/gAP/hAP/iAP/jAP/kAP/lAP/mAP/nAP/pAP/qAP/oAP/rAP/tAP/uAP/sAP/vAP/wAP/xAP/yAP/zAP/0AP/1AP/2AP/3AP/4AP/5AP/7AP/8AP/6AP/9AP/+AP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAIAAgAAAI/wABCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaJFhNYeUdS48aHGixkzlgDwYAAHJzgSOAFgcQCDkgMnKHhCsqSAJxeekBTJoQNMhwsKUNjQgcMEnyA3yHw0QYIHmzVzpiA64MEUKRKkTJEyJQqTJjt2COVQhcIUKleuaMGiRcsVLVmaYO3aJewTCmbNakG7JYsWLlrSptWiBcsVJF++WEVLRckRHFiSVKhQRIIECTx4iFXLlk2XmDKdkBkjZswYMmXMnKFyVIcOHGfYtTuD7h07duvMkRs3Ll06cdo8lfqEiZOoUJ5CefLkiZOnTHg2cfrkCdSePqJAhRpFqvQnUP9BQ40aRar1ptSnPqFKdeq1qlWuNHHy9ImUrE9NlixZwqS6kyXYsd/XbqSJlCjtuTcFFFKEYcZ+Z6SBRhtwiPGGGWXEkcZ+bKhRRhpspLFGG3KwUUYaebRRRx557LFHHX7okYcff+zhByB/BCKIIIQUUoghiCSimCB3VXYXXnntxddfjukFnmd9BSaYYoYNZhhffBG2F2KFJUbZZJFN1ldfgxWmpF6EXdaXZnddltlheG12WV+e7fVZZn1x5tlnfYU2GmmceaZXZqOhZhovmZn2WGaZiaalX3P+xdllp5WGWmqqscYaa7DB1lpqsG1G22yu0VYbbbfhlltuveVG3G/38fabbcANJ9xxySV33G7JLbdcc81FR52O1lXnXXbaZceddd9xJ96N1pVHXnnleUdeeuqJ5956N5KH3o3snZfefjfGJ+N89s1434z78dcffgH2599//QU44IEEHohggQguyN+CDD4YYYQTVnghhBluyGGHG3r4YYYhbljiiB+WmOKJKa7YYosvxjhjjDPWWOONOa6YY449/hhkkEMWmeSRSS7Z5JNRTlnllVlu2eWXYY5Z5plDAgEAOw==" width="32" height="32">
        </div>
        <div>
          <p><b>Thank you for your submission!</b></p>
          <p>Your site will be reviewed and added to the directory soon.</p>
        </div>
      </div>
      <div style="display: flex; margin-bottom: 10px;">
        <div style="margin-right: 10px;">
          <img src="data:image/gif;base64,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" width="32" height="32">
        </div>
        <div>
          <p><b>Thank you for your submission!</b></p>
          <p>Your site will be reviewed and added to the directory soon.</p>
        </div>
      </div>
