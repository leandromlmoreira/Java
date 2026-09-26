#!/bin/bash

echo "========================================"
echo "    JavaLab - Build"
echo "========================================"
echo

echo "[1/2] Compilando módulos de exemplo..."
for dir in exercicios/*/; do
    echo "Compilando $dir..."
    (cd "$dir" && javac *.java)
    if [ $? -ne 0 ]; then
        echo "ERRO: Falha na compilação de $dir"
        exit 1
    fi
done
echo "✓ Módulos de exemplo compilados com sucesso!"
echo

echo "[2/2] Compilando aplicações..."
for dir in projetos/*/; do
    echo "Compilando $dir..."
    (cd "$dir" && javac *.java)
    if [ $? -ne 0 ]; then
        echo "ERRO: Falha na compilação de $dir"
        exit 1
    fi
done
echo "✓ Aplicações compiladas com sucesso!"
echo

echo "========================================"
echo "    Aplicações disponíveis para execução:"
echo "========================================"
echo
echo "1. Calculadora: cd projetos/calculadora && java Calculadora"
echo "2. Sudoku: cd projetos/sudoku && java Sudoku"
echo "3. Jogo da Memória: cd projetos/jogo-memoria && java JogoMemoria"
echo "4. Board de Tarefas: cd projetos/board-tarefas && java BoardTarefas"
echo
echo "========================================"
echo
