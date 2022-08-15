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
    return await this.PRISMA.repository.findMany({
      where: { deleted: { equals: false } },
      orderBy: { createdAt: 'desc' },
      select: {
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
  }

  findOne(id: number) {
    return `This action returns a #${id} repository`;
  }

  update(id: number, updateRepositoryDto: UpdateRepositoryDto) {
    return `This action updates a #${id} repository`;
  }

  remove(id: number) {
    return `This action removes a #${id} repository`;
  }
}
