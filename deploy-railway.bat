@echo off
echo ========================================
echo SpotMYstar Railway Backend Deployment
echo ========================================
echo.

echo [INFO] Checking Railway CLI...
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Installing Railway CLI...
    call npm install -g @railway/cli
)

echo [OK] Railway CLI ready
echo.

echo [INFO] Logging into Railway...
echo This will open your browser for authentication.
echo.
call railway login

echo.
echo [INFO] Navigating to backend directory...
cd backend

echo.
echo [INFO] Initializing Railway project...
echo.
call railway init

echo.
echo [INFO] Adding PostgreSQL database...
call railway add postgresql

echo.
echo [INFO] Deploying backend...
call railway up

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Set environment variables in Railway dashboard
echo 2. Run migrations: railway run npm run migrate
echo 3. Get your backend URL: railway open
echo 4. Copy URL and add to Vercel as VITE_API_URL
echo.
echo Environment variables to set:
echo   NODE_ENV=production
echo   JWT_SECRET=^<generate-32-char-secret^>
echo   JWT_REFRESH_SECRET=^<generate-another-secret^>
echo   FRONTEND_URL=https://your-app.vercel.app
echo.
echo Generate secrets with:
echo   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.
pause
