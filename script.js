// CyberDirector 2006 - Main JavaScript Functions
// This would be linked in the HTML file and contains all functionality

// Directory data will be loaded from backend
let directoryData = [];

// Categories for the directory
const categories = [
    {id: "all", name: "All Sites"},
    {id: "art", name: "Pixel Art & Graphics"},
    {id: "web", name: "Web Development"},
    {id: "nostalgia", name: "Web Nostalgia"},
    {id: "code", name: "Code & Programming"},
    {id: "gaming", name: "Retro Gaming"}
];

// Initialize when document is loaded
document.addEventListener("DOMContentLoaded", async function() {
    // Show loading screen
    showLoadingScreen();
    // Fetch directory data from backend
    try {
        const response = await fetch('https://<your-neon-project>.neon.tech/rest/v1/rpc/sites_get');
        if (response.ok) {
            directoryData = await response.json();
        } else {
            directoryData = [];
        }
    } catch (err) {
        directoryData = [];
    }
    // Initialize components after "loading"
    setTimeout(function() {
        hideLoadingScreen();
        initializeDirectory();
        initializeButtonRotator();
        initializeSearchEngine();
        initializeVisitorCounter();
        setupEventListeners();
        // Maybe show a popup ad
        setTimeout(showRandomPopupAd, 30000);
    }, 3000);
});

// Loading screen functions
function showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    const progress = document.getElementById("progress");
    
    loadingScreen.style.display = "flex";
    
    // Simulate progress
    setTimeout(function() { progress.style.width = "30%"; }, 500);
    setTimeout(function() { progress.style.width = "60%"; }, 1200);
    setTimeout(function() { progress.style.width = "90%"; }, 2000);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none";
}

// Initialize directory with links
function initializeDirectory() {
    // Populate categories
    const categorySelector = document.getElementById("category-select");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelector.appendChild(option);
    });
    
    // Create directory sections
    const directorySectionContainer = document.getElementById("directory-container");
    
    // Group links by category
    const groupedLinks = {};
    categories.forEach(cat => {
        if (cat.id !== "all") {
            groupedLinks[cat.id] = directoryData.filter(link => link.category === cat.id);
        }
    });
    
    // Create sections for each category
    for (const category in groupedLinks) {
        if (groupedLinks[category].length > 0) {
            const section = document.createElement("div");
            section.className = "directory-section";
            const catName = categories.find(c => c.id === category).name;
            
            section.innerHTML = `
                <h3>${catName}</h3>
                <div class="directory-links" id="category-${category}">
                </div>
            `;
            
            directorySectionContainer.appendChild(section);
            
            // Add links to this category
            const linksContainer = document.getElementById(`category-${category}`);
            groupedLinks[category].forEach(link => {
                const linkEl = document.createElement("div");
                linkEl.className = "directory-link";
                linkEl.innerHTML = `
                    <a href="${link.url}" target="_blank">${link.name}</a>
                    <p>${link.description}</p>
                `;
                linksContainer.appendChild(linkEl);
            });
        }
    }
}

// Initialize the button rotator
function initializeButtonRotator() {
    const container = document.getElementById("button-container");
    const buttons = directoryData.slice(0);  // Clone the array
    
    // Shuffle the buttons array
    for (let i = buttons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }
    
    // Clear the container first
    container.innerHTML = '';
    
    // Display 3-5 random buttons
    const numToShow = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numToShow && i < buttons.length; i++) {
        const button = document.createElement("a");
        button.href = buttons[i].url;
        button.target = "_blank";
        
        const img = document.createElement("img");
        img.src = buttons[i].buttonUrl;
        img.width = 88;
        img.height = 31;
        img.className = "button88x31";
        img.alt = buttons[i].name;
        
        button.appendChild(img);
        container.appendChild(button);
    }
}

// Initialize the search engine
function initializeSearchEngine() {
    const searchForm = document.getElementById("search-form");
    const searchResults = document.getElementById("search-results");
    
    // Initially hide search results
    searchResults.style.display = "none";
    
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
        if (searchQuery.length < 2) {
            playErrorSound();
            alert("Please enter at least 2 characters to search!");
            return;
        }
        
        // Clear previous results
        searchResults.innerHTML = "";
        
        // Find matching results
        const results = directoryData.filter(item => 
            item.name.toLowerCase().includes(searchQuery) || 
            item.description.toLowerCase().includes(searchQuery)
        );
        
        // Show the results container
        searchResults.style.display = "block";
        
        // Display results
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results" style="color: #00ff00;">No results found. Try a different search term.</p>';
        } else {
            const resultsHeader = document.createElement("h3");
            resultsHeader.textContent = `Found ${results.length} result(s) for "${searchQuery}"`;
            searchResults.appendChild(resultsHeader);
            
            results.forEach(result => {
                const resultItem = document.createElement("div");
                resultItem.className = "search-result";
                
                let buttonHtml = '';
                if (result.buttonUrl) {
                    buttonHtml = `<img src="${result.buttonUrl}" width="88" height="31" class="button88x31" alt="${result.name}">`;
                }
                
                resultItem.innerHTML = `
                    <div class="result-header">
                        <a href="${result.url}" target="_blank">${result.name}</a>
                        ${buttonHtml}
                    </div>
                    <p class="result-description">${result.description}</p>
                    <p class="result-category">Category: ${categories.find(c => c.id === result.category).name}</p>
                `;
                
                searchResults.appendChild(resultItem);
            });
        }
        
        // Scroll to results
        searchResults.scrollIntoView({behavior: 'smooth'});
    });
}

// Initialize the visitor counter
function initializeVisitorCounter() {
    // Generate a random number between 10000 and 99999
    const visits = Math.floor(Math.random() * 90000) + 10000;
    const counter = document.getElementById("visit-count");
    counter.textContent = visits.toString();
}

// Handle form submission and other event listeners
function setupEventListeners() {
    const submitForm = document.getElementById("submit-form");
    submitForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Validate the form
        const url = document.getElementById("site-url").value;
        const name = document.getElementById("site-name").value;
        const desc = document.getElementById("site-desc").value;
        
        if (!url || !name || !desc) {
            playErrorSound();
            alert("Please fill in all required fields!");
            return;
        }
        
        // Show success message
        alert("Thanks for your submission! Your site will be reviewed and added to the directory soon!");
        submitForm.reset();
    });
    
    // "Surprise Me" button
    const surpriseButton = document.getElementById("surprise-me");
    if (surpriseButton) {
        surpriseButton.addEventListener("click", function() {
            const randomIndex = Math.floor(Math.random() * directoryData.length);
            window.open(directoryData[randomIndex].url, '_blank');
        });
    }
    
    // Setup Konami code easter egg
    setupKonamiCode();
}

// Konami code easter egg
function setupKonamiCode() {
    let konamiIndex = 0;
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right B A
    
    document.addEventListener("keydown", function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                showAdminConsole();
            }
        } else {
            konamiIndex = 0;
        }
    });
}

// Play the classic Windows XP error sound
function playErrorSound() {
    const audio = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNYDH4YMgp0MWgQAZG/ILNYDH4YMgp0MhgL5jIH0R/QEe/DtZAEMB/0hGwXM8L5+DkQ1/2xjPHk6c+j3nj+b9AyLkInEgG4OURtCDvZg7OXiGBTFLYI0EUKh4YhZxGzGQhF0TehDCiRAf1QXmvs9zZqszhDATNy/Z9fXwAfXTgPAJG2F7U+IzQzEblbGFJaSI50riSQpVJo/YtaOQlEVAWMgErwQczIWdQNnwn9mW1W0aDaTSb+C/JlKTJJBYwcP3eiyqJ8880A5FpuUsvCUwpNAq4ubWMRH8PFvKPluCwXjcUDcF6cJBH+KU0vomLA0CAwEAAQ==");
    audio.play();
}

// Show a random popup ad
function showRandomPopupAd() {
    const popupAds = [
        {
            title: "FREE HOT CYBERWEB ACCESS!!",
            content: "Sign up for our BLAZING FAST 56k dial-up service! First month FREE!",
            position: {top: "20%", left: "30%"}
        },
        {
            title: "WIN A FREE PC!!!",
            content: "You are the 1,000,000th visitor! CLICK HERE to claim your Pentium III prize!",
            position: {top: "40%", left: "50%"}
        },
        {
            title: "AMAZING FONT COLLECTION!",
            content: "Download 5,000+ pixel and web fonts! Perfect for your GeoCities page!",
            position: {top: "30%", left: "40%"}
        }
    ];
    
    // Select a random ad
    const ad = popupAds[Math.floor(Math.random() * popupAds.length)];
    
    // Create popup element
    const popup = document.createElement("div");
    popup.className = "popup-ad";
    popup.style.top = ad.position.top;
    popup.style.left = ad.position.left;
    
    popup.innerHTML = `
        <h4 style="margin: 0; color: #cc0000; text-align: center; font-family: 'Comic Sans MS', cursive;">${ad.title}</h4>
        <div style="text-align: center; padding: 10px; font-size: 12px;">${ad.content}</div>
        <div style="text-align: center;">
            <button style="background: #ffcc00; font-weight: bold; border: 2px outset #ffaa00; padding: 3px 8px; cursor: pointer;">CLICK HERE!!!</button>
        </div>
        <span class="close-button">X</span>
    `;
    
    document.body.appendChild(popup);
    
    // Display the popup
    setTimeout(() => {
        popup.style.display = "block";
    }, 500);
    
    // Add event listener to close button
    popup.querySelector(".close-button").addEventListener("click", function() {
        popup.remove();
    });
    
    // Add event listener to button (just closes the popup)
    popup.querySelector("button").addEventListener("click", function() {
        popup.remove();
    });
}

// Admin console easter egg
function showAdminConsole() {
    // Create a hacker-style terminal interface
    const terminal = document.createElement("div");
    terminal.style.position = "fixed";
    terminal.style.top = "10%";
    terminal.style.left = "10%";
    terminal.style.width = "80%";
    terminal.style.height = "80%";
    terminal.style.backgroundColor = "#000000";
    terminal.style.color = "#00ff00";
    terminal.style.padding = "10px";
    terminal.style.fontFamily = "monospace";
    terminal.style.zIndex = "10000";
    terminal.style.overflow = "auto";
    terminal.style.border = "2px solid #00ff00";
    terminal.style.boxShadow = "0 0 20px #00ff00";
    
    // Add content to the terminal
    terminal.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <pre>
  _______       __                  ______  _               __           
 / ___  /_____ / /_  ___   _____   / ____/ (_)_____  ___   / /_ ____  _____
/ /__/ // __  / __ \\/ _ \\ / ___/  / /     / // ___/ / _ \\ / __// __ \\/ ___/
\\___  // /_/ / /_/ /  __// /     / /___  / // /__  /  __// /_ / /_/ / /    
/___/ / \\__,_/_.___/\\___//_/      \\____/ /_/ \\___/  \\___/ \\__/ \\____/_/     
                                                                            
 ___     ______   __  __   ___    __  __     __    ____  ___     _   __  _____  ____
|__ \\   / ____/  / / / /  /   |  / / / /    / /   / __/ /   |   / | / / /_  _/ / __ \\
__/ /  / /      / / / /  / /| | / / / /    / /   / /   / /| |  /  |/ /   / /  / /_/ /
/ __/  / /___   / /_/ /  / ___ |/ /_/ /    / /___/ /___/ ___ | / /|  /   / /  / _, _/
/____/  \\____/   \\____/  /_/  |_|\\____/    /_____/\\____/_/  |_|/_/ |_/   /_/  /_/ |_|
                    </pre>
        </div>
        <div id="terminal-output">
            <p>> SYSTEM INITIALIZED...</p>
            <p>> ACCESS GRANTED TO LEVEL 7 ADMIN TERMINAL</p>
            <p>> WELCOME, CYBERDIRECTOR ADMINISTRATOR</p>
            <p>> DISPLAYING SYSTEM STATUS:</p>
            <p>   - SITES IN DATABASE: ${directoryData.length}</p>
            <p>   - PENDING APPROVALS: 13</p>
            <p>   - SERVER LOAD: 72%</p>
            <p>   - LAST BACKUP: 2006-03-17 04:23:17</p>
            <p>   - UPTIME: 63 DAYS, 11 HOURS, 47 MINUTES</p>
            <p>> TYPE 'HELP' FOR COMMANDS</p>
        </div>
        <div style="display: flex; margin-top: 10px;">
            <span>> </span>
            <input type="text" id="terminal-input" style="flex-grow: 1; background: black; color: #00ff00; border: none; outline: none; font-family: monospace;">
        </div>
    `;
    
    document.body.appendChild(terminal);
    
    // Focus on the input
    const input = document.getElementById("terminal-input");
    input.focus();
    
    // Handle terminal commands
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            const command = input.value.trim().toLowerCase();
            const output = document.getElementById("terminal-output");
            
            // Add the command to the output
            const commandLine = document.createElement("p");
            commandLine.innerHTML = `> ${input.value}`;
            output.appendChild(commandLine);
            
            // Process commands
            processCommand(command, output);
            
            // Clear the input
            input.value = "";
            
            // Scroll to the bottom
            terminal.scrollTop = terminal.scrollHeight;
        }
    });
    
    // Add close button
    const closeButton = document.createElement("div");
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontWeight = "bold";
    closeButton.style.color = "#ff0000";
    
    closeButton.addEventListener("click", function() {
        terminal.remove();
    });
    
    terminal.appendChild(closeButton);
}

// Process admin console commands
function processCommand(command, output) {
    if (command === "help") {
        const helpText = document.createElement("div");
        helpText.innerHTML = `
            <p>AVAILABLE COMMANDS:</p>
            <p>   - HELP: Display this help message</p>
            <p>   - LIST: List all sites in the directory</p>
            <p>   - PENDING: Show pending submissions</p>
            <p>   - STATUS: Display system status</p>
            <p>   - CLEAR: Clear the terminal screen</p>
            <p>   - EXIT: Close the terminal</p>
        `;
        output.appendChild(helpText);
    } else if (command === "list") {
        const listText = document.createElement("div");
        listText.innerHTML = `
            <p>LISTING ALL SITES IN DATABASE:</p>
        `;
        
        directoryData.forEach((site, index) => {
            listText.innerHTML += `<p>   ${index+1}. ${site.name} (${site.url}) - ${site.category}</p>`;
        });
        
        output.appendChild(listText);
    } else if (command === "pending") {
        const pendingText = document.createElement("div");
        pendingText.innerHTML = `
            <p>PENDING SUBMISSIONS:</p>
            <p>   1. CoolWebDesigns (http://example.com/cooldesigns) - design</p>
            <p>   2. RetroWeb Archive (http://example.com/retroweb) - nostalgia</p>
            <p>   3. PixelArtGallery (http://example.com/pixelart) - art</p>
            <p>   ...</p>
            <p>   [10 more entries]</p>
        `;
        output.appendChild(pendingText);
    } else if (command === "status") {
        const statusText = document.createElement("div");
        statusText.innerHTML = `
            <p>SYSTEM STATUS:</p>
            <p>   - SITES IN DATABASE: ${directoryData.length}</p>
            <p>   - PENDING APPROVALS: 13</p>
            <p>   - SERVER LOAD: ${Math.floor(Math.random() * 30) + 60}%</p>
            <p>   - LAST BACKUP: 2006-03-17 04:23:17</p>
            <p>   - UPTIME: 63 DAYS, 11 HOURS, ${Math.floor(Math.random() * 60)} MINUTES</p>
            <p>   - MEMORY USAGE: ${Math.floor(Math.random() * 20) + 70}%</p>
            <p>   - CPU USAGE: ${Math.floor(Math.random() * 40) + 30}%</p>
            <p>   - DISK SPACE: ${Math.floor(Math.random() * 30) + 40}% USED</p>
        `;
        output.appendChild(statusText);
    } else if (command === "clear") {
        output.innerHTML = "";
    } else if (command === "exit") {
        const terminal = output.closest("div[style*='position: fixed']");
        if (terminal) {
            terminal.remove();
        }
    } else {
        const errorText = document.createElement("p");
        errorText.innerHTML = `COMMAND NOT RECOGNIZED: '${command}'. TYPE 'HELP' FOR AVAILABLE COMMANDS.`;
        errorText.style.color = "#ff0000";
        output.appendChild(errorText);
    }
}
