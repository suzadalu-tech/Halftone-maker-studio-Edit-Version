# Precision Halftone Studio — Adobe Illustrator Extension

**Precision Halftone Studio** is a professional Adobe Illustrator CEP extension specifically designed to convert raster/color images into clean, editable vector halftone artwork, and systematically eliminate common vector tracing defects:
1. Dots touching each other
2. Merged dots
3. Irregular / distorted dots
4. Tilted or skewed dots
5. Non-circular dots
6. Uneven spacing
7. Broken dots
8. Dirty vector shapes
9. Unwanted tiny fragments
10. Difficult-to-edit traced artwork

---

## 1. System Architecture & Technology Choice

### Why CEP (Common Extensibility Platform)?
- **Illustrator Production Stability**: Illustrator UXP is not yet generally available or feature-complete for complex vector document manipulation across all target Windows versions.
- **CEP 9 - 12 (HTML5 / Chromium + Node.js + ExtendScript JSX)** is the established, stable production extension architecture for Adobe Illustrator CC 2018 through Illustrator 2026/2027+.
- **Separation of Concerns**:
  - **UI & Mathematical Engine**: Fast Canvas rendering, spatial-grid collision resolution ($O(N)$), luminance sampling, and edge detection execute directly in the panel.
  - **Illustrator DOM Abstraction (`/jsx/`)**: Optimized batch vector generation via `pathItems.ellipse(top, left, width, height)` with redraw suppression (`app.redraw = false`).
  - **Clean Traced Halftone**: Analyzes existing Illustrator paths, evaluates circularity $4\pi A / P^2$, eliminates dust, and replaces distorted paths with true mathematical circles.

---

## 2. Directory Structure

```
/extension
  ├── CSXS/
  │   └── manifest.xml          # Extension definition, version bounds, geometry
  ├── client/
  │   ├── index.html            # Dark-theme Adobe Spectrum UI
  │   ├── styles.css            # Illustrator-matched styling
  │   ├── app.js                # UI state & CEP dispatcher
  │   └── lib/
  │       └── CSInterface.js    # Official Adobe CEP host bridge
  ├── core/
  │   └── halftoneCore.js       # Mathematical halftone & collision engine
  ├── jsx/
  │   ├── main.jsx              # ExtendScript router
  │   ├── illustratorCommands.jsx # Command abstraction layer
  │   ├── vectorGenerator.jsx   # Batch circle vector creation
  │   ├── cleanup.jsx           # Traced vector cleaning & normalization
  │   └── document.jsx          # Document & artboard management
  ├── presets/
  │   └── presets.json          # Built-in presets (Fine, Medium, Portrait, Print)
  ├── .debug                    # Remote debugging configuration (port 8088)
  ├── INSTALL_WINDOWS.bat       # 1-click Windows installer & registry setup
  └── README.md
```

---

## 3. Installation & Development Setup (Windows)

### Option A: One-Click Script (Recommended)
1. Double click `INSTALL_WINDOWS.bat` located in this folder.
2. It sets the `PlayerDebugMode` registry key to `1` and copies the extension to:
   `%APPDATA%\Adobe\CEP\extensions\com.precisionhalftone.studio`
3. Launch Adobe Illustrator.
4. Go to **Window > Extensions > Precision Halftone Studio**.

### Option B: Manual Installation
1. Enable Unsigned Extensions in Windows Registry:
   - Press `Win + R`, type `regedit`, press Enter.
   - Navigate to: `HKEY_CURRENT_USER\Software\Adobe\CSXS.11` (and `CSXS.10`, `CSXS.9`, `CSXS.12`).
   - Create a String Value named `PlayerDebugMode` with value `1`.
2. Copy this `/extension` folder into:
   `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\com.precisionhalftone.studio`
3. Restart Adobe Illustrator.

---

## 4. Visual Studio Code Setup & Debugging

1. Install the **ExtendScript Debugger** extension in VS Code.
2. Open this folder in VS Code.
3. To debug the panel frontend:
   - With Illustrator open and the panel active, open Google Chrome.
   - Navigate to `http://localhost:8088`.
   - Click the panel link to open the full Chrome DevTools (Console, Elements, Network, Profiler).

---

## 5. Packaging into ZXP for Commercial Distribution

To package this extension into an Adobe `.zxp` file:
1. Download **ZXPSignCmd** from Adobe GitHub.
2. Generate a self-signed certificate:
   ```cmd
   ZXPSignCmd.exe -selfSignedCert US CA "PrecisionHalftone" "HalftoneStudio" "YourPassword" cert.p12
   ```
3. Sign and build package:
   ```cmd
   ZXPSignCmd.exe -sign extension PrecisionHalftoneStudio.zxp cert.p12 "YourPassword" -tsa http://timestamp.digicert.com
   ```
The output `PrecisionHalftoneStudio.zxp` can now be distributed or installed with Anastasiy's Extension Manager or ZXP Installer.
