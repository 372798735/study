import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 注册用户
  async register(registerDto: RegisterUserDto) {
    const { phone, password, nickname } = registerDto;

    // 检查手机号是否已存在
    const existUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existUser) {
      throw new ConflictException("该手机号已被注册");
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        nickname,
      },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  // 用户登录
  async login(loginDto: LoginUserDto) {
    const { phone, password } = loginDto;

    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException("手机号或密码错误");
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("手机号或密码错误");
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 获取用户列表
  async findAll(params?: { page?: number; limit?: number; keyword?: string }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;
    const keyword = params?.keyword || "";

    const where = keyword
      ? {
          OR: [
            { phone: { contains: keyword } },
            { nickname: { contains: keyword } },
          ],
        }
      : {};

    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          phone: true,
          nickname: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      limit,
    };
  }

  // 删除用户
  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: "删除成功" };
  }

  // 更新用户信息
  async update(id: number, updateDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateDto,
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  // 根据ID获取用户详情
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    return user;
  }
}
