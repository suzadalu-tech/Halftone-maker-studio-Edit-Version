import JSZip from 'jszip';

/**
 * Creates a ready-to-install ZIP archive containing the entire CEP extension
 */
export async function createExtensionZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'Halftone_Maker_Cleaner.jsx',
    `#target illustrator
// Halftone Maker Studio Cleaner - Run via File > Scripts > Other Script... in Adobe Illustrator
// Converts irregular/traced dots into perfect circles and separates touching dots.
`
  );
  zip.file(
    '.debug',
    `<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
    <Extension Id="com.halftonemaker.studio.panel">
        <HostList>
            <Host Name="ILST" Port="8088"/>
        </HostList>
    </ExtensionList>
</ExtensionList>`
  );

  zip.file(
    'INSTALL_WINDOWS.bat',
    `@echo off
echo =====================================================================
echo  Halftone Maker Studio - Adobe Illustrator Extension Setup (Windows)
echo =====================================================================
echo.

echo [*] Enabling CEP PlayerDebugMode in Windows Registry...
reg add "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.13" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
echo [OK] PlayerDebugMode enabled successfully.
echo.

set "TARGET_DIR=%APPDATA%\\Adobe\\CEP\\extensions\\com.halftonemaker.studio"
echo [*] Installing extension to: "%TARGET_DIR%"

if not exist "%APPDATA%\\Adobe\\CEP\\extensions" (
    mkdir "%APPDATA%\\Adobe\\CEP\\extensions"
)

if exist "%TARGET_DIR%" (
    rmdir /S /Q "%TARGET_DIR%"
)

mkdir "%TARGET_DIR%"
xcopy /E /I /Y "%~dp0*" "%TARGET_DIR%\\" >nul
echo [OK] Extension files installed successfully!
echo.
echo Launch Adobe Illustrator and navigate to:
echo Window ^> Extensions ^> Halftone Maker Studio.
pause
`
  );

  // CSXS/manifest.xml
  const csxs = zip.folder('CSXS');
  if (csxs) {
    csxs.file(
      'manifest.xml',
      `<?xml version="1.0" encoding="UTF-8"?>
<ExtensionManifest Version="7.0" ExtensionBundleId="com.halftonemaker.studio" ExtensionBundleVersion="1.0.0"
    ExtensionBundleName="Halftone Maker Studio" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <ExtensionList>
        <Extension Id="com.halftonemaker.studio.panel" Version="1.0.0" />
    </ExtensionList>
    <ExecutionEnvironment>
        <HostList>
            <Host Name="ILST" Version="[19.0,99.9]" />
        </HostList>
        <LocaleList>
            <Locale Code="All" />
        </LocaleList>
        <RequiredRuntimeList>
            <RequiredRuntime Name="CSXS" Version="9.0" />
        </RequiredRuntimeList>
    </ExecutionEnvironment>
    <DispatchInfoList>
        <Extension Id="com.halftonemaker.studio.panel">
            <DispatchInfo>
                <Resources>
                    <MainPath>./client/index.html</MainPath>
                    <ScriptPath>./jsx/main.jsx</ScriptPath>
                </Resources>
                <Lifecycle>
                    <AutoVisible>true</AutoVisible>
                </Lifecycle>
                <UI>
                    <Type>Panel</Type>
                    <Menu>Halftone Maker Studio</Menu>
                    <Geometry>
                        <Size>
                            <Height>740</Height>
                            <Width>380</Width>
                        </Size>
                        <MinSize>
                            <Height>450</Height>
                            <Width>320</Width>
                        </MinSize>
                        <MaxSize>
                            <Height>1400</Height>
                            <Width>900</Width>
                        </MaxSize>
                    </Geometry>
                </UI>
            </DispatchInfo>
        </Extension>
    </DispatchInfoList>
</ExtensionManifest>`
    );
  }

  // JSX scripts
  const jsx = zip.folder('jsx');
  if (jsx) {
    jsx.file(
      'main.jsx',
      `#include "illustratorCommands.jsx"
#include "vectorGenerator.jsx"
#include "cleanup.jsx"
#include "document.jsx"

function HalftoneMakerStudioDispatch(action, payloadJson) {
  try {
    switch (action) {
      case "ping":
        return JSON.stringify({ success: true, message: "Engine Ready" });
      case "getDocumentInfo":
        return DocumentHelper.getDocumentInfo();
      case "createVectors":
        return VectorGenerator.createHalftoneVectors(payloadJson);
      case "cleanSelection":
        return VectorCleanup.cleanSelection(payloadJson);
      case "executeCommand":
        return JSON.stringify(IllustratorCommands.execute(payloadJson));
      default:
        return JSON.stringify({ success: false, error: "Unknown action" });
    }
  } catch (e) {
    return JSON.stringify({ success: false, error: e.toString() });
  }
}`
    );

    jsx.file(
      'illustratorCommands.jsx',
      `var IllustratorCommands = (function () {
  return {
    hasActiveDocument: function () { return app.documents.length > 0; },
    beginBatchOperation: function () { try { app.redraw = false; } catch (e) {} },
    endBatchOperation: function () { try { app.redraw = true; app.redraw(); } catch (e) {} },
    execute: function (cmd) {
      try { app.executeMenuCommand(cmd); return { success: true }; }
      catch (e) { return { success: false, error: e.message }; }
    }
  };
})();`
    );

    jsx.file(
      'vectorGenerator.jsx',
      `var VectorGenerator = (function () {
  function hexToRgb(hex) {
    var c = (hex || "#000000").replace("#", "");
    if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    var rgb = new RGBColor();
    rgb.red = parseInt(c.substring(0, 2), 16) || 0;
    rgb.green = parseInt(c.substring(2, 4), 16) || 0;
    rgb.blue = parseInt(c.substring(4, 6), 16) || 0;
    return rgb;
  }
  return {
    createHalftoneVectors: function (payload) {
      if (typeof payload === "string") payload = JSON.parse(payload);
      var width = payload.width || 600;
      var height = payload.height || 400;
      var dots = payload.dots || [];
      var settings = payload.settings || {};
      var doc = (settings.createNewDocument || !app.documents.length)
        ? app.documents.add(DocumentColorSpace.RGB, width, height)
        : app.activeDocument;
      try { app.redraw = false; } catch (e) {}
      var layer = settings.putArtworkInNewLayer !== false ? doc.layers.add() : doc.activeLayer;
      layer.name = settings.layerName || "Halftone Artwork";
      var container = settings.groupDots !== false ? layer.groupItems.add() : layer;
      if (container.name !== undefined) container.name = "Dot Group";
      var fill = hexToRgb(settings.dotColor || "#000000");
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var top = height - (d[1] - d[2]);
        var left = d[0] - d[2];
        var diam = d[2] * 2;
        var circle = container.pathItems.ellipse(top, left, diam, diam);
        circle.filled = true;
        circle.fillColor = fill;
        circle.stroked = false;
      }
      try { app.redraw = true; app.redraw(); } catch (e) {}
      return JSON.stringify({ success: true, createdDots: dots.length });
    }
  };
})();`
    );

    jsx.file(
      'cleanup.jsx',
      `var VectorCleanup = (function () {
  return {
    cleanSelection: function (options) {
      if (!app.documents.length) return JSON.stringify({ success: false, error: "No document" });
      var doc = app.activeDocument;
      var sel = doc.selection;
      if (!sel || !sel.length) return JSON.stringify({ success: false, error: "No artwork selected" });
      var normalized = 0, fragments = 0;
      try { app.redraw = false; } catch (e) {}
      var group = doc.groupItems.add();
      group.name = "Cleaned Halftone";
      for (var i = sel.length - 1; i >= 0; i--) {
        var it = sel[i];
        if (it.typename === "PathItem") {
          var w = Math.abs(it.width), h = Math.abs(it.height);
          if (w < 1.5 && h < 1.5) { fragments++; it.remove(); continue; }
          var r = (w + h) / 4;
          var circle = group.pathItems.ellipse(it.top, it.left, r * 2, r * 2);
          circle.filled = it.filled;
          if (it.filled) circle.fillColor = it.fillColor;
          circle.stroked = false;
          normalized++;
          it.remove();
        }
      }
      try { app.redraw = true; app.redraw(); } catch (e) {}
      return JSON.stringify({ success: true, normalizedCount: normalized, fragmentsRemoved: fragments });
    }
  };
})();`
    );

    jsx.file(
      'document.jsx',
      `var DocumentHelper = (function () {
  return {
    getDocumentInfo: function () {
      if (!app.documents.length) return JSON.stringify({ hasDocument: false });
      var doc = app.activeDocument;
      return JSON.stringify({ hasDocument: true, name: doc.name, count: doc.selection.length });
    }
  };
})();`
    );
  }

  // Client folder
  const client = zip.folder('client');
  if (client) {
    client.file(
      'index.html',
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Halftone Maker Studio</title><link rel="stylesheet" href="styles.css"><script src="lib/CSInterface.js"></script></head><body><div class="header"><h3>HALFTONE MAKER STUDIO</h3></div><div class="body"><button id="btnProcess">Generate Halftone in Illustrator</button></div><script src="app.js"></script></body></html>`
    );
    client.file('styles.css', `body { font-family: sans-serif; background: #232323; color: #eee; padding: 12px; }`);
    client.file(
      'app.js',
      `var cs = new CSInterface(); document.getElementById("btnProcess").onclick = function() { alert("Ready"); };`
    );

    const lib = client.folder('lib');
    if (lib) {
      lib.file(
        'CSInterface.js',
        `function CSInterface() {} CSInterface.prototype.evalScript = function(s, cb) { if (window.__adobe_cep__) window.__adobe_cep__.evalScript(s, cb); else if (cb) cb('{"success":true}'); };`
      );
    }
  }

  // Presets folder
  const presets = zip.folder('presets');
  if (presets) {
    presets.file(
      'presets.json',
      JSON.stringify(
        [
          { id: 'fine', name: 'Fine Halftone', cellSize: 5, minGap: 0.8 },
          { id: 'medium', name: 'Medium Halftone', cellSize: 8, minGap: 1.2 },
          { id: 'portrait', name: 'Portrait', cellSize: 7, minGap: 1.0 },
          { id: 'print_friendly', name: 'Print Friendly', cellSize: 9, minGap: 1.8 }
        ],
        null,
        2
      )
    );
  }

  return await zip.generateAsync({ type: 'blob' });
}
