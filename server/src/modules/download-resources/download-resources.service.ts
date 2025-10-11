import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDownloadResourceDto } from "./dto/create-download-resource.dto";
import { UpdateDownloadResourceDto } from "./dto/update-download-resource.dto";

@Injectable()
export class DownloadResourcesService {
  constructor(private prisma: PrismaService) {}

  async create(createDownloadResourceDto: CreateDownloadResourceDto) {
    return this.prisma.downloadResource.create({
      data: {
        title: createDownloadResourceDto.title,
        description: createDownloadResourceDto.description,
        fileUrl: createDownloadResourceDto.fileUrl,
        fileType: createDownloadResourceDto.fileType,
        fileName: createDownloadResourceDto.fileName,
        fileSize: createDownloadResourceDto.fileSize
          ? BigInt(createDownloadResourceDto.fileSize)
          : null,
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; keyword?: string }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where = params?.keyword
      ? {
          OR: [
            { title: { contains: params.keyword } },
            { description: { contains: params.keyword } },
            { fileName: { contains: params.keyword } },
          ],
        }
      : {};

    const [list, total] = await Promise.all([
      this.prisma.downloadResource.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          fileUrl: true,
          fileType: true,
          fileName: true,
          fileSize: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.downloadResource.count({ where }),
    ]);

    // 转换 BigInt 为 number
    const formattedList = list.map((item) => ({
      ...item,
      fileSize: item.fileSize ? Number(item.fileSize) : null,
    }));

    return {
      list: formattedList,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const resource = await this.prisma.downloadResource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`下载资源 #${id} 不存在`);
    }

    return {
      ...resource,
      fileSize: resource.fileSize ? Number(resource.fileSize) : null,
    };
  }

  async update(
    id: number,
    updateDownloadResourceDto: UpdateDownloadResourceDto
  ) {
    await this.findOne(id);

    const data: any = {
      title: updateDownloadResourceDto.title,
      description: updateDownloadResourceDto.description,
      fileUrl: updateDownloadResourceDto.fileUrl,
      fileType: updateDownloadResourceDto.fileType,
      fileName: updateDownloadResourceDto.fileName,
    };

    if (updateDownloadResourceDto.fileSize !== undefined) {
      data.fileSize = updateDownloadResourceDto.fileSize
        ? BigInt(updateDownloadResourceDto.fileSize)
        : null;
    }

    const updated = await this.prisma.downloadResource.update({
      where: { id },
      data,
    });

    return {
      ...updated,
      fileSize: updated.fileSize ? Number(updated.fileSize) : null,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.downloadResource.delete({
      where: { id },
    });
  }
}
