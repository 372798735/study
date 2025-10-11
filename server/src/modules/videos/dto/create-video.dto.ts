import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateVideoDto {
  @ApiProperty({ description: "视频标题" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "视频描述", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "视频文件URL" })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({
    description: "视频分类",
    enum: [
      "三角函数",
      "数列",
      "圆锥曲线",
      "函数与导数",
      "空间向量与立体几何",
      "概率与统计",
    ],
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: "缩略图URL", required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ description: "文件大小（字节）", required: false })
  @IsOptional()
  fileSize?: number;
}
