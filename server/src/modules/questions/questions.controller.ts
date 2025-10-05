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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('题目管理')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: '获取题目列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量' })
  @ApiQuery({ name: 'category', required: false, description: '分类' })
  @ApiQuery({ name: 'keyword', required: false, description: '关键词' })
  @ApiResponse({ status: 200, description: '题目列表' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.questionsService.findAll(page, limit, category, keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取题目详情' })
  @ApiResponse({ status: 200, description: '题目详情' })
  @ApiResponse({ status: 404, description: '题目不存在' })
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建题目' })
  @ApiResponse({ status: 201, description: '题目创建成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新题目' })
  @ApiResponse({ status: 200, description: '题目更新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '题目不存在' })
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除题目' })
  @ApiResponse({ status: 200, description: '题目删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '题目不存在' })
  async remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }

  @Post(':id/answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '提交答案' })
  @ApiResponse({ status: 200, description: '答案提交成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '题目不存在' })
  async answer(
    @Param('id') id: string,
    @Body() answerQuestionDto: AnswerQuestionDto,
    @Request() req,
  ) {
    return this.questionsService.answer(+id, answerQuestionDto, req.user.sub);
  }
}
