@echo off
echo ==========================================
echo   MathAI Visualizer - Startup Script
echo ==========================================

echo [1/2] Checking Dependencies...
pip install -r requirements.txt

echo.
echo [2/2] Starting Server...
echo.
echo Opening browser...
start http://127.0.0.1:5000
echo.
echo Server logs will appear below. Do not close this window.
echo.

python app.py
pause
