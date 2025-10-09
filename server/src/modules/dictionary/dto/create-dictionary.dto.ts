import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
} from "class-validator";

export class CreateDictionaryDto {
  @ApiProperty({ description: "字典类型" })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: "显示名称" })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: "字典值" })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: "排序", required: false, default: 0 })
  @IsOptional()
  @IsInt()
  sort?: number;

  @ApiProperty({
    description: "状态",
    enum: ["active", "inactive"],
    default: "active",
  })
  @IsOptional()
  @IsEnum(["active", "inactive"])
  status?: string;

  @ApiProperty({ description: "备注", required: false })
  @IsOptional()
  @IsString()
  remark?: string;
}
