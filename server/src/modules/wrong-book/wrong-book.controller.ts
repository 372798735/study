import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { WrongBookService } from "./wrong-book.service";
import { AddWrongBookDto } from "./dto/add-wrong-book.dto";

@ApiTags("错题本")
@Controller("wrong-book")
export class WrongBookController {
  constructor(private readonly wrongBookService: WrongBookService) {}

  @Post()
  @ApiOperation({ summary: "添加错题" })
  @ApiResponse({ status: 201, description: "添加成功" })
  async addWrongBook(@Request() req, @Body() dto: AddWrongBookDto) {
    // TODO: 从JWT获取真实userId，这里暂时使用固定值
    const userId = 1;
    return this.wrongBookService.addWrongBook(userId, dto);
  }

  @Delete(":questionId")
  @ApiOperation({ summary: "移除错题" })
  @ApiResponse({ status: 200, description: "移除成功" })
  async removeWrongBook(
    @Request() req,
    @Param("questionId") questionId: string
  ) {
    const userId = 1;
    return this.wrongBookService.removeWrongBook(userId, +questionId);
  }

  @Get()
  @ApiOperation({ summary: "获取错题列表" })
  @ApiQuery({
    name: "questionCategory",
    required: false,
    description: "题目类型",
  })
  @ApiQuery({ name: "paperName", required: false, description: "试卷名称" })
  @ApiQuery({ name: "page", required: false, description: "页码" })
  @ApiQuery({ name: "limit", required: false, description: "每页数量" })
  @ApiResponse({ status: 200, description: "错题列表" })
  async getWrongBooks(
    @Request() req,
    @Query("questionCategory") questionCategory?: string,
    @Query("paperName") paperName?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const userId = 1;
    return this.wrongBookService.getWrongBooks(
      userId,
      questionCategory,
      paperName,
      page ? +page : 1,
      limit ? +limit : 10
    );
  }

  @Get("papers")
  @ApiOperation({ summary: "获取错题试卷列表" })
  @ApiQuery({
    name: "questionCategory",
    required: false,
    description: "题目类型",
  })
  @ApiResponse({ status: 200, description: "错题试卷列表" })
  async getWrongBookPapers(
    @Request() req,
    @Query("questionCategory") questionCategory?: string
  ) {
    const userId = 1;
    return this.wrongBookService.getWrongBookPapers(userId, questionCategory);
  }

  @Get("check/:questionId")
  @ApiOperation({ summary: "检查题目是否在错题本中" })
  @ApiResponse({ status: 200, description: "检查结果" })
  async isInWrongBook(@Request() req, @Param("questionId") questionId: string) {
    const userId = 1;
    const isIn = await this.wrongBookService.isInWrongBook(userId, +questionId);
    return { isInWrongBook: isIn };
  }
}
