import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";

export const authResolvers = {
  async register(
    _: unknown,
    args: { email: string; password: string; name: string; role?: string }
  ) {
    const existing = await prisma.user.findUnique({ where: { email: args.email } });
    if (existing) throw new Error("User with this email already exists");
    const passwordHash = await bcrypt.hash(args.password, 12);
    const user = await prisma.user.create({
      data: {
        email: args.email,
        passwordHash,
        name: args.name,
        role: args.role ?? "buyer",
      },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
    return { token, refreshToken, user };
  },

  async login(_: unknown, args: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: args.email } });
    if (!user || !user.passwordHash) throw new Error("Invalid email or password");
    const valid = await bcrypt.compare(args.password, user.passwordHash);
    if (!valid) throw new Error("Invalid email or password");
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
    return { token, refreshToken, user };
  },
};
