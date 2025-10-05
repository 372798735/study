<template>
  <div class="statistics-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: #409eff">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalQuestions }}</div>
              <div class="stat-label">总题目数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalVideos }}</div>
              <div class="stat-label">总视频数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon><View /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalViews }}</div>
              <div class="stat-label">总观看次数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>学习趋势</span>
          </template>
          <div ref="learningChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>内容分布</span>
          </template>
          <div ref="contentChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { User, Document, VideoPlay, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getStatistics } from "@/api/statistics";
import * as echarts from "echarts";

const stats = ref({
  totalUsers: 0,
  totalQuestions: 0,
  totalVideos: 0,
  totalViews: 0,
});

const learningChartRef = ref<HTMLElement>();
const contentChartRef = ref<HTMLElement>();

const loadStatistics = async () => {
  try {
    const data = await getStatistics();
    stats.value = data;
    initCharts();
  } catch (error) {
    ElMessage.error("加载统计数据失败");
  }
};

const initCharts = () => {
  // 学习趋势图
  if (learningChartRef.value) {
    const learningChart = echarts.init(learningChartRef.value);
    learningChart.setOption({
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "学习人数",
          type: "line",
          data: [120, 200, 150, 80, 70, 110, 130],
          smooth: true,
        },
      ],
    });
  }

  // 内容分布图
  if (contentChartRef.value) {
    const contentChart = echarts.init(contentChartRef.value);
    contentChart.setOption({
      tooltip: { trigger: "item" },
      series: [
        {
          name: "内容分布",
          type: "pie",
          radius: "50%",
          data: [
            { value: 335, name: "JavaScript" },
            { value: 310, name: "Vue.js" },
            { value: 234, name: "Node.js" },
            { value: 135, name: "TypeScript" },
            { value: 154, name: "其他" },
          ],
        },
      ],
    });
  }
};

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped lang="scss">
.statistics-page {
  .stat-card {
    display: flex;
    align-items: center;

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      margin-right: 16px;
    }

    .stat-content {
      flex: 1;

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style>
