import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("文件上传")
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "上传图片" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "图片上传成功" })
  @ApiResponse({ status: 400, description: "文件格式不支持" })
  @ApiResponse({ status: 401, description: "未授权" })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("请选择要上传的文件");
    }

    // 检查文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException("只支持 JPG、PNG、GIF 格式的图片");
    }

    // 检查文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException("图片大小不能超过 5MB");
    }

    return this.uploadService.uploadImage(file);
  }

  @Post("video")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "上传视频" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "视频上传成功" })
  @ApiResponse({ status: 400, description: "文件格式不支持" })
  @ApiResponse({ status: 401, description: "未授权" })
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("请选择要上传的文件");
    }

    // 检查文件类型
    const allowedTypes = ["video/mp4", "video/avi", "video/mov"];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException("只支持 MP4、AVI、MOV 格式的视频");
    }

    // 检查文件大小 (200MB)
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException("视频大小不能超过 200MB");
    }

    return this.uploadService.uploadVideo(file);
  }
}
