import java.util.Scanner;

public class Exercicio1 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Digite o nome: ");
        String nome = scanner.nextLine();
        
        System.out.print("Digite o ano de nascimento: ");
        int anoNascimento = scanner.nextInt();
        
        int anoAtual = 2025;
        int idade = anoAtual - anoNascimento;
        
        System.out.println("Olá '" + nome + "' você tem '" + idade + "' anos");
        
        scanner.close();
    }
}
