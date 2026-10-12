@echo off
cd /d "%~dp0"
echo Starting EduSolve AI...
echo Keep this window OPEN, then open http://localhost:5173/ in your browser.
npm run dev -- --port 5173 --host localhost
pause
