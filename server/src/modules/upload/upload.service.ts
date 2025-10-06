import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import * as OSS from "ali-oss";

@Injectable()
export class UploadService {
  private ossClient: OSS | null = null;

  constructor(private configService: ConfigService) {
    // 初始化 OSS 客户端
    const accessKeyId = this.configService.get<string>("ALIYUN_ACCESS_KEY_ID");
    const accessKeySecret = this.configService.get<string>(
      "ALIYUN_ACCESS_KEY_SECRET"
    );
    const bucket = this.configService.get<string>("ALIYUN_OSS_BUCKET");
    const region = this.configService.get<string>("ALIYUN_OSS_REGION");

    // 如果配置了阿里云 OSS，则初始化客户端
    if (accessKeyId && accessKeySecret && bucket && region) {
      this.ossClient = new OSS({
        region,
        accessKeyId,
        accessKeySecret,
        bucket,
      });
      console.log("✅ 阿里云 OSS 客户端初始化成功");
    } else {
      console.log("⚠️  未配置阿里云 OSS，将使用本地存储");
    }
  }

  // 判断是否使用 OSS
  private useOSS(): boolean {
    return this.ossClient !== null;
  }

  async uploadImage(file: Express.Multer.File) {
    // 生成唯一文件名
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const ossPath = `images/${fileName}`;

    // 如果配置了 OSS，上传到 OSS
    if (this.useOSS()) {
      try {
        // 上传文件（继承 Bucket 的 ACL 设置）
        const result = await this.ossClient.put(ossPath, file.buffer);

        return {
          url: result.url,
          filename: fileName,
          size: file.size,
          mimetype: file.mimetype,
        };
      } catch (error) {
        console.error("OSS 图片上传失败，详细错误:", error);
        throw new Error(`图片上传失败: ${error.message || error}`);
      }
    }

    // 否则保存到本地
    const uploadPath =
      this.configService.get<string>("UPLOAD_PATH") || "./uploads";
    const imageDir = path.join(uploadPath, "images");

    // 确保目录存在
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    const filePath = path.join(imageDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const baseUrl =
      this.configService.get<string>("BASE_URL") || "http://localhost:3000";
    const fileUrl = `${baseUrl}/uploads/images/${fileName}`;

    return {
      url: fileUrl,
      filename: fileName,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async uploadVideo(file: Express.Multer.File) {
    // 生成唯一文件名
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const ossPath = `videos/${fileName}`;

    // 如果配置了 OSS，上传到 OSS
    if (this.useOSS()) {
      try {
        // 上传文件（继承 Bucket 的 ACL 设置）
        const result = await this.ossClient.put(ossPath, file.buffer);

        return {
          url: result.url,
          filename: fileName,
          size: file.size,
          mimetype: file.mimetype,
        };
      } catch (error) {
        console.error("OSS 视频上传失败，详细错误:", error);
        throw new Error(`视频上传失败: ${error.message || error}`);
      }
    }

    // 否则保存到本地
    const uploadPath =
      this.configService.get<string>("UPLOAD_PATH") || "./uploads";
    const videoDir = path.join(uploadPath, "videos");

    // 确保目录存在
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    const filePath = path.join(videoDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const baseUrl =
      this.configService.get<string>("BASE_URL") || "http://localhost:3000";
    const fileUrl = `${baseUrl}/uploads/videos/${fileName}`;

    return {
      url: fileUrl,
      filename: fileName,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
