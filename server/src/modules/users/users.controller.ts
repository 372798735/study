import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RegisterUserDto, LoginUserDto } from "./dto/user.dto";

@ApiTags("用户管理")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post("register")
  @ApiOperation({ summary: "用户注册" })
  @ApiResponse({ status: 201, description: "注册成功" })
  @ApiResponse({ status: 409, description: "手机号已被注册" })
  async register(@Body() registerDto: RegisterUserDto) {
    const user = await this.usersService.register(registerDto);
    const token = this.authService.generateToken({
      sub: user.id,
      phone: user.phone,
    });
    return {
      token,
      user,
    };
  }

  @Post("login")
  @ApiOperation({ summary: "用户登录" })
  @ApiResponse({ status: 201, description: "登录成功" })
  @ApiResponse({ status: 401, description: "手机号或密码错误" })
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.usersService.login(loginDto);
    const token = this.authService.generateToken({
      sub: user.id,
      phone: user.phone,
    });
    return {
      token,
      user,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取用户列表" })
  @ApiQuery({ name: "page", required: false, description: "页码" })
  @ApiQuery({ name: "limit", required: false, description: "每页数量" })
  @ApiQuery({ name: "keyword", required: false, description: "搜索关键词" })
  @ApiResponse({ status: 200, description: "获取成功" })
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("keyword") keyword?: string
  ) {
    return await this.usersService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      keyword,
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除用户" })
  @ApiResponse({ status: 200, description: "删除成功" })
  @ApiResponse({ status: 404, description: "用户不存在" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
