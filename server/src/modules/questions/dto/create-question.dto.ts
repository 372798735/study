import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: '题目标题' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '题目内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '题目类型', enum: ['single', 'multiple', 'fill', 'essay'] })
  @IsEnum(['single', 'multiple', 'fill', 'essay'])
  type: string;

  @ApiProperty({ description: '选择题选项', required: false })
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiProperty({ description: '正确答案' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ description: '题目解析', required: false })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ description: '题目分类' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: '难度级别', enum: ['easy', 'medium', 'hard'] })
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: string;

  @ApiProperty({ description: '题目图片URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: '讲解视频URL', required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ description: '视频时长（秒）', required: false })
  @IsOptional()
  videoDuration?: number;
}
