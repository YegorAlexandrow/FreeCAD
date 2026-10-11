@echo off
rem Starts the Rezets CAD server and opens it in the browser. Projects are kept in %USERPROFILE%\RezetsCAD.
cd /d "%~dp0"
where py >nul 2>nul && (py -3 rezets_server.py --open %*) || (python rezets_server.py --open %*)
pause
