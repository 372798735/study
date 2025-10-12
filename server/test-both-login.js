const http = require("http");

function makeRequest(options, postData, testName) {
  console.log(`\n========== ${testName} ==========`);

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`状态码: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log("响应:", JSON.stringify(json, null, 2));

          if (res.statusCode === 200 || res.statusCode === 201) {
            if (json.code === 200 && json.data) {
              console.log("✅ 登录成功！");
              if (json.data.access_token) {
                console.log(
                  "Token:",
                  json.data.access_token.substring(0, 30) + "..."
                );
              }
            } else {
              console.log("⚠️  响应格式异常");
            }
          } else {
            console.log("❌ 登录失败");
          }
        } catch (e) {
          console.log("响应体:", data);
          console.log("❌ 解析 JSON 失败");
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error("❌ 请求失败:", error.message);
      resolve();
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log("测试两个系统的登录接口...\n");

  // 测试1：后台管理系统登录（Admin）
  const adminData = JSON.stringify({
    username: "admin",
    password: "admin123",
  });

  await makeRequest(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/v1/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(adminData),
      },
    },
    adminData,
    "测试1: 后台管理系统登录（Admin）"
  );

  // 测试2：微信小程序登录（User）
  const userData = JSON.stringify({
    phone: "13800138000",
    password: "123456",
  });

  await makeRequest(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/v1/users/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(userData),
      },
    },
    userData,
    "测试2: 微信小程序登录（User）"
  );

  console.log("\n========== 测试总结 ==========");
  console.log("两个系统使用不同的表和接口：");
  console.log("1. 后台管理 → Admin 表 → /api/v1/auth/login");
  console.log("2. 微信小程序 → User 表 → /api/v1/users/login");
}

runTests();
