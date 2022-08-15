import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Next,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user-dto';
import { NextFunction, Response } from 'express';
import { ValidateUserDto } from '../../../global/guards/auth/dto/validate-user.dto';
import { errorHandle } from '../../../global/helpers/errorHandle';

@Controller('user')
export class UserController {
  constructor(private readonly USER_SERVICE: UserService) {}

  @Post('signup')
  async signUp(
    @Body() user: CreateUserDto,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      if (user.name.match(/[^\w\s]/gi)) {
        throw new BadRequestException('Special characters not acceptable');
      }

      return response.json(
        await this.USER_SERVICE.create({
          ...user,
          name: user.name.trim(),
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  @Post('signin')
  async signIn(
    @Body() credentials: ValidateUserDto,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      return response.json(await this.USER_SERVICE.loginUser(credentials));
    } catch (err) {
      next(err);
    }
  }

  @Get('find/:slug')
  async find(
    @Param('slug') slug: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      return response.json(await this.USER_SERVICE.find(slug));
    } catch (err) {
      next(err);
    }
  }

  @Get('list/:username')
  async listNameOrSlug(
    @Param('username') username: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    return response.json(
      await this.USER_SERVICE.listByNameOrSlug(username.trim()),
    );
  }
}
