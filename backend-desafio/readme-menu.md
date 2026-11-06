
# API Menu - Desafio Técnico

## Sobre o projeto

Este projeto foi desenvolvido para um desafio técnico da Paketá.
A empresa forneceu o projeto inicial (boilerplate),
com a estrutura de pastas e algumas funcionalidades prontas.
Minha responsabilidade foi utilizar essa estrutura para desenvolver uma API de gerenciamento de menus,
seguindo os requisitos do desafio.

**Implementação do desafio:** Denise Maria Leandro de Castro.

## 1. Preparação do ambiente

Antes de começar a desenvolver, verifiquei as tecnologias utilizadas no projeto e o que
já estava instalado no meu computador. Primeiro, consultei o arquivo `package.json`
para entender quais bibliotecas o projeto utilizava. Depois, verifiquei as versões do Node.js e
do npm pelos comandos:

```bash
node -v
npm -v
```

As versões encontradas foram:

```text
Node.js: 24.16.0
npm: 11.13.0
```

O Node.js é utilizado para executar a aplicação.
O npm é responsável por instalar e gerenciar as dependências.
Para instalar as dependências do projeto, utilizei:

```bash
npm install
```

## 2. Configuração do MongoDB

O desafio exigia a utilização do MongoDB. Ao analisar o arquivo `src/index.ts`, 
identifiquei que o projeto já utilizava o Mongoose para se conectar ao banco de dados. 
O Mongoose facilita o trabalho com o MongoDB, permitindo criar modelos, cadastrar, 
consultar e excluir registros. Para utilizar o banco de dados, criei uma conta no MongoDB Atlas, que permite trabalhar 
com o MongoDB na nuvem. Configurei o acesso ao banco e obtive a string de conexão 
fornecida pelo Atlas. A conexão foi configurada por meio da variável `MONGO_URL`, no arquivo `.env`. 
Durante essa configuração, foi necessário ajustar a representação dos caracteres especiais 
da senha na URL de conexão. O arquivo `.env` não deve ser enviado ao GitHub porque contém 
informações de acesso ao banco de dados. Depois de configurar a conexão, iniciei a aplicação e verifiquei se conseguia acessar 
o MongoDB. Com a conexão funcionando, comecei a implementação das funcionalidades do desafio.

## 3. Como os dados são armazenados

Cada item do menu é salvo separadamente no banco de dados. Para isso, criei o modelo `menu.ts`, com três campos:

- `id`: identificador numérico do item.
- `name`: nome do item, obrigatório e único.
- `relatedId`: identificador do item pai, utilizado quando o cadastro é de um subitem.

Por exemplo, se Eletrodomésticos tem o ID 1, posso cadastrar Televisores 
informando `relatedId: 1`. Assim, o sistema sabe que Televisores pertence a Eletrodomésticos.
Também criei o modelo `counter.ts` para gerar identificadores numéricos em sequência, 
já que o MongoDB normalmente utiliza identificadores do tipo `ObjectId`.
O `counter.ts` define o modelo que armazena o contador utilizado na geração dos 
identificadores. No cadastro, utilizei o método `findOneAndUpdate` 
do Mongoose com o operador `$inc`, que aumenta o valor do contador diretamente no 
banco de dados. Esse incremento é feito de forma atômica, 
evitando que dois cadastros simultâneos recebam o mesmo número. Embora o identificador seja armazenado como número no banco, a API o 
retorna como texto (`String`), conforme solicitado no desafio.

## 4. Funcionalidades desenvolvidas

Implementei os três endpoints solicitados.

### Cadastrar item

`POST /api/v1/menu`

Permite cadastrar um item principal ou um subitem.
Exemplo:

```json
{
  "name": "Televisores",
  "relatedId": 1
}
```

O campo `name` é obrigatório. O campo `relatedId` é opcional e deve ser informado quando 
o item pertence a outro menu. Quando o cadastro funciona, a API retorna o status `201` e o 
ID do novo item como texto. Também implementei verificações para impedir nomes duplicados, 
dados inválidos e cadastros associados a itens que não existem.

### Consultar menu

`GET /api/v1/menu`

Consulta os itens cadastrados e devolve o menu completo, organizado por níveis. 
Para organizar os itens, utilizei uma função chamada `buildTree`.
Essa função procura os subitens de cada item e repete o processo até encontrar 
os últimos níveis. Esse processo é chamado de recursividade. 
Dessa forma, não preciso definir previamente quantos níveis um menu pode ter. 
Quando a consulta funciona, a API retorna o status `200` e o menu completo no 
formato JSON solicitado no desafio.

### Excluir item

`DELETE /api/v1/menu/{id}`

Permite excluir um item informando seu identificador. Também implementei a exclusão em cascata. 
Isso significa que, quando um item é excluído, seus subitens também são removidos.
Para realizar essa exclusão, primeiro verifico se o item existe. 
Depois, procuro os subitens relacionados a ele e continuo a busca até identificar todos os 
seus descendentes. Por fim, utilizo o método `deleteMany` do Mongoose para excluir os 
registros encontrados. Por exemplo, se eu excluir Televisores, 
os itens LCD e seus respectivos subitens também serão excluídos. 
Essa foi uma decisão de implementação para evitar que fiquem subitens sem um item pai.
Quando a exclusão funciona, a API retorna o status `200`.

## 5. Organização dos arquivos

Mantive a estrutura do projeto fornecida pela empresa. Os arquivos principais que utilizei para implementar a API foram:

```text
src/
├── controllers/
│   └── menu.ts
├── models/
│   ├── menu.ts
│   └── counter.ts
├── routes/
│   └── menu.ts
├── validation/
│   └── menu.ts
└── index.ts
```

O `menu.ts` da pasta `models` define os dados do menu.

O `counter.ts` controla a sequência dos identificadores.

O `menu.ts` da pasta `controllers` contém as funções de cadastro, consulta e exclusão.

O `menu.ts` da pasta `routes` define os endereços da API.

O `menu.ts` da pasta `validation` verifica os dados recebidos.

O `index.ts` foi atualizado para registrar as novas rotas.

## 6. Testes realizados

Utilizei o HTTP Client do WebStorm para testar a API.
Criei o arquivo `menu.http`, onde organizei as requisições para facilitar a execução dos testes.
Testei o cadastro de itens principais e subitens, 
a consulta do menu completo e a exclusão de registros. 
Também fiz testes com nomes duplicados, campos obrigatórios não preenchidos, 
identificadores inválidos, itens relacionados inexistentes e exclusão em cascata.
Verifiquei os códigos HTTP retornados pela API, como `201` para cadastro realizado, `200` 
para consulta e exclusão, `400` para dados inválidos, `404` para itens não encontrados 
e `409` para nomes duplicados. Esses testes ajudaram a verificar se as funcionalidades 
estavam respondendo corretamente e se os erros estavam sendo tratados.


## 7. Como executar

É necessário ter Node.js, npm e acesso a um banco MongoDB. Dentro da pasta `backend-desafio`, instale as dependências:

```bash
npm install
```

O comando `npm install` instala as dependências declaradas no arquivo `package.json`. Configure o arquivo `.env` com uma conexão válida na variável `MONGO_URL`.
O arquivo `.env.example` pode ser utilizado como referência, sem colocar informações de acesso diretamente no código. Depois, inicie a aplicação:

```bash
npm start
```

A API estará disponível em:

`http://localhost:8000`

Para testar os endpoints, abra o arquivo `menu.http` no WebStorm e execute as requisições.


## 8. Considerações finais

Desenvolvi a API Menu utilizando o projeto inicial fornecido pela Paketá. 
Procurei manter a estrutura existente e implementar as funcionalidades solicitadas de forma 
simples, utilizando Node.js, TypeScript, Express, Mongoose e MongoDB. O projeto permite 
cadastrar, consultar e excluir menus com vários níveis de subitens, além de validar os dados 
recebidos. Também implementei a geração de identificadores numéricos e a exclusão em cascata.
Os testes foram realizados para verificar o funcionamento das operações e o 
tratamento de situações inválidas.
