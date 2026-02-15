# Sistema de Marketplace de Veículos

Um sistema de marketplace completo para compra e venda de veículos, inspirado no Webmotors. Desenvolvido com Node.js, Express e SQLite.

## 🚗 Funcionalidades

- **Listagem de Veículos**: Visualize todos os veículos disponíveis no marketplace
- **Busca e Filtros**: Pesquise por marca, modelo, e aplique filtros por:
  - Tipo de veículo (Carro, Moto, Caminhão)
  - Marca
  - Faixa de ano
  - Faixa de preço
- **Detalhes do Veículo**: Visualize informações completas incluindo:
  - Fotos
  - Especificações técnicas
  - Descrição detalhada
  - Informações do vendedor
- **Cadastro de Veículos**: Anuncie seu veículo com todas as informações necessárias
- **Edição e Exclusão**: Gerencie seus anúncios facilmente

## 🛠️ Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - SQLite3
  - CORS
  - Body-Parser

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Design Responsivo

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (Node Package Manager)

## 🚀 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/vinicius622026/sistema-veiculo-marketplace.git
cd sistema-veiculo-marketplace
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Acesse o aplicativo no navegador:
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
sistema-veiculo-marketplace/
├── server.js              # Servidor Express e API REST
├── package.json           # Dependências e scripts
├── marketplace.db         # Banco de dados SQLite (criado automaticamente)
├── public/
│   ├── index.html        # Interface principal
│   ├── styles.css        # Estilos da aplicação
│   └── app.js            # Lógica do frontend
└── README.md             # Documentação
```

## 🔌 API Endpoints

### Veículos

- `GET /api/vehicles` - Lista todos os veículos (com filtros opcionais)
  - Query params: `tipo`, `marca`, `precoMin`, `precoMax`, `anoMin`, `anoMax`, `search`
- `GET /api/vehicles/:id` - Obtém detalhes de um veículo específico
- `POST /api/vehicles` - Cria um novo veículo
- `PUT /api/vehicles/:id` - Atualiza um veículo existente
- `DELETE /api/vehicles/:id` - Exclui um veículo

### Auxiliares

- `GET /api/brands` - Lista todas as marcas disponíveis
- `GET /api/types` - Lista todos os tipos de veículos

## 💾 Modelo de Dados

### Veículo

```javascript
{
  id: INTEGER (auto-increment),
  tipo: STRING,              // Carro, Moto, Caminhão
  marca: STRING,             // Toyota, Honda, etc.
  modelo: STRING,            // Corolla, Civic, etc.
  ano: INTEGER,              // 2020, 2021, etc.
  preco: DECIMAL,            // Preço em reais
  quilometragem: INTEGER,    // KM rodados
  cor: STRING,               // Cor do veículo
  combustivel: STRING,       // Gasolina, Flex, Diesel, etc.
  cambio: STRING,            // Manual, Automático
  portas: INTEGER,           // Número de portas
  descricao: TEXT,           // Descrição detalhada
  imagem: STRING,            // URL da imagem
  vendedor: STRING,          // Nome do vendedor
  telefone: STRING,          // Telefone de contato
  cidade: STRING,            // Cidade
  estado: STRING,            // Estado (UF)
  created_at: DATETIME       // Data de criação
}
```

## 🎨 Interface

A interface foi desenvolvida com foco em usabilidade e design moderno:

- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Filtros Intuitivos**: Busca rápida e filtros fáceis de usar
- **Cards de Veículos**: Visualização clara e atrativa dos veículos
- **Modals**: Para detalhes completos e formulários
- **Feedback Visual**: Animações e estados hover

## 📝 Dados de Exemplo

O sistema vem com dados de exemplo pré-carregados incluindo:
- Carros (Toyota Corolla, Honda Civic, VW Gol, Chevrolet Onix, Fiat Argo)
- Motos (Honda CG 160, Yamaha Fazer 250)
- Caminhões (Mercedes-Benz Accelo)

## 🔒 Segurança

- Validação de dados no backend
- Sanitização de inputs
- CORS configurado
- Preparação de queries SQL para evitar SQL Injection

## 🚀 Melhorias Futuras

- Autenticação de usuários
- Upload de múltiplas imagens
- Sistema de favoritos
- Chat entre comprador e vendedor
- Integração com APIs de pagamento
- Avaliações e comentários
- Geolocalização
- Notificações por email

## 📄 Licença

ISC

## 👤 Autor

Desenvolvido para demonstração de um sistema de marketplace de veículos.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.
