import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '../middleware/authMiddleware.js';

const handleErrors = (err: any) => {};

const createToken = (id: number) => {
  return jwt.sign({ id }, getJWTSecret());
};

export const signup_get = (req: Request, res: Response) => {};
