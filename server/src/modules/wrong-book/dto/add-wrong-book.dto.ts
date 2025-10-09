import { IsInt, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AddWrongBookDto {
  @ApiProperty({ description: "题目ID" })
  @Type(() => Number)
  @IsInt()
  questionId: number;

  @ApiProperty({ description: "用户答案", required: false })
  @IsOptional()
  @IsString()
  userAnswer?: string;

  @ApiProperty({ description: "笔记", required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
