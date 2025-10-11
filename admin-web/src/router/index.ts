import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 配置NProgress
NProgress.configure({ showSpinner: false });

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "仪表板", icon: "Dashboard" },
      },
      {
        path: "questions",
        name: "Questions",
        component: () => import("@/views/questions/index.vue"),
        meta: { title: "题目管理", icon: "Document" },
      },
      {
        path: "questions/add",
        name: "QuestionAdd",
        component: () => import("@/views/questions/add.vue"),
        meta: { title: "添加题目", hidden: true },
      },
      {
        path: "questions/edit/:id",
        name: "QuestionEdit",
        component: () => import("@/views/questions/edit.vue"),
        meta: { title: "编辑题目", hidden: true },
      },
      {
        path: "videos",
        name: "Videos",
        component: () => import("@/views/videos/index.vue"),
        meta: { title: "视频管理", icon: "VideoPlay" },
      },
      {
        path: "videos/upload",
        name: "VideoUpload",
        component: () => import("@/views/videos/upload.vue"),
        meta: { title: "上传视频", hidden: true },
      },
      {
        path: "videos/edit/:id",
        name: "VideoEdit",
        component: () => import("@/views/videos/edit.vue"),
        meta: { title: "编辑视频", hidden: true },
      },
      {
        path: "video-notes",
        name: "VideoNotes",
        component: () => import("@/views/video-notes/index.vue"),
        meta: { title: "视频号笔记", icon: "Notebook" },
      },
      {
        path: "video-notes/upload",
        name: "VideoNoteUpload",
        component: () => import("@/views/video-notes/upload.vue"),
        meta: { title: "上传笔记", hidden: true },
      },
      {
        path: "video-notes/edit/:id",
        name: "VideoNoteEdit",
        component: () => import("@/views/video-notes/edit.vue"),
        meta: { title: "编辑笔记", hidden: true },
      },
      {
        path: "download-resources",
        name: "DownloadResources",
        component: () => import("@/views/download-resources/index.vue"),
        meta: { title: "笔记下载管理", icon: "Download" },
      },
      {
        path: "download-resources/upload",
        name: "DownloadResourceUpload",
        component: () => import("@/views/download-resources/upload.vue"),
        meta: { title: "上传资源", hidden: true },
      },
      {
        path: "download-resources/edit/:id",
        name: "DownloadResourceEdit",
        component: () => import("@/views/download-resources/edit.vue"),
        meta: { title: "编辑资源", hidden: true },
      },
      {
        path: "statistics",
        name: "Statistics",
        component: () => import("@/views/statistics/index.vue"),
        meta: { title: "数据统计", icon: "DataAnalysis" },
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/settings/index.vue"),
        meta: { title: "个人设置", icon: "Setting" },
      },
      {
        path: "dictionary",
        name: "Dictionary",
        component: () => import("@/views/dictionary/index.vue"),
        meta: { title: "字典管理", icon: "SetUp" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "页面不存在" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const userStore = useUserStore();

  // 检查是否需要登录
  if (to.path !== "/login" && !userStore.isLoggedIn) {
    next("/login");
    return;
  }

  // 如果已登录且访问登录页，重定向到首页
  if (to.path === "/login" && userStore.isLoggedIn) {
    next("/");
    return;
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
