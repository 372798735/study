import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

// 解决 BigInt 序列化问题
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 跨域配置
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  });

  // Swagger文档配置
  const config = new DocumentBuilder()
    .setTitle("教育小程序API")
    .setDescription("教育类微信小程序后端API文档")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // 全局前缀
  app.setGlobalPrefix("api/v1");

  // 静态文件服务 - 提供上传文件的访问
  const express = require("express");
  app.use("/uploads", express.static("uploads"));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 服务器运行在: http://localhost:${port}`);
  console.log(`📚 API文档地址: http://localhost:${port}/api/docs`);
}

bootstrap();
