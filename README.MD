<div align="center">

<h1>💰 Finance Control</h1>
<h3>🏦 Sistema Completo de Controle Financeiro Pessoal</h3>
<p><em>Uma aplicação moderna e intuitiva para gerenciar suas finanças pessoais com dashboards interativos, navegação temporal e análises detalhadas em tempo real.</em></p>

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[📖 Documentação](#-documentação-da-api) • [💡 Sugerir Feature](https://github.com/tlsilva89/finance-control/issues/new?template=feature_request.md)

</div>

---

## ✨ Funcionalidades Principais

<div align="center">
<table>
<tr>
<td width="50%">

### 🔐 **Autenticação & Segurança**

```
✅ Login seguro com JWT
✅ Recuperação de senha
✅ Perguntas de segurança
✅ Validação em tempo real
✅ Proteção de rotas
```

### 💼 **Gestão Financeira**

```
✅ Controle de entradas
✅ Gestão de cartões
✅ Monitoramento de assinaturas
✅ Controle de serviços
✅ Categorização automática
```

</td>
<td width="50%">

### 📊 **Dashboard & Analytics**

```
✅ Navegação temporal
✅ Gráficos interativos
✅ Insights automáticos
✅ Tendências mensais
✅ Relatórios customizados
```

### 📱 **Interface Moderna**

```
✅ Design responsivo
✅ Dark theme elegante
✅ PWA ready
✅ Offline support
✅ Animações suaves
```

</td>
</tr>
</table>
</div>

---

## 🛠️ Stack Tecnológica

<div align="center">

### Frontend

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black)

### Backend

![.NET](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

</div>

---

## 🚀 Quick Start

<div align="center">

### Pré-requisitos

![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-339933?style=flat&logo=node.js&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-≥9.0-512BD4?style=flat&logo=.net&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-≥13.0-316192?style=flat&logo=postgresql&logoColor=white)
![Git](https://img.shields.io/badge/Git-Latest-F05032?style=flat&logo=git&logoColor=white)

</div>

### 1️⃣ Clonagem do Repositório

```bash
git clone https://github.com/tlsilva89/finance-control.git
cd finance-control
```

<details>
<summary><strong>2️⃣ Configuração do Backend</strong> 🔽</summary>

```bash
cd backend

# 📦 Instalar dependências
dotnet restore

# 🗄️ Configurar banco de dados
dotnet ef migrations add InitialCreate
dotnet ef database update

# 🚀 Executar aplicação
dotnet run --urls "http://localhost:5188"
```

✅ **Backend**: `http://localhost:5188`  
📖 **Swagger**: `http://localhost:5188/swagger`

</details>

<details>
<summary><strong>3️⃣ Configuração do Frontend</strong> 🔽</summary>

```bash
cd frontend

# 📦 Instalar dependências
npm install

# ⚙️ Configurar ambiente
echo "VITE_API_URL=http://localhost:5188" > .env.local

# 🚀 Executar aplicação
npm run dev
```

✅ **Frontend**: `http://localhost:5173`

</details>

<details>
<summary><strong>4️⃣ Build para Produção</strong> 🔽</summary>

<table>
<tr>
<td width="50%">

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

</td>
<td width="50%">

**Backend:**

```bash
cd backend
dotnet publish -c Release -o publish/
```

</td>
</tr>
</table>

</details>

---

## 📁 Estrutura do Projeto

```
finance-control/
├── 🎨 frontend/                    # Vue.js + TypeScript
│   ├── 📁 src/
│   │   ├── 🧩 components/         # Componentes reutilizáveis
│   │   │   ├── 📊 Charts/         # Gráficos Chart.js
│   │   │   ├── 🎭 Layout/         # Layout e navegação
│   │   │   ├── 🎨 UI/             # Componentes de interface
│   │   │   └── 🪟 Modals/         # Modais e overlays
│   │   ├── 🔧 composables/        # Lógica reutilizável
│   │   ├── 🛣️  router/            # Rotas e guardas
│   │   ├── 🌐 services/           # API communication
│   │   ├── 🏪 stores/             # Estado global (Pinia)
│   │   ├── 📝 types/              # TypeScript types
│   │   └── 📄 views/              # Páginas da aplicação
│   └── ⚙️ config files...
└── 🏗️ backend/                     # .NET Core API
    ├── 🗄️ Data/                   # EF Core context
    ├── 📊 Models/                 # Entidades
    ├── ⚡ Services/               # Lógica de negócio
    ├── 🌐 Endpoints/              # API endpoints
    ├── 📦 Dtos/                   # Data Transfer Objects
    └── 🔄 Migrations/             # DB migrations
```

---

## 🔌 API Endpoints

<div align="center">

### 🔐 Autenticação

| Método | Endpoint                    | Descrição                    | Auth |
| ------ | --------------------------- | ---------------------------- | ---- |
| `POST` | `/api/auth/register`        | 📝 Cadastro de usuário       | ❌   |
| `POST` | `/api/auth/login`           | 🔑 Login do usuário          | ❌   |
| `POST` | `/api/auth/check-username`  | ✅ Verificar disponibilidade | ❌   |
| `POST` | `/api/auth/forgot-password` | 🔄 Recuperação de senha      | ❌   |

### 💰 Recursos Financeiros

| Recurso            | GET                      | POST                      | PUT                           | DELETE                           |
| ------------------ | ------------------------ | ------------------------- | ----------------------------- | -------------------------------- |
| **💰 Entradas**    | `GET /api/incomes`       | `POST /api/incomes`       | `PUT /api/incomes/{id}`       | `DELETE /api/incomes/{id}`       |
| **💳 Cartões**     | `GET /api/credit-cards`  | `POST /api/credit-cards`  | `PUT /api/credit-cards/{id}`  | `DELETE /api/credit-cards/{id}`  |
| **📺 Assinaturas** | `GET /api/subscriptions` | `POST /api/subscriptions` | `PUT /api/subscriptions/{id}` | `DELETE /api/subscriptions/{id}` |
| **🏠 Serviços**    | `GET /api/services`      | `POST /api/services`      | `PUT /api/services/{id}`      | `DELETE /api/services/{id}`      |

</div>

---

## ⚙️ Configuração

<details>
<summary><strong>🌐 Variáveis de Ambiente</strong></summary>

**Frontend (`.env.local`):**

```env
VITE_API_URL=http://localhost:5188
VITE_DEBUG_MODE=true
VITE_ENABLE_MOCK_DATA=false
```

**Backend (`appsettings.json`):**

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Database=FinanceControl;Username=postgres;Password=suasenha"
  },
  "Jwt": {
    "Key": "sua-chave-super-secreta-com-pelo-menos-32-caracteres",
    "Issuer": "FinanceControl",
    "Audience": "FinanceControl",
    "ExpirationSeconds": 86400
  }
}
```

</details>

---

## 🚢 Deploy

<div align="center">

### Frontend

[![Deploy to Vercel](https://img.shields.io/badge/Deploy%20to-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com)

### Backend

[![Deploy to Railway](https://img.shields.io/badge/Deploy%20to-Railway-0B0D0E?style=for-the-badge&logo=railway)](https://railway.app)
[![Deploy to Heroku](https://img.shields.io/badge/Deploy%20to-Heroku-430098?style=for-the-badge&logo=heroku)](https://heroku.com)

</div>

<details>
<summary><strong>🐳 Docker Deployment</strong></summary>

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
# Build e executar
docker build -t finance-control-frontend .
docker run -p 80:80 finance-control-frontend
```

</details>

---

## 🧪 Testes & Qualidade

<div align="center">

![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Coverage-85%25-green?style=for-the-badge)
![Code Quality](https://img.shields.io/badge/Code%20Quality-A-brightgreen?style=for-the-badge)

</div>

```bash
# 🧪 Frontend Tests
cd frontend
npm run test              # Testes unitários
npm run test:coverage     # Coverage report
npm run lint             # ESLint
npm run format           # Prettier

# 🔬 Backend Tests
cd backend
dotnet test              # Todos os testes
dotnet test --collect:"XPlat Code Coverage"  # Com coverage
dotnet format --verify-no-changes           # Verificar formatação
```

---

## 🤝 Contribuindo

<div align="center">

[![Contributors](https://img.shields.io/github/contributors/tlsilva89/finance-control?style=for-the-badge)](https://github.com/tlsilva89/finance-control/graphs/contributors)
[![Pull Requests](https://img.shields.io/github/issues-pr/tlsilva89/finance-control?style=for-the-badge)](https://github.com/tlsilva89/finance-control/pulls)
[![Good First Issues](https://img.shields.io/github/issues/tlsilva89/finance-control/good%20first%20issue?style=for-the-badge&color=7057ff)](https://github.com/tlsilva89/finance-control/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

</div>

### Como Contribuir

1. 🍴 **Fork** o repositório
2. 🌿 Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. 💾 Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. 📤 Push para a branch (`git push origin feature/nova-funcionalidade`)
5. 🔃 Abra um **Pull Request**

<details>
<summary><strong>📝 Padrões de Desenvolvimento</strong></summary>

**Commits Convencionais:**

```
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    formatação/estilo
refactor: refatoração
test:     testes
chore:    manutenção
```

**Code Review Checklist:**

- ✅ Testes passando
- ✅ Código formatado
- ✅ Documentação atualizada
- ✅ Performance verificada

</details>

---

## 📚 Recursos & Documentação

<div align="center">

### Links Úteis

[![Vue.js Docs](https://img.shields.io/badge/Vue.js-Documentation-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/guide/)
[![.NET Docs](https://img.shields.io/badge/.NET-Documentation-512BD4?style=for-the-badge&logo=.net)](https://docs.microsoft.com/dotnet/)
[![Tailwind Docs](https://img.shields.io/badge/Tailwind-Documentation-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/docs)

### Guias e Tutoriais

| 📖  | Conteúdo                                     | Status |
| --- | -------------------------------------------- | ------ |
| 🚀  | [Configuração do Ambiente](docs/setup.md)    | ✅     |
| 💡  | [Adicionando Nova Feature](docs/features.md) | ✅     |
| 🚢  | [Deploy em Produção](docs/deployment.md)     | ✅     |
| 🔧  | [Troubleshooting](docs/troubleshooting.md)   | ✅     |

</div>

---

## 📄 Licença

<div align="center">

![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**MIT License** - Livre para uso pessoal e comercial

```
✅ Uso comercial permitido
✅ Modificação permitida
✅ Distribuição permitida
✅ Uso privado permitido
```

</div>

---

## 🙏 Agradecimentos

<div align="center">

### Tecnologias Incríveis

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=flat&logo=.net&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

### Comunidade Incrível

- 🤝 Contribuidores do GitHub
- 🧪 Beta testers
- 💡 Comunidade open source
- 🛠️ Desenvolvedores de ferramentas

</div>

---

<div align="center">

## 🌟 Mostre seu Apoio

**Gostou do projeto? Deixe uma estrela!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/tlsilva89/finance-control?style=for-the-badge&logo=github&color=yellow)](https://github.com/tlsilva89/finance-control/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tlsilva89/finance-control?style=for-the-badge&logo=github&color=blue)](https://github.com/tlsilva89/finance-control/network/members)

### 🎉 **Projeto Concluído - Agosto 2025**

---

### 💬 Conecte-se

[![Twitter Follow](https://img.shields.io/badge/Follow-@tlsilva89-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/tlsilva89)
[![LinkedIn Connect](https://img.shields.io/badge/Connect-LinkedIn-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/tlsilva89)
[![GitHub Follow](https://img.shields.io/badge/Follow-@tlsilva89-181717?style=for-the-badge&logo=github)](https://github.com/tlsilva89)

---

<h3>💰 Finance Control</h3>
<p><em>Sua solução completa para controle financeiro pessoal</em></p>
<p><strong>Desenvolvido usando Vue.js e .NET</strong></p>

**[⬆️ Voltar ao topo](#-finance-control)**

---

<sub>© 2025 Finance Control. Desenvolvido por Thiago Luciano Silva.</sub>

</div>
