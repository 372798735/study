import { PartialType } from "@nestjs/swagger";
import { CreateDownloadResourceDto } from "./create-download-resource.dto";

export class UpdateDownloadResourceDto extends PartialType(
  CreateDownloadResourceDto
) {}
