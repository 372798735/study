<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <span class="logo-icon">📚</span>
        <span v-if="!isCollapse" class="logo-text">教育管理后台</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>仪表板</span>
        </el-menu-item>

        <el-menu-item index="/questions">
          <el-icon><Document /></el-icon>
          <span>题目管理</span>
        </el-menu-item>

        <el-menu-item index="/videos">
          <el-icon><VideoPlay /></el-icon>
          <span>视频管理</span>
        </el-menu-item>

        <el-menu-item index="/video-notes">
          <el-icon><Notebook /></el-icon>
          <span>视频号笔记</span>
        </el-menu-item>

        <el-menu-item index="/download-resources">
          <el-icon><Download /></el-icon>
          <span>笔记下载管理</span>
        </el-menu-item>

        <el-menu-item index="/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </el-menu-item>

        <el-menu-item index="/dictionary">
          <el-icon><SetUp /></el-icon>
          <span>字典管理</span>
        </el-menu-item>

        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>账号管理</span>
        </el-menu-item>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-button type="text" @click="toggleCollapse" class="collapse-btn">
            <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
          </el-button>

          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item
              v-for="item in breadcrumbList"
              :key="item.path"
              :to="item.path"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  DataBoard,
  Document,
  VideoPlay,
  Notebook,
  Download,
  DataAnalysis,
  Setting,
  SetUp,
  Fold,
  Expand,
  User,
  ArrowDown,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 侧边栏折叠状态
const isCollapse = ref(false);

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 面包屑导航
const breadcrumbList = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title);
  return matched.map((item) => ({
    path: item.path,
    title: item.meta?.title,
  }));
});

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case "profile":
      // 跳转到个人资料页面
      break;
    case "settings":
      router.push("/settings");
      break;
    case "logout":
      handleLogout();
      break;
  }
};

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    userStore.logout();
    router.push("/login");
    ElMessage.success("退出登录成功");
  } catch (error) {
    // 用户取消
  }
};
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background: #304156;
  transition: width 0.3s;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #434a50;
    gap: 8px;

    .logo-icon {
      font-size: 24px;
    }

    .logo-text {
      white-space: nowrap;
    }
  }

  .sidebar-menu {
    border: none;
    background: #304156;

    :deep(.el-menu-item) {
      color: #bfcbd9;

      &:hover {
        background: #263445;
        color: white;
      }

      &.is-active {
        background: #409eff;
        color: white;
      }
    }
  }
}

.header {
  background: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;

    .collapse-btn {
      margin-right: 20px;
      font-size: 18px;
    }

    .breadcrumb {
      font-size: 14px;
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background: #f5f5f5;
      }

      .username {
        margin: 0 8px;
        font-size: 14px;
      }
    }
  }
}

.main-content {
  background: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
