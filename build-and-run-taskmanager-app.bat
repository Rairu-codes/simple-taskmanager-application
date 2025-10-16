@echo off
REM ==========================================
REM   TASK MANAGER - BUILD AND RUN
REM   Complete automated startup script
REM ==========================================

setlocal enabledelayedexpansion

REM Set colors
color 0A

echo.
echo ==========================================
echo   TASK MANAGER APPLICATION
echo   Build and Run Script
echo ==========================================
echo.

REM Get current directory
set "CURRENT_DIR=%cd%"
set "BACKEND_DIR=%CURRENT_DIR%\taskmanager-backend"
set "FRONTEND_DIR=%CURRENT_DIR%\taskmanager-frontend"

REM Check if we're in the right directory
if not exist "%BACKEND_DIR%" (
    echo ERROR: Backend folder not found at: %BACKEND_DIR%
    echo Please run this script from: C:\Users\flcb2\SpringBootProjects
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo ERROR: Frontend folder not found at: %FRONTEND_DIR%
    echo Please run this script from: C:\Users\flcb2\SpringBootProjects
    pause
    exit /b 1
)

REM Menu
echo What do you want to do?
echo.
echo 1. Build and Run Full Application (Frontend + Backend)
echo 2. Build Backend Only
echo 3. Run Backend Only (without building)
echo 4. Build Frontend Only
echo 5. Exit
echo.

set /p CHOICE="Enter your choice (1-5): "

if "%CHOICE%"=="1" goto BUILD_FULL
if "%CHOICE%"=="2" goto BUILD_BACKEND
if "%CHOICE%"=="3" goto RUN_BACKEND
if "%CHOICE%"=="4" goto BUILD_FRONTEND
if "%CHOICE%"=="5" goto EXIT_SCRIPT

echo Invalid choice. Please try again.
pause
goto :EOF

REM ==========================================
REM BUILD FULL APPLICATION
REM ==========================================
:BUILD_FULL
cls
echo.
echo ==========================================
echo   BUILDING FULL APPLICATION
echo ==========================================
echo.

REM Step 1: Build Frontend
echo [1/3] Building React Frontend...
echo.
cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

echo Building React...
call npm run build
if errorlevel 1 (
    echo ERROR: npm run build failed
    pause
    exit /b 1
)
echo Frontend build completed successfully!
echo.

REM Step 2: Copy Frontend to Backend
echo [2/3] Copying frontend to backend static resources...
echo.

set "DIST_DIR=%FRONTEND_DIR%\dist"
set "STATIC_DIR=%BACKEND_DIR%\src\main\resources\static"

if exist "%STATIC_DIR%" (
    echo Cleaning old static files...
    rmdir /s /q "%STATIC_DIR%"
)

mkdir "%STATIC_DIR%"

echo Copying files...
xcopy "%DIST_DIR%" "%STATIC_DIR%" /E /I /Y /Q

if errorlevel 1 (
    echo ERROR: Failed to copy frontend files
    pause
    exit /b 1
)
echo Frontend copied successfully!
echo.

REM Step 3: Build Backend
echo [3/3] Building Spring Boot Backend...
echo.
cd /d "%BACKEND_DIR%"

echo Compiling backend...
call mvnw.cmd clean package -DskipTests
if errorlevel 1 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   BUILD COMPLETED SUCCESSFULLY!
echo ==========================================
echo.

REM Ask to run
set /p RUN_NOW="Do you want to run the application now? (y/n): "
if /i "%RUN_NOW%"=="y" goto RUN_BACKEND
if /i "%RUN_NOW%"=="n" goto EXIT_SCRIPT
goto RUN_BACKEND

REM ==========================================
REM BUILD BACKEND ONLY
REM ==========================================
:BUILD_BACKEND
cls
echo.
echo ==========================================
echo   BUILDING BACKEND ONLY
echo ==========================================
echo.

cd /d "%BACKEND_DIR%"

echo Building Spring Boot Backend...
call mvnw.cmd clean package -DskipTests

if errorlevel 1 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)

echo.
echo Backend built successfully!
echo JAR file: %BACKEND_DIR%\target\taskmanager-backend-0.0.1-SNAPSHOT.jar
echo.

set /p RUN_NOW="Do you want to run the backend now? (y/n): "
if /i "%RUN_NOW%"=="y" goto RUN_BACKEND
if /i "%RUN_NOW%"=="n" goto EXIT_SCRIPT
goto RUN_BACKEND

REM ==========================================
REM RUN BACKEND
REM ==========================================
:RUN_BACKEND
cls
echo.
echo ==========================================
echo   STARTING APPLICATION
echo ==========================================
echo.

cd /d "%BACKEND_DIR%"

REM Check if JAR exists
if not exist "target\taskmanager-backend-0.0.1-SNAPSHOT.jar" (
    echo ERROR: JAR file not found!
    echo Please build first using option 1 or 2
    pause
    exit /b 1
)

echo.
echo Finding your IP address...
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%A"
)
set "IP=%IP: =%"

echo.
echo ==========================================
echo   APPLICATION STARTED
echo ==========================================
echo.
echo Local Access:     http://localhost:8080
echo Network Access:   http://%IP%:8080
echo.
echo Press Ctrl+C to stop the application
echo.
echo ==========================================
echo.

REM Start the application
java -jar target\taskmanager-backend-0.0.1-SNAPSHOT.jar

pause
goto EOF

REM ==========================================
REM BUILD FRONTEND ONLY
REM ==========================================
:BUILD_FRONTEND
cls
echo.
echo ==========================================
echo   BUILDING FRONTEND ONLY
echo ==========================================
echo.

cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

echo Building React frontend...
call npm run build

if errorlevel 1 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo Frontend built successfully!
echo Location: %FRONTEND_DIR%\dist
echo.

pause
goto EOF

REM ==========================================
REM EXIT
REM ==========================================
:EXIT_SCRIPT
echo.
echo Goodbye!
echo.
exit /b 0

:EOF
pause