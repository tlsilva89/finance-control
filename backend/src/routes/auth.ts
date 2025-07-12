import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../server.js";

const router = Router();

// Função auxiliar para tratamento de erros
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

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

interface CheckUsernameRequest {
  username: string;
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
      console.log("📝 Dados recebidos para registro:", req.body);

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
        console.log("❌ Campos obrigatórios faltando");
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }

      console.log("🔍 Verificando se username já existe:", username);

      // Verificar se username já existe
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        console.log("❌ Username já existe:", username);
        return res
          .status(400)
          .json({ error: "Nome de usuário já está em uso" });
      }

      // Validar formato do username (apenas letras, números e underscore)
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        console.log("❌ Formato de username inválido:", username);
        return res.status(400).json({
          error:
            "Nome de usuário deve ter entre 3-20 caracteres e conter apenas letras, números e underscore",
        });
      }

      console.log("🔐 Criptografando senha e resposta de segurança");

      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedSecurityAnswer = await bcrypt.hash(
        securityAnswer.toLowerCase().trim(),
        10
      );

      console.log("💾 Criando usuário no banco de dados");

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

      console.log("✅ Usuário criado com sucesso:", user.id);

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
      console.error("💥 Erro detalhado no registro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  }
);

// Login
router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    try {
      console.log("🔑 Tentativa de login para:", req.body.username);

      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username e senha são obrigatórios" });
      }

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        console.log("❌ Usuário não encontrado:", username);
        return res.status(400).json({ error: "Credenciais inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.log("❌ Senha incorreta para:", username);
        return res.status(400).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );

      console.log("✅ Login realizado com sucesso:", user.username);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      console.error("💥 Erro no login:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  }
);

// Verificar disponibilidade de username
router.post(
  "/check-username",
  async (req: Request<{}, {}, CheckUsernameRequest>, res: Response) => {
    try {
      const { username } = req.body;

      console.log("🔍 Verificando disponibilidade do username:", username);

      // Validação básica
      if (!username) {
        return res.status(400).json({
          available: false,
          message: "Nome de usuário é obrigatório",
        });
      }

      // Validar formato do username
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return res.json({
          available: false,
          message:
            "Nome de usuário deve ter entre 3-20 caracteres e conter apenas letras, números e underscore",
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      const available = !existingUser;
      console.log(
        `${available ? "✅" : "❌"} Username ${username} ${available ? "disponível" : "já em uso"}`
      );

      res.json({
        available,
        message: available
          ? "Nome de usuário disponível"
          : "Nome de usuário já está em uso",
      });
    } catch (error) {
      console.error("💥 Erro ao verificar username:", error);
      res.status(500).json({
        available: false,
        message: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  }
);

// Verificar se usuário existe e retornar pergunta de segurança
router.post(
  "/forgot-password",
  async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => {
    try {
      const { username } = req.body;

      console.log("🔍 Verificando usuário para recuperação:", username);

      if (!username) {
        return res.status(400).json({ error: "Nome de usuário é obrigatório" });
      }

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
        console.log("❌ Usuário não encontrado para recuperação:", username);
        return res.json({
          message:
            "Se o usuário existir, você poderá prosseguir com a recuperação",
          hasUser: false,
        });
      }

      console.log("✅ Usuário encontrado para recuperação:", username);

      res.json({
        message: "Usuário encontrado",
        hasUser: true,
        securityQuestion: user.securityQuestion,
      });
    } catch (error) {
      console.error("💥 Erro ao verificar usuário:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  }
);

// Redefinir senha com data de nascimento e pergunta de segurança
router.post(
  "/reset-password",
  async (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => {
    try {
      const { username, birthDate, securityAnswer, newPassword } = req.body;

      console.log("🔄 Tentativa de redefinição de senha para:", username);

      if (!username || !birthDate || !securityAnswer || !newPassword) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        console.log("❌ Usuário não encontrado para reset:", username);
        return res.status(400).json({ error: "Dados inválidos" });
      }

      // Verificar data de nascimento
      const userBirthDate = new Date(user.birthDate)
        .toISOString()
        .split("T")[0];
      const providedBirthDate = new Date(birthDate).toISOString().split("T")[0];

      if (userBirthDate !== providedBirthDate) {
        console.log("❌ Data de nascimento incorreta para:", username);
        return res.status(400).json({ error: "Data de nascimento incorreta" });
      }

      // Verificar resposta de segurança
      const isValidAnswer = await bcrypt.compare(
        securityAnswer.toLowerCase().trim(),
        user.securityAnswer
      );

      if (!isValidAnswer) {
        console.log("❌ Resposta de segurança incorreta para:", username);
        return res
          .status(400)
          .json({ error: "Resposta de segurança incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log("✅ Senha redefinida com sucesso para:", username);

      res.json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      console.error("💥 Erro ao redefinir senha:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  }
);

// Alterar senha (usuário logado)
router.post(
  "/change-password",
  authenticateToken,
  async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).userId;

      console.log("🔄 Alteração de senha para usuário:", userId);

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Senha atual e nova senha são obrigatórias" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.log(
          "❌ Usuário não encontrado para alteração de senha:",
          userId
        );
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        console.log("❌ Senha atual incorreta para:", userId);
        return res.status(400).json({ error: "Senha atual incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      console.log("✅ Senha alterada com sucesso para:", userId);

      res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("💥 Erro ao alterar senha:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  }
);

// Atualizar pergunta de segurança (usuário logado)
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

      console.log("🔄 Atualizando pergunta de segurança para:", userId);

      if (!securityQuestion || !securityAnswer) {
        return res
          .status(400)
          .json({ error: "Pergunta e resposta de segurança são obrigatórias" });
      }

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

      console.log("✅ Pergunta de segurança atualizada para:", userId);

      res.json({ message: "Pergunta de segurança atualizada com sucesso" });
    } catch (error) {
      console.error("💥 Erro ao atualizar pergunta de segurança:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      });
    }
  }
);

export default router;
