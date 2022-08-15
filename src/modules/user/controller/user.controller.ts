import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { NextFunction, Request, Response } from 'express';
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

  @Patch('update')
  async updateUser(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      if (!Object.keys(request.body).length) {
        throw new BadRequestException('Body is empty');
      }

      return response.json(
        await this.USER_SERVICE.update(
          request.body,
          response.locals.user.userId,
        ),
      );
    } catch (err) {
      next(err);
    }
  }

  @Delete('delete')
  async deleteUser(@Res() response: Response, @Next() next: NextFunction) {
    try {
      return response.json(
        await this.USER_SERVICE.delete(response.locals.user.userId),
      );
    } catch (err) {
      next(err);
    }
  }

  @Patch('restore')
  async restoreUser(@Res() response: Response, @Next() next: NextFunction) {
    try {
      return response.json(
        await this.USER_SERVICE.restore(response.locals.user.userId),
      );
    } catch (err) {
      next(err);
    }
  }
}
