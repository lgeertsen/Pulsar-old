echo off
set template=%1
set filepath=%2
rem set dirpath=%3

echo F | xcopy /S /Q /Y /F "%template%" "%filepath%"
rem echo Created from %template% >> %dirpath%comment.txt
