import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDictionaryDto } from "./dto/create-dictionary.dto";
import { UpdateDictionaryDto } from "./dto/update-dictionary.dto";

@Injectable()
export class DictionaryService {
  constructor(private prisma: PrismaService) {}

  async create(createDictionaryDto: CreateDictionaryDto) {
    // 检查是否已存在
    const existing = await this.prisma.dictionary.findUnique({
      where: {
        type_value: {
          type: createDictionaryDto.type,
          value: createDictionaryDto.value,
        },
      },
    });

    if (existing) {
      throw new ConflictException("该字典项已存在");
    }

    return this.prisma.dictionary.create({
      data: createDictionaryDto,
    });
  }

  async findAll(type?: string, status?: string) {
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.dictionary.findMany({
      where,
      orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    });
  }

  async findOne(id: number) {
    const dictionary = await this.prisma.dictionary.findUnique({
      where: { id },
    });

    if (!dictionary) {
      throw new NotFoundException("字典项不存在");
    }

    return dictionary;
  }

  async update(id: number, updateDictionaryDto: UpdateDictionaryDto) {
    await this.findOne(id);

    // 如果修改了type或value，检查是否冲突
    if (updateDictionaryDto.type || updateDictionaryDto.value) {
      const current = await this.prisma.dictionary.findUnique({
        where: { id },
      });

      const newType = updateDictionaryDto.type || current.type;
      const newValue = updateDictionaryDto.value || current.value;

      const existing = await this.prisma.dictionary.findUnique({
        where: {
          type_value: {
            type: newType,
            value: newValue,
          },
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException("该字典项已存在");
      }
    }

    return this.prisma.dictionary.update({
      where: { id },
      data: updateDictionaryDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.dictionary.delete({
      where: { id },
    });
  }

  // 批量删除
  async batchRemove(ids: number[]) {
    return this.prisma.dictionary.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  // 按类型获取字典列表（用于下拉框）
  async getByType(type: string) {
    return this.prisma.dictionary.findMany({
      where: {
        type,
        status: "active",
      },
      orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        label: true,
        value: true,
      },
    });
  }
}
