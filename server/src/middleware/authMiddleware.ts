import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { getSeason } from '../api/api.js';
import config from '../config/config.js';
import { prisma } from '../db/db.js';

export const getJWTSecret = () => {
  // add season so that users are authenticated every season
  return config.jwtSecret + getSeason();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (token) {
    const secret = getJWTSecret();
    jwt.verify(token, secret, (err: VerifyErrors | null, decodedToken: any) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (token) {
    const secret = getJWTSecret();
    jwt.verify(token, secret, async (err: VerifyErrors | null, decodedToken: any) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
