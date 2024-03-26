# API RESTful do Golden Raspberry Awards

API RESTful para possibilitar a leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

O projeto foi desenvolvido utilizando a linguagem de programação [Node.js](https://nodejs.org/) com [Typescript](https://www.typescriptlang.org/), [Express](https://expressjs.com/) para o servidor web e rotas da API, [SQLite](https://www.sqlite.org/index.html) como banco de dados em memória, [Jest](https://jestjs.io/) com [SWC](https://swc.rs/docs/usage/jest) para rodar testes, [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) para utilizar como ambiente de desenvolvimento e produção. Conceitos de [arquitetura limpa](https://www.amazon.com.br/Clean-Architecture-Craftsmans-Software-Structure-ebook/dp/B075LRM681) foram seguidos para proporcionar clareza, separação de responsabilidades, boas práticas e princípios no ciclo de desenvolvimento de software.

Ao iniciar a aplicação, o banco de dados SQLite é iniciado em memória, o arquivo CSV com a lista dos filmes é parseado e inserido em tabelas do banco de dados, uma carga de dados inicial. A API RESTful inicia no endereço http://localhost:3000/.

A API RESTful utiliza o nível 2 de maturidade de Richardson e possui o endpoint `/movies/producers` utilizando o verbo HTTP `GET` para obter:

- o produtor com maior intervalo entre dois prêmios consecutivos;
- o produtor que obteve dois prêmios mais rápido;
- em caso de houver mais de um produtor com o mesmo intervalo, retorna todos os produtores com o mesmo intervalo:

## Passo a passo para rodar o projeto

**1. Clonar o projeto:**

```sh
git clone https://github.com/dalloglio/challenge-golden-raspberry-awards-restful-api.git
```

**2. Acessar a pasta do projeto:**

```sh
cd challenge-golden-raspberry-awards-restful-api
```

**3. Substituir o arquivo `movies.csv` na raiz do projeto com a lista dos filmes:**

Este passo é opcional, caso deseje substituir a lista de filmes basta seguir o mesmo layout do arquivo `movies.csv`.

**4. Rodar o projeto com Docker:**

```sh
docker compose up app-prod
```

**5. Abrir o navegador e acessar o endpoint disponível:**

http://localhost:3000/movies/producers

O retorno do endpoint será como no formato abaixo:

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

## Rodar os testes

O requisito do projeto é somente testes de integração. Testes unitários e de ponta a ponta não foram realizados.

**1. Executar o projeto em modo de desenvolvimento com Docker Compose:**

```sh
docker compose up -d app
```

**2. Rodar os testes dentro do container do Docker:**

```sh
docker compose exec app npm test
```

> Qualquer dúvida não hesite em entrar em contato comigo via e-mail ricardo.tech@live.com.
