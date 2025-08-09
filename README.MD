# 💰 Finance Control

<div align="center">
  <h3>🏦 Sistema completo de controle financeiro pessoal</h3>
  <p>Uma aplicação moderna e intuitiva para gerenciar suas finanças pessoais com dashboards interativos, controle de gastos mensais e análises detalhadas.</p>
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

---

## ✨ Funcionalidades

### 🔐 **Autenticação Segura**

- Sistema completo de login e cadastro
- Autenticação JWT com tokens seguros
- Recuperação de senha com pergunta de segurança
- Validação de dados em tempo real

### 📊 **Dashboard Interativo**

- Visão geral das finanças mensais
- Gráficos de pizza e linha interativos
- Indicadores de tendências de gastos
- Navegação por mês de referência

### 💳 **Gerenciamento Financeiro Completo**

- **💰 Entradas**: Controle de todas as fontes de renda
- **💳 Cartões de Crédito**: Monitoramento de limites e dívidas
- **📺 Assinaturas**: Gestão de serviços recorrentes
- **🏠 Serviços**: Controle de contas mensais (energia, água, internet, etc.)

### 📱 **Interface Moderna**

- Design responsivo com Tailwind CSS
- Totalmente adaptado para desktop e mobile
- Floating Action Buttons para dispositivos móveis
- Dark theme elegante

### 🔍 **Funcionalidades Avançadas**

- Filtros por categoria e período
- Busca em tempo real
- Notificações de próximos vencimentos
- Histórico de transações recentes
- Cálculo automático de saldo mensal

---

## 🛠️ Tecnologias Utilizadas

<table>
<tr>
<td>

### **Frontend**

- **Vue.js 3** - Framework JavaScript progressivo
- **TypeScript** - Superset com tipagem estática
- **Vite** - Build tool extremamente rápido
- **Tailwind CSS** - Framework CSS utility-first
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento oficial do Vue
- **Chart.js** - Gráficos interativos
- **Heroicons** - Ícones SVG modernos

</td>
<td>

### **Backend**

- **.NET 9** - Framework web moderno
- **ASP.NET Core** - APIs RESTful
- **Entity Framework Core** - ORM para .NET
- **SQLite** - Banco de dados leve
- **JWT Bearer** - Autenticação baseada em tokens
- **Swagger/OpenAPI** - Documentação automática

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

```bash
git clone https://github.com/tlsilva89/finance-control.git
cd finance-control
```

### 2️⃣ **Configuração do Backend**

```bash
# Navegue para o diretório do backend
cd backend

# Instale as dependências do .NET
dotnet restore

# Crie e execute as migrações do banco
dotnet ef migrations add InitialCreate
dotnet ef database update

# Execute o backend
dotnet run --urls "http://localhost:5188"
```

✅ **Backend disponível em:** `http://localhost:5188`  
📖 **Swagger UI:** `http://localhost:5188/swagger`

### 3️⃣ **Configuração do Frontend**

```bash
# Em um novo terminal, navegue para o frontend
cd frontend

# Instale as dependências
npm install

# Configure a variável de ambiente (opcional)
echo "VITE_API_URL=http://localhost:5188" > .env.local

# Execute o frontend em modo desenvolvimento
npm run dev
```

✅ **Frontend disponível em:** `http://localhost:5173`

### 4️⃣ **Build para Produção**

<table>
<tr>
<td>

**Frontend:**

```bash
cd frontend
npm run build
```

</td>
<td>

**Backend:**

```bash
cd backend
dotnet publish -c Release
```

</td>
</tr>
</table>

---

## 📁 Estrutura do Projeto

```
finance-control/
├── 📁 frontend/                    # Aplicação Vue.js
│   ├── 📁 src/
│   │   ├── 📁 components/          # Componentes reutilizáveis
│   │   │   ├── 📁 Charts/          # Componentes de gráficos
│   │   │   ├── 📁 Layout/          # Layout da aplicação
│   │   │   ├── 📁 UI/              # Componentes de interface
│   │   │   └── 📁 Modals/          # Modais da aplicação
│   │   ├── 📁 composables/         # Composables do Vue
│   │   ├── 📁 router/              # Configuração de rotas
│   │   ├── 📁 services/            # Serviços e API calls
│   │   ├── 📁 stores/              # Gerenciamento de estado (Pinia)
│   │   └── 📁 views/               # Páginas da aplicação
│   └── 📄 package.json
└── 📁 backend/                     # API .NET Core
    ├── 📁 Data/                    # Contexto do banco de dados
    ├── 📁 Models/                  # Modelos de dados
    ├── 📁 Services/                # Serviços de negócio
    ├── 📁 Endpoints/               # Endpoints da API
    └── 📁 Dtos/                    # Data Transfer Objects
```

---

## 🔌 API Endpoints

### 🔐 **Autenticação**

| Método | Endpoint                    | Descrição                 |
| ------ | --------------------------- | ------------------------- |
| `POST` | `/api/auth/register`        | Cadastro de usuário       |
| `POST` | `/api/auth/login`           | Login                     |
| `POST` | `/api/auth/check-username`  | Verificar disponibilidade |
| `POST` | `/api/auth/forgot-password` | Esqueci a senha           |
| `POST` | `/api/auth/reset-password`  | Redefinir senha           |

### 💰 **Recursos Financeiros**

| Recurso         | Endpoints Disponíveis                            |
| --------------- | ------------------------------------------------ |
| **Entradas**    | `GET` `POST` `PUT` `DELETE` `/api/incomes`       |
| **Cartões**     | `GET` `POST` `PUT` `DELETE` `/api/credit-cards`  |
| **Assinaturas** | `GET` `POST` `PUT` `DELETE` `/api/subscriptions` |
| **Serviços**    | `GET` `POST` `PUT` `DELETE` `/api/services`      |

> **🔒 Nota:** Todos os endpoints (exceto autenticação) requerem autenticação JWT.  
> Adicione o header: `Authorization: Bearer <seu_token>`

---

## ⚙️ Configuração

### **Variáveis de Ambiente**

**Frontend** (`.env.local`):

```env
VITE_API_URL=http://localhost:5188
```

**Backend** (`appsettings.json`):

```json
{
  "ConnectionStrings": {
    "Default": "Data Source=FinanceControl.db"
  },
  "Jwt": {
    "Key": "sua-chave-super-secreta-com-pelo-menos-32-caracteres",
    "Issuer": "FinanceControl",
    "Audience": "FinanceControl",
    "ExpirationSeconds": 86400
  }
}
```

---

## 🧪 Testes

```bash
# Frontend - Executar testes
cd frontend
npm run test

# Backend - Executar testes
cd backend
dotnet test
```

---

## 🚢 Deploy

### **Frontend** (Vercel/Netlify)

1. Configure `VITE_API_URL` para sua API em produção
2. Execute `npm run build`
3. Deploy da pasta `dist/`

### **Backend** (Railway/Heroku/Azure)

1. Configure o banco de dados de produção
2. Atualize as configurações JWT
3. Execute `dotnet publish -c Release`

---

## 🤝 Como Contribuir

1. **Fork** o projeto
2. Crie sua **feature branch** (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### **Padrões de Código**

- ✅ **Frontend**: ESLint + Prettier
- ✅ **Backend**: EditorConfig + .NET Code Style
- ✅ **Commits**: Conventional Commits

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

Agradecimentos especiais às tecnologias e comunidades que tornaram este projeto possível:

- [Vue.js Team](https://vuejs.org/) pela excelente framework
- [.NET Team](https://dotnet.microsoft.com/) pela plataforma robusta
- [Tailwind CSS](https://tailwindcss.com/) pelo sistema de design
- [Heroicons](https://heroicons.com/) pelos ícones lindos
- Comunidade open source pelos feedbacks e contribuições

---

<div align="center">

### ⭐ Se este projeto te ajudou, deixe uma estrela!

[![GitHub stars](https://img.shields.io/github/stars/tlsilva89/finance-control?style=social)](https://github.com/tlsilva89/finance-control/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tlsilva89/finance-control?style=social)](https://github.com/tlsilva89/finance-control/network/members)

**Feito Vue.js e .NET**

</div>
