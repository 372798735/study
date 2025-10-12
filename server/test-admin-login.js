const http = require("http");

console.log("测试管理员登录...\n");

const postData = JSON.stringify({
  username: "admin",
  password: "admin123",
});

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

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("状态码:", res.statusCode);
    console.log("响应头:", res.headers);
    console.log("\n响应体:");
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));

      if (json.code === 200 && json.data.access_token) {
        console.log("\n✅ 登录测试成功！");
        console.log("Token:", json.data.access_token.substring(0, 50) + "...");
      } else {
        console.log("\n❌ 登录失败：响应格式不正确");
      }
    } catch (e) {
      console.log(data);
      console.log("\n❌ 解析 JSON 失败");
    }
  });
});

req.on("error", (error) => {
  console.error("❌ 请求失败:", error.message);
  console.log("\n请确认：");
  console.log("1. 后端服务器是否在运行？");
  console.log("2. 端口 3000 是否正确？");
});

req.write(postData);
req.end();
