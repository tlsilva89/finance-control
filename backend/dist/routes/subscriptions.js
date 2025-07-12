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
// GET - Listar assinaturas com filtro por mês
router.get("/", authenticateToken, async (req, res) => {
    try {
        const { monthReference } = req.query;
        console.log("Buscando assinaturas para usuário:", req.userId, "mês:", monthReference);
        const whereClause = { userId: req.userId };
        if (monthReference) {
            whereClause.monthReference = monthReference;
        }
        const subscriptions = await prisma.subscription.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });
        console.log("Assinaturas encontradas:", subscriptions.length);
        res.json(subscriptions);
    }
    catch (error) {
        console.error("Erro ao buscar assinaturas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// POST - Criar assinatura
router.post("/", authenticateToken, async (req, res) => {
    try {
        console.log("Criando assinatura para usuário:", req.userId);
        console.log("Dados da assinatura:", req.body);
        const { name, amount, renewalDate, category, monthReference } = req.body;
        // Validação básica
        if (!name || amount === undefined || !renewalDate || !category) {
            return res
                .status(400)
                .json({ error: "Todos os campos são obrigatórios" });
        }
        // Se monthReference não for fornecido, gerar automaticamente
        const finalMonthReference = monthReference ||
            (() => {
                const renewalDateObj = new Date(renewalDate);
                return `${renewalDateObj.getFullYear()}-${String(renewalDateObj.getMonth() + 1).padStart(2, "0")}`;
            })();
        const subscription = await prisma.subscription.create({
            data: {
                name,
                amount: parseFloat(amount),
                renewalDate: new Date(renewalDate),
                category,
                monthReference: finalMonthReference,
                userId: req.userId,
            },
        });
        console.log("Assinatura criada:", subscription);
        res.status(201).json(subscription);
    }
    catch (error) {
        console.error("Erro ao criar assinatura:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// PUT - Atualizar assinatura
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, renewalDate, category, monthReference } = req.body;
        console.log("Atualizando assinatura:", id, "para usuário:", req.userId);
        const updateData = {
            name,
            amount: parseFloat(amount),
            renewalDate: new Date(renewalDate),
            category,
        };
        if (monthReference !== undefined) {
            updateData.monthReference = monthReference;
        }
        const subscription = await prisma.subscription.update({
            where: {
                id,
                userId: req.userId,
            },
            data: updateData,
        });
        console.log("Assinatura atualizada:", subscription);
        res.json(subscription);
    }
    catch (error) {
        console.error("Erro ao atualizar assinatura:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// DELETE - Deletar assinatura
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deletando assinatura:", id, "para usuário:", req.userId);
        await prisma.subscription.delete({
            where: {
                id,
                userId: req.userId,
            },
        });
        console.log("Assinatura deletada:", id);
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar assinatura:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
export default router;
//# sourceMappingURL=subscriptions.js.map