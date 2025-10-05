import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { WechatLoginDto } from './dto/wechat-login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(admin: any) {
    const payload = { 
      sub: admin.id, 
      username: admin.username, 
      role: 'admin' 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: admin,
    };
  }

  async wechatLogin(wechatLoginDto: WechatLoginDto) {
    const { code } = wechatLoginDto;
    
    // 这里应该调用微信API获取openid
    // 为了演示，我们使用模拟的openid
    const openid = `mock_openid_${Date.now()}`;
    
    if (!openid) {
      throw new BadRequestException('微信登录失败');
    }

    // 查找或创建用户
    let user = await this.prisma.user.findUnique({
      where: { openid },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          openid,
          nickname: '微信用户',
          role: 'student',
        },
      });
    }

    const payload = { 
      sub: user.id, 
      openid: user.openid, 
      role: 'student' 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async refresh(user: any) {
    const payload = { 
      sub: user.sub, 
      openid: user.openid, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
