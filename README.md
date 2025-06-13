# ⏱️ Pomodoro 2 – Desktop App with Electron

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Author: tedevs0](https://img.shields.io/badge/Author-tedevs0-blue.svg)](https://github.com/tedevs0)

Desktop application built with **Electron**, works as a standalone runtime for PWAs or productivity tools.  
Ideal for projects with Node.js logic that need a desktop visual layer.

## 🖼️ Screenshot

![Screenshot of the application](Screenshot_1.png)

## 📦 Features 

- 🖥️ Packaged with [Electron](https://www.electronjs.org/)
- 🔒 Security: `contextIsolation: true`, `nodeIntegration: false`
- 🔗 Support for `<webview>` tags

## 🚀 Requirements

- Node.js 18 or higher
- npm or yarn

## ⚙️ Installation

Clone the repository and enter the folder:

```bash
git clone https://github.com/tedevs0/pomo2be.git
cd pomo2be
npm install
```

## ▶️ Development Mode

Run the application in desktop mode:

```bash
npm start
```

## 📁 Project Structure

```
pomo2be/
├── index.html           # Main interface
├── main.js              # Electron main process
├── preload.js           # Secure communication between processes
├── package.json
└── ...
```

## 💡 Future Ideas

* 🎨 Theme selector (light/dark mode)
* 🎨 Top bar?
* 🎨 GIF below the buttons
* 🎨 Choose between YouTube or something from the desktop

## 🤝 Contributions

This project is open source. You can fork it, improve it, and send pull requests.
You can also adapt it for your own desktop tools.

## 📜 License

MIT — free to use, modify, and share. No YouTube Premium connection required.
