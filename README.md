# Quake log parser

## Setup

1. Clone o repositório
2. Instale as dependências:
    ```sh
    npm install
    ```
3. Execute a aplicação:
    ```sh
    npm start
    ```
4. Execute os testes:
    ```sh
    npm test
    ```

## API

- `GET /games`: Retorna os dados dos jogos em formato JSON.
  - Parâmetros de consulta:
    - `player`: Filtra jogos por jogador.
    - `page`: Número da página (padrão: 1).
    - `limit`: Número de jogos por página (padrão: 10).

- `GET /stats`: Retorna estatísticas gerais dos jogos.

## Documentação

A documentação da API está disponível em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).