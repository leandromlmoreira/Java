# 🚀 Projeto Java - Exercícios e Projetos Completos

Este repositório contém uma coleção completa de exercícios e projetos em Java, implementando conceitos desde fundamentos básicos até técnicas avançadas de programação.

## 📁 Estrutura do Projeto

```
Java/
├── exercicios/
│   ├── exercicio1/          # Cálculo de Idade - Conceitos básicos
│   ├── exercicio2/          # Estruturas de Controle
│   ├── exercicio3/          # Classes e Encapsulamento
│   ├── exercicio4/          # Herança e Polimorfismo
│   ├── exercicio5/          # Interfaces e Lambda
│   └── exercicio6/          # Collections e Classes Úteis
├── projetos/
│   ├── calculadora/         # Calculadora com menu interativo
│   ├── sudoku/             # Jogo de Sudoku completo
│   ├── jogo-memoria/       # Jogo da memória com persistência
│   └── board-tarefas/      # Sistema Kanban com banco MySQL
├── docs/
│   ├── exercicios/         # Documentação dos exercícios
│   └── projetos/           # Documentação dos projetos
├── pom.xml                 # Configuração Maven principal
└── README.md               # Este arquivo
```

## 🎯 **EXERCÍCIOS PRÁTICOS**

### **1. 📊 Exercicio1 - Fundamentos da Linguagem**
**Arquivo:** `exercicios/exercicio1/Exercicio1.java`  
**Conceitos:** Variáveis, tipos de dados, Scanner, cálculos básicos  
**Funcionalidades:**
- Cálculo de idade baseado no ano de nascimento
- Entrada de dados via Scanner
- Operações matemáticas básicas
- Formatação de saída

**Como executar:**
```bash
cd exercicios/exercicio1
javac Exercicio1.java
java Exercicio1
```

---

### **2. 🔢 Exercicio2 - Estruturas de Controle**
**Arquivo:** `exercicios/exercicio2/Exercicio2.java`  
**Conceitos:** if/else, switch, loops, operadores lógicos  
**Funcionalidades:**
- Menu interativo com 6 opções
- Operações básicas (soma, subtração, multiplicação, divisão)
- Verificação de números pares/ímpares
- Cálculo de fatorial
- Verificação de números primos
- Tabuada de multiplicação

**Como executar:**
```bash
cd exercicios/exercicio2
javac Exercicio2.java
java Exercicio2
```

---

### **3. 🏗️ Exercicio3 - Classes e Encapsulamento**
**Arquivo:** `exercicios/exercicio3/Exercicio3.java`  
**Conceitos:** Classes, objetos, encapsulamento, métodos  
**Funcionalidades:**
- **Conta Bancária**: Saldo, cheque especial, depósitos, saques
- **Carro**: Ligar/desligar, acelerar, virar, trocar marcha
- **Máquina de Banho**: Gerenciar pet, água, shampoo, limpeza

**Como executar:**
```bash
cd exercicios/exercicio3
javac Exercicio3.java
java Exercicio3
```

---

### **4. 🔄 Exercicio4 - Herança e Polimorfismo**
**Arquivo:** `exercicios/exercicio4/Exercicio4.java`  
**Conceitos:** Herança, classes abstratas, polimorfismo, sobrescrita  
**Funcionalidades:**
- **Sistema de Ingressos**: Normal, Meia Entrada, Família
- **Sistema de Usuários**: Gerente, Vendedor, Atendente
- **Sistema de Relógios**: Americano (12h) e Brasileiro (24h)

**Como executar:**
```bash
cd exercicios/exercicio4
javac Exercicio4.java
java Exercicio4
```

---

### **5. 🔌 Exercicio5 - Interfaces e Lambda**
**Arquivo:** `exercicios/exercicio5/Exercicio5.java`  
**Conceitos:** Interfaces, implementação, polimorfismo  
**Funcionalidades:**
- **Sistema de Mensagens**: SMS, Email, Redes Sociais, WhatsApp
- **Sistema de Tributos**: Produtos com diferentes taxas
- **Sistema de Figuras**: Cálculo de áreas (Quadrado, Retângulo, Círculo)

**Como executar:**
```bash
cd exercicios/exercicio5
javac Exercicio5.java
java Exercicio5
```

---

### **6. 📚 Exercicio6 - Collections e Classes Úteis**
**Arquivo:** `exercicios/exercicio6/Exercicio6.java`  
**Conceitos:** Collections, Streams, Regex, formatação  
**Funcionalidades:**
- **Calculadora com Collections**: Soma e subtração de listas
- **Formatador de Telefones**: Formatação automática (fixo/celular)
- **Gerador de Formatos**: JSON, XML, YAML a partir de campos

**Como executar:**
```bash
cd exercicios/exercicio6
javac Exercicio6.java
java Exercicio6
```

---

## 🚀 **PROJETOS COMPLETOS**

### **1. 🧮 Calculadora Interativa**
**Pasta:** `projetos/calculadora/`  
**Conceitos:** Fundamentos Java, estruturas de controle, loops  
**Funcionalidades:**
- Menu interativo com operações matemáticas
- Validação de entrada (divisão por zero)
- Interface amigável com Scanner

**Como executar:**
```bash
cd projetos/calculadora
javac Calculadora.java
java Calculadora
```

---

### **2. 🎯 Jogo de Sudoku**
**Pasta:** `projetos/sudoku/`  
**Conceitos:** OOP, classes, arrays, validação  
**Funcionalidades:**
- Menu interativo com 9 opções
- Sistema de rascunhos
- Validação de regras do Sudoku
- Verificação de status e conflitos

**Como executar:**
```bash
cd projetos/sudoku
javac Sudoku.java
java Sudoku
```

---

### **3. 🧠 Jogo da Memória**
**Pasta:** `projetos/jogo-memoria/`  
**Conceitos:** Collections, I/O, persistência, exceções  
**Funcionalidades:**
- Criação de coleções personalizadas de cartas
- Sistema de jogo com virar cartas
- Contagem de lances e percentual de acertos
- Persistência em JSON e YAML
- Múltiplos jogos simultâneos

**Como executar:**
```bash
cd projetos/jogo-memoria
mvn clean compile
mvn exec:java -Dexec.mainClass="JogoMemoria"
```

---

### **4. 📊 Board de Gerenciamento de Tarefas**
**Pasta:** `projetos/board-tarefas/`  
**Conceitos:** JDBC, design patterns, banco de dados  
**Funcionalidades:**
- Boards personalizáveis com colunas padrão
- Sistema de workflow entre colunas
- Cards com bloqueio/desbloqueio
- Persistência em MySQL
- Relatórios de tempo e bloqueios

**Requisitos:**
- MySQL Server rodando na porta 3306
- Usuário: `root` com senha configurável

**Como executar:**
```bash
cd projetos/board-tarefas
mvn clean compile
mvn exec:java -Dexec.mainClass="BoardTarefas"
```

---

## 🛠️ **Tecnologias e Ferramentas**

### **Linguagem e Plataforma**
- **Java 11+** - Linguagem principal
- **Maven** - Gerenciamento de dependências (para projetos específicos)
- **JDBC** - Conexão com banco de dados
- **MySQL** - Banco de dados para Board de Tarefas

### **Dependências Específicas**
- **Jackson** - Serialização JSON/YAML (Jogo da Memória)
- **MySQL Connector** - Driver para MySQL (Board de Tarefas)

---

## 🚀 **Como Executar o Projeto**

### **1. Pré-requisitos**
- Java JDK 11 ou superior
- Maven 3.6+ (para projetos específicos)
- MySQL 8.0+ (para board-tarefas)

### **2. Exercícios (Compilação Simples)**
```bash
# Navegar para o exercício desejado
cd exercicios/exercicioX

# Compilar
javac ExercicioX.java

# Executar
java ExercicioX
```

### **3. Projetos com Maven**
```bash
# Navegar para o projeto
cd projetos/nome-projeto

# Compilar
mvn clean compile

# Executar
mvn exec:java -Dexec.mainClass="NomeClassePrincipal"
```

### **4. Projetos Simples (Sem Maven)**
```bash
cd projetos/calculadora
javac Calculadora.java
java Calculadora

cd ../sudoku
javac Sudoku.java
java Sudoku
```

---

## 📚 **Níveis de Aprendizado**

| Categoria | Conceitos | Nível |
|-----------|-----------|-------|
| **Exercicio1** | Sintaxe básica, Scanner | Básico |
| **Exercicio2** | Estruturas de controle, Loops | Básico |
| **Exercicio3** | Classes, Objetos, Encapsulamento | Intermediário |
| **Exercicio4** | Herança, Polimorfismo | Intermediário |
| **Exercicio5** | Interfaces, Implementação | Intermediário |
| **Exercicio6** | Collections, Streams, Regex | Avançado |
| **Calculadora** | Estruturas básicas | Básico |
| **Sudoku** | Classes, Arrays, Validação | Intermediário |
| **Jogo da Memória** | Collections, I/O, Persistência | Avançado |
| **Board de Tarefas** | JDBC, Design Patterns, BD | Avançado |

---

## 🔧 **Configurações Específicas**

### **MySQL (Board de Tarefas)**
1. Instalar MySQL Server 8.0+
2. Configurar usuário `root` com senha
3. Verificar porta 3306 disponível
4. O sistema cria automaticamente o banco `board_tarefas`

### **Arquivos de Dados**
- **Jogo da Memória:** `jogo_memoria.json` e `jogo_memoria.yaml`
- **Board de Tarefas:** Banco MySQL (criado automaticamente)

---

## 🧪 **Testes Rápidos**

### **Verificar Compilação**
```bash
# Compilar todos os exercícios
cd exercicios
javac exercicio*/Exercicio*.java

# Verificar arquivos .class criados
dir exercicio*/Exercicio*.class
```
---

## 📝 **Contribuições**

Este repositório é para fins educacionais. Contribuições são bem-vindas:

- 🔧 Melhorar código existente
- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 📚 Adicionar documentação
- 🧪 Criar testes unitários

