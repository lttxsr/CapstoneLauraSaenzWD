import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export class AuthService {
  async register(name: string | undefined, email: string, password: string) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new Error("EMAIL_TAKEN");
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("INVALID_CREDENTIALS");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("INVALID_CREDENTIALS");
    const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: "7d" });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
}
