import { Router, Response } from "express";
import { prisma } from "../server.js";
import jwt from "jsonwebtoken";

const router = Router();

// Middleware de autenticação
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de acesso requerido" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "secret",
    (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Token inválido" });
      req.userId = user.userId;
      next();
    }
  );
};

// GET - Listar cartões com filtro por mês
router.get("/", authenticateToken, async (req: any, res: Response) => {
  try {
    const { monthReference } = req.query;
    console.log(
      "Buscando cartões para usuário:",
      req.userId,
      "mês:",
      monthReference
    );

    const whereClause: any = { userId: req.userId };

    if (monthReference) {
      whereClause.monthReference = monthReference;
    }

    const creditCards = await prisma.creditCard.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    console.log("Cartões encontrados:", creditCards.length);
    res.json(creditCards);
  } catch (error) {
    console.error("Erro ao buscar cartões:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST - Criar cartão
router.post("/", authenticateToken, async (req: any, res: Response) => {
  try {
    console.log("Criando cartão para usuário:", req.userId);
    console.log("Dados do cartão:", req.body);

    const { name, limit, currentDebt, dueDate, monthReference } = req.body;

    // Validação básica
    if (!name || limit === undefined || currentDebt === undefined || !dueDate) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    // Se monthReference não for fornecido, gerar automaticamente
    const finalMonthReference =
      monthReference ||
      (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      })();

    const creditCard = await prisma.creditCard.create({
      data: {
        name,
        limit: parseFloat(limit),
        currentDebt: parseFloat(currentDebt),
        dueDate: parseInt(dueDate),
        monthReference: finalMonthReference,
        userId: req.userId,
      },
    });

    console.log("Cartão criado:", creditCard);
    res.status(201).json(creditCard);
  } catch (error) {
    console.error("Erro ao criar cartão:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT - Atualizar cartão
router.put("/:id", authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, limit, currentDebt, dueDate, monthReference } = req.body;

    console.log("Atualizando cartão:", id, "para usuário:", req.userId);

    const updateData: any = {
      name,
      limit: parseFloat(limit),
      currentDebt: parseFloat(currentDebt),
      dueDate: parseInt(dueDate),
    };

    if (monthReference !== undefined) {
      updateData.monthReference = monthReference;
    }

    const creditCard = await prisma.creditCard.update({
      where: {
        id,
        userId: req.userId,
      },
      data: updateData,
    });

    console.log("Cartão atualizado:", creditCard);
    res.json(creditCard);
  } catch (error) {
    console.error("Erro ao atualizar cartão:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE - Deletar cartão
router.delete("/:id", authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    console.log("Deletando cartão:", id, "para usuário:", req.userId);

    await prisma.creditCard.delete({
      where: {
        id,
        userId: req.userId,
      },
    });

    console.log("Cartão deletado:", id);
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar cartão:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
