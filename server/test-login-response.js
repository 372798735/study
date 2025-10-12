const http = require("http");

function testLogin(username, password, testName) {
  console.log(`\n========== ${testName} ==========`);

  const postData = JSON.stringify({ username, password });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/api/v1/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`状态码: ${res.statusCode}`);
        console.log(`响应体: ${data}`);

        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log("✅ 响应成功");
        } else if (res.statusCode === 401) {
          console.log("❌ 401 错误 - 这会被前端误认为'登录已过期'");
        } else {
          console.log(`⚠️  其他错误: ${res.statusCode}`);
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error("❌ 请求失败:", error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log("测试后台管理登录响应...\n");

  // 测试正确的账号密码
  await testLogin("admin", "admin123", "测试1: 正确的账号密码");

  // 测试错误的密码
  await testLogin("admin", "wrongpassword", "测试2: 错误的密码");

  // 测试不存在的用户
  await testLogin("notexist", "password", "测试3: 不存在的用户");

  console.log("\n========== 测试总结 ==========");
  console.log("问题：测试2和测试3都返回401，前端会显示'登录已过期'");
  console.log("解决方案：修改 LocalStrategy 返回更明确的错误信息");
}

runTests();
