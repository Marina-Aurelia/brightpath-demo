@echo off
start "BrightPath Server" /D "%~dp0" "%~dp0BrightPath-demo.exe"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8080"

