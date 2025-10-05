import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('数据统计')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取仪表板数据' })
  @ApiResponse({ status: 200, description: '仪表板数据' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getDashboard() {
    return this.statisticsService.getDashboard();
  }

  @Get('questions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取题目统计' })
  @ApiResponse({ status: 200, description: '题目统计' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getQuestionStats() {
    return this.statisticsService.getQuestionStats();
  }

  @Get('videos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取视频统计' })
  @ApiResponse({ status: 200, description: '视频统计' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getVideoStats() {
    return this.statisticsService.getVideoStats();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户统计' })
  @ApiResponse({ status: 200, description: '用户统计' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getUserStats() {
    return this.statisticsService.getUserStats();
  }
}
