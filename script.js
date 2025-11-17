document.addEventListener('DOMContentLoaded', function() {
    const searchEngineSelect = document.getElementById('search-engine');
    const domainInput = document.getElementById('domain');
    const generateDorksBtn = document.getElementById('generate-dorks-btn');
    const resultsContainer = document.getElementById('results-container');
    
    // Search engine configurations
    const searchEngines = {
        google: {
            name: 'Google',
            baseUrl: 'https://www.google.com/search?q='
        },
        bing: {
            name: 'Bing',
            baseUrl: 'https://www.bing.com/search?q='
        },
        duckduckgo: {
            name: 'DuckDuckGo',
            baseUrl: 'https://duckduckgo.com/?q='
        },
        yahoo: {
            name: 'Yahoo',
            baseUrl: 'https://search.yahoo.com/search?p='
        },
        yandex: {
            name: 'Yandex',
            baseUrl: 'https://yandex.com/search/?text='
        },
        baidu: {
            name: 'Baidu',
            baseUrl: 'https://www.baidu.com/s?wd='
        }
    };
    
    // Dork categories from google-dorks.txt
    let dorkCategories = {};
    
    // Load dork categories from the hardcoded google-dorks.txt URL
    async function loadDorkCategories() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/h6nt3r/collection_payloads/refs/heads/main/google-dorks.txt');
            const text = await response.text();
            
            // Store the full text for later use
            window.dorkText = text;
        } catch (error) {
            console.error('Error loading dork categories:', error);
            showMessage('Error loading dorks from remote file.', 'error');
        }
    }
    
    // Get all dorks from the loaded text
    function getAllDorks() {
        if (!window.dorkText) return [];
        
        const lines = window.dorkText.split('\n');
        const dorks = [];
        
        lines.forEach(line => {
            // Skip empty lines and category headers (lines starting with #)
            if (line.trim() && !line.startsWith('#')) {
                dorks.push(line.trim());
            }
        });
        
        return dorks;
    }
    
    // Initialize the application
    loadDorkCategories();
    

    

    
    // Generate all dorks
    function generateAllDorks() {
        const domain = domainInput.value.trim();
        const selectedEngine = searchEngineSelect.value;
        
        if (!domain) {
            showMessage('Please enter a domain.', 'error');
            return;
        }
        
        const engine = searchEngines[selectedEngine];
        const allDorks = getAllDorks();
        
        if (!allDorks || allDorks.length === 0) {
            showMessage('No dorks available.', 'error');
            return;
        }
        
        let resultsHTML = '';
        
        allDorks.forEach(dork => {
            const processedDork = dork.replace('example.com', domain);
            const encodedDork = encodeURIComponent(processedDork);
            const dorkLink = `${engine.baseUrl}${encodedDork}`;
            
            resultsHTML += `
                <div class="result-item" data-url="${dorkLink}">
                    <input type="checkbox" class="result-checkbox">
                    <p>${formatDorkName(processedDork)}</p>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = resultsHTML;
         
         // Restore checked state from localStorage
         restoreCheckedState();
         
         // Add click event to each result item to open in new tab
         const resultItems = document.querySelectorAll('.result-item');
         resultItems.forEach(item => {
             // Add checkbox event listener
             const checkbox = item.querySelector('.result-checkbox');
             if (checkbox) {
                 
                 checkbox.addEventListener('change', function() {
                     if (this.checked) {
                         item.classList.add('checked');
                     } else {
                         item.classList.remove('checked');
                     }
                     saveCheckedState();
                 });
             }
             
             // Make entire result item clickable
             item.addEventListener('click', function(e) {
                 // Don't trigger if clicking on checkbox
                 if (e.target.type !== 'checkbox') {
                     const url = this.dataset.url;
                     if (url) {
                         window.open(url, '_blank');
                         // Mark as checked when opened
                         const checkbox = this.querySelector('.result-checkbox');
                         if (checkbox && !checkbox.checked) {
                             checkbox.checked = true;
                             this.classList.add('checked');
                             saveCheckedState();
                         }
                     }
                 }
             });
         });
    }
    
    // Function to save checked state to localStorage
    function saveCheckedState() {
        const checkedUrls = [];
        document.querySelectorAll('.result-checkbox:checked').forEach(checkbox => {
            const resultItem = checkbox.closest('.result-item');
            const url = resultItem.dataset.url;
            checkedUrls.push(url);
        });
        localStorage.setItem('checkedUrls', JSON.stringify(checkedUrls));
    }
    
    // Restore checked state from localStorage
    function restoreCheckedState() {
        const checkedUrls = JSON.parse(localStorage.getItem('checkedUrls') || '[]');
        document.querySelectorAll('.result-item').forEach(item => {
            const url = item.dataset.url;
            if (checkedUrls.includes(url)) {
                const checkbox = item.querySelector('.result-checkbox');
                checkbox.checked = true;
                item.classList.add('checked');
            }
        });
    }
    
    // Clear all checked states
    function clearCheckedState() {
        const checkedBoxes = document.querySelectorAll('.result-checkbox:checked');
        checkedBoxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('.result-item').classList.remove('checked');
        });
        localStorage.removeItem('checkedUrls');
    }

    

    
    // Format dork name for display
    function formatDorkName(dorkType) {
        return dorkType.charAt(0).toUpperCase() + dorkType.slice(1).replace(/([A-Z])/g, ' $1');
    }
    
    // Show message in results container
    function showMessage(message, type = 'info') {
        resultsContainer.innerHTML = `<div class="result-item"><p>${message}</p></div>`;
    }
    

    
    // Event listeners
    
    // Auto-generate when domain or search engine changes
    domainInput.addEventListener('input', function() {
        if (domainInput.value.trim()) {
            generateAllDorks();
        } else {
            resultsContainer.innerHTML = '<p>Results will appear here...</p>';
        }
    });
    
    // Auto-generate when search engine changes
    searchEngineSelect.addEventListener('change', function() {
        if (domainInput.value.trim()) {
            generateAllDorks();
        }
    });
    
    // Handle Enter key in domain input
    domainInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateAllDorks();
        }
    });
    
    // Generate dorks button click event
    generateDorksBtn.addEventListener('click', function() {
        generateAllDorks();
    });
});