<template>
  <div class="download-resources">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>笔记下载管理</span>
          <el-button type="primary" @click="handleAdd">新增资源</el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入标题或文件名"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="fileType" label="文件类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.fileType === 'pdf' ? 'danger' : 'primary'">
              {{ row.fileType.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" min-width="180" />
        <el-table-column prop="fileSize" label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
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

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadResources"
          @current-change="loadResources"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getDownloadResources,
  deleteDownloadResource,
} from "@/api/download-resources";
import type { DownloadResource } from "@/types/download-resource";

const router = useRouter();
const loading = ref(false);
const tableData = ref<DownloadResource[]>([]);

const searchForm = reactive({
  keyword: "",
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 加载数据
const loadResources = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.pageSize,
    };
    if (searchForm.keyword) {
      params.keyword = searchForm.keyword;
    }
    const response = await getDownloadResources(params);
    tableData.value = response.data.list || [];
    pagination.total = response.data.total || 0;
  } catch (error) {
    ElMessage.error("加载失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  loadResources();
};

// 重置
const handleReset = () => {
  searchForm.keyword = "";
  pagination.page = 1;
  loadResources();
};

// 新增
const handleAdd = () => {
  router.push("/download-resources/upload");
};

// 编辑
const handleEdit = (row: DownloadResource) => {
  router.push(`/download-resources/edit/${row.id}`);
};

// 删除
const handleDelete = async (row: DownloadResource) => {
  try {
    await ElMessageBox.confirm("确定要删除这个资源吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteDownloadResource(row.id);
    ElMessage.success("删除成功");
    loadResources();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 格式化文件大小
const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

onMounted(() => {
  loadResources();
});
</script>

<style scoped lang="scss">
.download-resources {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
