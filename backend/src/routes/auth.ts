import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../server.js";

const router = Router();

interface RegisterRequest {
  username: string;
  name: string;
  birthDate: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface ForgotPasswordRequest {
  username: string;
}

interface ResetPasswordRequest {
  username: string;
  birthDate: string;
  securityAnswer: string;
  newPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UpdateSecurityQuestionRequest {
  securityQuestion: string;
  securityAnswer: string;
}

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

// Registro
router.post(
  "/register",
  async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    try {
      const {
        username,
        name,
        birthDate,
        password,
        securityQuestion,
        securityAnswer,
      } = req.body;

      // Validação de campos obrigatórios
      if (
        !username ||
        !name ||
        !birthDate ||
        !password ||
        !securityQuestion ||
        !securityAnswer
      ) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }

      // Verificar se username já existe
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Nome de usuário já está em uso" });
      }

      // Validar formato do username (apenas letras, números e underscore)
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({
          error:
            "Nome de usuário deve ter entre 3-20 caracteres e conter apenas letras, números e underscore",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedSecurityAnswer = await bcrypt.hash(
        securityAnswer.toLowerCase().trim(),
        10
      );

      const user = await prisma.user.create({
        data: {
          username,
          name,
          birthDate: new Date(birthDate),
          password: hashedPassword,
          securityQuestion,
          securityAnswer: hashedSecurityAnswer,
        },
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );

      res.json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// Login
router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ error: "Credenciais inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );

      res.json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// Verificar se usuário existe e retornar pergunta de segurança
router.post(
  "/forgot-password",
  async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => {
    try {
      const { username } = req.body;

      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          securityQuestion: true,
        },
      });

      // Sempre retorna sucesso para não vazar informações sobre usuários existentes
      if (!user) {
        return res.json({
          message:
            "Se o usuário existir, você poderá prosseguir com a recuperação",
          hasUser: false,
        });
      }

      res.json({
        message: "Usuário encontrado",
        hasUser: true,
        securityQuestion: user.securityQuestion,
      });
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// Redefinir senha com data de nascimento e pergunta de segurança
router.post(
  "/reset-password",
  async (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => {
    try {
      const { username, birthDate, securityAnswer, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      // Verificar data de nascimento
      const userBirthDate = new Date(user.birthDate)
        .toISOString()
        .split("T")[0];
      const providedBirthDate = new Date(birthDate).toISOString().split("T")[0];

      if (userBirthDate !== providedBirthDate) {
        return res.status(400).json({ error: "Data de nascimento incorreta" });
      }

      // Verificar resposta de segurança
      const isValidAnswer = await bcrypt.compare(
        securityAnswer.toLowerCase().trim(),
        user.securityAnswer
      );

      if (!isValidAnswer) {
        return res
          .status(400)
          .json({ error: "Resposta de segurança incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      res.json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// Alterar senha (usuário logado) - CORRIGIDO PARA USAR A INTERFACE
router.post(
  "/change-password",
  authenticateToken,
  async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        return res.status(400).json({ error: "Senha atual incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// Verificar disponibilidade de username
router.post("/check-username", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    res.json({
      available: !existingUser,
      message: existingUser
        ? "Nome de usuário já está em uso"
        : "Nome de usuário disponível",
    });
  } catch (error) {
    console.error("Erro ao verificar username:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Atualizar pergunta de segurança (usuário logado) - CORRIGIDO PARA USAR A INTERFACE
router.post(
  "/update-security-question",
  authenticateToken,
  async (
    req: Request<{}, {}, UpdateSecurityQuestionRequest>,
    res: Response
  ) => {
    try {
      const { securityQuestion, securityAnswer } = req.body;
      const userId = (req as any).userId;

      const hashedSecurityAnswer = await bcrypt.hash(
        securityAnswer.toLowerCase().trim(),
        10
      );

      await prisma.user.update({
        where: { id: userId },
        data: {
          securityQuestion,
          securityAnswer: hashedSecurityAnswer,
        },
      });

      res.json({ message: "Pergunta de segurança atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar pergunta de segurança:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

export default router;
