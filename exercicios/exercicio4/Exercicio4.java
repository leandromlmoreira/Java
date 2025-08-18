import java.util.Scanner;

public class Exercicio4 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            System.out.println("\n=== EXERCÍCIO 4 - HERANÇA E POLIMORFISMO ===");
            System.out.println("1. Testar Sistema de Ingressos");
            System.out.println("2. Testar Sistema de Usuários");
            System.out.println("3. Testar Sistema de Relógios");
            System.out.println("4. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    testarIngressos(scanner);
                    break;
                case 2:
                    testarUsuarios(scanner);
                    break;
                case 3:
                    testarRelogios(scanner);
                    break;
                case 4:
                    System.out.println("Saindo...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 4);
        
        scanner.close();
    }
    
    private static void testarIngressos(Scanner scanner) {
        System.out.println("\n=== TESTE SISTEMA DE INGRESSOS ===");
        
        System.out.print("Valor base do ingresso: R$ ");
        double valorBase = scanner.nextDouble();
        
        System.out.print("Nome do filme: ");
        scanner.nextLine();
        String nomeFilme = scanner.nextLine();
        
        System.out.print("É dublado? (true/false): ");
        boolean dublado = scanner.nextBoolean();
        
        IngressoNormal ingressoNormal = new IngressoNormal(valorBase, nomeFilme, dublado);
        
        System.out.print("Quantidade de pessoas para ingresso família: ");
        int qtdPessoas = scanner.nextInt();
        
        Ingresso meiaEntrada = new MeiaEntrada(valorBase, nomeFilme, dublado);
        Ingresso ingressoFamilia = new IngressoFamilia(valorBase, nomeFilme, dublado, qtdPessoas);
        
        System.out.println("\n--- Valores dos Ingressos ---");
        System.out.println("Ingresso Normal: R$ " + ingressoNormal.getValorReal());
        System.out.println("Meia Entrada: R$ " + meiaEntrada.getValorReal());
        System.out.println("Ingresso Família (" + qtdPessoas + " pessoas): R$ " + ingressoFamilia.getValorReal());
    }
    
    private static void testarUsuarios(Scanner scanner) {
        System.out.println("\n=== TESTE SISTEMA DE USUÁRIOS ===");
        
        System.out.print("Nome do gerente: ");
        scanner.nextLine();
        String nomeGerente = scanner.nextLine();
        
        System.out.print("Email do gerente: ");
        String emailGerente = scanner.nextLine();
        
        System.out.print("Senha do gerente: ");
        String senhaGerente = scanner.nextLine();
        
        Gerente gerente = new Gerente(nomeGerente, emailGerente, senhaGerente);
        
        System.out.print("Nome do vendedor: ");
        String nomeVendedor = scanner.nextLine();
        
        System.out.print("Email do vendedor: ");
        String emailVendedor = scanner.nextLine();
        
        System.out.print("Senha do vendedor: ");
        String senhaVendedor = scanner.nextLine();
        
        Vendedor vendedor = new Vendedor(nomeVendedor, emailVendedor, senhaVendedor);
        
        System.out.print("Nome do atendente: ");
        String nomeAtendente = scanner.nextLine();
        
        System.out.print("Email do atendente: ");
        String emailAtendente = scanner.nextLine();
        
        System.out.print("Senha do atendente: ");
        String senhaAtendente = scanner.nextLine();
        
        Atendente atendente = new Atendente(nomeAtendente, emailAtendente, senhaAtendente);
        
        System.out.println("\n--- Testando Funcionalidades ---");
        gerente.gerarRelatorioFinanceiro();
        vendedor.realizarVenda();
        atendente.receberPagamento(100.0);
        
        System.out.println("Vendedor é admin: " + vendedor.isAdministrador());
        System.out.println("Gerente é admin: " + gerente.isAdministrador());
        System.out.println("Atendente é admin: " + atendente.isAdministrador());
    }
    
    private static void testarRelogios(Scanner scanner) {
        System.out.println("\n=== TESTE SISTEMA DE RELÓGIOS ===");
        
        RelogioAmericano relogioAmericano = new RelogioAmericano();
        RelogioBrasileiro relogioBrasileiro = new RelogioBrasileiro();
        
        System.out.println("Relógio Americano: " + relogioAmericano.getHoraFormatada());
        System.out.println("Relógio Brasileiro: " + relogioBrasileiro.getHoraFormatada());
        
        System.out.print("Definir hora no relógio americano (0-23): ");
        int hora = scanner.nextInt();
        System.out.print("Definir minuto (0-59): ");
        int minuto = scanner.nextInt();
        System.out.print("Definir segundo (0-59): ");
        int segundo = scanner.nextInt();
        
        relogioAmericano.setHora(hora);
        relogioAmericano.setMinuto(minuto);
        relogioAmericano.setSegundo(segundo);
        
        System.out.println("Relógio Americano atualizado: " + relogioAmericano.getHoraFormatada());
        
        System.out.println("Sincronizando relógio brasileiro com o americano...");
        relogioBrasileiro.sincronizar(relogioAmericano);
        System.out.println("Relógio Brasileiro sincronizado: " + relogioBrasileiro.getHoraFormatada());
    }
}

abstract class Ingresso {
    protected double valor;
    protected String nomeFilme;
    protected boolean dublado;
    
    public Ingresso(double valor, String nomeFilme, boolean dublado) {
        this.valor = valor;
        this.nomeFilme = nomeFilme;
        this.dublado = dublado;
    }
    
    public abstract double getValorReal();
    
    public double getValor() {
        return valor;
    }
    
    public String getNomeFilme() {
        return nomeFilme;
    }
    
    public boolean isDublado() {
        return dublado;
    }
}

class IngressoNormal extends Ingresso {
    public IngressoNormal(double valor, String nomeFilme, boolean dublado) {
        super(valor, nomeFilme, dublado);
    }
    
    @Override
    public double getValorReal() {
        return valor;
    }
}

class MeiaEntrada extends Ingresso {
    public MeiaEntrada(double valor, String nomeFilme, boolean dublado) {
        super(valor, nomeFilme, dublado);
    }
    
    @Override
    public double getValorReal() {
        return valor / 2;
    }
}

class IngressoFamilia extends Ingresso {
    private int quantidadePessoas;
    
    public IngressoFamilia(double valor, String nomeFilme, boolean dublado, int quantidadePessoas) {
        super(valor, nomeFilme, dublado);
        this.quantidadePessoas = quantidadePessoas;
    }
    
    @Override
    public double getValorReal() {
        double valorTotal = valor * quantidadePessoas;
        if (quantidadePessoas > 3) {
            valorTotal *= 0.95;
        }
        return valorTotal;
    }
    
    public int getQuantidadePessoas() {
        return quantidadePessoas;
    }
}

abstract class Usuario {
    protected String nome;
    protected String email;
    protected String senha;
    protected boolean administrador;
    
    public Usuario(String nome, String email, String senha, boolean administrador) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.administrador = administrador;
    }
    
    public void realizarLogin() {
        System.out.println("Usuário " + nome + " fez login");
    }
    
    public void realizarLogoff() {
        System.out.println("Usuário " + nome + " fez logoff");
    }
    
    public void alterarDados() {
        System.out.println("Dados do usuário " + nome + " alterados");
    }
    
    public void alterarSenha() {
        System.out.println("Senha do usuário " + nome + " alterada");
    }
    
    public String getNome() {
        return nome;
    }
    
    public String getEmail() {
        return email;
    }
    
    public boolean isAdministrador() {
        return administrador;
    }
}

class Gerente extends Usuario {
    public Gerente(String nome, String email, String senha) {
        super(nome, email, senha, true);
    }
    
    public void gerarRelatorioFinanceiro() {
        System.out.println("Relatório financeiro gerado por " + nome);
    }
    
    public void consultarVendas() {
        System.out.println("Vendas consultadas por " + nome);
    }
}

class Vendedor extends Usuario {
    private int quantidadeVendas;
    
    public Vendedor(String nome, String email, String senha) {
        super(nome, email, senha, false);
        this.quantidadeVendas = 0;
    }
    
    public void realizarVenda() {
        quantidadeVendas++;
        System.out.println("Venda realizada por " + nome + ". Total de vendas: " + quantidadeVendas);
    }
    
    public void consultarVendas() {
        System.out.println("Vendas consultadas por " + nome + ". Total: " + quantidadeVendas);
    }
    
    public int getQuantidadeVendas() {
        return quantidadeVendas;
    }
}

class Atendente extends Usuario {
    private double valorEmCaixa;
    
    public Atendente(String nome, String email, String senha) {
        super(nome, email, senha, false);
        this.valorEmCaixa = 0;
    }
    
    public void receberPagamento(double valor) {
        valorEmCaixa += valor;
        System.out.println("Pagamento de R$ " + valor + " recebido por " + nome + ". Caixa: R$ " + valorEmCaixa);
    }
    
    public void fecharCaixa() {
        System.out.println("Caixa fechado por " + nome + ". Valor final: R$ " + valorEmCaixa);
        valorEmCaixa = 0;
    }
    
    public double getValorEmCaixa() {
        return valorEmCaixa;
    }
}

abstract class Relogio {
    protected int hora;
    protected int minuto;
    protected int segundo;
    
    public Relogio() {
        this.hora = 0;
        this.minuto = 0;
        this.segundo = 0;
    }
    
    public void setHora(int hora) {
        if (hora >= 0 && hora <= getHoraMaxima()) {
            this.hora = hora;
        }
    }
    
    public void setMinuto(int minuto) {
        if (minuto >= 0 && minuto <= 59) {
            this.minuto = minuto;
        }
    }
    
    public void setSegundo(int segundo) {
        if (segundo >= 0 && segundo <= 59) {
            this.segundo = segundo;
        }
    }
    
    public int getHora() {
        return hora;
    }
    
    public int getMinuto() {
        return minuto;
    }
    
    public int getSegundo() {
        return segundo;
    }
    
    public String getHoraFormatada() {
        return String.format("%02d:%02d:%02d", hora, minuto, segundo);
    }
    
    public abstract int getHoraMaxima();
    
    public abstract void sincronizar(Relogio outroRelogio);
}

class RelogioAmericano extends Relogio {
    @Override
    public int getHoraMaxima() {
        return 12;
    }
    
    @Override
    public void sincronizar(Relogio outroRelogio) {
        int horaOutro = outroRelogio.getHora();
        if (horaOutro > 12) {
            horaOutro = horaOutro - 12;
        }
        this.hora = horaOutro;
        this.minuto = outroRelogio.getMinuto();
        this.segundo = outroRelogio.getSegundo();
    }
}

class RelogioBrasileiro extends Relogio {
    @Override
    public int getHoraMaxima() {
        return 23;
    }
    
    @Override
    public void sincronizar(Relogio outroRelogio) {
        this.hora = outroRelogio.getHora();
        this.minuto = outroRelogio.getMinuto();
        this.segundo = outroRelogio.getSegundo();
    }
}
