# JavaLab

Coleção de aplicações e utilitários em Java puro (sem frameworks pesados), cobrindo desde operações matemáticas básicas até um sistema de gestão de tarefas com persistência em banco de dados.

Cada módulo é independente e pode ser compilado e executado isoladamente — não há acoplamento entre eles.

## Aplicações

### Calculadora
Calculadora de linha de comando com menu interativo: soma, subtração, multiplicação, divisão e potenciação, com submenu para acumular resultados de somas e subtrações.

```
cd projetos/calculadora
javac Calculadora.java
java Calculadora
```

Saída de exemplo:
```
=== CALCULADORA ===
1. Realizar uma soma
...
Escolha uma opção: 1
Digite o primeiro número: 4
Digite o segundo número: 6
Resultado: 4.0 + 6.0 = 10.0
```

### Sudoku
Jogo de Sudoku com tabuleiro 9x9, validação de linhas, colunas e quadrantes 3x3, sistema de rascunhos e verificação de conflitos. Disponível em versão texto (`Sudoku`) e com interface gráfica Swing (`SudokuGUI`).

```
cd projetos/sudoku
javac Sudoku.java
java Sudoku
```

A versão texto aceita posições fixas via argumentos de linha de comando (`linha,coluna;valor,editável`):
```
java Sudoku 0,0;4,false 1,0;7,false 2,0;9,true
```

Ou, usando os scripts utilitários em `bin/` (compilam e já executam):
```
bin/run.sh      # Linux/macOS
bin\run.bat     # Windows
```

### Jogo da Memória
Jogo de cartas com pares a serem encontrados, contagem de tentativas, percentual de acerto e suporte a múltiplas partidas simultâneas. O estado da partida é persistido em JSON e YAML via Jackson.

```
cd projetos/jogo-memoria
mvn clean compile
mvn exec:java -Dexec.mainClass="JogoMemoria"
```

### Board de Tarefas
Sistema de board no estilo Kanban: colunas de workflow padrão, bloqueio/desbloqueio de cards com motivo registrado e relatórios de tempo gasto e tempo bloqueado por card. Persistência via JDBC em MySQL.

```
cd projetos/board-tarefas
mvn clean compile
mvn exec:java -Dexec.mainClass="BoardTarefas"
```

Requer um MySQL 8.0+ acessível (porta e usuário configuráveis em `BoardTarefas.java`); o schema `board_tarefas` é criado automaticamente na primeira execução.

### Módulos de exemplo (`exercicios/`)
Pequenos programas de referência para conceitos específicos da linguagem, cada um autocontido em `exercicios/exercicioN/`:

| Módulo | Conteúdo |
|---|---|
| `exercicio1` | Tipos primitivos, entrada via `Scanner`, cálculo simples |
| `exercicio2` | Estruturas de controle, laços, menu interativo (tabuada, IMC, paridade, divisão) |
| `exercicio3` | Classes, objetos e encapsulamento (conta bancária, carro, banho de pet) |
| `exercicio4` | Herança e polimorfismo (ingressos, usuários, formatos de hora) |
| `exercicio5` | Interfaces e implementação (mensagens, tributos, cálculo de área) |
| `exercicio6` | Collections, streams e regex (operações em lista, formatação de telefone, geração de JSON/XML/YAML) |

Compilação individual:
```
cd exercicios/exercicio1
javac Exercicio1.java
java Exercicio1
```

## Stack

- Java 11+
- Maven (para os módulos com dependências: `jogo-memoria` e `board-tarefas`)
- Jackson (JSON/YAML) — `jogo-memoria`
- MySQL Connector/J — `board-tarefas`
- Swing — `SudokuGUI`

## Como rodar tudo

```
./build.sh      # Linux/macOS — compila exercícios e projetos
build.bat       # Windows
```

Pré-requisitos: JDK 11+; Maven 3.6+ e MySQL 8.0+ apenas para os módulos que dependem deles.

## Testes

O projeto usa JUnit 4 (declarado em `pom.xml`) para os módulos Maven. Não há suíte de testes automatizados ainda — contribuições nessa área são bem-vindas.

## Documentação

Notas de estudo detalhadas por módulo estão em `docs/exercicios/` e `docs/projetos/`.

## Licença

Uso livre para fins educacionais e de referência.

---
Base: estudos da trilha Java da DIO.
