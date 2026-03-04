@echo off
echo ========================================
echo SpotMYstar Vercel Deployment Script
echo ========================================
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
)

echo [OK] Vercel CLI ready
echo.

REM Check if git is initialized
if not exist .git (
    echo [INFO] Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
    echo [OK] Git initialized
) else (
    echo [OK] Git repository exists
)

echo.
echo Deployment Checklist:
echo.
echo Before deploying, ensure you have:
echo 1. Backend deployed (Railway/Render/Heroku)
echo 2. Database created and migrated
echo 3. Backend URL ready
echo.

set /p CONFIRM="Do you have your backend URL? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo [WARNING] Please deploy your backend first!
    echo.
    echo Quick backend deployment options:
    echo 1. Railway: railway up
    echo 2. Render: Connect GitHub repo
    echo 3. Heroku: git push heroku main
    echo.
    pause
    exit /b 1
)

echo.
set /p BACKEND_URL="Enter your backend URL (e.g., https://your-app.railway.app): "

if "%BACKEND_URL%"=="" (
    echo [ERROR] Backend URL is required
    pause
    exit /b 1
)

echo.
echo [INFO] Configuring frontend...

REM Update frontend .env
(
echo VITE_API_URL=%BACKEND_URL%/api
) > frontend\.env

echo [OK] Frontend configured with backend URL
echo.

REM Login to Vercel
echo [INFO] Logging into Vercel...
call vercel login

echo.
echo [INFO] Deploying to Vercel...
echo.

cd frontend
call vercel --prod

echo.
echo ========================================
echo Deployment initiated!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for deployment to complete
echo 2. Copy your Vercel URL
echo 3. Update backend CORS with Vercel URL
echo 4. Test your application
echo.
echo For detailed instructions, see:
echo   - DEPLOY_TO_VERCEL.md
echo   - docs\VERCEL_DEPLOYMENT.md
echo.
pause
