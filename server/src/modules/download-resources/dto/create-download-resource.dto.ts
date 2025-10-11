import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDownloadResourceDto {
  @ApiProperty({ description: "标题" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "描述", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "文件URL" })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: "文件类型", enum: ["word", "pdf"] })
  @IsString()
  @IsIn(["word", "pdf"])
  fileType: string;

  @ApiProperty({ description: "文件名" })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: "文件大小（字节）", required: false })
  @IsOptional()
  fileSize?: number;
}
