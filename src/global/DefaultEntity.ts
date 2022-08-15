import { IsBoolean, IsDate, IsUUID } from 'class-validator';

export class DefaultEntity {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsBoolean()
  deleted: boolean;
}
