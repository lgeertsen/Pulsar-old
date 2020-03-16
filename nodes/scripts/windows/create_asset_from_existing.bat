echo off
set template=%1
set file=%2
set comment=%3

echo F | xcopy "%template%" "%file%"
echo Created from %template% >> %comment%comment.txt
