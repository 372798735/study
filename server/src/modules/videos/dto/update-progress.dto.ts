import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({ description: '观看进度（0-100）' })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({ description: '是否已完成', required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
