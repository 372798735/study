import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AddWrongBookDto } from "./dto/add-wrong-book.dto";

@Injectable()
export class WrongBookService {
  constructor(private prisma: PrismaService) {}

  // 添加错题
  async addWrongBook(userId: number, dto: AddWrongBookDto) {
    // 检查题目是否存在
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
    });

    if (!question) {
      throw new NotFoundException("题目不存在");
    }

    // 使用 upsert 避免重复添加
    return this.prisma.wrongBook.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId: dto.questionId,
        },
      },
      update: {
        userAnswer: dto.userAnswer,
        note: dto.note,
        questionCategory: question.questionCategory,
      },
      create: {
        userId,
        questionId: dto.questionId,
        questionCategory: question.questionCategory,
        userAnswer: dto.userAnswer,
        note: dto.note,
      },
      include: {
        question: true,
      },
    });
  }

  // 移除错题
  async removeWrongBook(userId: number, questionId: number) {
    const wrongBook = await this.prisma.wrongBook.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    if (!wrongBook) {
      throw new NotFoundException("错题不存在");
    }

    return this.prisma.wrongBook.delete({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });
  }

  // 获取错题列表（按试卷分组）
  async getWrongBooks(
    userId: number,
    questionCategory?: string,
    paperName?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const where: any = { userId };

    if (questionCategory) {
      where.questionCategory = questionCategory;
    }

    if (paperName) {
      where.question = {
        paperName,
      };
    }

    const [list, total] = await Promise.all([
      this.prisma.wrongBook.findMany({
        where,
        include: {
          question: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wrongBook.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      limit,
    };
  }

  // 获取错题试卷列表
  async getWrongBookPapers(userId: number, questionCategory?: string) {
    const where: any = { userId };

    if (questionCategory) {
      where.questionCategory = questionCategory;
    }

    // 获取所有错题
    const wrongBooks = await this.prisma.wrongBook.findMany({
      where,
      include: {
        question: true,
      },
    });

    // 按试卷分组统计
    const paperMap = new Map();
    for (const wb of wrongBooks) {
      if (wb.question.paperName) {
        if (!paperMap.has(wb.question.paperName)) {
          paperMap.set(wb.question.paperName, {
            paperName: wb.question.paperName,
            count: 0,
          });
        }
        paperMap.get(wb.question.paperName).count++;
      }
    }

    // 获取试卷详情
    const papers = [];
    for (const [paperName, data] of paperMap) {
      const dictionary = await this.prisma.dictionary.findUnique({
        where: {
          type_value: {
            type: "paper_name",
            value: paperName,
          },
        },
      });

      if (dictionary) {
        papers.push({
          id: dictionary.id,
          label: dictionary.label,
          value: dictionary.value,
          questionCount: data.count,
        });
      }
    }

    return papers;
  }

  // 检查题目是否在错题本中
  async isInWrongBook(userId: number, questionId: number) {
    const wrongBook = await this.prisma.wrongBook.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    return !!wrongBook;
  }
}
