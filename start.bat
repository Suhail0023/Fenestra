@echo off
cd /d %~dp0
py -m pip install openpyxl
start "" /b cmd /c "timeout /t 3 >nul && start http://localhost:8000"
py server.py
