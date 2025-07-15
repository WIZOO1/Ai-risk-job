// Main application JavaScript for AI Job Risk Assessment

// Global variables
let currentAssessment = null;
let jobSuggestions = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadJobSuggestions();
});

// Initialize application
function initializeApp() {
  console.log('AI Job Risk Assessment App initialized');
  
  // Set up AdSense if available
  if (window.adsbygoogle) {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log('AdSense not available');
    }
  }
}

// Setup event listeners
function setupEventListeners() {
  // Job title input autocomplete
  const jobInput = document.getElementById('job-input');
  if (jobInput) {
    jobInput.addEventListener('input', handleJobInputChange);
    jobInput.addEventListener('keydown', handleJobInputKeydown);
  }

  // Assessment form submission
  const assessmentForm = document.getElementById('assessment-form');
  if (assessmentForm) {
    assessmentForm.addEventListener('submit', handleAssessmentSubmit);
  }

  // Share buttons
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', handleShareClick);
  });

  // Navigation menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Newsletter subscription
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
}

// Load job suggestions for autocomplete
async function loadJobSuggestions() {
  try {
    const response = await fetch('/api/jobs');
    if (response.ok) {
      jobSuggestions = await response.json();
    }
  } catch (error) {
    console.error('Failed to load job suggestions:', error);
  }
}

// Handle job input changes for autocomplete
function handleJobInputChange(event) {
  const input = event.target;
  const value = input.value.toLowerCase();
  
  if (value.length < 2) {
    hideJobSuggestions();
    return;
  }

  const suggestions = jobSuggestions.filter(job => 
    job.title.toLowerCase().includes(value)
  ).slice(0, 10);

  showJobSuggestions(suggestions, input);
}

// Handle keyboard navigation in job input
function handleJobInputKeydown(event) {
  const suggestionsList = document.getElementById('job-suggestions');
  if (!suggestionsList) return;

  const suggestions = suggestionsList.querySelectorAll('.suggestion-item');
  const currentActive = suggestionsList.querySelector('.active');

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      navigateSuggestions(suggestions, currentActive, 'down');
      break;
    case 'ArrowUp':
      event.preventDefault();
      navigateSuggestions(suggestions, currentActive, 'up');
      break;
    case 'Enter':
      event.preventDefault();
      if (currentActive) {
        selectSuggestion(currentActive.textContent);
      } else {
        handleAssessmentSubmit(event);
      }
      break;
    case 'Escape':
      hideJobSuggestions();
      break;
  }
}

// Navigate through suggestions with keyboard
function navigateSuggestions(suggestions, currentActive, direction) {
  if (suggestions.length === 0) return;

  let newIndex = -1;
  
  if (currentActive) {
    const currentIndex = Array.from(suggestions).indexOf(currentActive);
    newIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;
  } else {
    newIndex = direction === 'down' ? 0 : suggestions.length - 1;
  }

  // Wrap around
  if (newIndex < 0) newIndex = suggestions.length - 1;
  if (newIndex >= suggestions.length) newIndex = 0;

  // Update active state
  suggestions.forEach(s => s.classList.remove('active'));
  suggestions[newIndex].classList.add('active');
}

// Show job suggestions dropdown
function showJobSuggestions(suggestions, input) {
  hideJobSuggestions();

  if (suggestions.length === 0) return;

  const suggestionsList = document.createElement('div');
  suggestionsList.id = 'job-suggestions';
  suggestionsList.className = 'absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto';

  suggestions.forEach(job => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item px-4 py-2 hover:bg-gray-100 cursor-pointer';
    suggestionItem.textContent = job.title;
    suggestionItem.addEventListener('click', () => selectSuggestion(job.title));
    suggestionsList.appendChild(suggestionItem);
  });

  input.parentNode.appendChild(suggestionsList);
}

// Hide job suggestions dropdown
function hideJobSuggestions() {
  const suggestionsList = document.getElementById('job-suggestions');
  if (suggestionsList) {
    suggestionsList.remove();
  }
}

// Select a job suggestion
function selectSuggestion(jobTitle) {
  const jobInput = document.getElementById('job-input');
  if (jobInput) {
    jobInput.value = jobTitle;
    hideJobSuggestions();
    jobInput.focus();
  }
}

// Handle assessment form submission
async function handleAssessmentSubmit(event) {
  event.preventDefault();
  
  const jobInput = document.getElementById('job-input');
  const jobTitle = jobInput.value.trim();
  
  if (!jobTitle) {
    showError('Please enter a job title');
    return;
  }

  showLoading(true);
  
  try {
    const response = await fetch('/api/assess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobTitle })
    });

    if (response.ok) {
      const result = await response.json();
      currentAssessment = result;
      showAssessmentResults(result);
    } else {
      const error = await response.json();
      showError(error.message || 'Assessment failed');
    }
  } catch (error) {
    showError('Network error. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Show loading state
function showLoading(show) {
  const loadingEl = document.getElementById('loading');
  const submitBtn = document.getElementById('submit-btn');
  
  if (loadingEl) {
    loadingEl.style.display = show ? 'block' : 'none';
  }
  
  if (submitBtn) {
    submitBtn.disabled = show;
    submitBtn.textContent = show ? 'Analyzing...' : 'Analyze Job Risk';
  }
}

// Show assessment results
function showAssessmentResults(result) {
  const resultsContainer = document.getElementById('assessment-results');
  if (!resultsContainer) return;

  resultsContainer.innerHTML = `
    <div class="assessment-result-card">
      <h2 class="text-2xl font-bold mb-4">Assessment Results for: ${result.jobTitle}</h2>
      
      <div class="risk-score">
        <div class="risk-meter">
          <div class="risk-level" style="width: ${result.risk}%"></div>
        </div>
        <p class="risk-text">AI Replacement Risk: ${result.risk}%</p>
      </div>

      <div class="result-details">
        <div class="detail-item">
          <h3>Timeline</h3>
          <p>${result.years}</p>
        </div>
        
        <div class="detail-item">
          <h3>Safety Index</h3>
          <p>${result.safety}/100</p>
        </div>
        
        <div class="detail-item">
          <h3>Industry Category</h3>
          <p>${result.category}</p>
        </div>
      </div>

      <div class="skills-recommendations">
        <h3>Recommended Skills to Develop</h3>
        <ul>
          ${result.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      </div>

      <div class="action-buttons">
        <button id="share-result" class="share-btn btn-primary">Share Results</button>
        <button id="new-assessment" class="btn-secondary">New Assessment</button>
      </div>
    </div>
  `;

  // Setup result action buttons
  document.getElementById('share-result').addEventListener('click', handleShareClick);
  document.getElementById('new-assessment').addEventListener('click', resetAssessment);

  resultsContainer.style.display = 'block';
}

// Handle share button click
function handleShareClick(event) {
  const platform = event.target.dataset.platform;
  
  if (!currentAssessment) return;

  const shareText = `I just assessed my job's AI replacement risk: ${currentAssessment.risk}% risk for ${currentAssessment.jobTitle}. Check your risk at`;
  const shareUrl = window.location.origin;

  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
      break;
    case 'linkedin':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
      break;
    default:
      // Copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        showSuccessMessage('Results copied to clipboard!');
      });
  }
}

// Reset assessment for new analysis
function resetAssessment() {
  currentAssessment = null;
  document.getElementById('job-input').value = '';
  document.getElementById('assessment-results').style.display = 'none';
  document.getElementById('job-input').focus();
}

// Toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
}

// Handle newsletter subscription
async function handleNewsletterSubmit(event) {
  event.preventDefault();
  
  const emailInput = event.target.querySelector('input[type="email"]');
  const email = emailInput.value.trim();
  
  if (!email) {
    showError('Please enter a valid email address');
    return;
  }

  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      showSuccessMessage('Successfully subscribed to newsletter!');
      emailInput.value = '';
    } else {
      showError('Subscription failed. Please try again.');
    }
  } catch (error) {
    showError('Network error. Please try again.');
  }
}

// Utility functions
function showError(message) {
  const errorEl = document.getElementById('error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 5000);
  }
}

function showSuccessMessage(message) {
  const successEl = document.getElementById('success-message');
  if (successEl) {
    successEl.textContent = message;
    successEl.style.display = 'block';
    setTimeout(() => successEl.style.display = 'none', 3000);
  }
}

// Analytics tracking
function trackEvent(eventName, properties = {}) {
  if (window.gtag) {
    gtag('event', eventName, properties);
  }
  
  if (window.analytics) {
    analytics.track(eventName, properties);
  }
}

// Performance monitoring
function measurePerformance() {
  if (window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    
    trackEvent('page_load_time', {
      load_time: loadTime,
      page: window.location.pathname
    });
  }
}

// Initialize performance monitoring
setTimeout(measurePerformance, 1000);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadJobSuggestions,
    handleAssessmentSubmit,
    showAssessmentResults,
    trackEvent
  };
}