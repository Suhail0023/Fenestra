@echo off
cd /d %~dp0
rem Document generator (Excel/PDF formats) needs: py -m pip install openpyxl pypdf reportlab
rem Data is stored in fenestra.db. If you have old AZAL_*_Project_DB.xlsx files, run once: py -m pip install openpyxl pypdf reportlab
start "" /b cmd /c "timeout /t 3 >nul && start http://localhost:8000"
py server.py
