@echo off
echo ========================================
echo Starting SpotMYstar Development Servers
echo ========================================
echo.

echo Starting backend server...
start "SpotMYstar Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
echo [OK] Backend started
echo.

echo Starting frontend server...
start "SpotMYstar Frontend" cmd /k "cd frontend && npm run dev"
echo [OK] Frontend started
echo.

echo ========================================
echo Both servers are running!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close the terminal windows to stop the servers
echo.
pause
