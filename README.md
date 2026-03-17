# Desafio DDD: Implementação de Order Repository

Este repositório contém a implementação do `OrderRepository` para o desafio do módulo de DDD: Patterns. O projeto foca na persistência de agregados complexos utilizando Sequelize, garantindo a integridade entre as Entidades de Domínio e o Banco de Dados.

## 🚀 Tecnologias
* **TypeScript**
* **Node.js**
* **Sequelize** (SQLite para testes)
* **Jest** (TDD)

## 📋 Requisitos Implementados
Conforme as regras do desafio, os seguintes métodos foram implementados em `OrderRepository`:
- [x] `create`: Criação de pedidos com itens.
- [x] `update`: Atualização de dados do pedido e sincronização de itens (estratégia delete/create).
- [x] `find`: Recuperação de um pedido por ID com mapeamento para Entidade de Domínio.
- [x] `findAll`: Listagem de todos os pedidos cadastrados.

## 🛠️ Como instalar e rodar

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/Leonardo-Nogueira/OrderSystemDDD.git](https://github.com/Leonardo-Nogueira/OrderSystemDDD.git)
   cd OrderSystemDDD

## Para facilitar e rodar os testes, instale o plugin do jest.   