import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { DictionaryService } from "./dictionary.service";
import { CreateDictionaryDto } from "./dto/create-dictionary.dto";
import { UpdateDictionaryDto } from "./dto/update-dictionary.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("字典管理")
@Controller("dictionary")
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建字典项" })
  @ApiResponse({ status: 201, description: "创建成功" })
  async create(@Body() createDictionaryDto: CreateDictionaryDto) {
    return this.dictionaryService.create(createDictionaryDto);
  }

  @Get()
  @ApiOperation({ summary: "获取字典列表" })
  @ApiQuery({ name: "type", required: false, description: "字典类型" })
  @ApiQuery({ name: "status", required: false, description: "状态" })
  @ApiResponse({ status: 200, description: "字典列表" })
  async findAll(
    @Query("type") type?: string,
    @Query("status") status?: string
  ) {
    return this.dictionaryService.findAll(type, status);
  }

  @Get("type/:type")
  @ApiOperation({ summary: "按类型获取字典（用于下拉框）" })
  @ApiResponse({ status: 200, description: "字典列表" })
  async getByType(@Param("type") type: string) {
    return this.dictionaryService.getByType(type);
  }

  @Get(":id")
  @ApiOperation({ summary: "获取字典详情" })
  @ApiResponse({ status: 200, description: "字典详情" })
  async findOne(@Param("id") id: string) {
    return this.dictionaryService.findOne(+id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新字典项" })
  @ApiResponse({ status: 200, description: "更新成功" })
  async update(
    @Param("id") id: string,
    @Body() updateDictionaryDto: UpdateDictionaryDto
  ) {
    return this.dictionaryService.update(+id, updateDictionaryDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除字典项" })
  @ApiResponse({ status: 200, description: "删除成功" })
  async remove(@Param("id") id: string) {
    return this.dictionaryService.remove(+id);
  }

  @Delete("batch/delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "批量删除字典项" })
  @ApiResponse({ status: 200, description: "删除成功" })
  async batchRemove(@Body("ids") ids: number[]) {
    return this.dictionaryService.batchRemove(ids);
  }
}
