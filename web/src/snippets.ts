export interface AppCard {
  id: string
  title: string
  description: string
  path: string
  runCommand: string
  language: string
  snippet: string
}

export const apps: AppCard[] = [
  {
    id: 'calculadora',
    title: 'Calculadora',
    description:
      'Calculadora de linha de comando com menu interativo: soma, subtração, multiplicação, divisão e potenciação. Soma e subtração têm um submenu para acumular resultados informando mais números.',
    path: 'projetos/calculadora/Calculadora.java',
    runCommand: 'cd projetos/calculadora && javac Calculadora.java && java Calculadora',
    language: 'java',
    snippet: `private static void realizarDivisao(Scanner scanner) {
    System.out.print("Digite o dividendo: ");
    double dividendo = scanner.nextDouble();
    System.out.print("Digite o divisor: ");
    double divisor = scanner.nextDouble();

    if (divisor == 0) {
        System.out.println("Erro: Divisão por zero não é permitida!");
        return;
    }

    double quociente = dividendo / divisor;
    double resto = dividendo % divisor;

    System.out.println("Resultado: " + dividendo + " ÷ " + divisor + " = " + quociente);
    System.out.println("Resto: " + resto);
}`,
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description:
      'Jogo de Sudoku 9x9 em modo texto, com validação de linhas, colunas e quadrantes 3x3, números fixos via argumentos de linha de comando e verificação de conflitos. Também existe uma versão com interface gráfica Swing (SudokuGUI).',
    path: 'projetos/sudoku/Sudoku.java',
    runCommand: 'cd projetos/sudoku && javac Sudoku.java && java Sudoku',
    language: 'java',
    snippet: `private static boolean podeColocarNumero(int linha, int coluna, int numero) {
    for (int j = 0; j < TAMANHO; j++) {
        if (j != coluna && tabuleiro[linha][j] == numero) {
            return false;
        }
    }

    for (int i = 0; i < TAMANHO; i++) {
        if (i != linha && tabuleiro[i][coluna] == numero) {
            return false;
        }
    }

    int quadradoLinha = (linha / 3) * 3;
    int quadradoColuna = (coluna / 3) * 3;

    for (int i = quadradoLinha; i < quadradoLinha + 3; i++) {
        for (int j = quadradoColuna; j < quadradoColuna + 3; j++) {
            if ((i != linha || j != coluna) && tabuleiro[i][j] == numero) {
                return false;
            }
        }
    }

    return true;
}`,
  },
  {
    id: 'jogo-memoria',
    title: 'Jogo da Memória',
    description:
      'Jogo de cartas com pares a serem encontrados, contagem de tentativas e percentual de acerto. Suporta coleções de cartas próprias e persiste o estado da partida em JSON e YAML via Jackson.',
    path: 'projetos/jogo-memoria/JogoMemoria.java',
    runCommand:
      'cd projetos/jogo-memoria && mvn clean compile && mvn exec:java -Dexec.mainClass="JogoMemoria"',
    language: 'java',
    snippet: `public boolean virarCartas(int pos1, int pos2) {
    if (pos1 < 0 || pos1 >= cartasVisiveis.size() ||
        pos2 < 0 || pos2 >= cartasVisiveis.size()) {
        return false;
    }

    Carta carta1 = cartasVisiveis.get(pos1);
    Carta carta2 = cartasVisiveis.get(pos2);

    if (carta1.isRemovida() || carta2.isRemovida()) {
        return false;
    }

    carta1.setVirada(true);
    carta2.setVirada(true);
    totalLances++;

    if (carta1.getConteudo().equals(carta2.getConteudo())) {
        carta1.setRemovida(true);
        carta2.setRemovida(true);
        acertos++;
        return true;
    }

    carta1.setVirada(false);
    carta2.setVirada(false);
    return false;
}`,
  },
  {
    id: 'board-tarefas',
    title: 'Board de Tarefas',
    description:
      'Sistema de board estilo Kanban com colunas de workflow padrão, bloqueio de cards com motivo registrado e relatórios de tempo por card. Persistência via JDBC em MySQL, com schema criado automaticamente na primeira execução.',
    path: 'projetos/board-tarefas/BoardTarefas.java',
    runCommand:
      'cd projetos/board-tarefas && mvn clean compile && mvn exec:java -Dexec.mainClass="BoardTarefas"',
    language: 'java',
    snippet: `private void criarColunasPadrao(int boardId) {
    PreparedStatement pstmt = connection.prepareStatement(
        "INSERT INTO colunas (board_id, nome, ordem, tipo) VALUES (?, ?, ?, ?)"
    );

    String[][] colunas = {
        {"A Fazer", "1", "inicial"},
        {"Em Andamento", "2", "pendente"},
        {"Em Revisão", "3", "pendente"},
        {"Concluído", "4", "final"},
        {"Cancelado", "5", "cancelamento"}
    };

    for (String[] coluna : colunas) {
        pstmt.setInt(1, boardId);
        pstmt.setString(2, coluna[0]);
        pstmt.setInt(3, Integer.parseInt(coluna[1]));
        pstmt.setString(4, coluna[2]);
        pstmt.executeUpdate();
    }
}`,
  },
]
