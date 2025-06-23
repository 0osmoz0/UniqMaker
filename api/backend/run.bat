@echo off
set FLASK_APP=api.py
set FLASK_ENV=development
set /p DUMMY=Loading environment variables from .env (make sure you have it set manually) ...
flask run --host=0.0.0.0 --port=5000
pause
