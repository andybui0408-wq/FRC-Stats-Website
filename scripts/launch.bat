@echo off
echo 🚀 Starting FRC Scouting Dashboard...
echo 📊 Opening dashboard in your default browser...

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐍 Using Python to serve the application...
    python -m http.server 8000
) else (
    echo ❌ Python not found. Please install Python to run the local server.
    echo Alternatively, you can open index.html directly in your browser.
    pause
    exit /b 1
)
