<template>
  <div class="users-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-button type="primary" @click="showCreateDialog">
            <el-icon><Plus /></el-icon>
            创建账号
          </el-button>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="手机号/昵称"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.role === 'admin'" type="danger">管理员</el-tag>
            <el-tag v-else type="success">学生</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 创建账号对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="创建账号"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入11位手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            show-password
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="请输入昵称（最多7个字）"
            maxlength="7"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate" :loading="creating">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import {
  getUsers,
  registerUser,
  deleteUser,
  type UserInfo,
  type RegisterForm,
} from "@/api/users";

const loading = ref(false);
const creating = ref(false);
const tableData = ref<UserInfo[]>([]);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();

const searchForm = reactive({
  keyword: "",
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const form = reactive<RegisterForm>({
  phone: "",
  password: "",
  nickname: "",
});

// 表单验证规则
const rules: FormRules<RegisterForm> = {
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少6位", trigger: "blur" },
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { max: 7, message: "昵称最多7个字", trigger: "blur" },
  ],
};

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true;
    const response = await getUsers({
      page: pagination.page,
      limit: pagination.pageSize,
      keyword: searchForm.keyword,
    });

    tableData.value = response.data.list || [];
    pagination.total = response.data.total || 0;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "加载失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  loadUsers();
};

// 分页大小改变
const handleSizeChange = () => {
  pagination.page = 1;
  loadUsers();
};

// 页码改变
const handlePageChange = () => {
  loadUsers();
};

// 显示创建对话框
const showCreateDialog = () => {
  form.phone = "";
  form.password = "";
  form.nickname = "";
  dialogVisible.value = true;
};

// 创建账号
const handleCreate = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      creating.value = true;
      await registerUser(form);
      ElMessage.success("创建成功");
      dialogVisible.value = false;
      loadUsers();
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || "创建失败");
    } finally {
      creating.value = false;
    }
  });
};

// 删除用户
const handleDelete = async (row: UserInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户"${row.nickname}"吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await deleteUser(row.id);
    ElMessage.success("删除成功");
    loadUsers();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.response?.data?.message || "删除失败");
    }
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped lang="scss">
.users-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}
</style>
