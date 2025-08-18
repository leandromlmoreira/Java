@echo off
echo ========================================
echo    Java Learning Repository Builder
echo ========================================
echo.

echo Escolha o que compilar:
echo 1. Exercicios
echo 2. Projetos
echo 3. Tudo
echo.
set /p escolha="Digite sua opção (1-3): "

if "%escolha%"=="1" goto exercicios
if "%escolha%"=="2" goto projetos
if "%escolha%"=="3" goto tudo
echo Opção inválida!
pause
exit /b 1

:exercicios
echo.
echo [1/3] Compilando exercicios...
cd exercicios
for /d %%i in (*) do (
    echo Compilando %%i...
    cd %%i
    javac *.java 2>nul
    if %errorlevel% equ 0 (
        echo ✓ %%i compilado com sucesso!
    ) else (
        echo ✗ Erro ao compilar %%i
    )
    cd ..
)
cd ..
echo ✓ Exercicios compilados!
goto fim

:projetos
echo.
echo [2/3] Compilando projetos...
cd projetos
for /d %%i in (*) do (
    echo Compilando %%i...
    cd %%i
    javac *.java 2>nul
    if %errorlevel% equ 0 (
        echo ✓ %%i compilado com sucesso!
    ) else (
        echo ✗ Erro ao compilar %%i
    )
    cd ..
)
cd ..
echo ✓ Projetos compilados!
goto fim

:tudo
echo.
echo [1/3] Compilando exercicios...
cd exercicios
for /d %%i in (*) do (
    echo Compilando %%i...
    cd %%i
    javac *.java 2>nul
    if %errorlevel% equ 0 (
        echo ✓ %%i compilado com sucesso!
    ) else (
        echo ✗ Erro ao compilar %%i
    )
    cd ..
)
cd ..

echo [2/3] Compilando projetos...
cd projetos
for /d %%i in (*) do (
    echo Compilando %%i...
    cd %%i
    javac *.java 2>nul
    if %errorlevel% equ 0 (
        echo ✓ %%i compilado com sucesso!
    ) else (
        echo ✗ Erro ao compilar %%i
    )
    cd ..
)
cd ..

echo [3/3] Compilação concluida!
echo.
echo ========================================
echo    Projetos disponiveis para execucao:
echo ========================================
echo.
echo Calculadora: cd projetos\calculadora && java Calculadora
echo Sudoku: cd projetos\sudoku && java Sudoku
echo Jogo da Memoria: cd projetos\jogo-memoria && java JogoMemoria
echo Board de Tarefas: cd projetos\board-tarefas && java BoardTarefas
echo.
echo ========================================

:fim
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
