import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { DownloadResourcesService } from "./download-resources.service";
import { CreateDownloadResourceDto } from "./dto/create-download-resource.dto";
import { UpdateDownloadResourceDto } from "./dto/update-download-resource.dto";

@ApiTags("笔记下载管理")
@Controller("download-resources")
export class DownloadResourcesController {
  constructor(
    private readonly downloadResourcesService: DownloadResourcesService
  ) {}

  @Post()
  @ApiOperation({ summary: "创建下载资源" })
  create(@Body() createDownloadResourceDto: CreateDownloadResourceDto) {
    return this.downloadResourcesService.create(createDownloadResourceDto);
  }

  @Get()
  @ApiOperation({ summary: "获取下载资源列表" })
  @ApiQuery({ name: "page", required: false, description: "页码" })
  @ApiQuery({ name: "limit", required: false, description: "每页数量" })
  @ApiQuery({ name: "keyword", required: false, description: "搜索关键词" })
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("keyword") keyword?: string
  ) {
    return this.downloadResourcesService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      keyword,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "获取下载资源详情" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.downloadResourcesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新下载资源" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDownloadResourceDto: UpdateDownloadResourceDto
  ) {
    return this.downloadResourcesService.update(id, updateDownloadResourceDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除下载资源" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.downloadResourcesService.remove(id);
  }
}
