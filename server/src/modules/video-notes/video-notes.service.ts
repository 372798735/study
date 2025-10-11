import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateVideoNoteDto } from "./dto/create-video-note.dto";
import { UpdateVideoNoteDto } from "./dto/update-video-note.dto";

@Injectable()
export class VideoNotesService {
  constructor(private prisma: PrismaService) {}

  async create(createVideoNoteDto: CreateVideoNoteDto) {
    return this.prisma.videoNote.create({
      data: {
        title: createVideoNoteDto.title,
        description: createVideoNoteDto.description,
        fileUrl: createVideoNoteDto.fileUrl,
        fileType: createVideoNoteDto.fileType,
        fileName: createVideoNoteDto.fileName,
        fileSize: createVideoNoteDto.fileSize
          ? BigInt(createVideoNoteDto.fileSize)
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
      this.prisma.videoNote.findMany({
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
      this.prisma.videoNote.count({ where }),
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
    const videoNote = await this.prisma.videoNote.findUnique({
      where: { id },
    });

    if (!videoNote) {
      throw new NotFoundException(`视频号笔记 #${id} 不存在`);
    }

    return {
      ...videoNote,
      fileSize: videoNote.fileSize ? Number(videoNote.fileSize) : null,
    };
  }

  async update(id: number, updateVideoNoteDto: UpdateVideoNoteDto) {
    await this.findOne(id);

    const data: any = {
      title: updateVideoNoteDto.title,
      description: updateVideoNoteDto.description,
      fileUrl: updateVideoNoteDto.fileUrl,
      fileType: updateVideoNoteDto.fileType,
      fileName: updateVideoNoteDto.fileName,
    };

    if (updateVideoNoteDto.fileSize !== undefined) {
      data.fileSize = updateVideoNoteDto.fileSize
        ? BigInt(updateVideoNoteDto.fileSize)
        : null;
    }

    const updated = await this.prisma.videoNote.update({
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
    return this.prisma.videoNote.delete({
      where: { id },
    });
  }
}
