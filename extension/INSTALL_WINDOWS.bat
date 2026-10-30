@echo off
echo =====================================================================
echo  Precision Halftone Studio - Adobe Illustrator Extension Setup (Windows)
echo =====================================================================
echo.

:: 1. Enable CEP Debug Mode in Windows Registry for CC 2018 - 2026+
echo [*] Enabling CEP PlayerDebugMode in Windows Registry...
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.13" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
echo [OK] PlayerDebugMode enabled successfully.
echo.

:: 2. Determine target CEP folder
set "TARGET_DIR=%APPDATA%\Adobe\CEP\extensions\com.precisionhalftone.studio"
echo [*] Installing extension to: "%TARGET_DIR%"

if not exist "%APPDATA%\Adobe\CEP\extensions" (
    mkdir "%APPDATA%\Adobe\CEP\extensions"
)

if exist "%TARGET_DIR%" (
    echo [*] Removing previous installation...
    rmdir /S /Q "%TARGET_DIR%"
)

mkdir "%TARGET_DIR%"
xcopy /E /I /Y "%~dp0*" "%TARGET_DIR%\" >nul
echo [OK] Extension files installed successfully!
echo.

echo =====================================================================
echo  Installation Complete!
echo.
echo  To open in Adobe Illustrator:
echo  1. Restart Adobe Illustrator.
echo  2. Open any document or create a new document.
echo  3. Go to top menu: Window ^> Extensions ^> Precision Halftone Studio.
echo.
echo  To inspect or debug in Chrome:
echo  Visit http://localhost:8088 in Chrome while the extension panel is open.
echo =====================================================================
pause
