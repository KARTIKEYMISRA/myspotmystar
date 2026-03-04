@echo off
echo ================================
echo SpotMYstar Setup Script (Windows)
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node -v
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] PostgreSQL is not installed. Please install PostgreSQL first.
    pause
    exit /b 1
)

echo [OK] PostgreSQL is installed
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

cd ..

REM Create database
echo Setting up database...
psql -U postgres -c "CREATE DATABASE spotmystar;" 2>nul
echo [OK] Database setup completed
echo.

REM Run migrations
echo Running database migrations...
cd backend
call npm run migrate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to run migrations
    pause
    exit /b 1
)
echo [OK] Migrations completed
echo.

cd ..

echo ================================
echo Setup completed successfully!
echo ================================
echo.
echo To start the application:
echo 1. Start backend:  cd backend ^&^& npm run dev
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo.
echo Default admin credentials:
echo Email: admin@spotmystar.com
echo Password: admin123
echo.
echo Visit http://localhost:5173 to access the application
echo.
pause
