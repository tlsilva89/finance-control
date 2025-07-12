import { Router } from "express";
import { prisma } from "../server.js";
import jwt from "jsonwebtoken";
const router = Router();
// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token de acesso requerido" });
    }
    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
        if (err)
            return res.status(403).json({ error: "Token inválido" });
        req.userId = user.userId;
        next();
    });
};
// GET - Listar serviços com filtro por mês
router.get("/", authenticateToken, async (req, res) => {
    try {
        const { monthReference } = req.query;
        console.log("Buscando serviços para usuário:", req.userId, "mês:", monthReference);
        const whereClause = { userId: req.userId };
        if (monthReference) {
            whereClause.monthReference = monthReference;
        }
        const services = await prisma.service.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });
        console.log("Serviços encontrados:", services.length);
        res.json(services);
    }
    catch (error) {
        console.error("Erro ao buscar serviços:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// POST - Criar serviço
router.post("/", authenticateToken, async (req, res) => {
    try {
        console.log("Criando serviço para usuário:", req.userId);
        console.log("Dados do serviço:", req.body);
        const { name, amount, dueDate, category, monthReference } = req.body;
        // Validação básica
        if (!name || amount === undefined || !dueDate || !category) {
            return res
                .status(400)
                .json({ error: "Todos os campos são obrigatórios" });
        }
        // Se monthReference não for fornecido, gerar automaticamente
        const finalMonthReference = monthReference ||
            (() => {
                const now = new Date();
                return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
            })();
        const service = await prisma.service.create({
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: parseInt(dueDate),
                category,
                monthReference: finalMonthReference,
                userId: req.userId,
            },
        });
        console.log("Serviço criado:", service);
        res.status(201).json(service);
    }
    catch (error) {
        console.error("Erro ao criar serviço:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// PUT - Atualizar serviço
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, dueDate, category, monthReference } = req.body;
        console.log("Atualizando serviço:", id, "para usuário:", req.userId);
        const updateData = {
            name,
            amount: parseFloat(amount),
            dueDate: parseInt(dueDate),
            category,
        };
        if (monthReference !== undefined) {
            updateData.monthReference = monthReference;
        }
        const service = await prisma.service.update({
            where: {
                id,
                userId: req.userId,
            },
            data: updateData,
        });
        console.log("Serviço atualizado:", service);
        res.json(service);
    }
    catch (error) {
        console.error("Erro ao atualizar serviço:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// DELETE - Deletar serviço
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deletando serviço:", id, "para usuário:", req.userId);
        await prisma.service.delete({
            where: {
                id,
                userId: req.userId,
            },
        });
        console.log("Serviço deletado:", id);
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar serviço:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
export default router;
//# sourceMappingURL=services.js.map