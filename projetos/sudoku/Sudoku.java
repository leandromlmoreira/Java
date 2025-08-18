import java.util.Scanner;

public class Sudoku {
    private static final int TAMANHO = 9;
    private static int[][] tabuleiro = new int[TAMANHO][TAMANHO];
    private static boolean[][] numerosFixos = new boolean[TAMANHO][TAMANHO];
    
    public static void main(String[] args) {
        inicializarTabuleiro(args);
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            exibirMenu();
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    exibirTabuleiro();
                    break;
                case 2:
                    colocarNumero(scanner);
                    break;
                case 3:
                    removerNumero(scanner);
                    break;
                case 4:
                    verificarJogo();
                    break;
                case 5:
                    verificarStatus();
                    break;
                case 6:
                    limparTabuleiro();
                    break;
                case 7:
                    finalizarJogo();
                    break;
                case 8:
                    System.out.println("Saindo do jogo...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 8);
        
        scanner.close();
    }
    
    private static void inicializarTabuleiro(String[] args) {
        if (args.length % 3 != 0) {
            System.out.println("Argumentos inválidos! Use: numero linha coluna");
            return;
        }
        
        for (int i = 0; i < args.length; i += 3) {
            try {
                int numero = Integer.parseInt(args[i]);
                int linha = Integer.parseInt(args[i + 1]);
                int coluna = Integer.parseInt(args[i + 2]);
                
                if (linha >= 0 && linha < TAMANHO && coluna >= 0 && coluna < TAMANHO) {
                    tabuleiro[linha][coluna] = numero;
                    numerosFixos[linha][coluna] = true;
                }
            } catch (NumberFormatException e) {
                System.out.println("Argumento inválido: " + args[i]);
            }
        }
    }
    
    private static void exibirMenu() {
        System.out.println("\n=== SUDOKU ===");
        System.out.println("1. Ver tabuleiro");
        System.out.println("2. Colocar número");
        System.out.println("3. Remover número");
        System.out.println("4. Verificar jogo");
        System.out.println("5. Verificar status");
        System.out.println("6. Limpar tabuleiro");
        System.out.println("7. Finalizar jogo");
        System.out.println("8. Sair");
        System.out.print("Escolha uma opção: ");
    }
    
    private static void exibirTabuleiro() {
        System.out.println("\n  0 1 2   3 4 5   6 7 8");
        System.out.println("  -------------------------");
        
        for (int i = 0; i < TAMANHO; i++) {
            System.out.print(i + " |");
            for (int j = 0; j < TAMANHO; j++) {
                if (tabuleiro[i][j] == 0) {
                    System.out.print("  ");
                } else {
                    System.out.print(" " + tabuleiro[i][j]);
                }
                
                if (j == 2 || j == 5) {
                    System.out.print(" |");
                }
            }
            System.out.println(" |");
            
            if (i == 2 || i == 5) {
                System.out.println("  -------------------------");
            }
        }
    }
    
    private static void colocarNumero(Scanner scanner) {
        System.out.print("Digite a linha (0-8): ");
        int linha = scanner.nextInt();
        System.out.print("Digite a coluna (0-8): ");
        int coluna = scanner.nextInt();
        System.out.print("Digite o número (1-9): ");
        int numero = scanner.nextInt();
        
        if (linha < 0 || linha >= TAMANHO || coluna < 0 || coluna >= TAMANHO) {
            System.out.println("Posição inválida!");
            return;
        }
        
        if (numero < 1 || numero > 9) {
            System.out.println("Número inválido!");
            return;
        }
        
        if (numerosFixos[linha][coluna]) {
            System.out.println("Posição fixa! Não pode ser alterada.");
            return;
        }
        
        if (tabuleiro[linha][coluna] != 0) {
            System.out.println("Posição já ocupada!");
            return;
        }
        
        if (podeColocarNumero(linha, coluna, numero)) {
            tabuleiro[linha][coluna] = numero;
            System.out.println("Número colocado com sucesso!");
        } else {
            System.out.println("Número não pode ser colocado nesta posição!");
        }
    }
    
    private static void removerNumero(Scanner scanner) {
        System.out.print("Digite a linha (0-8): ");
        int linha = scanner.nextInt();
        System.out.print("Digite a coluna (0-8): ");
        int coluna = scanner.nextInt();
        
        if (linha < 0 || linha >= TAMANHO || coluna < 0 || coluna >= TAMANHO) {
            System.out.println("Posição inválida!");
            return;
        }
        
        if (numerosFixos[linha][coluna]) {
            System.out.println("Posição fixa! Não pode ser removida.");
            return;
        }
        
        if (tabuleiro[linha][coluna] == 0) {
            System.out.println("Posição já está vazia!");
            return;
        }
        
        tabuleiro[linha][coluna] = 0;
        System.out.println("Número removido com sucesso!");
    }
    
    private static boolean podeColocarNumero(int linha, int coluna, int numero) {
        // Verificar linha
        for (int j = 0; j < TAMANHO; j++) {
            if (j != coluna && tabuleiro[linha][j] == numero) {
                return false;
            }
        }
        
        // Verificar coluna
        for (int i = 0; i < TAMANHO; i++) {
            if (i != linha && tabuleiro[i][coluna] == numero) {
                return false;
            }
        }
        
        // Verificar quadrado 3x3
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
    }
    
    private static void verificarJogo() {
        boolean temErros = false;
        
        // Verificar linhas
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                if (tabuleiro[i][j] != 0) {
                    int numero = tabuleiro[i][j];
                    tabuleiro[i][j] = 0;
                    if (!podeColocarNumero(i, j, numero)) {
                        System.out.println("Erro na posição [" + i + "][" + j + "]");
                        temErros = true;
                    }
                    tabuleiro[i][j] = numero;
                }
            }
        }
        
        if (!temErros) {
            System.out.println("Jogo sem erros!");
        }
    }
    
    private static void verificarStatus() {
        int espacosVazios = 0;
        boolean temErros = false;
        
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                if (tabuleiro[i][j] == 0) {
                    espacosVazios++;
                }
            }
        }
        
        if (espacosVazios == 0) {
            System.out.println("Status: COMPLETO");
        } else {
            System.out.println("Status: INCOMPLETO (" + espacosVazios + " espaços vazios)");
        }
        
        verificarJogo();
    }
    
    private static void limparTabuleiro() {
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                if (!numerosFixos[i][j]) {
                    tabuleiro[i][j] = 0;
                }
            }
        }
        System.out.println("Tabuleiro limpo! Números fixos mantidos.");
    }
    
    private static void finalizarJogo() {
        int espacosVazios = 0;
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                if (tabuleiro[i][j] == 0) {
                    espacosVazios++;
                }
            }
        }
        
        if (espacosVazios == 0) {
            System.out.println("Parabéns! Jogo concluído com sucesso!");
        } else {
            System.out.println("Jogo incompleto! Preencha todos os espaços vazios.");
        }
    }
}
