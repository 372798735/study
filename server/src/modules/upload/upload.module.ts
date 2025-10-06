import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import * as multer from "multer";

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // 使用内存存储，这样才能使用 file.buffer
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
