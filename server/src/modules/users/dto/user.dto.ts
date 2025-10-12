import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
  @ApiProperty({ description: "手机号" })
  @IsString()
  @IsNotEmpty({ message: "手机号不能为空" })
  @Matches(/^1[3-9]\d{9}$/, { message: "手机号格式不正确" })
  phone: string;

  @ApiProperty({ description: "密码" })
  @IsString()
  @IsNotEmpty({ message: "密码不能为空" })
  @MinLength(6, { message: "密码至少6位" })
  password: string;

  @ApiProperty({ description: "昵称" })
  @IsString()
  @IsNotEmpty({ message: "昵称不能为空" })
  @MaxLength(7, { message: "昵称最多7个字" })
  nickname: string;
}

export class LoginUserDto {
  @ApiProperty({ description: "手机号" })
  @IsString()
  @IsNotEmpty({ message: "手机号不能为空" })
  phone: string;

  @ApiProperty({ description: "密码" })
  @IsString()
  @IsNotEmpty({ message: "密码不能为空" })
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: "昵称", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7, { message: "昵称最多7个字" })
  nickname?: string;

  @ApiProperty({ description: "头像", required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
