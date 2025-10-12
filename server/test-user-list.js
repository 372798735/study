const http = require("http");

// 首先登录获取 token
function adminLogin() {
  console.log("========== 步骤1：管理员登录 ==========\n");

  const postData = JSON.stringify({
    username: "admin",
    password: "admin123",
  });

  return new Promise((resolve, reject) => {
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
        try {
          const json = JSON.parse(data);
          if (json.code === 200 && json.data.access_token) {
            console.log("✅ 登录成功");
            console.log(
              "Token:",
              json.data.access_token.substring(0, 30) + "...\n"
            );
            resolve(json.data.access_token);
          } else {
            console.log("❌ 登录失败:", json);
            reject(new Error("登录失败"));
          }
        } catch (e) {
          console.log("❌ 解析响应失败:", data);
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// 获取用户列表
function getUserList(token) {
  console.log("========== 步骤2：获取用户列表 ==========\n");

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/v1/users?page=1&limit=10",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

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

          if (json.code === 200) {
            console.log("\n========== 用户列表 ==========");
            console.log(`总数: ${json.data.total}`);
            console.log(`当前页: ${json.data.page}`);
            console.log(`每页数量: ${json.data.limit}`);
            console.log(`列表数量: ${json.data.list.length}`);

            if (json.data.list.length > 0) {
              console.log("\n用户详情:");
              json.data.list.forEach((user, index) => {
                console.log(`\n${index + 1}. ID: ${user.id}`);
                console.log(`   手机号: ${user.phone}`);
                console.log(`   昵称: ${user.nickname}`);
                console.log(`   角色: ${user.role}`);
                console.log(`   创建时间: ${user.createdAt}`);
              });
            } else {
              console.log("\n⚠️  列表为空！");
            }
          }
          resolve();
        } catch (e) {
          console.log("❌ 解析响应失败:", data);
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

async function main() {
  try {
    const token = await adminLogin();
    await getUserList(token);
    console.log("\n========== 测试完成 ==========");
  } catch (error) {
    console.error("\n❌ 测试失败:", error.message);
    console.log("\n请确认：");
    console.log("1. 后端服务器是否正在运行？");
    console.log("2. 端口 3000 是否正确？");
    console.log("3. 数据库连接是否正常？");
  }
}

main();
