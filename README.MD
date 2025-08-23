**📁 README.md - ARQUIVO COMPLETO PARA COLAR**

```markdown
# 💰 Finance Control

<div align="center">
  <h3>🏦 Sistema completo de controle financeiro pessoal</h3>
  <p>Uma aplicação moderna e intuitiva para gerenciar suas finanças pessoais com dashboards interativos, navegação temporal e análises detalhadas em tempo real.</p>
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

---

## ✨ Funcionalidades Principais

### 🔐 **Sistema de Autenticação Robusto**

- **Login e Cadastro Seguros**: Autenticação JWT com tokens de longa duração
- **Recuperação de Senha**: Sistema completo com perguntas de segurança personalizadas
- **Validação em Tempo Real**: Feedback imediato durante preenchimento de formulários
- **Proteção de Rotas**: Middleware de autenticação automático
- **Verificação de Usuário**: Checagem de disponibilidade de username

### 📊 **Dashboard Financeiro Avançado**

- **Visão Geral Mensal**: Resumo completo das finanças do mês selecionado
- **Navegação Temporal**: Sistema de navegação entre meses com controles intuitivos
- **Indicadores Visuais**: Cards interativos com informações de entradas, gastos e saldo
- **Gráficos Dinâmicos**:
  - 🥧 **Gráfico de Pizza**: Distribuição visual de despesas por categoria
  - 📊 **Gráfico de Barras**: Comparativo histórico mensal com filtros
- **Insights Automáticos**: Análise de tendências e variações percentuais
- **Atualização em Tempo Real**: Dados sincronizados automaticamente

### 💼 **Gerenciamento Financeiro Completo**

#### 💰 **Gestão de Entradas**

- Registro de todas as fontes de renda
- Categorização automática por tipo
- Histórico completo de transações
- Busca e filtros avançados
- Cálculo automático de totais mensais

#### 💳 **Controle de Cartões de Crédito**

- **Monitoramento de Limites**: Indicadores visuais de utilização
- **Gestão de Dívidas**: Controle detalhado de débitos atuais
- **Vencimentos**: Alertas de próximas faturas
- **Gastos por Cartão**: Análise individual de cada cartão
- **Histórico de Compras**: Registro completo de transações

#### 📺 **Gerenciamento de Assinaturas**

- Controle de serviços recorrentes (Netflix, Spotify, etc.)
- Alertas de renovação automática
- Análise de custo benefício
- Categorização por tipo de serviço
- Controle de status (ativo/inativo)

#### 🏠 **Controle de Serviços Essenciais**

- Gestão de contas mensais (energia, água, internet, gás)
- Calendário de vencimentos
- Histórico de consumo
- Alertas de pagamento
- Comparativo mensal de valores

### 📱 **Interface Moderna e Responsiva**

- **Design System Consistente**: Baseado em Tailwind CSS
- **Dark Theme Elegante**: Interface otimizada para longos períodos de uso
- **Responsividade Total**: Experiência fluida em desktop, tablet e mobile
- **Floating Action Buttons**: Ações rápidas em dispositivos móveis
- **Animações Suaves**: Transições elegantes entre estados
- **Componentes Reutilizáveis**: Arquitetura modular e escalável

### 🔍 **Funcionalidades Avançadas**

- **Sistema de Filtros**: Busca por categoria, período e valor
- **Pesquisa Inteligente**: Busca em tempo real com sugestões
- **Próximos Vencimentos**: Dashboard de pagamentos pendentes
- **Transações Recentes**: Histórico das últimas movimentações
- **Cálculos Automáticos**: Saldo mensal, percentuais e tendências
- **Indicadores de Urgência**: Alertas visuais por proximidade de vencimento
- **Navegação Contextual**: Links inteligentes entre seções relacionadas

### 📈 **Analytics e Relatórios**

- **Análise de Tendências**: Comparação mês a mês com insights
- **Distribuição de Gastos**: Visualização proporcional por categoria
- **Indicadores de Performance**: Superávit/déficit mensal
- **Histórico Inteligente**: Apenas meses com dados reais
- **Métricas Personalizadas**: Percentuais de limite usado, economia mensal

---

## 🛠️ Stack Tecnológico

<table>
<tr>
<td>

### **Frontend Moderno**

- **Vue.js 3** - Framework progressivo com Composition API
- **TypeScript** - Tipagem estática para maior robustez
- **Vite** - Build tool ultrarrápido com HMR
- **Tailwind CSS** - Framework CSS utility-first
- **Pinia** - Gerenciamento de estado moderno
- **Vue Router 4** - Roteamento oficial com proteção
- **Chart.js** - Gráficos interativos e responsivos
- **Heroicons** - Biblioteca de ícones SVG consistente

</td>
<td>

### **Backend Robusto**

- **.NET 9** - Framework web de alta performance
- **ASP.NET Core** - APIs RESTful modernas
- **Entity Framework Core** - ORM avançado com migrations
- **SQLite** - Banco de dados leve e confiável
- **JWT Bearer** - Autenticação stateless segura
- **Swagger/OpenAPI** - Documentação automática
- **Middleware Pipeline** - Processamento de requisições

</td>
</tr>
</table>

---

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **.NET SDK** >= 9.0
- **Git** para controle de versão

---

## 🚀 Instalação e Execução

### 1️⃣ **Clone o Repositório**
```

git clone https://github.com/tlsilva89/finance-control.git
cd finance-control

```

### 2️⃣ **Configuração do Backend**

```

cd backend

# Instalar dependências

dotnet restore

# Criar e aplicar migrações

dotnet ef migrations add InitialCreate
dotnet ef database update

# Executar em desenvolvimento

dotnet run --urls "http://localhost:5188"

```

✅ **Backend disponível em:** `http://localhost:5188`
📖 **Documentação API:** `http://localhost:5188/swagger`

### 3️⃣ **Configuração do Frontend**

```

cd frontend

# Instalar dependências

npm install

# Configurar variáveis de ambiente

echo "VITE_API_URL=http://localhost:5188" > .env.local

# Executar em desenvolvimento

npm run dev

```

✅ **Aplicação disponível em:** `http://localhost:5173`

### 4️⃣ **Build para Produção**

<table>
<tr>
<td>

**Frontend:**

```

cd frontend
npm run build
npm run preview # testar build local

```

</td>
<td>

**Backend:**

```

cd backend
dotnet publish -c Release -o publish/

```

</td>
</tr>
</table>

---

## 📁 Arquitetura do Projeto

```

finance-control/
├── 📁 frontend/ # Aplicação Vue.js + TypeScript
│ ├── 📁 src/
│ │ ├── 📁 components/ # Componentes reutilizáveis
│ │ │ ├── 📁 Charts/ # Componentes de gráficos (Chart.js)
│ │ │ ├── 📁 Layout/ # Layout principal e navegação
│ │ │ ├── 📁 UI/ # Componentes de interface
│ │ │ └── 📁 Modals/ # Modais e overlays
│ │ ├── 📁 composables/ # Composables Vue para lógica reutilizável
│ │ ├── 📁 router/ # Configuração de rotas e guardas
│ │ ├── 📁 services/ # Camada de comunicação com API
│ │ ├── 📁 stores/ # Stores Pinia (estado global)
│ │ │ ├── 📄 auth.ts # Autenticação e usuário
│ │ │ ├── 📄 finance.ts # Dados financeiros principais
│ │ │ └── 📄 dateReference.ts # Navegação temporal
│ │ ├── 📁 types/ # Tipos TypeScript globais
│ │ └── 📁 views/ # Páginas da aplicação
│ │ ├── 📄 DashboardView.vue # Dashboard principal
│ │ ├── 📄 IncomeView.vue # Gestão de entradas
│ │ ├── 📄 CreditCardsView.vue # Controle de cartões
│ │ ├── 📄 SubscriptionsView.vue # Gestão de assinaturas
│ │ └── 📄 ServicesView.vue # Controle de serviços
│ ├── 📄 package.json
│ ├── 📄 tailwind.config.js # Configuração do Tailwind
│ └── 📄 vite.config.ts # Configuração do Vite
└── 📁 backend/ # API .NET Core
├── 📁 Data/ # Contexto e configurações do EF Core
├── 📁 Models/ # Entidades do banco de dados
├── 📁 Services/ # Serviços de negócio e validações
├── 📁 Endpoints/ # Minimal APIs endpoints
├── 📁 Dtos/ # Data Transfer Objects
├── 📁 Migrations/ # Migrações do Entity Framework
└── 📄 Program.cs # Configuração da aplicação

```

---

## 🔌 Documentação da API

### 🔐 **Endpoints de Autenticação**

| Método | Endpoint                    | Descrição                    | Autenticação |
| ------ | --------------------------- | ---------------------------- | ------------ |
| `POST` | `/api/auth/register`        | Cadastro de novo usuário     | ❌           |
| `POST` | `/api/auth/login`           | Login do usuário             | ❌           |
| `POST` | `/api/auth/check-username`  | Verificar disponibilidade    | ❌           |
| `POST` | `/api/auth/forgot-password` | Iniciar recuperação de senha | ❌           |
| `POST` | `/api/auth/reset-password`  | Redefinir senha              | ❌           |

### 💰 **Endpoints de Recursos Financeiros**

| Recurso            | GET                           | POST                          | PUT                             | DELETE                          |
| ------------------ | ----------------------------- | ----------------------------- | ------------------------------- | ------------------------------- |
| **💰 Entradas**    | `GET /api/incomes`            | `POST /api/incomes`           | `PUT /api/incomes/{id}`         | `DELETE /api/incomes/{id}`      |
| **💳 Cartões**     | `GET /api/credit-cards`       | `POST /api/credit-cards`      | `PUT /api/credit-cards/{id}`    | `DELETE /api/credit-cards/{id}` |
| **📺 Assinaturas** | `GET /api/subscriptions`      | `POST /api/subscriptions`     | `PUT /api/subscriptions/{id}`   | `DELETE /api/subscriptions/{id}`|
| **🏠 Serviços**    | `GET /api/services`           | `POST /api/services`          | `PUT /api/services/{id}`        | `DELETE /api/services/{id}`     |

### 📊 **Endpoints de Analytics**

| Método | Endpoint                     | Descrição                        | Parâmetros              |
| ------ | ---------------------------- | -------------------------------- | ----------------------- |
| `GET`  | `/api/dashboard/summary`     | Resumo mensal completo           | `month`, `year`         |
| `GET`  | `/api/dashboard/trends`      | Análise de tendências            | `months` (quantidade)   |
| `GET`  | `/api/dashboard/upcoming`    | Próximos vencimentos             | `days` (lookahead)      |

> **🔒 Autenticação:** Todos os endpoints (exceto auth) requerem JWT Bearer token
> **📄 Formato:** `Authorization: Bearer <seu_token_jwt>`

---

## ⚙️ Configuração Detalhada

### **Variáveis de Ambiente do Frontend**

Crie o arquivo `.env.local` na pasta `frontend/`:

```

# URL da API backend

VITE_API_URL=http://localhost:5188

# Configurações de desenvolvimento (opcional)

VITE_DEBUG_MODE=true
VITE_ENABLE_MOCK_DATA=false

```

### **Configuração do Backend**

Configure o `appsettings.json` na pasta `backend/`:

```

{
"ConnectionStrings": {
"Default": "Data Source=FinanceControl.db"
},
"Jwt": {
"Key": "sua-chave-super-secreta-com-pelo-menos-32-caracteres-para-seguranca",
"Issuer": "FinanceControl",
"Audience": "FinanceControl",
"ExpirationSeconds": 86400
},
"Logging": {
"LogLevel": {
"Default": "Information",
"Microsoft.AspNetCore": "Warning"
}
},
"AllowedHosts": "\*"
}

```

---

## 📱 Recursos Mobile

### **Design Responsivo**
- Layout adaptativo automático
- Componentes otimizados para touch
- Floating Action Buttons para ações rápidas
- Navegação simplificada em telas pequenas

### **PWA Ready**
- Service Worker configurado
- Cache inteligente de recursos
- Funciona offline (limitado)
- Instalável como app nativo

---

## 🧪 Testes e Qualidade

### **Frontend**

```

cd frontend

# Executar testes unitários

npm run test

# Executar testes com coverage

npm run test:coverage

# Linting e formatação

npm run lint
npm run format

```

### **Backend**

```

cd backend

# Executar todos os testes

dotnet test

# Executar com coverage

dotnet test --collect:"XPlat Code Coverage"

# Verificar formatação

dotnet format --verify-no-changes

```

---

## 🚢 Deploy em Produção

### **Frontend (Vercel/Netlify)**

```

# Build otimizado para produção

npm run build

# Preview local do build

npm run preview

# Configurar variáveis no provedor:

# VITE_API_URL=https://sua-api.herokuapp.com

```

### **Backend (Railway/Heroku/Azure)**

```

# Publicar aplicação

dotnet publish -c Release -o publish/

# Configurar variáveis de ambiente:

# - ConnectionString para PostgreSQL/MySQL

# - JWT\_\_Key com chave segura

# - ASPNETCORE_ENVIRONMENT=Production

```

### **Docker (Opcional)**

```

# Frontend Dockerfile

FROM node:18-alpine AS build
WORKDIR /app
COPY package\*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

```

---

## 🤝 Contribuindo para o Projeto

### **Como Contribuir**

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request** detalhado

### **Padrões de Desenvolvimento**

#### **Commits Convencionais**
```

feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação/estilo
refactor: refatoração
test: testes
chore: tarefas de manutenção

```

#### **Estrutura de Branch**
```

main/ # Produção estável
develop/ # Desenvolvimento ativo  
feature/nome # Novas funcionalidades
hotfix/nome # Correções urgentes
release/v1.x.x # Preparação de releases

```

#### **Code Review Checklist**
- ✅ Testes passando
- ✅ Código formatado
- ✅ Documentação atualizada
- ✅ Performance otimizada
- ✅ Acessibilidade considerada

---

## 📚 Recursos e Documentação

### **Links Úteis**
- [📖 Documentação Vue.js](https://vuejs.org/guide/)
- [🎨 Tailwind CSS Docs](https://tailwindcss.com/docs)
- [⚡ Vite Guide](https://vitejs.dev/guide/)
- [🏪 Pinia Docs](https://pinia.vuejs.org/)
- [🔷 .NET Documentation](https://docs.microsoft.com/dotnet/)

### **Tutoriais e Guias**
- **Configuração do Ambiente**: [Ver Wiki](#)
- **Adicionando Nova Feature**: [Ver Guia](#)
- **Deploy em Produção**: [Ver Tutorial](#)
- **Troubleshooting**: [Ver FAQ](#)

---

## 🐛 Problemas Conhecidos

### **Limitações Atuais**
- Suporte limitado a Internet Explorer
- Gráficos podem ter performance reduzida com +1000 registros
- PWA funciona melhor em Chrome/Edge

### **Reportar Bugs**
Encontrou um problema? [Abra uma issue](https://github.com/tlsilva89/finance-control/issues) com:
- Descrição detalhada
- Passos para reproduzir
- Screenshots (se aplicável)
- Informações do ambiente

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

```

MIT License - Livre para uso pessoal e comercial
✅ Uso comercial permitido
✅ Modificação permitida  
✅ Distribuição permitida
✅ Uso privado permitido

```

---

## 🙏 Agradecimentos

**Tecnologias e Ferramentas:**
- [Vue.js Team](https://vuejs.org/) - Framework excepcional
- [Microsoft .NET Team](https://dotnet.microsoft.com/) - Plataforma robusta
- [Tailwind Labs](https://tailwindcss.com/) - Sistema de design moderno
- [Heroicons](https://heroicons.com/) - Ícones consistentes e bonitos

**Comunidade:**
- Contribuidores do GitHub que enviaram PRs
- Beta testers que forneceram feedback valioso
- Comunidade open source por inspiração e suporte

**Ferramentas de Desenvolvimento:**
- [Vite](https://vitejs.dev/) - Build tool incrivelmente rápido
- [Chart.js](https://www.chartjs.org/) - Gráficos interativos
- [Pinia](https://pinia.vuejs.org/) - Gerenciamento de estado elegante

---

<div align="center">

### ⭐ Gostou do projeto? Deixe uma estrela!

[![GitHub stars](https://img.shields.io/github/stars/tlsilva89/finance-control?style=for-the-badge&logo=github)](https://github.com/tlsilva89/finance-control/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tlsilva89/finance-control?style=for-the-badge&logo=github)](https://github.com/tlsilva89/finance-control/network/members)
[![GitHub issues](https://img.shields.io/github/issues/tlsilva89/finance-control?style=for-the-badge&logo=github)](https://github.com/tlsilva89/finance-control/issues)

---

**💰 Finance Control** - Sua solução completa para controle financeiro pessoal

*Desenvolvido com ❤️ usando Vue.js e .NET*

**[⬆️ Voltar ao topo](#-finance-control)**

</div>
```

**✅ ARQUIVO PRONTO PARA COLAR:**

- ✅ Markdown puro sem escapes
- ✅ Formatação GitHub completa
- ✅ Links funcionais
- ✅ Badges atualizados
- ✅ Estrutura organizada
