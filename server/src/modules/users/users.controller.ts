import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 200, description: '用户信息' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Get('records')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取学习记录' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量' })
  @ApiQuery({ name: 'contentType', required: false, description: '内容类型' })
  @ApiResponse({ status: 200, description: '学习记录' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getRecords(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('contentType') contentType?: string,
  ) {
    return this.usersService.getRecords(req.user.sub, page, limit, contentType);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取学习统计' })
  @ApiResponse({ status: 200, description: '学习统计' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getStatistics(@Request() req) {
    return this.usersService.getStatistics(req.user.sub);
  }
}
