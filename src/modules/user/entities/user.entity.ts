import { DefaultEntity } from '../../../global/DefaultEntity';
import { IsEmail, IsHash, IsString } from 'class-validator';

export class UserEntity extends DefaultEntity {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsHash('HS256')
  password: string;
}
