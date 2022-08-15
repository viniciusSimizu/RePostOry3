import { Injectable } from '@nestjs/common';
import { CreateRepositoryDto } from '../dto/create-repository.dto';
import { UpdateRepositoryDto } from '../dto/update-repository.dto';
import { PrismaService } from '../../../global/database/prisma.service';

@Injectable()
export class RepositoryService {
  constructor(private PRISMA: PrismaService) {}

  async create(createRepositoryDto: CreateRepositoryDto) {
    return await this.PRISMA.repository.create({
      data: {
        githubId: createRepositoryDto.githubId,
        githubApiId: createRepositoryDto.githubApiId,
        url: createRepositoryDto.url,
        description: createRepositoryDto.description,
        name: createRepositoryDto.name,
      },
      select: { name: true, description: true, url: true },
    });
  }

  async findAll() {
    const repositories = await this.PRISMA.repository.findMany({
      where: {
        deleted: false,
        githubAccount: { deleted: false, user: { deleted: false } },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,

        githubAccount: {
          select: {
            username: true,
            avatarUrl: true,

            user: { select: { name: true } },
          },
        },
      },
    });
    return repositories.map((repository) => ({
      ...repository,
      githubAccount: {
        ...repository.githubAccount,
        name: repository.githubAccount.user.name,
        user: undefined,
      },
    }));
  }

  async delete(repositoryId: string) {
    return await this.PRISMA.repository.delete({
      where: { id: repositoryId },
      select: { name: true, deleted: true },
    });
  }
}
