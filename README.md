# Desafio DDD: Patterns - Agregados e Eventos

Este repositório contém a resolução dos desafios práticos do módulo de **Domain-Driven Design (DDD): Patterns**. O projeto foca em dois pilares fundamentais: a persistência de agregados complexos e a comunicação desacoplada através de sistemas de eventos.

## 🚀 Tecnologias
* **TypeScript**
* **Node.js**
* **Sequelize** (SQLite em memória para testes)
* **Jest** (TDD)

---

## 🏗️ Desafio 1: Implementação de Order Repository
Este desafio focou na persistência do agregado de **Orders (Pedidos)**, garantindo a integridade entre as Entidades de Domínio e o Banco de Dados relacional.

### Requisitos Implementados em `OrderRepository`:
- [x] **`create`**: Criação de pedidos persistindo o cabeçalho e seus respectivos itens.
- [x] **`update`**: Atualização de dados do pedido e sincronização de itens (estratégia delete/create para itens).
- [x] **`find`**: Recuperação de um pedido por ID com o correto mapeamento para a Entidade de Domínio.
- [x] **`findAll`**: Listagem completa de todos os pedidos cadastrados.

---

## 📢 Desafio 2: Eventos de Domínio (Customer)
Implementação de um sistema de mensageria interna para reagir a mudanças no ciclo de vida da entidade **Customer**.

### Eventos e Handlers:
1. **Evento `CustomerCreated`**:
    - Disparado ao criar um novo cliente no `CustomerRepository`.
    - **Handlers**: Executa `EnviaConsoleLog1Handler` e `EnviaConsoleLog2Handler`.
2. **Evento `CustomerAddressChanged`**:
    - Disparado quando o endereço de um cliente é alterado e persistido.
    - **Handler**: `EnviaConsoleLogHandler`, que imprime no console:
      > `Endereço do cliente: {id}, {nome} alterado para: {endereco}`

---

## 🛠️ Como Instalar e Rodar

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/Leonardo-Nogueira/OrderSystemDDD.git](https://github.com/Leonardo-Nogueira/OrderSystemDDD.git)
   cd OrderSystemDDD

2. **Instalar dependências:** 
   ```bash
   npm install


3. **Para rodar especificamente o teste do desafio:**   
   ```bash
   npm test src/infrastructure/customer/repository/sequelize/customer.repository.spec.ts
   npm test src/infrastructure/order/repository/sequilize/order.repository.spec.ts