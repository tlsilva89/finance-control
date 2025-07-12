import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import incomeRoutes from "./routes/income.js";
import creditCardRoutes from "./routes/creditCards.js";
import serviceRoutes from "./routes/services.js";
import subscriptionRoutes from "./routes/subscriptions.js";
// Configurar dotenv
dotenv.config();
const app = express();
const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});
// CORREÇÃO: Garantir que PORT seja sempre um número
const PORT = parseInt(process.env.PORT || "3001", 10);
// Test database connection
async function testDatabaseConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Conexão com banco de dados estabelecida");
    }
    catch (error) {
        console.error("❌ Erro ao conectar com banco de dados:", error);
        process.exit(1);
    }
}
// Configuração CORS corrigida para resolver problemas de Content-Type
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://finance-control.local:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
}));
// Middleware para parsing JSON
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
app.use("/api/services", serviceRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
// Rota de teste
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Servidor funcionando!",
        timestamp: new Date().toISOString(),
        database: "Connected",
        cors_origin: process.env.CORS_ORIGIN,
        port: PORT,
        node_env: process.env.NODE_ENV,
        routes: [
            "/api/auth",
            "/api/incomes",
            "/api/credit-cards",
            "/api/services",
            "/api/subscriptions",
        ],
    });
});
// Error handling middleware - CORREÇÃO: Parâmetro 'next' renomeado para '_next'
app.use((err, req, res, _next) => {
    console.error("💥 Erro no servidor:", err);
    res.status(500).json({
        error: "Erro interno do servidor",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
// 404 handler
app.use((req, res) => {
    console.log(`❌ Rota não encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ error: "Rota não encontrada" });
});
// Start server
async function startServer() {
    try {
        await testDatabaseConnection();
        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
            console.log(`🌐 Acessível em: http://192.168.3.7:${PORT}/api/health`);
            console.log(`🗄️  Database: ${process.env.DATABASE_URL}`);
            console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
            console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
            console.log(`📋 Rotas disponíveis:`);
            console.log(`   • POST /api/auth/login`);
            console.log(`   • POST /api/auth/register`);
            console.log(`   • POST /api/auth/check-username`);
            console.log(`   • POST /api/auth/forgot-password`);
            console.log(`   • POST /api/auth/reset-password`);
            console.log(`   • POST /api/auth/change-password`);
            console.log(`   • POST /api/auth/update-security-question`);
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
            console.log(`   • GET  /api/subscriptions`);
            console.log(`   • POST /api/subscriptions`);
            console.log(`   • PUT  /api/subscriptions/:id`);
            console.log(`   • DELETE /api/subscriptions/:id`);
        });
        // Graceful shutdown
        process.on("SIGTERM", () => {
            console.log("🛑 SIGTERM recebido, encerrando servidor...");
            server.close(() => {
                console.log("✅ Servidor encerrado graciosamente");
                process.exit(0);
            });
        });
        process.on("SIGINT", () => {
            console.log("🛑 SIGINT recebido, encerrando servidor...");
            server.close(() => {
                console.log("✅ Servidor encerrado graciosamente");
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error("💥 Erro ao iniciar servidor:", error);
        process.exit(1);
    }
}
// Iniciar servidor
startServer().catch((error) => {
    console.error("💥 Erro fatal ao iniciar aplicação:", error);
    process.exit(1);
});
export { prisma };
//# sourceMappingURL=server.js.map