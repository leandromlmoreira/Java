#!/bin/bash

echo "========================================"
echo "    Java Learning Repository Builder"
echo "========================================"
echo

echo "[1/4] Compilando exercicios..."
cd src/main/java/com/exercicios
javac *.java
if [ $? -ne 0 ]; then
    echo "ERRO: Falha na compilacao dos exercicios!"
    exit 1
fi
echo "✓ Exercicios compilados com sucesso!"
echo

echo "[2/4] Compilando projetos..."
cd ../projetos
javac *.java
if [ $? -ne 0 ]; then
    echo "ERRO: Falha na compilacao dos projetos!"
    exit 1
fi
echo "✓ Projetos compilados com sucesso!"
echo

echo "[3/4] Movendo arquivos compilados..."
cd ../../../../..
mkdir -p target/classes
mv src/main/java/com/exercicios/*.class target/classes/ 2>/dev/null
mv src/main/java/com/projetos/*.class target/classes/ 2>/dev/null
echo "✓ Arquivos compilados movidos para target/classes"
echo

echo "[4/4] Compilacao concluida!"
echo
echo "========================================"
echo "    Projetos disponiveis para execucao:"
echo "========================================"
echo
echo "1. Calculadora: java -cp target/classes com.projetos.Calculadora"
echo "2. Sudoku: java -cp target/classes com.projetos.Sudoku 5 0 0 3 1 1 7 2 2"
echo "3. Jogo da Memoria: java -cp target/classes com.projetos.JogoMemoria"
echo "4. Board de Tarefas: java -cp target/classes com.projetos.BoardTarefas"
echo
echo "========================================"
echo
