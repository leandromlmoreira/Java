import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class Exercicio6 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            System.out.println("\n=== EXERCÍCIO 6 - COLLECTIONS E CLASSES ÚTEIS ===");
            System.out.println("1. Calculadora com Collections");
            System.out.println("2. Formatador de Telefones");
            System.out.println("3. Gerador de Formatos (JSON/XML/YAML)");
            System.out.println("4. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    testarCalculadora(scanner);
                    break;
                case 2:
                    testarFormatadorTelefone(scanner);
                    break;
                case 3:
                    testarGeradorFormatos(scanner);
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
    
    private static void testarCalculadora(Scanner scanner) {
        System.out.println("\n=== CALCULADORA COM COLLECTIONS ===");
        
        System.out.println("Digite os números separados por vírgula (ex: 10,5,3,2): ");
        scanner.nextLine();
        String entrada = scanner.nextLine();
        
        Calculadora calculadora = new Calculadora();
        double resultadoSoma = calculadora.somar(entrada);
        double resultadoSubtracao = calculadora.subtrair(entrada);
        
        System.out.println("Números informados: " + entrada);
        System.out.println("Resultado da soma: " + resultadoSoma);
        System.out.println("Resultado da subtração: " + resultadoSubtracao);
    }
    
    private static void testarFormatadorTelefone(Scanner scanner) {
        System.out.println("\n=== FORMATADOR DE TELEFONES ===");
        
        System.out.println("Digite o número de telefone (com ou sem formatação): ");
        scanner.nextLine();
        String telefone = scanner.nextLine();
        
        FormatadorTelefone formatador = new FormatadorTelefone();
        String resultado = formatador.formatar(telefone);
        
        System.out.println("Telefone original: " + telefone);
        System.out.println("Telefone formatado: " + resultado);
    }
    
    private static void testarGeradorFormatos(Scanner scanner) {
        System.out.println("\n=== GERADOR DE FORMATOS ===");
        
        List<Campo> campos = new ArrayList<>();
        
        System.out.println("Digite os campos no formato: NOME_CAMPO;VALOR;TIPO");
        System.out.println("Tipos disponíveis: texto, data, data_hora, inteiro, decimal, booleano, array");
        System.out.println("Exemplo: nome;João;texto");
        System.out.println("Digite 'sair' para finalizar");
        
        scanner.nextLine();
        String entrada;
        do {
            System.out.print("Campo: ");
            entrada = scanner.nextLine();
            
            if (!entrada.equalsIgnoreCase("sair")) {
                String[] partes = entrada.split(";");
                if (partes.length == 3) {
                    campos.add(new Campo(partes[0], partes[1], partes[2]));
                } else {
                    System.out.println("Formato inválido! Use: NOME;VALOR;TIPO");
                }
            }
        } while (!entrada.equalsIgnoreCase("sair"));
        
        if (!campos.isEmpty()) {
            GeradorFormatos gerador = new GeradorFormatos();
            
            System.out.println("\n--- RESULTADOS ---");
            System.out.println("JSON:");
            System.out.println(gerador.gerarJSON(campos));
            
            System.out.println("\nXML:");
            System.out.println(gerador.gerarXML(campos));
            
            System.out.println("\nYAML:");
            System.out.println(gerador.gerarYAML(campos));
        }
    }
}

class Calculadora {
    public double somar(String numeros) {
        List<Double> lista = parseNumeros(numeros);
        return lista.stream().mapToDouble(Double::doubleValue).sum();
    }
    
    public double subtrair(String numeros) {
        List<Double> lista = parseNumeros(numeros);
        if (lista.isEmpty()) return 0;
        
        double resultado = lista.get(0);
        for (int i = 1; i < lista.size(); i++) {
            resultado -= lista.get(i);
        }
        return resultado;
    }
    
    private List<Double> parseNumeros(String entrada) {
        List<Double> numeros = new ArrayList<>();
        String[] partes = entrada.split(",");
        
        for (String parte : partes) {
            try {
                numeros.add(Double.parseDouble(parte.trim()));
            } catch (NumberFormatException e) {
                System.out.println("Valor inválido ignorado: " + parte);
            }
        }
        
        return numeros;
    }
}

class FormatadorTelefone {
    public String formatar(String entrada) {
        String numeros = extrairNumeros(entrada);
        
        if (numeros.length() == 8) {
            return formatarTelefoneFixo(numeros, false);
        } else if (numeros.length() == 9) {
            return formatarCelular(numeros, false);
        } else if (numeros.length() == 10) {
            return formatarTelefoneFixo(numeros, true);
        } else if (numeros.length() == 11) {
            return formatarCelular(numeros, true);
        } else {
            return "Número inválido";
        }
    }
    
    private String extrairNumeros(String entrada) {
        return entrada.replaceAll("[^0-9]", "");
    }
    
    private String formatarTelefoneFixo(String numeros, boolean comDDD) {
        if (comDDD) {
            return "(" + numeros.substring(0, 2) + ")" + numeros.substring(2, 6) + "-" + numeros.substring(6);
        } else {
            return numeros.substring(0, 4) + "-" + numeros.substring(4);
        }
    }
    
    private String formatarCelular(String numeros, boolean comDDD) {
        if (comDDD) {
            return "(" + numeros.substring(0, 2) + ")" + numeros.substring(2, 7) + "-" + numeros.substring(7);
        } else {
            return numeros.substring(0, 5) + "-" + numeros.substring(5);
        }
    }
}

class Campo {
    private String nome;
    private String valor;
    private String tipo;
    
    public Campo(String nome, String valor, String tipo) {
        this.nome = nome;
        this.valor = valor;
        this.tipo = tipo;
    }
    
    public String getNome() {
        return nome;
    }
    
    public String getValor() {
        return valor;
    }
    
    public String getTipo() {
        return tipo;
    }
}

class GeradorFormatos {
    public String gerarJSON(List<Campo> campos) {
        StringBuilder json = new StringBuilder("{\n");
        
        for (int i = 0; i < campos.size(); i++) {
            Campo campo = campos.get(i);
            json.append("  \"").append(campo.getNome()).append("\": ");
            
            if (campo.getTipo().equals("texto")) {
                json.append("\"").append(campo.getValor()).append("\"");
            } else if (campo.getTipo().equals("inteiro") || campo.getTipo().equals("decimal")) {
                json.append(campo.getValor());
            } else if (campo.getTipo().equals("booleano")) {
                json.append(campo.getValor());
            } else {
                json.append("\"").append(campo.getValor()).append("\"");
            }
            
            if (i < campos.size() - 1) {
                json.append(",");
            }
            json.append("\n");
        }
        
        json.append("}");
        return json.toString();
    }
    
    public String gerarXML(List<Campo> campos) {
        StringBuilder xml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<dados>\n");
        
        for (Campo campo : campos) {
            xml.append("  <").append(campo.getNome()).append(">");
            xml.append(campo.getValor());
            xml.append("</").append(campo.getNome()).append(">\n");
        }
        
        xml.append("</dados>");
        return xml.toString();
    }
    
    public String gerarYAML(List<Campo> campos) {
        StringBuilder yaml = new StringBuilder();
        
        for (Campo campo : campos) {
            yaml.append(campo.getNome()).append(": ");
            
            if (campo.getTipo().equals("texto")) {
                yaml.append("\"").append(campo.getValor()).append("\"");
            } else if (campo.getTipo().equals("inteiro") || campo.getTipo().equals("decimal")) {
                yaml.append(campo.getValor());
            } else if (campo.getTipo().equals("booleano")) {
                yaml.append(campo.getValor());
            } else {
                yaml.append("\"").append(campo.getValor()).append("\"");
            }
            
            yaml.append("\n");
        }
        
        return yaml.toString();
    }
}
