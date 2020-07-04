echo off
set hython=%1
set hr=%2
set scene=%3
set node=%4
set fs=%5
set fend=%6
echo on
%hython% %hr% %scene% -d %node% -e -f %fs% %fend%
