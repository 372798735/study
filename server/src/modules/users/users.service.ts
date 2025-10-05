import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        openid: true,
        nickname: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async getRecords(userId: number, page: number, limit: number, contentType?: string) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (contentType) {
      where.contentType = contentType;
    }

    const [records, total] = await Promise.all([
      this.prisma.learningRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          question: {
            select: {
              id: true,
              title: true,
              type: true,
              category: true,
            },
          },
          video: {
            select: {
              id: true,
              title: true,
              category: true,
              duration: true,
            },
          },
        },
      }),
      this.prisma.learningRecord.count({ where }),
    ]);

    // 格式化记录数据
    const formattedRecords = records.map(record => ({
      id: record.id,
      contentType: record.contentType,
      contentId: record.contentId,
      contentTitle: record.contentType === 'question' 
        ? record.question?.title 
        : record.video?.title,
      progress: record.progress,
      score: record.score,
      completedAt: record.completedAt,
      createdAt: record.createdAt,
    }));

    return {
      list: formattedRecords,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStatistics(userId: number) {
    const [
      totalQuestions,
      totalVideos,
      completedQuestions,
      completedVideos,
      questionRecords,
      videoRecords,
    ] = await Promise.all([
      this.prisma.question.count(),
      this.prisma.video.count(),
      this.prisma.learningRecord.count({
        where: {
          userId,
          contentType: 'question',
          completedAt: { not: null },
        },
      }),
      this.prisma.learningRecord.count({
        where: {
          userId,
          contentType: 'video',
          completedAt: { not: null },
        },
      }),
      this.prisma.learningRecord.findMany({
        where: {
          userId,
          contentType: 'question',
        },
        select: {
          score: true,
        },
      }),
      this.prisma.learningRecord.findMany({
        where: {
          userId,
          contentType: 'video',
        },
        select: {
          progress: true,
        },
      }),
    ]);

    // 计算正确率
    const totalQuestionAttempts = questionRecords.length;
    const correctAnswers = questionRecords.filter(record => record.score === 100).length;
    const accuracy = totalQuestionAttempts > 0 ? Math.round((correctAnswers / totalQuestionAttempts) * 100) : 0;

    // 计算学习时长（分钟）
    const totalVideoProgress = videoRecords.reduce((sum, record) => sum + record.progress, 0);
    const averageVideoDuration = 10; // 假设平均视频时长10分钟
    const studyTime = Math.round((totalVideoProgress / 100) * averageVideoDuration);

    return {
      totalQuestions,
      totalVideos,
      completedQuestions,
      completedVideos,
      accuracy,
      studyTime,
    };
  }
}
