document.addEventListener('DOMContentLoaded', function() {
    const searchEngineSelect = document.getElementById('search-engine');
    const domainInput = document.getElementById('domain');
    const generateDorksBtn = document.getElementById('generate-dorks-btn');
    const generateGamblingDorksBtn = document.getElementById('generate-gambling-dorks-btn');
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
    
    // Removed auto-generation when domain or search engine changes
    // Results will only appear when buttons are clicked
    
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
    
    // Generate gambling dorks button click event
    generateGamblingDorksBtn.addEventListener('click', function() {
        generateGamblingDorks();
    });
    
    // Generate gambling-related dorks
    function generateGamblingDorks() {
        const domain = domainInput.value.trim();
        const selectedEngine = searchEngineSelect.value;
        
        if (!domain) {
            showMessage('Please enter a domain.', 'error');
            return;
        }
        
        const engine = searchEngines[selectedEngine];
        
        // Gambling-related keywords
        const gamblingKeywords = [
            'gacor', 'slot gacor', 'slot maxwin', 'maxwin', 'jp maxwin', 
            'slot88', 'rtp slot', 'slot online terpercaya', 'judi online', 
            'slot online', 'casino online', 'poker online', 'togel online',
            'situs judi', 'bandar judi', 'agen judi', 'link alternatif',
            'daftar judi', 'login judi', 'deposit judi', 'withdraw judi',
            'bonus judi', 'promo judi', 'jackpot', 'freebet', 'mixparlay',
            'sbobet', 'sabung ayam', 'tembak ikan', 'live casino', 'baccarat',
            'roulette', 'blackjack', 'domino', 'ceme', 'capsa', 'qq', 'pkv'
        ];
        
        // Dork patterns for gambling detection
        const dorkPatterns = [
            'site:{domain} {keyword}',
            'site:{domain} inurl:{keyword}',
            'site:{domain} intitle:{keyword}',
            'site:{domain} "{keyword}"',
            'site:{domain} *{keyword}*',
            'site:{domain} {keyword} login',
            'site:{domain} {keyword} register',
            'site:{domain} {keyword} daftar',
            'site:{domain} {keyword} deposit',
            'site:{domain} {keyword} withdraw',
            'site:{domain} {keyword} bonus',
            'site:{domain} {keyword} promo',
            'site:{domain} {keyword} jackpot',
            'site:{domain} {keyword} freebet',
            'site:{domain} {keyword} alternatif',
            'site:{domain} {keyword} link',
            'site:{domain} {keyword} apk',
            'site:{domain} {keyword} mobile',
            'site:{domain} {keyword} wap',
            'site:{domain} {keyword} terpercaya',
            'site:{domain} {keyword} terbaru',
            'site:{domain} {keyword} terlengkap',
            'site:{domain} {keyword} resmi',
            'site:{domain} {keyword} terbaik',
            'site:{domain} {keyword} teraman',
            'site:{domain} {keyword} terpopuler',
            'site:{domain} {keyword} terbesar',
            'site:{domain} {keyword} terupdate',
            'site:{domain} {keyword} terkini',
            'site:{domain} {keyword} terbaru',
            'site:{domain} {keyword} terlengkap',
            'site:{domain} {keyword} terpercaya',
            'site:{domain} {keyword} teraman',
            'site:{domain} {keyword} terbaik',
            'site:{domain} {keyword} terpopuler',
            'site:{domain} {keyword} terbesar',
            'site:{domain} {keyword} terupdate',
            'site:{domain} {keyword} terkini'
        ];
        
        let resultsHTML = '';
        
        // Generate dorks for each keyword with each pattern
        gamblingKeywords.forEach(keyword => {
            dorkPatterns.forEach(pattern => {
                const dork = pattern.replace('{domain}', domain).replace('{keyword}', keyword);
                const encodedDork = encodeURIComponent(dork);
                const dorkLink = `${engine.baseUrl}${encodedDork}`;
                
                resultsHTML += `
                    <div class="result-item" data-url="${dorkLink}">
                        <input type="checkbox" class="result-checkbox">
                        <p>${formatDorkName(dork)}</p>
                    </div>
                `;
            });
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
});