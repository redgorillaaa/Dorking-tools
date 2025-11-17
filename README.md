# Recon Engines

A web-based tool for generating search engine dorks to help with reconnaissance and subdomain enumeration. This tool allows you to quickly generate specialized search queries for multiple search engines to find subdomains, related domains, and other information about a target domain.

## Features

- Support for multiple search engines (Google, Bing, DuckDuckGo, Yahoo, Yandex, Baidu)
- Pre-built dork templates for common reconnaissance tasks:
  - Subdomain discovery
  - Related domains
  - Cached pages
  - File type searches
  - Directory listings
  - Admin panel discovery
  - Database file discovery
  - Login page discovery
  - WordPress site discovery
  - PHP info pages
- Dark theme interface for comfortable use
- Responsive design for mobile devices
- One-click opening of generated dorks in new tabs

## Demo

You can see a live demo of this tool at: [https://yourusername.github.io/recon-engines](https://yourusername.github.io/recon-engines)

## Getting Started

### Prerequisites

- A GitHub account
- Git installed on your local machine (optional)

### Installation

1. Fork this repository to your GitHub account.
2. Clone the repository to your local machine (optional):
   ```
   git clone https://github.com/yourusername/recon-engines.git
   cd recon-engines
   ```
3. Make any desired changes to the code.
4. Commit and push your changes:
   ```
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

### Deployment to GitHub Pages

1. Go to your repository on GitHub.
2. Click on the "Settings" tab.
3. Scroll down to the "Pages" section in the left sidebar.
4. Under "Build and deployment", select the "Deploy from a branch" source.
5. Choose the "main" branch and the "/ (root)" folder.
6. Click "Save".
7. Wait a few minutes for GitHub to build and deploy your site.
8. Your site will be available at `https://yourusername.github.io/recon-engines`.

## Usage

1. Select a search engine from the dropdown menu.
2. Enter the domain you want to search for in the "Domain to search" field.
3. The tool will automatically generate a dork link and display all available dorks for the selected search engine.
4. Click on any dork link to open it in a new tab.

## Project Structure

```
recon-engines/
├── index.html      # Main HTML file
├── style.css       # CSS styles for the interface
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Customization

### Adding New Search Engines

To add a new search engine, edit the `script.js` file and add a new entry to the `searchEngines` object:

```javascript
newEngine: {
    name: 'New Engine',
    baseUrl: 'https://search.example.com/search?q=',
    dorks: {
        subdomains: 'site:*.{domain}',
        // Add more dorks as needed
    }
}
```

### Adding New Dorks

To add new dorks, add them to the `dorks` object for each search engine in `script.js`:

```javascript
dorks: {
    // Existing dorks...
    newDork: 'site:{domain} your-custom-dork-here',
}
```

### Customizing the Appearance

To customize the appearance, edit the `style.css` file. The CSS is organized into sections for easy modification:

- General styles (body, container)
- Header styles
- Form styles
- Results styles
- Footer styles
- Responsive design

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is intended for educational purposes and authorized security testing only. Users are responsible for ensuring they have proper authorization before using this tool on any systems or domains they do not own. The developers are not responsible for any misuse of this tool.