@echo off
Echo tests_start
ping 1.1.1.1 -n 15 -w 1000 > nul
Echo tests_end