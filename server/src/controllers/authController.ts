import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '../middleware/authMiddleware.js';
import { User } from '../models/user.js';

const handleErrors = (err: any) => {};

const createToken = (id: number) => {
  return jwt.sign({ id }, getJWTSecret());
};

export const signup_post = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const user = await User.create(email, name, password);
};

export const login_post = (req: Request, res: Response) => {};
