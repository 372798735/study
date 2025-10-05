<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6" v-for="(item, index) in statsCards" :key="index">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="24">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ item.value }}</div>
              <div class="stats-label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>题目类型分布</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="questionTypeChart" style="height: 300px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>视频分类分布</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="videoCategoryChart" style="height: 300px" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-row :gutter="20" class="recent-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近题目</span>
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/questions')"
              >
                查看全部
              </el-button>
            </div>
          </template>
          <div class="recent-list">
            <div
              v-for="item in recentQuestions"
              :key="item.id"
              class="recent-item"
              @click="goToQuestion(item.id)"
            >
              <div class="item-content">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-meta">
                  <el-tag :type="getTypeTagType(item.type)" size="small">
                    {{ getTypeText(item.type) }}
                  </el-tag>
                  <el-tag
                    :type="getDifficultyTagType(item.difficulty)"
                    size="small"
                  >
                    {{ getDifficultyText(item.difficulty) }}
                  </el-tag>
                </div>
              </div>
              <div class="item-time">
                {{ formatDate(item.createdAt, "MM-DD HH:mm") }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近视频</span>
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/videos')"
              >
                查看全部
              </el-button>
            </div>
          </template>
          <div class="recent-list">
            <div
              v-for="item in recentVideos"
              :key="item.id"
              class="recent-item"
              @click="goToVideo(item.id)"
            >
              <div class="item-content">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-meta">
                  <el-tag size="small">{{ item.category }}</el-tag>
                  <span class="item-duration">{{
                    formatDuration(item.duration || 0)
                  }}</span>
                </div>
              </div>
              <div class="item-time">
                {{ formatDate(item.createdAt, "MM-DD HH:mm") }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {
  getDashboard,
  getQuestionStats,
  getVideoStats,
} from "@/api/statistics";
import { getQuestions } from "@/api/questions";
import { getVideos } from "@/api/videos";
import { formatDate, formatDuration } from "@/utils/format";
import type {
  DashboardData,
  QuestionStats,
  VideoStats,
} from "@/types/statistics";
import type { Question } from "@/types/question";
import type { Video } from "@/types/video";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const router = useRouter();

// 统计数据
const dashboardData = ref<DashboardData | null>(null);
const questionStats = ref<QuestionStats | null>(null);
const videoStats = ref<VideoStats | null>(null);

// 最近数据
const recentQuestions = ref<Question[]>([]);
const recentVideos = ref<Video[]>([]);

// 统计卡片数据
const statsCards = ref([
  {
    label: "总用户数",
    value: 0,
    icon: "User",
    color: "#409eff",
  },
  {
    label: "总题目数",
    value: 0,
    icon: "Document",
    color: "#67c23a",
  },
  {
    label: "总视频数",
    value: 0,
    icon: "VideoPlay",
    color: "#e6a23c",
  },
  {
    label: "学习记录",
    value: 0,
    icon: "DataAnalysis",
    color: "#f56c6c",
  },
]);

// 题目类型图表
const questionTypeChart = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "题目类型",
      type: "pie",
      radius: "50%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

// 视频分类图表
const videoCategoryChart = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "视频分类",
      type: "pie",
      radius: "50%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

// 获取仪表板数据
const loadDashboardData = async () => {
  try {
    const response = await getDashboard();
    dashboardData.value = response.data;

    // 更新统计卡片
    statsCards.value[0].value = dashboardData.value.overview.totalUsers;
    statsCards.value[1].value = dashboardData.value.overview.totalQuestions;
    statsCards.value[2].value = dashboardData.value.overview.totalVideos;
    statsCards.value[3].value = dashboardData.value.overview.totalRecords;
  } catch (error) {
    console.error("获取仪表板数据失败:", error);
  }
};

// 获取题目统计
const loadQuestionStats = async () => {
  try {
    const response = await getQuestionStats();
    questionStats.value = response.data;

    // 更新题目类型图表
    questionTypeChart.value.series[0].data = questionStats.value.byType.map(
      (item) => ({
        value: item.count,
        name: getTypeText(item.type),
      })
    );
  } catch (error) {
    console.error("获取题目统计失败:", error);
  }
};

// 获取视频统计
const loadVideoStats = async () => {
  try {
    const response = await getVideoStats();
    videoStats.value = response.data;

    // 更新视频分类图表
    videoCategoryChart.value.series[0].data = videoStats.value.byCategory.map(
      (item) => ({
        value: item.count,
        name: item.category,
      })
    );
  } catch (error) {
    console.error("获取视频统计失败:", error);
  }
};

// 获取最近题目
const loadRecentQuestions = async () => {
  try {
    const response = await getQuestions({ page: 1, limit: 5 });
    recentQuestions.value = response.data.list;
  } catch (error) {
    console.error("获取最近题目失败:", error);
  }
};

// 获取最近视频
const loadRecentVideos = async () => {
  try {
    const response = await getVideos({ page: 1, limit: 5 });
    recentVideos.value = response.data.list;
  } catch (error) {
    console.error("获取最近视频失败:", error);
  }
};

// 跳转到题目详情
const goToQuestion = (id: number) => {
  router.push(`/questions/edit/${id}`);
};

// 跳转到视频详情
const goToVideo = (id: number) => {
  router.push(`/videos/edit/${id}`);
};

// 获取题目类型标签类型
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    single: "primary",
    multiple: "success",
    fill: "warning",
    essay: "danger",
  };
  return typeMap[type] || "info";
};

// 获取题目类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    single: "单选题",
    multiple: "多选题",
    fill: "填空题",
    essay: "简答题",
  };
  return typeMap[type] || type;
};

// 获取难度标签类型
const getDifficultyTagType = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    easy: "success",
    medium: "warning",
    hard: "danger",
  };
  return difficultyMap[difficulty] || "info";
};

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    easy: "简单",
    medium: "中等",
    hard: "困难",
  };
  return difficultyMap[difficulty] || difficulty;
};

onMounted(() => {
  loadDashboardData();
  loadQuestionStats();
  loadVideoStats();
  loadRecentQuestions();
  loadRecentVideos();
});
</script>

<style lang="scss" scoped>
.dashboard {
  .stats-cards {
    margin-bottom: 20px;

    .stats-card {
      .stats-content {
        display: flex;
        align-items: center;

        .stats-icon {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 16px;
        }

        .stats-info {
          .stats-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 4px;
          }

          .stats-label {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }

  .charts-section {
    margin-bottom: 20px;
  }

  .recent-section {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .recent-list {
      .recent-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: #f5f5f5;
        }

        &:last-child {
          border-bottom: none;
        }

        .item-content {
          flex: 1;

          .item-title {
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .item-meta {
            display: flex;
            align-items: center;
            gap: 8px;

            .item-duration {
              font-size: 12px;
              color: #999;
            }
          }
        }

        .item-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>
