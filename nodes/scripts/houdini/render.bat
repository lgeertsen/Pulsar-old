set hr=%1
set scene=%2
set node=%3
set fs=%4
set fend=%5
"C:\Program Files\Side Effects Software\Houdini 18.0.391\bin\hython.exe" %hr% %scene% -d %node% -e -f %fs% %fend%
