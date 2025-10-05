import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ description: '视频标题' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '视频描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '视频文件URL' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: '视频时长（秒）', required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: '视频分类' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: '缩略图URL', required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ description: '文件大小（字节）', required: false })
  @IsOptional()
  fileSize?: number;
}
