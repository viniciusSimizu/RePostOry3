import { IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateRepositoryDto {
  @IsNumber()
  githubApiId: number;

  @IsString()
  repoName: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  githubId: string;
}
