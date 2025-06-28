# Finance Control 💰

Um sistema completo de controle financeiro pessoal desenvolvido com **Vue.js 3** e **Node.js**, oferecendo uma interface moderna e intuitiva para gerenciar suas finanças.

## Funcionalidades

### 📊 Dashboard Interativo

- **Gráficos animados** com Chart.js para visualização de dados
- **Resumo financeiro** com entradas, despesas e saldo
- **Comparativo mensal** dos últimos 6 meses
- **Indicadores visuais** de tendências financeiras

### 💳 Gestão Completa

- **Entradas**: Controle de receitas e fontes de renda
- **Cartões de Crédito**: Gerenciamento de limites e débitos
- **Assinaturas**: Acompanhamento de serviços recorrentes
- **Serviços**: Controle de gastos com utilidades

### 🔐 Segurança Avançada

- **Autenticação com username** único
- **Sistema de recuperação de senha** com pergunta secreta
- **Validação por data de nascimento**
- **Criptografia bcrypt** para senhas
- **Tokens JWT** para sessões seguras

### 📱 Interface Moderna

- **Design responsivo** para desktop e mobile
- **Tema dark** elegante inspirado no Arch Linux
- **Animações suaves** e transições fluidas
- **Componentes reutilizáveis** com TypeScript

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Vue.js 3** - Framework progressivo
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Chart.js** - Gráficos interativos
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento SPA

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma ORM** - Mapeamento objeto-relacional
- **SQLite** - Banco de dados
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/finance-control.git
cd finance-control
```

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Configurar banco de dados
npx prisma db push
npx prisma generate

# Iniciar servidor
npm run dev
```

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu_jwt_secret_super_seguro"
PORT=3000
```

## 🎯 Como Usar

### 1. **Registro de Usuário**

- Crie uma conta com username único
- Defina uma pergunta de segurança
- Informe sua data de nascimento

### 2. **Dashboard Principal**

- Visualize o resumo financeiro do mês
- Analise gráficos de distribuição de gastos
- Compare despesas dos últimos 6 meses

### 3. **Gestão de Dados**

- **Entradas**: Adicione suas fontes de renda
- **Cartões**: Configure limites e acompanhe débitos
- **Assinaturas**: Gerencie serviços recorrentes
- **Serviços**: Controle gastos com utilidades

### 4. **Navegação por Mês**

- Use o seletor de mês para visualizar dados históricos
- Compare diferentes períodos
- Analise tendências de gastos

## 🔧 Scripts Disponíveis

### Backend

```bash
npm run dev          # Servidor em modo desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npx prisma studio    # Interface visual do banco
```

### Frontend

```bash
npm run dev          # Desenvolvimento com hot-reload
npm run build        # Build para produção
npm run preview      # Preview da build de produção
npm run lint         # Verificar código com ESLint
```

### Estrutura do Projeto

```
finance-control/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── income.ts
│   │   │   ├── creditCards.ts
│   │   │   ├── subscriptions.ts
│   │   │   └── services.ts
│   │   └── server.ts
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Modals/
│   │   │   ├── Charts/
│   │   │   └── UI/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── composables/
│   │   ├── services/
│   │   └── router/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔐 Funcionalidades de Segurança

### Autenticação

- **Username único** com validação em tempo real
- **Senhas criptografadas** com bcrypt
- **Tokens JWT** com expiração de 7 dias
- **Middleware de autenticação** em rotas protegidas

### Recuperação de Senha

- **Validação por data de nascimento**
- **Pergunta de segurança** personalizada
- **Processo seguro** sem vazamento de informações
- **Criptografia** de respostas de segurança

### Proteção de Dados

- **Validação de entrada** em todas as rotas
- **Sanitização** de dados do usuário
- **Headers de segurança** configurados
- **CORS** configurado adequadamente

## 🎨 Design System

### Paleta de Cores

- **Primary**: `#3b82f6` (Azul)
- **Secondary**: `#1793d1` (Ciano Arch)
- **Dark**: `#0f172a` (Slate 950)
- **Success**: `#10b981` (Verde)
- **Error**: `#ef4444` (Vermelho)

### Tipografia

- **Principal**: Inter (Sans-serif)
- **Código**: JetBrains Mono (Monospace)
- **Hierarquia**: 6 níveis de tamanho
- **Pesos**: 300, 400, 500, 600, 700

## 🚀 Deploy

### Backend (Railway/Heroku)

```bash
# Build da aplicação
npm run build

# Configurar variáveis de ambiente
# DATABASE_URL, JWT_SECRET, PORT

# Deploy automático via Git
git push origin main
```

### Frontend (Vercel/Netlify)

```bash
# Build da aplicação
npm run build

# Configurar variável de ambiente
# VITE_API_URL=https://sua-api.com

# Deploy automático via Git
git push origin main
```

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Commit

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: mudanças em ferramentas/configurações
```

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Thiago Luciano**

- GitHub: [@tlsilva89](https://github.com/tlsilva89)
- LinkedIn: [Thiago Luciano](https://www.linkedin.com/in/tlsilva89/)
- Email: thiago.luciano@digitalspark.dev

## 🙏 Agradecimentos

- [Vue.js](https://vuejs.org/) - Framework incrível
- [Tailwind CSS](https://tailwindcss.com/) - CSS utilitário
- [Chart.js](https://www.chartjs.org/) - Gráficos interativos
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Heroicons](https://heroicons.com/) - Ícones elegantes

  Feito com ❤️ e ☕
  ⭐ Se este projeto te ajudou, considere dar uma estrela!
