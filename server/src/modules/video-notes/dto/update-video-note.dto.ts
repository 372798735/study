import { PartialType } from "@nestjs/swagger";
import { CreateVideoNoteDto } from "./create-video-note.dto";

export class UpdateVideoNoteDto extends PartialType(CreateVideoNoteDto) {}
