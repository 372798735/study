import { Module } from "@nestjs/common";
import { WrongBookController } from "./wrong-book.controller";
import { WrongBookService } from "./wrong-book.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [WrongBookController],
  providers: [WrongBookService],
})
export class WrongBookModule {}
