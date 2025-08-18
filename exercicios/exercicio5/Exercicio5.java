import java.util.Scanner;

public class Exercicio5 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            System.out.println("\n=== EXERCÍCIO 5 - INTERFACES E LAMBDA ===");
            System.out.println("1. Testar Sistema de Mensagens");
            System.out.println("2. Testar Sistema de Tributos");
            System.out.println("3. Testar Sistema de Figuras Geométricas");
            System.out.println("4. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    testarSistemaMensagens(scanner);
                    break;
                case 2:
                    testarSistemaTributos(scanner);
                    break;
                case 3:
                    testarSistemaFiguras(scanner);
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
    
    private static void testarSistemaMensagens(Scanner scanner) {
        System.out.println("\n=== TESTE SISTEMA DE MENSAGENS ===");
        
        System.out.print("Digite a mensagem de marketing: ");
        scanner.nextLine();
        String mensagem = scanner.nextLine();
        
        SistemaMensagens sistema = new SistemaMensagens();
        
        int opcao;
        do {
            System.out.println("\n--- Menu de Serviços ---");
            System.out.println("1. Enviar por SMS");
            System.out.println("2. Enviar por E-mail");
            System.out.println("3. Enviar por Redes Sociais");
            System.out.println("4. Enviar por WhatsApp");
            System.out.println("5. Enviar para todos os serviços");
            System.out.println("6. Voltar ao menu principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    sistema.enviarMensagem(mensagem, new ServicoSMS());
                    break;
                case 2:
                    sistema.enviarMensagem(mensagem, new ServicoEmail());
                    break;
                case 3:
                    sistema.enviarMensagem(mensagem, new ServicoRedesSociais());
                    break;
                case 4:
                    sistema.enviarMensagem(mensagem, new ServicoWhatsApp());
                    break;
                case 5:
                    sistema.enviarParaTodos(mensagem);
                    break;
            }
        } while (opcao != 6);
    }
    
    private static void testarSistemaTributos(Scanner scanner) {
        System.out.println("\n=== TESTE SISTEMA DE TRIBUTOS ===");
        
        System.out.print("Digite o valor do produto: R$ ");
        double valor = scanner.nextDouble();
        
        System.out.println("\n--- Tipos de Produto ---");
        System.out.println("1. Alimentação (1%)");
        System.out.println("2. Saúde e Bem-estar (1.5%)");
        System.out.println("3. Vestuário (2.5%)");
        System.out.println("4. Cultura (4%)");
        System.out.print("Escolha o tipo: ");
        int tipo = scanner.nextInt();
        
        Produto produto = null;
        switch (tipo) {
            case 1:
                produto = new ProdutoAlimentacao(valor);
                break;
            case 2:
                produto = new ProdutoSaude(valor);
                break;
            case 3:
                produto = new ProdutoVestuario(valor);
                break;
            case 4:
                produto = new ProdutoCultura(valor);
                break;
            default:
                System.out.println("Tipo inválido!");
                return;
        }
        
        double tributo = produto.calcularTributo();
        System.out.println("Valor do produto: R$ " + valor);
        System.out.println("Tributo: R$ " + tributo);
        System.out.println("Valor total: R$ " + (valor + tributo));
    }
    
    private static void testarSistemaFiguras(Scanner scanner) {
        System.out.println("\n=== TESTE SISTEMA DE FIGURAS GEOMÉTRICAS ===");
        
        System.out.println("1. Calcular área do Quadrado");
        System.out.println("2. Calcular área do Retângulo");
        System.out.println("3. Calcular área do Círculo");
        System.out.print("Escolha uma opção: ");
        int opcao = scanner.nextInt();
        
        switch (opcao) {
            case 1:
                System.out.print("Digite o lado do quadrado: ");
                double lado = scanner.nextDouble();
                FiguraGeometrica quadrado = new Quadrado(lado);
                System.out.println("Área do quadrado: " + quadrado.calcularArea());
                break;
            case 2:
                System.out.print("Digite a base do retângulo: ");
                double base = scanner.nextDouble();
                System.out.print("Digite a altura do retângulo: ");
                double altura = scanner.nextDouble();
                FiguraGeometrica retangulo = new Retangulo(base, altura);
                System.out.println("Área do retângulo: " + retangulo.calcularArea());
                break;
            case 3:
                System.out.print("Digite o raio do círculo: ");
                double raio = scanner.nextDouble();
                FiguraGeometrica circulo = new Circulo(raio);
                System.out.println("Área do círculo: " + circulo.calcularArea());
                break;
            default:
                System.out.println("Opção inválida!");
        }
    }
}

interface ServicoMensagem {
    void receberMensagem(String mensagem);
}

class ServicoSMS implements ServicoMensagem {
    @Override
    public void receberMensagem(String mensagem) {
        System.out.println("SMS enviado: " + mensagem);
    }
}

class ServicoEmail implements ServicoMensagem {
    @Override
    public void receberMensagem(String mensagem) {
        System.out.println("E-mail enviado: " + mensagem);
    }
}

class ServicoRedesSociais implements ServicoMensagem {
    @Override
    public void receberMensagem(String mensagem) {
        System.out.println("Post em redes sociais: " + mensagem);
    }
}

class ServicoWhatsApp implements ServicoMensagem {
    @Override
    public void receberMensagem(String mensagem) {
        System.out.println("Mensagem WhatsApp: " + mensagem);
    }
}

class SistemaMensagens {
    public void enviarMensagem(String mensagem, ServicoMensagem servico) {
        servico.receberMensagem(mensagem);
    }
    
    public void enviarParaTodos(String mensagem) {
        ServicoMensagem[] servicos = {
            new ServicoSMS(),
            new ServicoEmail(),
            new ServicoRedesSociais(),
            new ServicoWhatsApp()
        };
        
        for (ServicoMensagem servico : servicos) {
            servico.receberMensagem(mensagem);
        }
    }
}

interface ProdutoTributavel {
    double calcularTributo();
    double getValor();
}

abstract class Produto implements ProdutoTributavel {
    protected double valor;
    
    public Produto(double valor) {
        this.valor = valor;
    }
    
    @Override
    public double getValor() {
        return valor;
    }
}

class ProdutoAlimentacao extends Produto {
    public ProdutoAlimentacao(double valor) {
        super(valor);
    }
    
    @Override
    public double calcularTributo() {
        return valor * 0.01;
    }
}

class ProdutoSaude extends Produto {
    public ProdutoSaude(double valor) {
        super(valor);
    }
    
    @Override
    public double calcularTributo() {
        return valor * 0.015;
    }
}

class ProdutoVestuario extends Produto {
    public ProdutoVestuario(double valor) {
        super(valor);
    }
    
    @Override
    public double calcularTributo() {
        return valor * 0.025;
    }
}

class ProdutoCultura extends Produto {
    public ProdutoCultura(double valor) {
        super(valor);
    }
    
    @Override
    public double calcularTributo() {
        return valor * 0.04;
    }
}

interface FiguraGeometrica {
    double calcularArea();
}

class Quadrado implements FiguraGeometrica {
    private double lado;
    
    public Quadrado(double lado) {
        this.lado = lado;
    }
    
    @Override
    public double calcularArea() {
        return lado * lado;
    }
}

class Retangulo implements FiguraGeometrica {
    private double base;
    private double altura;
    
    public Retangulo(double base, double altura) {
        this.base = base;
        this.altura = altura;
    }
    
    @Override
    public double calcularArea() {
        return base * altura;
    }
}

class Circulo implements FiguraGeometrica {
    private double raio;
    
    public Circulo(double raio) {
        this.raio = raio;
    }
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}
