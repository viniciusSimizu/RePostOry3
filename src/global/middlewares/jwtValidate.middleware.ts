import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, response, Response } from 'express';
import { errorHandle } from '../helpers/errorHandle';

@Injectable()
export class JwtValidateMiddleware implements NestMiddleware {
  constructor(private readonly JWT_SERVICE: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.get('authorization').split(' ')[1];
      res.locals.user = await this.JWT_SERVICE.verify(token);
      next();
    } catch (err) {
      throw new UnauthorizedException(errorHandle(err, 'JWT Invalid'));
    }
  }
}
