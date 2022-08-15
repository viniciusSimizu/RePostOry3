import { IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateRepositoryDto {
  @IsNumber()
  githubApiId: number;

  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  githubId: string;
}
