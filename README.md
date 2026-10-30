<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a41097e5-35fa-42c2-b1e8-f46b43942a84

## Run Locally

**Prerequisites:**  Node.js


## 🖥️ Build Windows Desktop Application (.exe)

This project is fully configured with **Electron** and **electron-builder** to package a standalone Windows desktop `.exe` application.

### Method 1: Just Run `npm install` (Automatic on Windows)
On your Windows computer, simply open the project directory and run:
```bash
npm install
```
The `postinstall` script will automatically:
1. Build the production web bundle (`vite build`)
2. Package the app using `electron-builder`
3. Generate `.exe` files in the `release/` folder!

### Method 2: Double Click `build-windows-exe.bat`
On Windows, simply double-click the `build-windows-exe.bat` file. It will automatically run everything and show you the generated `.exe` files.

### Method 3: Manual Command
```bash
npm run build:exe
```
or for portable version:
```bash
npm run dist:portable
```

Output files will be saved in the `release/` folder:
- `release/Halftone Maker Setup 1.0.0.exe` (Installer)
- `release/Halftone Maker 1.0.0.exe` (Portable executable - no install required)

