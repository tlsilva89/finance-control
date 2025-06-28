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

// GET - Listar entradas com filtro por mês
router.get("/", authenticateToken, async (req: any, res: Response) => {
  try {
    const { monthReference } = req.query;
    console.log(
      "Buscando entradas para usuário:",
      req.userId,
      "mês:",
      monthReference
    );

    const whereClause: any = { userId: req.userId };

    if (monthReference) {
      whereClause.monthReference = monthReference;
    }

    const incomes = await prisma.income.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    console.log("Entradas encontradas:", incomes.length);
    res.json(incomes);
  } catch (error) {
    console.error("Erro ao buscar entradas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST - Criar entrada
router.post("/", authenticateToken, async (req: any, res: Response) => {
  try {
    console.log("Criando entrada para usuário:", req.userId);
    console.log("Dados da entrada:", req.body);

    const { description, amount, date, monthReference } = req.body;

    // Validação básica
    if (!description || amount === undefined || !date) {
      return res
        .status(400)
        .json({ error: "Descrição, valor e data são obrigatórios" });
    }

    // Se monthReference não for fornecido, gerar automaticamente baseado na data
    const finalMonthReference =
      monthReference ||
      (() => {
        const entryDate = new Date(date);
        return `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, "0")}`;
      })();

    const income = await prisma.income.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        monthReference: finalMonthReference,
        userId: req.userId,
      },
    });

    console.log("Entrada criada:", income);
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
    const { description, amount, date, monthReference } = req.body;

    console.log("Atualizando entrada:", id, "para usuário:", req.userId);

    // Preparar dados para atualização
    const updateData: any = {
      description,
      amount: parseFloat(amount),
      date: new Date(date),
    };

    // Se monthReference for fornecido, incluir na atualização
    // Caso contrário, gerar automaticamente baseado na nova data
    if (monthReference !== undefined) {
      updateData.monthReference = monthReference;
    } else {
      const entryDate = new Date(date);
      updateData.monthReference = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, "0")}`;
    }

    const income = await prisma.income.update({
      where: {
        id,
        userId: req.userId,
      },
      data: updateData,
    });

    console.log("Entrada atualizada:", income);
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

    console.log("Deletando entrada:", id, "para usuário:", req.userId);

    await prisma.income.delete({
      where: {
        id,
        userId: req.userId,
      },
    });

    console.log("Entrada deletada:", id);
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar entrada:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
