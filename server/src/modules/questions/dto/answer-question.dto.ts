import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AnswerQuestionDto {
  @ApiProperty({ description: '用户答案' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
