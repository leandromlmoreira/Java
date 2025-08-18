import java.util.*;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class BoardTarefas {
    private static final String URL = "jdbc:mysql://localhost:3306/board_tarefas";
    private static final String USER = "root";
    private static final String PASSWORD = "password";
    
    private Connection connection;
    private Scanner scanner;
    
    public BoardTarefas() {
        this.scanner = new Scanner(System.in);
        conectarBanco();
        criarTabelas();
    }
    
    public static void main(String[] args) {
        BoardTarefas board = new BoardTarefas();
        board.executar();
    }
    
    private void conectarBanco() {
        try {
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Conectado ao banco de dados MySQL!");
        } catch (SQLException e) {
            System.out.println("Erro ao conectar ao banco: " + e.getMessage());
            System.out.println("Verifique se o MySQL está rodando e as credenciais estão corretas.");
            System.exit(1);
        }
    }
    
    private void criarTabelas() {
        try {
            Statement stmt = connection.createStatement();
            
            stmt.execute("CREATE TABLE IF NOT EXISTS boards (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY," +
                        "nome VARCHAR(100) NOT NULL," +
                        "data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")");
            
            stmt.execute("CREATE TABLE IF NOT EXISTS colunas (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY," +
                        "board_id INT," +
                        "nome VARCHAR(50) NOT NULL," +
                        "ordem INT NOT NULL," +
                        "tipo ENUM('inicial', 'pendente', 'final', 'cancelamento') NOT NULL," +
                        "FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE" +
                        ")");
            
            stmt.execute("CREATE TABLE IF NOT EXISTS cards (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY," +
                        "coluna_id INT," +
                        "titulo VARCHAR(200) NOT NULL," +
                        "descricao TEXT," +
                        "data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                        "data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                        "bloqueado BOOLEAN DEFAULT FALSE," +
                        "motivo_bloqueio TEXT," +
                        "FOREIGN KEY (coluna_id) REFERENCES colunas(id) ON DELETE CASCADE" +
                        ")");
            
            stmt.execute("CREATE TABLE IF NOT EXISTS historico_movimentos (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY," +
                        "card_id INT," +
                        "coluna_origem_id INT," +
                        "coluna_destino_id INT," +
                        "data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                        "FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE," +
                        "FOREIGN KEY (coluna_origem_id) REFERENCES colunas(id) ON DELETE CASCADE," +
                        "FOREIGN KEY (coluna_destino_id) REFERENCES colunas(id) ON DELETE CASCADE" +
                        ")");
            
            stmt.execute("CREATE TABLE IF NOT EXISTS historico_bloqueios (" +
                        "id INT AUTO_INCREMENT PRIMARY KEY," +
                        "card_id INT," +
                        "acao ENUM('bloqueio', 'desbloqueio') NOT NULL," +
                        "motivo TEXT," +
                        "data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                        "FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE" +
                        ")");
            
            System.out.println("Tabelas criadas/verificadas com sucesso!");
            
        } catch (SQLException e) {
            System.out.println("Erro ao criar tabelas: " + e.getMessage());
        }
    }
    
    public void executar() {
        int opcao;
        
        do {
            System.out.println("\n=== BOARD DE TAREFAS ===");
            System.out.println("1. Criar novo board");
            System.out.println("2. Selecionar board");
            System.out.println("3. Excluir boards");
            System.out.println("4. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    criarBoard();
                    break;
                case 2:
                    selecionarBoard();
                    break;
                case 3:
                    excluirBoards();
                    break;
                case 4:
                    System.out.println("Saindo...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 4);
        
        scanner.close();
        fecharConexao();
    }
    
    private void criarBoard() {
        System.out.println("\n=== CRIAR NOVO BOARD ===");
        
        System.out.print("Nome do board: ");
        scanner.nextLine();
        String nome = scanner.nextLine();
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO boards (nome) VALUES (?)", 
                Statement.RETURN_GENERATED_KEYS
            );
            pstmt.setString(1, nome);
            pstmt.executeUpdate();
            
            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                int boardId = rs.getInt(1);
                criarColunasPadrao(boardId);
                System.out.println("Board '" + nome + "' criado com sucesso!");
            }
            
        } catch (SQLException e) {
            System.out.println("Erro ao criar board: " + e.getMessage());
        }
    }
    
    private void criarColunasPadrao(int boardId) {
        try {
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
            
        } catch (SQLException e) {
            System.out.println("Erro ao criar colunas padrão: " + e.getMessage());
        }
    }
    
    private void selecionarBoard() {
        System.out.println("\n=== SELECIONAR BOARD ===");
        
        try {
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, nome FROM boards ORDER BY nome");
            
            List<Board> boards = new ArrayList<>();
            while (rs.next()) {
                boards.add(new Board(rs.getInt("id"), rs.getString("nome")));
            }
            
            if (boards.isEmpty()) {
                System.out.println("Nenhum board disponível!");
                return;
            }
            
            System.out.println("Boards disponíveis:");
            for (int i = 0; i < boards.size(); i++) {
                System.out.println((i + 1) + ". " + boards.get(i).getNome());
            }
            
            System.out.print("Escolha um board: ");
            int escolha = scanner.nextInt() - 1;
            
            if (escolha >= 0 && escolha < boards.size()) {
                Board board = boards.get(escolha);
                gerenciarBoard(board);
            } else {
                System.out.println("Escolha inválida!");
            }
            
        } catch (SQLException e) {
            System.out.println("Erro ao listar boards: " + e.getMessage());
        }
    }
    
    private void gerenciarBoard(Board board) {
        int opcao;
        do {
            System.out.println("\n--- BOARD: " + board.getNome() + " ---");
            System.out.println("1. Mover card para próxima coluna");
            System.out.println("2. Cancelar um card");
            System.out.println("3. Criar card");
            System.out.println("4. Bloquear card");
            System.out.println("5. Desbloquear card");
            System.out.println("6. Ver board");
            System.out.println("7. Gerar relatório de tempo");
            System.out.println("8. Gerar relatório de bloqueios");
            System.out.println("9. Fechar board");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    moverCard(board);
                    break;
                case 2:
                    cancelarCard(board);
                    break;
                case 3:
                    criarCard(board);
                    break;
                case 4:
                    bloquearCard(board);
                    break;
                case 5:
                    desbloquearCard(board);
                    break;
                case 6:
                    verBoard(board);
                    break;
                case 7:
                    gerarRelatorioTempo(board);
                    break;
                case 8:
                    gerarRelatorioBloqueios(board);
                    break;
                case 9:
                    System.out.println("Fechando board...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 9);
    }
    
    private void criarCard(Board board) {
        System.out.println("\n--- CRIAR CARD ---");
        
        System.out.print("Título do card: ");
        scanner.nextLine();
        String titulo = scanner.nextLine();
        
        System.out.print("Descrição: ");
        String descricao = scanner.nextLine();
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "INSERT INTO cards (coluna_id, titulo, descricao) VALUES (?, ?, ?)"
            );
            
            pstmt.setInt(1, obterColunaInicial(board.getId()));
            pstmt.setString(2, titulo);
            pstmt.setString(3, descricao);
            pstmt.executeUpdate();
            
            System.out.println("Card criado com sucesso!");
            
        } catch (SQLException e) {
            System.out.println("Erro ao criar card: " + e.getMessage());
        }
    }
    
    private void moverCard(Board board) {
        System.out.println("\n--- MOVER CARD ---");
        verBoard(board);
        
        System.out.print("ID do card a mover: ");
        int cardId = scanner.nextInt();
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "SELECT c.id, c.coluna_id, col.ordem, col.tipo FROM cards c " +
                "JOIN colunas col ON c.coluna_id = col.id " +
                "WHERE c.id = ? AND c.bloqueado = FALSE"
            );
            pstmt.setInt(1, cardId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                int colunaAtual = rs.getInt("coluna_id");
                int ordemAtual = rs.getInt("ordem");
                String tipoAtual = rs.getString("tipo");
                
                if ("final".equals(tipoAtual)) {
                    System.out.println("Card já está na coluna final!");
                    return;
                }
                
                int proximaColuna = obterProximaColuna(board.getId(), ordemAtual);
                if (proximaColuna > 0) {
                    moverCardParaColuna(cardId, colunaAtual, proximaColuna);
                    System.out.println("Card movido com sucesso!");
                } else {
                    System.out.println("Não foi possível mover o card!");
                }
            } else {
                System.out.println("Card não encontrado ou está bloqueado!");
            }
            
        } catch (SQLException e) {
            System.out.println("Erro ao mover card: " + e.getMessage());
        }
    }
    
    private void cancelarCard(Board board) {
        System.out.println("\n--- CANCELAR CARD ---");
        verBoard(board);
        
        System.out.print("ID do card a cancelar: ");
        int cardId = scanner.nextInt();
        
        try {
            int colunaCancelamento = obterColunaCancelamento(board.getId());
            
            PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE cards SET coluna_id = ? WHERE id = ?"
            );
            pstmt.setInt(1, colunaCancelamento);
            pstmt.setInt(2, cardId);
            pstmt.executeUpdate();
            
            System.out.println("Card cancelado com sucesso!");
            
        } catch (SQLException e) {
            System.out.println("Erro ao cancelar card: " + e.getMessage());
        }
    }
    
    private void bloquearCard(Board board) {
        System.out.println("\n--- BLOQUEAR CARD ---");
        verBoard(board);
        
        System.out.print("ID do card a bloquear: ");
        int cardId = scanner.nextInt();
        
        System.out.print("Motivo do bloqueio: ");
        scanner.nextLine();
        String motivo = scanner.nextLine();
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE cards SET bloqueado = TRUE, motivo_bloqueio = ? WHERE id = ?"
            );
            pstmt.setString(1, motivo);
            pstmt.setInt(2, cardId);
            pstmt.executeUpdate();
            
            PreparedStatement pstmtHistorico = connection.prepareStatement(
                "INSERT INTO historico_bloqueios (card_id, acao, motivo) VALUES (?, 'bloqueio', ?)"
            );
            pstmtHistorico.setInt(1, cardId);
            pstmtHistorico.setString(2, motivo);
            pstmtHistorico.executeUpdate();
            
            System.out.println("Card bloqueado com sucesso!");
            
        } catch (SQLException e) {
            System.out.println("Erro ao bloquear card: " + e.getMessage());
        }
    }
    
    private void desbloquearCard(Board board) {
        System.out.println("\n--- DESBLOQUEAR CARD ---");
        verBoard(board);
        
        System.out.print("ID do card a desbloquear: ");
        int cardId = scanner.nextInt();
        
        System.out.print("Motivo do desbloqueio: ");
        scanner.nextLine();
        String motivo = scanner.nextLine();
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE cards SET bloqueado = FALSE, motivo_bloqueio = NULL WHERE id = ?"
            );
            pstmt.setInt(1, cardId);
            pstmt.executeUpdate();
            
            PreparedStatement pstmtHistorico = connection.prepareStatement(
                "INSERT INTO historico_bloqueios (card_id, acao, motivo) VALUES (?, 'desbloqueio', ?)"
            );
            pstmtHistorico.setInt(1, cardId);
            pstmtHistorico.setString(2, motivo);
            pstmtHistorico.executeUpdate();
            
            System.out.println("Card desbloqueado com sucesso!");
            
        } catch (SQLException e) {
            System.out.println("Erro ao desbloquear card: " + e.getMessage());
        }
    }
    
    private void verBoard(Board board) {
        System.out.println("\n--- BOARD: " + board.getNome() + " ---");
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "SELECT col.nome, col.ordem, col.tipo, c.id, c.titulo, c.bloqueado " +
                "FROM colunas col " +
                "LEFT JOIN cards c ON col.id = c.coluna_id " +
                "WHERE col.board_id = ? " +
                "ORDER BY col.ordem"
            );
            pstmt.setInt(1, board.getId());
            ResultSet rs = pstmt.executeQuery();
            
            String colunaAtual = "";
            while (rs.next()) {
                String nomeColuna = rs.getString("nome");
                if (!nomeColuna.equals(colunaAtual)) {
                    System.out.println("\n[" + nomeColuna + "]");
                    colunaAtual = nomeColuna;
                }
                
                if (rs.getObject("id") != null) {
                    String bloqueado = rs.getBoolean("bloqueado") ? " 🔒" : "";
                    System.out.println("  • " + rs.getString("titulo") + " (ID: " + rs.getInt("id") + ")" + bloqueado);
                }
            }
            
        } catch (SQLException e) {
            System.out.println("Erro ao visualizar board: " + e.getMessage());
        }
    }
    
    private void gerarRelatorioTempo(Board board) {
        System.out.println("\n--- RELATÓRIO DE TEMPO ---");
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "SELECT c.titulo, c.data_criacao, c.data_movimento, " +
                "TIMESTAMPDIFF(HOUR, c.data_criacao, c.data_movimento) as tempo_horas " +
                "FROM cards c " +
                "JOIN colunas col ON c.coluna_id = col.id " +
                "WHERE col.board_id = ? AND col.tipo = 'final' " +
                "ORDER BY c.data_movimento DESC"
            );
            pstmt.setInt(1, board.getId());
            ResultSet rs = pstmt.executeQuery();
            
            System.out.println("Tarefas concluídas:");
            while (rs.next()) {
                System.out.println("• " + rs.getString("titulo") + 
                                 " - Tempo: " + rs.getInt("tempo_horas") + " horas");
            }
            
        } catch (SQLException e) {
            System.out.println("Erro ao gerar relatório: " + e.getMessage());
        }
    }
    
    private void gerarRelatorioBloqueios(Board board) {
        System.out.println("\n--- RELATÓRIO DE BLOQUEIOS ---");
        
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "SELECT c.titulo, hb.acao, hb.motivo, hb.data_acao " +
                "FROM historico_bloqueios hb " +
                "JOIN cards c ON hb.card_id = c.id " +
                "JOIN colunas col ON c.coluna_id = col.id " +
                "WHERE col.board_id = ? " +
                "ORDER BY hb.data_acao DESC"
            );
            pstmt.setInt(1, board.getId());
            ResultSet rs = pstmt.executeQuery();
            
            System.out.println("Histórico de bloqueios:");
            while (rs.next()) {
                System.out.println("• " + rs.getString("titulo") + 
                                 " - " + rs.getString("acao") + 
                                 " - Motivo: " + rs.getString("motivo") +
                                 " - Data: " + rs.getTimestamp("data_acao"));
            }
            
        } catch (SQLException e) {
            System.out.println("Erro ao gerar relatório: " + e.getMessage());
        }
    }
    
    private void excluirBoards() {
        System.out.println("\n=== EXCLUIR BOARDS ===");
        
        try {
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, nome FROM boards ORDER BY nome");
            
            List<Board> boards = new ArrayList<>();
            while (rs.next()) {
                boards.add(new Board(rs.getInt("id"), rs.getString("nome")));
            }
            
            if (boards.isEmpty()) {
                System.out.println("Nenhum board disponível!");
                return;
            }
            
            System.out.println("Boards disponíveis:");
            for (int i = 0; i < boards.size(); i++) {
                System.out.println((i + 1) + ". " + boards.get(i).getNome());
            }
            
            System.out.print("Escolha um board para excluir: ");
            int escolha = scanner.nextInt() - 1;
            
            if (escolha >= 0 && escolha < boards.size()) {
                Board board = boards.get(escolha);
                
                System.out.print("Confirma exclusão do board '" + board.getNome() + "'? (s/n): ");
                scanner.nextLine();
                String confirmacao = scanner.nextLine();
                
                if (confirmacao.equalsIgnoreCase("s")) {
                    PreparedStatement pstmt = connection.prepareStatement("DELETE FROM boards WHERE id = ?");
                    pstmt.setInt(1, board.getId());
                    pstmt.executeUpdate();
                    System.out.println("Board excluído com sucesso!");
                } else {
                    System.out.println("Exclusão cancelada.");
                }
            } else {
                System.out.println("Escolha inválida!");
            }
            
        } catch (SQLException e) {
            System.out.println("Erro ao excluir board: " + e.getMessage());
        }
    }
    
    private int obterColunaInicial(int boardId) {
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "SELECT id FROM colunas WHERE board_id = ? AND tipo = 'inicial'"
            );
            pstmt.setInt(1, boardId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("id");
            }
        } catch (SQLException e) {
            System.out.println("Erro ao obter coluna inicial: " + e.getMessage());
        }
        return -1;
    }
    
    private int obterProximaColuna(int boardId, int ordemAtual) {
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "SELECT id FROM colunas WHERE board_id = ? AND ordem = ?"
            );
            pstmt.setInt(1, boardId);
            pstmt.setInt(2, ordemAtual + 1);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("id");
            }
        } catch (SQLException e) {
            System.out.println("Erro ao obter próxima coluna: " + e.getMessage());
        }
        return -1;
    }
    
    private int obterColunaCancelamento(int boardId) {
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "SELECT id FROM colunas WHERE board_id = ? AND tipo = 'cancelamento'"
            );
            pstmt.setInt(1, boardId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("id");
            }
        } catch (SQLException e) {
            System.out.println("Erro ao obter coluna de cancelamento: " + e.getMessage());
        }
        return -1;
    }
    
    private void moverCardParaColuna(int cardId, int colunaOrigem, int colunaDestino) {
        try {
            PreparedStatement pstmt = connection.prepareStatement(
                "UPDATE cards SET coluna_id = ?, data_movimento = CURRENT_TIMESTAMP WHERE id = ?"
            );
            pstmt.setInt(1, colunaDestino);
            pstmt.setInt(2, cardId);
            pstmt.executeUpdate();
            
            PreparedStatement pstmtHistorico = connection.prepareStatement(
                "INSERT INTO historico_movimentos (card_id, coluna_origem_id, coluna_destino_id) VALUES (?, ?, ?)"
            );
            pstmtHistorico.setInt(1, cardId);
            pstmtHistorico.setInt(2, colunaOrigem);
            pstmtHistorico.setInt(3, colunaDestino);
            pstmtHistorico.executeUpdate();
            
        } catch (SQLException e) {
            System.out.println("Erro ao mover card: " + e.getMessage());
        }
    }
    
    private void fecharConexao() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("Conexão com banco fechada.");
            }
        } catch (SQLException e) {
            System.out.println("Erro ao fechar conexão: " + e.getMessage());
        }
    }
}

class Board {
    private int id;
    private String nome;
    
    public Board(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    public int getId() { return id; }
    public String getNome() { return nome; }
}
