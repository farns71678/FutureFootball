import bcrypt from 'bcrypt';
import { prisma } from '../db/db.js';

const create = async (email: string, name: string, password: string) => {
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);
  return await prisma.user.create({ data: { email, name, password } });
};

export const User = { create };
