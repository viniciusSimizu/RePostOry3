import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Next,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { NextFunction, Response } from 'express';
import { ValidateUserDto } from '../../../global/guards/auth/dto/validate-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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
      return response
        .status(200)
        .json(await this.USER_SERVICE.loginUser(credentials));
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
      const user = await this.USER_SERVICE.find(slug);
      return response.json({ user });
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

  @Get('info')
  async getInfo(@Res() response: Response, @Next() next: NextFunction) {
    try {
      return response.json(
        await this.USER_SERVICE.getInfo(response.locals.user.userId),
      );
    } catch (err) {
      next(err);
    }
  }

  @Put('update')
  async updateUser(
    @Body() user: UpdateUserDto,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      if (!Object.keys(user).length) {
        throw new BadRequestException('Body is empty');
      }

      return response.json(
        await this.USER_SERVICE.update(user, response.locals.user.userId),
      );
    } catch (err) {
      next(err);
    }
  }

  @Delete('delete')
  async deleteUser(@Res() response: Response, @Next() next: NextFunction) {
    try {
      await this.USER_SERVICE.delete(response.locals.user.userId);
      return response.json();
    } catch (err) {
      next(err);
    }
  }

  @Get('verify-signature')
  async verifySignature(
    @Headers('Authorization') token: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      return response.json(
        await this.USER_SERVICE.verifySignature(token.split(' ')[1]),
      );
    } catch (err) {
      next(err);
    }
  }

  @Get('refresh-token')
  async refreshToken(
    @Headers('Authorization') refreshToken: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      return response.json(
        await this.USER_SERVICE.refreshTokenUser(refreshToken.split(' ')[1]),
      );
    } catch (err) {
      next(err);
    }
  }
}
