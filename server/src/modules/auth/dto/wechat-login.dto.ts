import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class WechatLoginDto {
  @ApiProperty({ description: '微信授权码', example: 'code_from_wechat' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
