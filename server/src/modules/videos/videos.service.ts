import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { UpdateProgressDto } from "./dto/update-progress.dto";

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number,
    limit: number,
    category?: string,
    keyword?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          fileUrl: true,
          category: true,
          thumbnailUrl: true,
          fileSize: true,
          createdAt: true,
        },
      }),
      this.prisma.video.count({ where }),
    ]);

    return {
      list: videos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException("视频不存在");
    }

    return video;
  }

  async create(createVideoDto: CreateVideoDto) {
    return this.prisma.video.create({
      data: createVideoDto,
    });
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException("视频不存在");
    }

    return this.prisma.video.update({
      where: { id },
      data: updateVideoDto,
    });
  }

  async remove(id: number) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException("视频不存在");
    }

    // 先删除相关的学习记录，避免外键约束错误
    await this.prisma.learningRecord.deleteMany({
      where: {
        contentId: id,
        contentType: "video",
      },
    });

    // 再删除视频
    return this.prisma.video.delete({
      where: { id },
    });
  }

  async updateProgress(
    id: number,
    updateProgressDto: UpdateProgressDto,
    userId: number
  ) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException("视频不存在");
    }

    const { progress, completed = false } = updateProgressDto;

    // 保存学习记录
    await this.prisma.learningRecord.upsert({
      where: {
        userId_contentId_contentType: {
          userId,
          contentId: id,
          contentType: "video",
        },
      },
      update: {
        progress,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        contentId: id,
        contentType: "video",
        progress,
        completedAt: completed ? new Date() : null,
      },
    });

    return {
      message: "进度更新成功",
      progress,
      completed,
    };
  }
}
