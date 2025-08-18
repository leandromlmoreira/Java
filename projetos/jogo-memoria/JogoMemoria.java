import java.util.*;
import java.io.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

public class JogoMemoria {
    private static final String ARQUIVO_DADOS = "jogo_memoria.json";
    private static final String ARQUIVO_YAML = "jogo_memoria.yaml";
    
    private List<Colecao> colecoes;
    private Jogo jogoAtual;
    private ObjectMapper jsonMapper;
    private ObjectMapper yamlMapper;
    
    public JogoMemoria() {
        this.colecoes = new ArrayList<>();
        this.jsonMapper = new ObjectMapper();
        this.yamlMapper = new ObjectMapper(new YAMLFactory());
        carregarDados();
    }
    
    public static void main(String[] args) {
        JogoMemoria jogo = new JogoMemoria();
        jogo.executar();
    }
    
    public void executar() {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            System.out.println("\n=== JOGO DA MEMÓRIA ===");
            System.out.println("1. Criar uma coleção de cartas");
            System.out.println("2. Iniciar um jogo");
            System.out.println("3. Continuar um jogo");
            System.out.println("4. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    criarColecao(scanner);
                    break;
                case 2:
                    iniciarJogo(scanner);
                    break;
                case 3:
                    continuarJogo();
                    break;
                case 4:
                    salvarDados();
                    System.out.println("Saindo...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 4);
        
        scanner.close();
    }
    
    private void criarColecao(Scanner scanner) {
        System.out.println("\n=== CRIAR COLEÇÃO ===");
        
        System.out.print("Nome da coleção: ");
        scanner.nextLine();
        String nome = scanner.nextLine();
        
        System.out.print("Quantidade de cartas (mínimo 10): ");
        int quantidade = scanner.nextInt();
        
        if (quantidade < 10) {
            System.out.println("Quantidade mínima é 10 cartas!");
            return;
        }
        
        List<Carta> cartas = new ArrayList<>();
        for (int i = 0; i < quantidade; i++) {
            System.out.print("Conteúdo da carta " + (i + 1) + ": ");
            scanner.nextLine();
            String conteudo = scanner.nextLine();
            cartas.add(new Carta(conteudo, i));
        }
        
        Colecao colecao = new Colecao(nome, cartas);
        colecoes.add(colecao);
        
        System.out.println("Coleção '" + nome + "' criada com " + quantidade + " cartas!");
    }
    
    private void iniciarJogo(Scanner scanner) {
        if (colecoes.isEmpty()) {
            System.out.println("Nenhuma coleção disponível! Crie uma coleção primeiro.");
            return;
        }
        
        System.out.println("\n=== INICIAR JOGO ===");
        System.out.println("Coleções disponíveis:");
        
        for (int i = 0; i < colecoes.size(); i++) {
            System.out.println((i + 1) + ". " + colecoes.get(i).getNome() + 
                             " (" + colecoes.get(i).getCartas().size() + " cartas)");
        }
        
        System.out.print("Escolha uma coleção: ");
        int escolha = scanner.nextInt() - 1;
        
        if (escolha >= 0 && escolha < colecoes.size()) {
            Colecao colecao = colecoes.get(escolha);
            jogoAtual = new Jogo(colecao);
            executarJogo(scanner);
        } else {
            System.out.println("Escolha inválida!");
        }
    }
    
    private void continuarJogo() {
        if (jogoAtual == null) {
            System.out.println("Nenhum jogo em andamento!");
            return;
        }
        
        Scanner scanner = new Scanner(System.in);
        executarJogo(scanner);
    }
    
    private void executarJogo(Scanner scanner) {
        int opcao;
        do {
            System.out.println("\n--- JOGO EM ANDAMENTO ---");
            System.out.println("1. Virar 2 cartas");
            System.out.println("2. Pausar jogo");
            System.out.println("3. Ver status do jogo");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    virarCartas(scanner);
                    break;
                case 2:
                    pausarJogo();
                    return;
                case 3:
                    verStatusJogo();
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
            
            if (jogoAtual.isJogoCompleto()) {
                System.out.println("\n🎉 PARABÉNS! JOGO COMPLETO! 🎉");
                System.out.println("Total de lances: " + jogoAtual.getTotalLances());
                System.out.println("Percentual de acertos: " + 
                    String.format("%.1f", jogoAtual.getPercentualAcertos()) + "%");
                jogoAtual = null;
                return;
            }
        } while (opcao != 2);
    }
    
    private void virarCartas(Scanner scanner) {
        if (jogoAtual == null) return;
        
        System.out.println("\n--- VIRAR CARTAS ---");
        jogoAtual.mostrarTabuleiro();
        
        System.out.print("Posição da primeira carta (0-" + (jogoAtual.getCartasVisiveis().size() - 1) + "): ");
        int pos1 = scanner.nextInt();
        
        System.out.print("Posição da segunda carta (0-" + (jogoAtual.getCartasVisiveis().size() - 1) + "): ");
        int pos2 = scanner.nextInt();
        
        if (pos1 == pos2) {
            System.out.println("Escolha posições diferentes!");
            return;
        }
        
        boolean acerto = jogoAtual.virarCartas(pos1, pos2);
        
        if (acerto) {
            System.out.println("🎯 ACERTO! Cartas removidas!");
        } else {
            System.out.println("❌ ERRO! Cartas viradas de volta!");
        }
        
        System.out.println("Lances: " + jogoAtual.getTotalLances());
        System.out.println("Acertos: " + jogoAtual.getAcertos());
    }
    
    private void pausarJogo() {
        if (jogoAtual != null) {
            System.out.println("Jogo pausado. Use 'Continuar um jogo' para retomar.");
        }
    }
    
    private void verStatusJogo() {
        if (jogoAtual == null) return;
        
        System.out.println("\n--- STATUS DO JOGO ---");
        System.out.println("Cartas restantes: " + jogoAtual.getCartasRestantes());
        System.out.println("Total de lances: " + jogoAtual.getTotalLances());
        System.out.println("Acertos: " + jogoAtual.getAcertos());
        System.out.println("Percentual de acertos: " + 
            String.format("%.1f", jogoAtual.getPercentualAcertos()) + "%");
    }
    
    private void carregarDados() {
        try {
            File arquivo = new File(ARQUIVO_DADOS);
            if (arquivo.exists()) {
                String json = new String(java.nio.file.Files.readAllBytes(arquivo.toPath()));
                DadosJogo dados = jsonMapper.readValue(json, DadosJogo.class);
                this.colecoes = dados.getColecoes();
                this.jogoAtual = dados.getJogoAtual();
                System.out.println("Dados carregados com sucesso!");
            }
        } catch (Exception e) {
            System.out.println("Erro ao carregar dados: " + e.getMessage());
        }
    }
    
    private void salvarDados() {
        try {
            DadosJogo dados = new DadosJogo(colecoes, jogoAtual);
            
            String json = jsonMapper.writeValueAsString(dados);
            java.nio.file.Files.write(java.nio.file.Paths.get(ARQUIVO_DADOS), json.getBytes());
            
            String yaml = yamlMapper.writeValueAsString(dados);
            java.nio.file.Files.write(java.nio.file.Paths.get(ARQUIVO_YAML), yaml.getBytes());
            
            System.out.println("Dados salvos com sucesso!");
        } catch (Exception e) {
            System.out.println("Erro ao salvar dados: " + e.getMessage());
        }
    }
}

class Carta {
    private String conteudo;
    private int id;
    private boolean virada;
    private boolean removida;
    
    public Carta(String conteudo, int id) {
        this.conteudo = conteudo;
        this.id = id;
        this.virada = false;
        this.removida = false;
    }
    
    public String getConteudo() { return conteudo; }
    public int getId() { return id; }
    public boolean isVirada() { return virada; }
    public boolean isRemovida() { return removida; }
    
    public void setVirada(boolean virada) { this.virada = virada; }
    public void setRemovida(boolean removida) { this.removida = removida; }
}

class Colecao {
    private String nome;
    private List<Carta> cartas;
    
    public Colecao(String nome, List<Carta> cartas) {
        this.nome = nome;
        this.cartas = cartas;
    }
    
    public String getNome() { return nome; }
    public List<Carta> getCartas() { return cartas; }
}

class Jogo {
    private Colecao colecao;
    private List<Carta> cartasVisiveis;
    private int totalLances;
    private int acertos;
    private Carta primeiraCarta;
    private Carta segundaCarta;
    
    public Jogo(Colecao colecao) {
        this.colecao = colecao;
        this.cartasVisiveis = new ArrayList<>(colecao.getCartas());
        this.totalLances = 0;
        this.acertos = 0;
        embaralharCartas();
    }
    
    private void embaralharCartas() {
        Collections.shuffle(cartasVisiveis);
    }
    
    public boolean virarCartas(int pos1, int pos2) {
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
        } else {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            carta1.setVirada(false);
            carta2.setVirada(false);
            return false;
        }
    }
    
    public void mostrarTabuleiro() {
        System.out.println("\nTabuleiro:");
        for (int i = 0; i < cartasVisiveis.size(); i++) {
            Carta carta = cartasVisiveis.get(i);
            if (carta.isRemovida()) {
                System.out.print("[   ] ");
            } else if (carta.isVirada()) {
                System.out.print("[" + carta.getConteudo().substring(0, Math.min(3, carta.getConteudo().length())) + "] ");
            } else {
                System.out.print("[" + i + "] ");
            }
            
            if ((i + 1) % 5 == 0) {
                System.out.println();
            }
        }
        System.out.println();
    }
    
    public boolean isJogoCompleto() {
        return cartasVisiveis.stream().allMatch(Carta::isRemovida);
    }
    
    public int getCartasRestantes() {
        return (int) cartasVisiveis.stream().filter(c -> !c.isRemovida()).count();
    }
    
    public int getTotalLances() { return totalLances; }
    public int getAcertos() { return acertos; }
    public List<Carta> getCartasVisiveis() { return cartasVisiveis; }
    
    public double getPercentualAcertos() {
        if (totalLances == 0) return 0.0;
        return (double) acertos / totalLances * 100;
    }
}

class DadosJogo {
    private List<Colecao> colecoes;
    private Jogo jogoAtual;
    
    public DadosJogo() {}
    
    public DadosJogo(List<Colecao> colecoes, Jogo jogoAtual) {
        this.colecoes = colecoes;
        this.jogoAtual = jogoAtual;
    }
    
    public List<Colecao> getColecoes() { return colecoes; }
    public Jogo getJogoAtual() { return jogoAtual; }
    
    public void setColecoes(List<Colecao> colecoes) { this.colecoes = colecoes; }
    public void setJogoAtual(Jogo jogoAtual) { this.jogoAtual = jogoAtual; }
}
