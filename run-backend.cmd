@echo off
"%~dp0.venv\Scripts\python.exe" -m uvicorn --app-dir "%~dp0backend" app.main:app --reload
