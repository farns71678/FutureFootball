import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserDB from '../db/user.js';
import { getJWTSecret } from '../middleware/authMiddleware.js';

const handleErrors = (err: any) => {
  console.log(err.message, err.code);
  const errors = { email: '', name: '', password: '' };
};

const createToken = (id: number) => {
  return jwt.sign({ id }, getJWTSecret());
};

export const signup_post = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const user = await UserDB.create(email, name, password);
  const token = createToken(user.id);

  res.status(201).json({ message: 'Created', user, token });
};

export const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserDB.login(email, password);
    const token = createToken(user.id);

    res.status(200).json({ message: 'Logged in', user, token });
  } catch (err: any) {
    res.status(400).json({ message: err.message || 'Unable to login' });
  }
};
