// CyberDirector 2006 - Search Engine Functions
// This file contains the core functionality for the Wiby-style search engine

/**
 * Search engine functionality for the CyberDirector website
 * Implements a simple search algorithm with terminal-like UI
 */

// Search class to handle various search operations
class DirectorySearch {
  constructor(directoryData) {
    this.directoryData = directoryData || [];
    this.searchIndex = this.buildSearchIndex();
  }
  
  // Create a simple search index from directory data
  buildSearchIndex() {
    const index = {};
    
    // Index each site
    this.directoryData.forEach(site => {
      // Add name tokens
      const nameTokens = this.tokenize(site.name);
      nameTokens.forEach(token => {
        if (!index[token]) {
          index[token] = [];
        }
        if (!index[token].includes(site.id)) {
          index[token].push(site.id);
        }
      });
      
      // Add description tokens
      const descTokens = this.tokenize(site.description);
      descTokens.forEach(token => {
        if (!index[token]) {
          index[token] = [];
        }
        if (!index[token].includes(site.id)) {
          index[token].push(site.id);
        }
      });
      
      // Add category as a token
      const categoryToken = site.category.toLowerCase();
      if (!index[categoryToken]) {
        index[categoryToken] = [];
      }
      if (!index[categoryToken].includes(site.id)) {
        index[categoryToken].push(site.id);
      }
    });
    
    return index;
  }
  
  // Split text into tokens, removing common words
  tokenize(text) {
    if (!text) return [];
    
    // Common words to exclude (stop words)
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 'to', 'of', 'for', 'with', 'on', 'at'];
    
    // Convert to lowercase, remove punctuation, and split into words
    const words = text.toLowerCase()
                       .replace(/[^\w\s]/g, '')
                       .split(/\s+/)
                       .filter(word => word.length > 1 && !stopWords.includes(word));
                       
    return words;
  }
  
  // Search the directory
  search(query) {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return [];
    }
    
    // Create score map for results
    const scoreMap = {};
    
    // Score each token match
    queryTokens.forEach(token => {
      const matchingSiteIds = this.searchIndex[token] || [];
      matchingSiteIds.forEach(siteId => {
        if (!scoreMap[siteId]) {
          scoreMap[siteId] = 0;
        }
        scoreMap[siteId] += 1;
      });
    });
    
    // Convert scores to array of results
    const results = Object.keys(scoreMap).map(siteId => {
      const site = this.directoryData.find(s => s.id === parseInt(siteId));
      return {
        site: site,
        score: scoreMap[siteId]
      };
    });
    
    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    // Return the site objects
    return results.map(result => result.site);
  }
  
  // Exact match search (much simpler alternative)
  simpleSearch(query) {
    if (!query || query.trim() === '') {
      return [];
    }
    
    query = query.toLowerCase().trim();
    
    return this.directoryData.filter(site => 
      site.name.toLowerCase().includes(query) || 
      site.description.toLowerCase().includes(query) ||
      site.category.toLowerCase().includes(query)
    );
  }
  
  // Generate ASCII art search results for terminal-like UI
  formatTerminalResults(results) {
    if (results.length === 0) {
      return `
+---------------------------------------------+
|               NO RESULTS FOUND              |
+---------------------------------------------+
|                                             |
|  Try different search terms or browse the   |
|  directory categories instead.              |
|                                             |
+---------------------------------------------+
      `;
    }
    
    let output = `
+---------------------------------------------+
|             SEARCH RESULTS (${results.length})              |
+---------------------------------------------+
`;
    
    results.forEach((site, index) => {
      output += `
| ${(index + 1).toString().padEnd(2)} | ${site.name.padEnd(38)} |
|    | ${site.url.substring(0, 36).padEnd(36)} |
|    | ${site.description.substring(0, 36).padEnd(36)} |
|    | Category: ${site.category.padEnd(28)} |
+---------------------------------------------+`;
    });
    
    return output;
  }
}

// Initialize search on page load
let searchEngine;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize with the directory data
  searchEngine = new DirectorySearch(directoryData);
  
  // Set up the search form
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results');
  
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const searchQuery = document.getElementById('search-input').value;
      
      if (searchQuery.length < 2) {
        playErrorSound();
        alert('Search query must be at least 2 characters!');
        return;
      }
      
      // Perform the search
      const results = searchEngine.search(searchQuery);
      
      // Display terminal-like results
      searchResults.style.fontFamily = '"Courier New", monospace';
      searchResults.style.whiteSpace = 'pre';
      searchResults.style.background = '#000000';
      searchResults.style.color = '#00FF00';
      searchResults.style.padding = '10px';
      searchResults.style.border = '1px solid #00FF00';
      searchResults.style.display = 'block';
      
      searchResults.innerHTML = `
==================================================
   CYBERDIRECTOR 2006 - SEARCH RESULTS           
==================================================
> search "${searchQuery}"

${searchEngine.formatTerminalResults(results)}

--------------------------------------------------
[END OF RESULTS]
      `;
      
      // Scroll to results
      searchResults.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// Export the search engine for use in other files
window.DirectorySearch = DirectorySearch;
