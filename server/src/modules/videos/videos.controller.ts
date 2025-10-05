import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('视频管理')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({ summary: '获取视频列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量' })
  @ApiQuery({ name: 'category', required: false, description: '分类' })
  @ApiQuery({ name: 'keyword', required: false, description: '关键词' })
  @ApiResponse({ status: 200, description: '视频列表' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.videosService.findAll(page, limit, category, keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取视频详情' })
  @ApiResponse({ status: 200, description: '视频详情' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建视频' })
  @ApiResponse({ status: 201, description: '视频创建成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新视频' })
  @ApiResponse({ status: 200, description: '视频更新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除视频' })
  @ApiResponse({ status: 200, description: '视频删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }

  @Post(':id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新观看进度' })
  @ApiResponse({ status: 200, description: '进度更新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async updateProgress(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
    @Request() req,
  ) {
    return this.videosService.updateProgress(+id, updateProgressDto, req.user.sub);
  }
}
