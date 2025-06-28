import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import incomeRoutes from "./routes/income.js";
import creditCardRoutes from "./routes/creditCards.js";
import serviceRoutes from "./routes/services.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
const PORT = process.env.PORT || 3000;

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Conexão com banco de dados estabelecida");
  } catch (error) {
    console.error("❌ Erro ao conectar com banco de dados:", error);
    process.exit(1);
  }
}

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Log de requests
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/credit-cards", creditCardRoutes);
app.use("/api/services", serviceRoutes); // Nova rota adicionada

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando!",
    timestamp: new Date().toISOString(),
    database: "Connected",
    routes: ["/api/auth", "/api/incomes", "/api/credit-cards", "/api/services"],
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("💥 Erro no servidor:", err);
    res
      .status(500)
      .json({ error: "Erro interno do servidor", details: err.message });
  }
);

// 404 handler
app.use((req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Rota não encontrada" });
});

// Start server
async function startServer() {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL}`);
    console.log(`📋 Rotas disponíveis:`);
    console.log(`   • POST /api/auth/login`);
    console.log(`   • POST /api/auth/register`);
    console.log(`   • GET  /api/incomes`);
    console.log(`   • POST /api/incomes`);
    console.log(`   • PUT  /api/incomes/:id`);
    console.log(`   • DELETE /api/incomes/:id`);
    console.log(`   • GET  /api/credit-cards`);
    console.log(`   • POST /api/credit-cards`);
    console.log(`   • PUT  /api/credit-cards/:id`);
    console.log(`   • DELETE /api/credit-cards/:id`);
    console.log(`   • GET  /api/services`);
    console.log(`   • POST /api/services`);
    console.log(`   • PUT  /api/services/:id`);
    console.log(`   • DELETE /api/services/:id`);
  });
}

startServer().catch(console.error);

export { prisma };
