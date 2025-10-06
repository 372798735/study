import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { AnswerQuestionDto } from "./dto/answer-question.dto";

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number,
    limit: number,
    category?: string,
    type?: string,
    difficulty?: string,
    keyword?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    // 过滤掉字符串 "undefined" 和空字符串
    if (category && category !== "undefined" && category.trim() !== "") {
      where.category = category;
    }

    if (type && type !== "undefined" && type.trim() !== "") {
      where.type = type;
    }

    if (difficulty && difficulty !== "undefined" && difficulty.trim() !== "") {
      where.difficulty = difficulty;
    }

    if (keyword && keyword !== "undefined" && keyword.trim() !== "") {
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          category: true,
          difficulty: true,
          imageUrl: true,
          videoUrl: true,
          videoDuration: true,
          createdAt: true,
        },
      }),
      this.prisma.question.count({ where }),
    ]);

    return {
      list: questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException("题目不存在");
    }

    return question;
  }

  async create(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: createQuestionDto,
    });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException("题目不存在");
    }

    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  async remove(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException("题目不存在");
    }

    // 先删除相关的学习记录，避免外键约束错误
    await this.prisma.learningRecord.deleteMany({
      where: {
        contentId: id,
        contentType: "question",
      },
    });

    // 再删除题目
    return this.prisma.question.delete({
      where: { id },
    });
  }

  async answer(
    id: number,
    answerQuestionDto: AnswerQuestionDto,
    userId: number
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException("题目不存在");
    }

    // 判断答案是否正确
    const isCorrect = this.checkAnswer(question, answerQuestionDto.answer);

    // 计算得分
    const score = isCorrect ? 100 : 0;

    // 保存学习记录
    await this.prisma.learningRecord.upsert({
      where: {
        userId_contentId_contentType: {
          userId,
          contentId: id,
          contentType: "question",
        },
      },
      update: {
        score,
        completedAt: new Date(),
      },
      create: {
        userId,
        contentId: id,
        contentType: "question",
        progress: 100,
        score,
        completedAt: new Date(),
      },
    });

    return {
      isCorrect,
      score,
      correctAnswer: question.answer,
      explanation: question.explanation,
    };
  }

  private checkAnswer(question: any, userAnswer: string): boolean {
    switch (question.type) {
      case "single":
      case "fill":
      case "essay":
        return (
          question.answer.toLowerCase().trim() ===
          userAnswer.toLowerCase().trim()
        );

      case "multiple":
        const correctAnswers = question.answer
          .split(",")
          .map((a) => a.trim().toLowerCase());
        const userAnswers = userAnswer
          .split(",")
          .map((a) => a.trim().toLowerCase());
        return (
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((answer) => userAnswers.includes(answer))
        );

      default:
        return false;
    }
  }
}
