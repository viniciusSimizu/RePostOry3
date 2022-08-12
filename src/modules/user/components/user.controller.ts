import { Body, Controller, Get, Next, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from '../DTOs/createUserDTO';
import { NextFunction, Response } from 'express';
import { IValidateUser } from '../../../global/guards/Auth/DTOs/IValidateUser';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(
    @Body() user: CreateUserDTO,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      return response.json(await this.userService.createUser(user));
    } catch (err) {
      next(err);
    }
  }

  @Post('signin')
  async signIn(
    @Body() credentials: IValidateUser,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      return response.json(await this.userService.loginUser(credentials));
    } catch (err) {
      next(err);
    }
  }
}
