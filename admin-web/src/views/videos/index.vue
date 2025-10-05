<template>
  <div class="videos-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>视频管理</span>
          <el-button type="primary" @click="handleAdd">上传视频</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column prop="viewCount" label="观看次数" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadVideos"
        @current-change="loadVideos"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getVideos, deleteVideo } from "@/api/videos";
import type { Video } from "@/types/video";

const router = useRouter();
const loading = ref(false);
const tableData = ref<Video[]>([]);

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const loadVideos = async () => {
  loading.value = true;
  try {
    const { data, total } = await getVideos({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });
    tableData.value = data;
    pagination.total = total;
  } catch (error) {
    ElMessage.error("加载失败");
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  router.push("/videos/upload");
};

const handleEdit = (row: Video) => {
  router.push(`/videos/edit/${row.id}`);
};

const handleDelete = async (row: Video) => {
  try {
    await ElMessageBox.confirm("确定要删除这个视频吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteVideo(row.id);
    ElMessage.success("删除成功");
    loadVideos();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

onMounted(() => {
  loadVideos();
});
</script>

<style scoped lang="scss">
.videos-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
