@echo off
echo ========================================
echo    SUDOKU - DIO CHALLENGE
echo ========================================
echo.

:menu
echo Escolha uma opcao:
echo 1. Compilar e executar interface grafica
echo 2. Compilar e executar versao terminal
echo 3. Compilar apenas
echo 4. Sair
echo.
set /p choice="Digite sua escolha (1-4): "

if "%choice%"=="1" goto gui
if "%choice%"=="2" goto terminal
if "%choice%"=="3" goto compile
if "%choice%"=="4" goto exit
echo Opcao invalida! Tente novamente.
echo.
goto menu

:gui
echo.
echo Compilando SudokuGUI.java...
javac SudokuGUI.java
if %errorlevel% neq 0 (
    echo Erro na compilacao!
    pause
    goto menu
)
echo Compilacao bem-sucedida!
echo.
echo Executando interface grafica...
java SudokuGUI
goto menu

:terminal
echo.
echo Compilando Sudoku.java...
javac Sudoku.java
if %errorlevel% neq 0 (
    echo Erro na compilacao!
    pause
    goto menu
)
echo Compilacao bem-sucedida!
echo.
echo Executando versao terminal...
echo.
echo Dica: Para usar os argumentos do desafio DIO, execute:
echo java Sudoku 0,0;4,false 1,0;7,false 2,0;9,true...
echo.
java Sudoku
goto menu

:compile
echo.
echo Compilando todos os arquivos...
javac *.java
if %errorlevel% neq 0 (
    echo Erro na compilacao!
    pause
    goto menu
)
echo Compilacao bem-sucedida!
echo.
pause
goto menu

:exit
echo.
echo Obrigado por usar o Sudoku!
echo.
pause
