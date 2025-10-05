import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File) {
    const uploadPath = this.configService.get<string>('UPLOAD_PATH') || './uploads';
    const imageDir = path.join(uploadPath, 'images');
    
    // 确保目录存在
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    // 生成唯一文件名
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(imageDir, fileName);

    // 保存文件
    fs.writeFileSync(filePath, file.buffer);

    // 返回文件URL
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/images/${fileName}`;

    return {
      url: fileUrl,
      filename: fileName,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async uploadVideo(file: Express.Multer.File) {
    const uploadPath = this.configService.get<string>('UPLOAD_PATH') || './uploads';
    const videoDir = path.join(uploadPath, 'videos');
    
    // 确保目录存在
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    // 生成唯一文件名
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(videoDir, fileName);

    // 保存文件
    fs.writeFileSync(filePath, file.buffer);

    // 返回文件URL
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/videos/${fileName}`;

    return {
      url: fileUrl,
      filename: fileName,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
