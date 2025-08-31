import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;
import java.util.Random;

public class SudokuGUI extends JFrame {
    private static final int TAMANHO = 9;
    private JTextField[][] campos = new JTextField[TAMANHO][TAMANHO];
    private int[][] tabuleiro = new int[TAMANHO][TAMANHO];
    private boolean[][] numerosFixos = new boolean[TAMANHO][TAMANHO];
    private JLabel timerLabel;
    private JLabel statusLabel;
    private Timer timer;
    private int segundos = 0;
    private int minutos = 0;
    private int horas = 0;
    
    public SudokuGUI() {
        setTitle("Sudoku - DIO Challenge");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(600, 700);
        setLocationRelativeTo(null);
        setResizable(false);
        
        inicializarComponentes();
        inicializarTabuleiro();
        iniciarTimer();
        
        setVisible(true);
    }
    
    private void inicializarComponentes() {
        setLayout(new BorderLayout());
        
        JPanel painelSuperior = new JPanel();
        painelSuperior.setLayout(new FlowLayout());
        painelSuperior.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JButton btnNovoJogo = new JButton("Novo Jogo");
        JButton btnVerificar = new JButton("Verificar");
        JButton btnResolver = new JButton("Resolver");
        JButton btnLimpar = new JButton("Limpar");
        
        btnNovoJogo.addActionListener(e -> novoJogo());
        btnVerificar.addActionListener(e -> verificarJogo());
        btnResolver.addActionListener(e -> resolverJogo());
        btnLimpar.addActionListener(e -> limparTabuleiro());
        
        painelSuperior.add(btnNovoJogo);
        painelSuperior.add(btnVerificar);
        painelSuperior.add(btnResolver);
        painelSuperior.add(btnLimpar);
        
        JPanel painelInfo = new JPanel();
        painelInfo.setLayout(new FlowLayout());
        
        timerLabel = new JLabel("Tempo: 00:00:00");
        timerLabel.setFont(new Font("Arial", Font.BOLD, 16));
        timerLabel.setForeground(new Color(70, 130, 180));
        
        statusLabel = new JLabel("Status: Pronto para jogar!");
        statusLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        
        painelInfo.add(timerLabel);
        painelInfo.add(new JLabel(" | "));
        painelInfo.add(statusLabel);
        
        JPanel painelTabuleiro = new JPanel();
        painelTabuleiro.setLayout(new GridLayout(3, 3, 3, 3));
        painelTabuleiro.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        painelTabuleiro.setBackground(new Color(50, 50, 50));
        
        for (int bloco = 0; bloco < 9; bloco++) {
            JPanel subPainel = new JPanel();
            subPainel.setLayout(new GridLayout(3, 3, 1, 1));
            subPainel.setBorder(BorderFactory.createLineBorder(new Color(100, 100, 100), 2));
            subPainel.setBackground(new Color(70, 70, 70));
            
            int blocoLinha = (bloco / 3) * 3;
            int blocoColuna = (bloco % 3) * 3;
            
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    int linha = blocoLinha + i;
                    int coluna = blocoColuna + j;
                    
                    campos[linha][coluna] = new JTextField();
                    campos[linha][coluna].setHorizontalAlignment(JTextField.CENTER);
                    campos[linha][coluna].setFont(new Font("Arial", Font.BOLD, 20));
                    campos[linha][coluna].setPreferredSize(new Dimension(50, 50));
                    
                    final int linhaFinal = linha;
                    final int colunaFinal = coluna;
                    
                    campos[linha][coluna].addKeyListener(new KeyAdapter() {
                        @Override
                        public void keyTyped(KeyEvent e) {
                            char c = e.getKeyChar();
                            if (!Character.isDigit(c) || c == '0') {
                                e.consume();
                            }
                        }
                        
                        @Override
                        public void keyReleased(KeyEvent e) {
                            validarCampo(linhaFinal, colunaFinal);
                        }
                    });
                    
                    subPainel.add(campos[linha][coluna]);
                }
            }
            
            painelTabuleiro.add(subPainel);
        }
        
        JPanel painelDificuldade = new JPanel();
        painelDificuldade.setLayout(new FlowLayout());
        painelDificuldade.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JLabel lblDificuldade = new JLabel("Dificuldade:");
        String[] dificuldades = {"Fácil", "Médio", "Difícil"};
        JComboBox<String> comboDificuldade = new JComboBox<>(dificuldades);
        comboDificuldade.setSelectedIndex(1);
        
        comboDificuldade.addActionListener(e -> {
            String dificuldade = (String) comboDificuldade.getSelectedItem();
            gerarNovoJogo(dificuldade);
        });
        
        painelDificuldade.add(lblDificuldade);
        painelDificuldade.add(comboDificuldade);
        
        add(painelSuperior, BorderLayout.NORTH);
        add(painelInfo, BorderLayout.CENTER);
        add(painelTabuleiro, BorderLayout.SOUTH);
        add(painelDificuldade, BorderLayout.EAST);
    }
    
    private void inicializarTabuleiro() {
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                tabuleiro[i][j] = 0;
                numerosFixos[i][j] = false;
                campos[i][j].setText("");
                campos[i][j].setEditable(true);
                campos[i][j].setBackground(Color.WHITE);
            }
        }
        
        gerarNovoJogo("Médio");
    }
    
    private void gerarNovoJogo(String dificuldade) {
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                tabuleiro[i][j] = 0;
                numerosFixos[i][j] = false;
                campos[i][j].setText("");
                campos[i][j].setEditable(true);
                campos[i][j].setBackground(Color.WHITE);
            }
        }
        
        gerarSolucao();
        
        int numerosParaRemover;
        switch (dificuldade) {
            case "Fácil":
                numerosParaRemover = 30;
                break;
            case "Difícil":
                numerosParaRemover = 50;
                break;
            default:
                numerosParaRemover = 40;
                break;
        }
        
        Random rand = new Random();
        for (int i = 0; i < numerosParaRemover; i++) {
            int linha, coluna;
            do {
                linha = rand.nextInt(TAMANHO);
                coluna = rand.nextInt(TAMANHO);
            } while (tabuleiro[linha][coluna] == 0);
            
            tabuleiro[linha][coluna] = 0;
        }
        
        atualizarInterface();
        reiniciarTimer();
        statusLabel.setText("Status: Novo jogo iniciado!");
    }
    
    private void gerarSolucao() {
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                if (tabuleiro[i][j] == 0) {
                    for (int num = 1; num <= 9; num++) {
                        if (podeColocarNumero(i, j, num)) {
                            tabuleiro[i][j] = num;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    private void atualizarInterface() {
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                if (tabuleiro[i][j] != 0) {
                    campos[i][j].setText(String.valueOf(tabuleiro[i][j]));
                    numerosFixos[i][j] = true;
                    campos[i][j].setEditable(false);
                    campos[i][j].setBackground(new Color(240, 240, 240));
                    campos[i][j].setForeground(Color.BLACK);
                } else {
                    campos[i][j].setText("");
                    numerosFixos[i][j] = false;
                    campos[i][j].setEditable(true);
                    campos[i][j].setBackground(Color.WHITE);
                }
            }
        }
    }
    
    private void validarCampo(int linha, int coluna) {
        if (numerosFixos[linha][coluna]) return;
        
        String texto = campos[linha][coluna].getText();
        if (texto.isEmpty()) {
            tabuleiro[linha][coluna] = 0;
            campos[linha][coluna].setBackground(Color.WHITE);
            return;
        }
        
        try {
            int numero = Integer.parseInt(texto);
            if (numero >= 1 && numero <= 9) {
                if (podeColocarNumero(linha, coluna, numero)) {
                    tabuleiro[linha][coluna] = numero;
                    campos[linha][coluna].setBackground(new Color(200, 255, 200));
                } else {
                    campos[linha][coluna].setBackground(new Color(255, 200, 200));
                }
            } else {
                campos[linha][coluna].setBackground(new Color(255, 200, 200));
            }
        } catch (NumberFormatException e) {
            campos[linha][coluna].setBackground(new Color(255, 200, 200));
        }
    }
    
    private boolean podeColocarNumero(int linha, int coluna, int numero) {
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
    }
    
    private void novoJogo() {
        int opcao = JOptionPane.showConfirmDialog(this, 
            "Deseja iniciar um novo jogo?", "Novo Jogo", 
            JOptionPane.YES_NO_OPTION);
        
        if (opcao == JOptionPane.YES_OPTION) {
            gerarNovoJogo("Médio");
        }
    }
    
    private void verificarJogo() {
        boolean temErros = false;
        boolean completo = true;
        
        for (int i = 0; i < TAMANHO; i++) {
            for (int j = 0; j < TAMANHO; j++) {
                if (tabuleiro[i][j] == 0) {
                    completo = false;
                    continue;
                }
                
                if (!podeColocarNumero(i, j, tabuleiro[i][j])) {
                    temErros = true;
                    campos[i][j].setBackground(new Color(255, 200, 200));
                }
            }
        }
        
        if (temErros) {
            statusLabel.setText("Status: Jogo com erros!");
            JOptionPane.showMessageDialog(this, "Existem erros no tabuleiro!", 
                "Verificação", JOptionPane.WARNING_MESSAGE);
        } else if (completo) {
            statusLabel.setText("Status: Parabéns! Jogo completo!");
            JOptionPane.showMessageDialog(this, "Parabéns! Você completou o Sudoku!", 
                "Vitória!", JOptionPane.INFORMATION_MESSAGE);
        } else {
            statusLabel.setText("Status: Jogo sem erros!");
            JOptionPane.showMessageDialog(this, "Jogo sem erros! Continue jogando!", 
                "Verificação", JOptionPane.INFORMATION_MESSAGE);
        }
    }
    
    private void resolverJogo() {
        int opcao = JOptionPane.showConfirmDialog(this, 
            "Deseja ver a solução completa?", "Resolver Jogo", 
            JOptionPane.YES_NO_OPTION);
        
        if (opcao == JOptionPane.YES_OPTION) {
            gerarSolucao();
            atualizarInterface();
            statusLabel.setText("Status: Jogo resolvido!");
        }
    }
    
    private void limparTabuleiro() {
        int opcao = JOptionPane.showConfirmDialog(this, 
            "Deseja limpar o tabuleiro?", "Limpar Tabuleiro", 
            JOptionPane.YES_NO_OPTION);
        
        if (opcao == JOptionPane.YES_OPTION) {
            for (int i = 0; i < TAMANHO; i++) {
                for (int j = 0; j < TAMANHO; j++) {
                    if (!numerosFixos[i][j]) {
                        tabuleiro[i][j] = 0;
                        campos[i][j].setText("");
                        campos[i][j].setBackground(Color.WHITE);
                    }
                }
            }
            statusLabel.setText("Status: Tabuleiro limpo!");
        }
    }
    
    private void iniciarTimer() {
        timer = new Timer(1000, e -> {
            segundos++;
            if (segundos == 60) {
                segundos = 0;
                minutos++;
                if (minutos == 60) {
                    minutos = 0;
                    horas++;
                }
            }
            
            String tempo = String.format("Tempo: %02d:%02d:%02d", horas, minutos, segundos);
            timerLabel.setText(tempo);
        });
        timer.start();
    }
    
    private void reiniciarTimer() {
        segundos = 0;
        minutos = 0;
        horas = 0;
        timerLabel.setText("Tempo: 00:00:00");
    }
    
    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            try {
                UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        
        SwingUtilities.invokeLater(() -> new SudokuGUI());
    }
}
