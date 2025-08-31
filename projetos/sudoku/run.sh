#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    SUDOKU - DIO CHALLENGE"
echo -e "========================================${NC}"
echo

show_menu() {
    echo -e "${YELLOW}Escolha uma opção:${NC}"
    echo "1. Compilar e executar interface gráfica"
    echo "2. Compilar e executar versão terminal"
    echo "3. Compilar apenas"
    echo "4. Sair"
    echo
}

compile_gui() {
    echo
    echo -e "${BLUE}Compilando SudokuGUI.java...${NC}"
    javac SudokuGUI.java
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Compilação bem-sucedida!${NC}"
        echo
        echo -e "${BLUE}Executando interface gráfica...${NC}"
        java SudokuGUI
    else
        echo -e "${RED}Erro na compilação!${NC}"
        read -p "Pressione Enter para continuar..."
    fi
}

compile_terminal() {
    echo
    echo -e "${BLUE}Compilando Sudoku.java...${NC}"
    javac Sudoku.java
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Compilação bem-sucedida!${NC}"
        echo
        echo -e "${BLUE}Executando versão terminal...${NC}"
        echo
        echo -e "${YELLOW}Dica: Para usar os argumentos do desafio DIO, execute:${NC}"
        echo "java Sudoku 0,0;4,false 1,0;7,false 2,0;9,true..."
        echo
        java Sudoku
    else
        echo -e "${RED}Erro na compilação!${NC}"
        read -p "Pressione Enter para continuar..."
    fi
}

compile_all() {
    echo
    echo -e "${BLUE}Compilando todos os arquivos...${NC}"
    javac *.java
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Compilação bem-sucedida!${NC}"
        echo
        read -p "Pressione Enter para continuar..."
    else
        echo -e "${RED}Erro na compilação!${NC}"
        read -p "Pressione Enter para continuar..."
    fi
}

# Menu principal
while true; do
    show_menu
    read -p "Digite sua escolha (1-4): " choice
    
    case $choice in
        1)
            compile_gui
            ;;
        2)
            compile_terminal
            ;;
        3)
            compile_all
            ;;
        4)
            echo
            echo -e "${GREEN}Obrigado por usar o Sudoku!${NC}"
            echo
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida! Tente novamente.${NC}"
            echo
            ;;
    esac
done
