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
import { VideoNotesService } from "./video-notes.service";
import { CreateVideoNoteDto } from "./dto/create-video-note.dto";
import { UpdateVideoNoteDto } from "./dto/update-video-note.dto";

@ApiTags("视频号笔记")
@Controller("video-notes")
export class VideoNotesController {
  constructor(private readonly videoNotesService: VideoNotesService) {}

  @Post()
  @ApiOperation({ summary: "创建视频号笔记" })
  create(@Body() createVideoNoteDto: CreateVideoNoteDto) {
    return this.videoNotesService.create(createVideoNoteDto);
  }

  @Get()
  @ApiOperation({ summary: "获取视频号笔记列表" })
  @ApiQuery({ name: "page", required: false, description: "页码" })
  @ApiQuery({ name: "limit", required: false, description: "每页数量" })
  @ApiQuery({ name: "keyword", required: false, description: "搜索关键词" })
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("keyword") keyword?: string
  ) {
    return this.videoNotesService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      keyword,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "获取视频号笔记详情" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.videoNotesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新视频号笔记" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateVideoNoteDto: UpdateVideoNoteDto
  ) {
    return this.videoNotesService.update(id, updateVideoNoteDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除视频号笔记" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.videoNotesService.remove(id);
  }
}
