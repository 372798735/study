import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalQuestions,
      totalVideos,
      totalRecords,
      recentUsers,
      recentQuestions,
      recentVideos,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.question.count(),
      this.prisma.video.count(),
      this.prisma.learningRecord.count(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 最近7天
          },
        },
      }),
      this.prisma.question.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 最近7天
          },
        },
      }),
      this.prisma.video.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 最近7天
          },
        },
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalQuestions,
        totalVideos,
        totalRecords,
      },
      recent: {
        users: recentUsers,
        questions: recentQuestions,
        videos: recentVideos,
      },
    };
  }

  async getQuestionStats() {
    const [
      totalQuestions,
      questionsByType,
      questionsByCategory,
      questionsByDifficulty,
    ] = await Promise.all([
      this.prisma.question.count(),
      this.prisma.question.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.question.groupBy({
        by: ['category'],
        _count: true,
      }),
      this.prisma.question.groupBy({
        by: ['difficulty'],
        _count: true,
      }),
    ]);

    return {
      total: totalQuestions,
      byType: questionsByType.map(item => ({
        type: item.type,
        count: item._count,
      })),
      byCategory: questionsByCategory.map(item => ({
        category: item.category,
        count: item._count,
      })),
      byDifficulty: questionsByDifficulty.map(item => ({
        difficulty: item.difficulty,
        count: item._count,
      })),
    };
  }

  async getVideoStats() {
    const [
      totalVideos,
      videosByCategory,
      totalDuration,
      totalSize,
    ] = await Promise.all([
      this.prisma.video.count(),
      this.prisma.video.groupBy({
        by: ['category'],
        _count: true,
      }),
      this.prisma.video.aggregate({
        _sum: {
          duration: true,
        },
      }),
      this.prisma.video.aggregate({
        _sum: {
          fileSize: true,
        },
      }),
    ]);

    return {
      total: totalVideos,
      byCategory: videosByCategory.map(item => ({
        category: item.category,
        count: item._count,
      })),
      totalDuration: totalDuration._sum.duration || 0,
      totalSize: totalSize._sum.fileSize || 0,
    };
  }

  async getUserStats() {
    const [
      totalUsers,
      activeUsers,
      userRecords,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.learningRecord.groupBy({
        by: ['userId'],
        _count: true,
      }),
      this.prisma.learningRecord.groupBy({
        by: ['userId', 'contentType'],
        _count: true,
      }),
    ]);

    const activeUserCount = activeUsers.length;
    const averageRecordsPerUser = activeUserCount > 0 
      ? Math.round(activeUsers.reduce((sum, user) => sum + user._count, 0) / activeUserCount)
      : 0;

    return {
      total: totalUsers,
      active: activeUserCount,
      averageRecords: averageRecordsPerUser,
    };
  }
}
