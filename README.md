# ReDet - reCAPTCHA Detector
<div style="display: flex; align-items: center; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/f7ad6e8a-88c4-4fac-afd3-331020913597" alt="image" width="80" height="auto">
  <img src="https://github.com/user-attachments/assets/4cb747ae-d081-42fa-a359-f213bbc0a9f2" alt="image" width="420" height
</div>
  
A powerful Chrome extension that detects and analyzes Google reCAPTCHA implementations on websites.

![Version](https://img.shields.io/badge/version-1.1-blue)
![Build](https://img.shields.io/badge/build-27--04--2025-green)
## Features

- 🔍 Detects both reCAPTCHA v2 and v3
- 🚀 Real-time scanning of web pages
- 💡 Enterprise reCAPTCHA detection
- 📋 Easy site key copying
- 🎨 Clean and modern UI

## Installation

1. Download the latest release from the [releases page](https://github.com/0xtbug/ReDet/releases)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the downloaded extension folder

## Usage

1. Click the extension icon in your browser toolbar
2. Click "Scan Page" to detect reCAPTCHA on the current page
3. View detailed information about detected reCAPTCHA implementations
4. Copy site keys and configuration details with one click

## Detection Features

- **reCAPTCHA v2**
  - Site key detection
  - Enterprise implementation detection
  - Full configuration details

- **reCAPTCHA v3**
  - Multiple site key detection
  - Enterprise implementation detection
  - Action parameters
  - Configuration details

## Development

### Prerequisites

- Chrome browser (latest version recommended)
- Git

### Setup for Development

1. Clone the repository:
```bash
git clone https://github.com/0xtbug/ReDet.git
cd ReDet
```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the cloned directory

3. Development workflow:
   - Make changes to the source files
   - Refresh the extension in `chrome://extensions/`
   - Click the refresh icon on the extension card to apply changes

### Project Structure

```
ReDet/
├── src/
│   ├── views/          # UI components
│   │   ├── popup/      # Extension popup interface
│   │   │   ├── popup.html
│   │   │   ├── popup.css
│   │   │   └── popup.js
│   │   └── icons/     # Extension icons
│   ├── content/       # Content scripts
│   │   └── content.js
│   ├── controllers/   # Background scripts
│   │   └── background.js
│   └── models/        # Data models
├── manifest.json      # Extension manifest
└── build-date        # Version and build information
```

### Development Guidelines

1. **Code Style**
   - Use consistent indentation (2 spaces)
   - Follow JavaScript ES6+ conventions
   - Keep functions small and focused
   - Add comments for complex logic

2. **Testing**
   - Test on different websites with various reCAPTCHA implementations
   - Verify both v2 and v3 detection
   - Check Enterprise reCAPTCHA detection
   - Test on different Chrome versions

3. **Building**
   - No build step required
   - Direct development in source files
   - Chrome automatically reloads on file changes

4. **Debugging**
   - Use Chrome DevTools for debugging
   - Check the Console for errors
   - Inspect popup with right-click -> Inspect
   - Monitor background script in extension page

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**0xtbug**
- GitHub: [@0xtbug](https://github.com/0xtbug)

## Acknowledgments

- Thanks to all contributors who have helped make this project better
- Special thanks to the Chrome Extensions community

## Version History

- v1.1 (Current)
  - Added Enterprise reCAPTCHA detection
  - Improved UI/UX
  - Better error handling
  - Performance optimizations

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/0xtbug/ReDet/issues) page
2. Create a new issue if your problem isn't already listed

---

Built with ❤️ by [0xtbug](https://github.com/0xtbug) 
