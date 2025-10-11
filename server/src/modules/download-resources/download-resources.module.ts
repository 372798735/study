import { Module } from "@nestjs/common";
import { DownloadResourcesService } from "./download-resources.service";
import { DownloadResourcesController } from "./download-resources.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [DownloadResourcesController],
  providers: [DownloadResourcesService, PrismaService],
})
export class DownloadResourcesModule {}
