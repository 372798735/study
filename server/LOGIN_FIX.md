# 登录问题修复说明

## 问题原因

找到了导致"登录已过期，请重新登录"的**两个关键问题**：

### 1. 前后端响应格式不匹配
- **后端**：NestJS 默认直接返回 `{ access_token, user }`
- **前端**：期望所有响应包含 `{ code: 200, data: {...} }` 格式
- **结果**：前端认为请求失败，触发401错误处理

### 2. 数据库密码未加密
- **数据库**：管理员密码存储为明文 `"admin123"`
- **验证逻辑**：使用 `bcrypt.compare()` 比对加密密码
- **结果**：密码验证始终失败，返回401未授权

## 修复方案

### 修复1：添加统一响应格式拦截器

**创建文件**：`src/common/interceptors/transform.interceptor.ts`
```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        data,
        message: "操作成功",
      }))
    );
  }
}
```

**修改文件**：`src/main.ts`
```typescript
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// 在 bootstrap() 中添加
app.useGlobalInterceptors(new TransformInterceptor());
```

### 修复2：加密管理员密码

**修改文件**：`prisma/seed.ts`
```typescript
import * as bcrypt from "bcryptjs";

// 加密密码后再存储
const hashedPassword = await bcrypt.hash("admin123", 10);
const admin = await prisma.admin.upsert({
  where: { username: "admin" },
  update: {
    password: hashedPassword,
  },
  create: {
    username: "admin",
    password: hashedPassword,
    email: "admin@example.com",
  },
});
```

**执行命令**：
```bash
npm run prisma:seed
```

### 修复3：前端Token管理一致性

**修改文件**：`admin-web/src/api/request.ts`
- 将 `localStorage.removeItem("token")` 改为 `removeToken()`
- 确保使用统一的 Cookie 存储方式

## 测试账户

- **用户名**：`admin`
- **密码**：`admin123`

## 验证步骤

1. ✅ 后端服务已启动（端口3000）
2. ✅ 数据库已更新管理员密码为加密哈希
3. ✅ 统一响应格式拦截器已应用
4. ✅ 前端Token管理已统一

## 预期结果

现在登录应该可以正常工作：
1. 输入用户名 `admin` 和密码 `admin123`
2. 后端验证通过，生成JWT token
3. 前端收到格式化响应：`{ code: 200, data: { access_token, user } }`
4. Token 存储到 Cookie
5. 自动获取用户信息成功
6. 跳转到首页

## 额外说明

如果问题仍然存在，请检查：
1. 浏览器控制台的Network标签，查看实际的请求和响应
2. 确认后端服务正在运行
3. 确认前端代理配置正确（`baseURL: "/api/v1"`）
4. 检查数据库连接是否正常
