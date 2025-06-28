import { Router, Response } from "express"; // Remover Request não usado
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

// GET - Listar entradas
router.get("/", authenticateToken, async (req: any, res: Response) => {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(incomes);
  } catch (error) {
    console.error("Erro ao buscar entradas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST - Criar entrada
router.post("/", authenticateToken, async (req: any, res: Response) => {
  try {
    const { description, amount, date } = req.body;

    const income = await prisma.income.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        userId: req.userId,
      },
    });

    res.status(201).json(income);
  } catch (error) {
    console.error("Erro ao criar entrada:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT - Atualizar entrada
router.put("/:id", authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { description, amount, date } = req.body;

    const income = await prisma.income.update({
      where: {
        id,
        userId: req.userId,
      },
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
      },
    });

    res.json(income);
  } catch (error) {
    console.error("Erro ao atualizar entrada:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE - Deletar entrada
router.delete("/:id", authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.income.delete({
      where: {
        id,
        userId: req.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar entrada:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
