import { Module } from "@nestjs/common";
import { VideoNotesService } from "./video-notes.service";
import { VideoNotesController } from "./video-notes.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [VideoNotesController],
  providers: [VideoNotesService, PrismaService],
})
export class VideoNotesModule {}
