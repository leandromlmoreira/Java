import java.util.Scanner;

public class Exercicio3 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            System.out.println("\n=== EXERCÍCIO 3 - CLASSES E ENCAPSULAMENTO ===");
            System.out.println("1. Testar Conta Bancária");
            System.out.println("2. Testar Carro");
            System.out.println("3. Testar Máquina de Banho");
            System.out.println("4. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    testarContaBancaria(scanner);
                    break;
                case 2:
                    testarCarro(scanner);
                    break;
                case 3:
                    testarMaquinaBanho(scanner);
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
    
    private static void testarContaBancaria(Scanner scanner) {
        System.out.println("\n=== TESTE CONTA BANCÁRIA ===");
        System.out.print("Digite o valor inicial para a conta: R$ ");
        double valorInicial = scanner.nextDouble();
        
        ContaBancaria conta = new ContaBancaria(valorInicial);
        
        int opcao;
        do {
            System.out.println("\n--- Menu Conta Bancária ---");
            System.out.println("1. Consultar saldo");
            System.out.println("2. Consultar cheque especial");
            System.out.println("3. Depositar dinheiro");
            System.out.println("4. Sacar dinheiro");
            System.out.println("5. Pagar boleto");
            System.out.println("6. Verificar uso do cheque especial");
            System.out.println("7. Voltar ao menu principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    System.out.println("Saldo atual: R$ " + conta.getSaldo());
                    break;
                case 2:
                    System.out.println("Cheque especial: R$ " + conta.getChequeEspecial());
                    break;
                case 3:
                    System.out.print("Valor para depositar: R$ ");
                    double valorDeposito = scanner.nextDouble();
                    conta.depositar(valorDeposito);
                    break;
                case 4:
                    System.out.print("Valor para sacar: R$ ");
                    double valorSaque = scanner.nextDouble();
                    conta.sacar(valorSaque);
                    break;
                case 5:
                    System.out.print("Valor do boleto: R$ ");
                    double valorBoleto = scanner.nextDouble();
                    conta.pagarBoleto(valorBoleto);
                    break;
                case 6:
                    System.out.println("Usando cheque especial: " + conta.isUsandoChequeEspecial());
                    break;
            }
        } while (opcao != 7);
    }
    
    private static void testarCarro(Scanner scanner) {
        System.out.println("\n=== TESTE CARRO ===");
        Carro carro = new Carro();
        
        int opcao;
        do {
            System.out.println("\n--- Menu Carro ---");
            System.out.println("1. Ligar carro");
            System.out.println("2. Desligar carro");
            System.out.println("3. Acelerar");
            System.out.println("4. Diminuir velocidade");
            System.out.println("5. Virar esquerda");
            System.out.println("6. Virar direita");
            System.out.println("7. Verificar velocidade");
            System.out.println("8. Trocar marcha");
            System.out.println("9. Voltar ao menu principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    carro.ligar();
                    break;
                case 2:
                    carro.desligar();
                    break;
                case 3:
                    carro.acelerar();
                    break;
                case 4:
                    carro.diminuirVelocidade();
                    break;
                case 5:
                    carro.virarEsquerda();
                    break;
                case 6:
                    carro.virarDireita();
                    break;
                case 7:
                    System.out.println("Velocidade atual: " + carro.getVelocidade() + " km/h");
                    break;
                case 8:
                    System.out.print("Nova marcha (0-6): ");
                    int marcha = scanner.nextInt();
                    carro.trocarMarcha(marcha);
                    break;
            }
        } while (opcao != 9);
    }
    
    private static void testarMaquinaBanho(Scanner scanner) {
        System.out.println("\n=== TESTE MÁQUINA DE BANHO ===");
        MaquinaBanho maquina = new MaquinaBanho();
        
        int opcao;
        do {
            System.out.println("\n--- Menu Máquina de Banho ---");
            System.out.println("1. Colocar pet na máquina");
            System.out.println("2. Dar banho no pet");
            System.out.println("3. Retirar pet da máquina");
            System.out.println("4. Abastecer água");
            System.out.println("5. Abastecer shampoo");
            System.out.println("6. Verificar nível de água");
            System.out.println("7. Verificar nível de shampoo");
            System.out.println("8. Verificar se tem pet");
            System.out.println("9. Limpar máquina");
            System.out.println("10. Voltar ao menu principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    System.out.print("Nome do pet: ");
                    scanner.nextLine();
                    String nomePet = scanner.nextLine();
                    maquina.colocarPet(nomePet);
                    break;
                case 2:
                    maquina.darBanho();
                    break;
                case 3:
                    maquina.retirarPet();
                    break;
                case 4:
                    maquina.abastecerAgua();
                    break;
                case 5:
                    maquina.abastecerShampoo();
                    break;
                case 6:
                    System.out.println("Nível de água: " + maquina.getNivelAgua() + " litros");
                    break;
                case 7:
                    System.out.println("Nível de shampoo: " + maquina.getNivelShampoo() + " litros");
                    break;
                case 8:
                    System.out.println("Tem pet na máquina: " + maquina.temPet());
                    break;
                case 9:
                    maquina.limparMaquina();
                    break;
            }
        } while (opcao != 10);
    }
}

class ContaBancaria {
    private double saldo;
    private double chequeEspecial;
    private boolean usandoChequeEspecial;
    
    public ContaBancaria(double valorInicial) {
        this.saldo = valorInicial;
        if (valorInicial <= 500) {
            this.chequeEspecial = 50;
        } else {
            this.chequeEspecial = valorInicial * 0.5;
        }
        this.usandoChequeEspecial = false;
    }
    
    public double getSaldo() {
        return saldo;
    }
    
    public double getChequeEspecial() {
        return chequeEspecial;
    }
    
    public boolean isUsandoChequeEspecial() {
        return usandoChequeEspecial;
    }
    
    public void depositar(double valor) {
        if (valor > 0) {
            if (usandoChequeEspecial) {
                double taxa = chequeEspecial * 0.2;
                saldo = saldo + valor - taxa;
                usandoChequeEspecial = false;
                System.out.println("Taxa de R$ " + taxa + " cobrada pelo uso do cheque especial");
            } else {
                saldo += valor;
            }
            System.out.println("Depósito de R$ " + valor + " realizado. Saldo: R$ " + saldo);
        }
    }
    
    public void sacar(double valor) {
        if (valor > 0 && valor <= (saldo + chequeEspecial)) {
            if (valor <= saldo) {
                saldo -= valor;
                System.out.println("Saque de R$ " + valor + " realizado. Saldo: R$ " + saldo);
            } else {
                double valorChequeEspecial = valor - saldo;
                saldo = 0;
                chequeEspecial -= valorChequeEspecial;
                usandoChequeEspecial = true;
                System.out.println("Saque realizado usando cheque especial. Saldo: R$ " + saldo);
            }
        } else {
            System.out.println("Valor insuficiente para saque");
        }
    }
    
    public void pagarBoleto(double valor) {
        sacar(valor);
    }
}

class Carro {
    private boolean ligado;
    private int velocidade;
    private int marcha;
    
    public Carro() {
        this.ligado = false;
        this.velocidade = 0;
        this.marcha = 0;
    }
    
    public void ligar() {
        if (!ligado) {
            ligado = true;
            System.out.println("Carro ligado");
        } else {
            System.out.println("Carro já está ligado");
        }
    }
    
    public void desligar() {
        if (ligado && marcha == 0 && velocidade == 0) {
            ligado = false;
            System.out.println("Carro desligado");
        } else {
            System.out.println("Não é possível desligar o carro");
        }
    }
    
    public void acelerar() {
        if (!ligado) {
            System.out.println("Carro deve estar ligado");
            return;
        }
        
        if (marcha == 0) {
            System.out.println("Carro em ponto morto, não pode acelerar");
            return;
        }
        
        if (velocidade < getVelocidadeMaximaMarcha()) {
            velocidade++;
            System.out.println("Velocidade: " + velocidade + " km/h");
        } else {
            System.out.println("Velocidade máxima para esta marcha atingida");
        }
    }
    
    public void diminuirVelocidade() {
        if (velocidade > 0) {
            velocidade--;
            System.out.println("Velocidade: " + velocidade + " km/h");
        }
    }
    
    public void virarEsquerda() {
        if (ligado && velocidade >= 1 && velocidade <= 40) {
            System.out.println("Virando para esquerda");
        } else {
            System.out.println("Não é possível virar para esquerda");
        }
    }
    
    public void virarDireita() {
        if (ligado && velocidade >= 1 && velocidade <= 40) {
            System.out.println("Virando para direita");
        } else {
            System.out.println("Não é possível virar para direita");
        }
    }
    
    public int getVelocidade() {
        return velocidade;
    }
    
    public void trocarMarcha(int novaMarcha) {
        if (novaMarcha >= 0 && novaMarcha <= 6) {
            if (Math.abs(novaMarcha - marcha) == 1 || novaMarcha == 0) {
                marcha = novaMarcha;
                System.out.println("Marcha alterada para: " + marcha);
            } else {
                System.out.println("Não é possível pular marchas");
            }
        } else {
            System.out.println("Marcha inválida");
        }
    }
    
    private int getVelocidadeMaximaMarcha() {
        switch (marcha) {
            case 1: return 20;
            case 2: return 40;
            case 3: return 60;
            case 4: return 80;
            case 5: return 100;
            case 6: return 120;
            default: return 0;
        }
    }
}

class MaquinaBanho {
    private String petAtual;
    private int nivelAgua;
    private int nivelShampoo;
    private boolean petLimpio;
    
    public MaquinaBanho() {
        this.petAtual = null;
        this.nivelAgua = 30;
        this.nivelShampoo = 10;
        this.petLimpio = false;
    }
    
    public void colocarPet(String nomePet) {
        if (petAtual == null) {
            petAtual = nomePet;
            petLimpio = false;
            System.out.println("Pet " + nomePet + " colocado na máquina");
        } else {
            System.out.println("Já há um pet na máquina");
        }
    }
    
    public void darBanho() {
        if (petAtual != null && nivelAgua >= 10 && nivelShampoo >= 2) {
            nivelAgua -= 10;
            nivelShampoo -= 2;
            petLimpio = true;
            System.out.println("Banho realizado no pet " + petAtual);
        } else {
            System.out.println("Não é possível dar banho");
        }
    }
    
    public void retirarPet() {
        if (petAtual != null) {
            if (!petLimpio) {
                System.out.println("Pet retirado sem estar limpo, máquina precisa ser limpa");
            } else {
                System.out.println("Pet " + petAtual + " retirado limpo");
            }
            petAtual = null;
            petLimpio = false;
        } else {
            System.out.println("Não há pet na máquina");
        }
    }
    
    public void abastecerAgua() {
        if (nivelAgua < 30) {
            nivelAgua = Math.min(30, nivelAgua + 2);
            System.out.println("Água abastecida. Nível atual: " + nivelAgua + " litros");
        } else {
            System.out.println("Tanque de água já está cheio");
        }
    }
    
    public void abastecerShampoo() {
        if (nivelShampoo < 10) {
            nivelShampoo = Math.min(10, nivelShampoo + 2);
            System.out.println("Shampoo abastecido. Nível atual: " + nivelShampoo + " litros");
        } else {
            System.out.println("Tanque de shampoo já está cheio");
        }
    }
    
    public int getNivelAgua() {
        return nivelAgua;
    }
    
    public int getNivelShampoo() {
        return nivelShampoo;
    }
    
    public boolean temPet() {
        return petAtual != null;
    }
    
    public void limparMaquina() {
        if (nivelAgua >= 3 && nivelShampoo >= 1) {
            nivelAgua -= 3;
            nivelShampoo -= 1;
            System.out.println("Máquina limpa");
        } else {
            System.out.println("Recursos insuficientes para limpeza");
        }
    }
}
