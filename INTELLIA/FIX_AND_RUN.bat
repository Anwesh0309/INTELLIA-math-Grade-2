@echo off
echo ========================================
echo  Fixing PowerShell Execution Policy
echo  and starting dev server...
echo ========================================

:: Fix PowerShell execution policy for current user (no admin needed)
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
echo [OK] Execution policy set to RemoteSigned for current user.

:: Now run npm install + dev using cmd directly (bypasses PowerShell entirely)
echo.
echo Installing dependencies...
cmd /c npm install

echo.
echo Starting dev server...
cmd /c npm run dev

pause
