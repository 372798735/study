<template>
  <div class="dictionary-page">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true">
        <el-form-item label="字典类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            clearable
          >
            <el-option label="试卷名称" value="paper_name" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="action-card">
      <el-button type="primary" @click="handleAdd">添加字典</el-button>
      <el-button
        type="danger"
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
      >
        批量删除 ({{ selectedIds.length }})
      </el-button>
      <el-button @click="loadDictionaries">刷新</el-button>
    </el-card>

    <!-- 字典列表 -->
    <el-card>
      <el-table
        v-loading="loading"
        :data="dictionaryList"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="type" label="类型" width="150">
          <template #default="{ row }">
            <el-tag>{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="label" label="显示名称" min-width="200" />

        <el-table-column prop="value" label="值" min-width="150" />

        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === "active" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
            :disabled="isEdit"
          >
            <el-option label="试卷名称" value="paper_name" />
          </el-select>
        </el-form-item>

        <el-form-item label="显示名称" prop="label">
          <el-input v-model="form.label" placeholder="请输入显示名称" />
        </el-form-item>

        <el-form-item label="值" prop="value">
          <el-input
            v-model="form.value"
            placeholder="请输入值"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitLoading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import {
  getDictionaries,
  createDictionary,
  updateDictionary,
  deleteDictionary,
  batchDeleteDictionaries,
  type Dictionary,
  type DictionaryForm,
} from "../../api/dictionary";

// 加载状态
const loading = ref(false);
const submitLoading = ref(false);

// 搜索表单
const searchForm = reactive({
  type: "",
  status: "",
});

// 字典列表
const dictionaryList = ref<Dictionary[]>([]);

// 选中的字典ID
const selectedIds = ref<number[]>([]);

// 对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref(0);

const dialogTitle = computed(() => (isEdit.value ? "编辑字典" : "添加字典"));

// 表单
const formRef = ref<FormInstance>();
const form = reactive<DictionaryForm>({
  type: "paper_name",
  label: "",
  value: "",
  sort: 0,
  status: "active",
  remark: "",
});

const rules: FormRules = {
  type: [{ required: true, message: "请选择字典类型", trigger: "change" }],
  label: [{ required: true, message: "请输入显示名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入值", trigger: "blur" }],
};

// 加载字典列表
const loadDictionaries = async () => {
  try {
    loading.value = true;
    const params: any = {};
    if (searchForm.type) params.type = searchForm.type;
    if (searchForm.status) params.status = searchForm.status;

    const response = await getDictionaries(params);
    dictionaryList.value = response.data;
  } catch (error) {
    console.error("获取字典列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  loadDictionaries();
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    type: "",
    status: "",
  });
  loadDictionaries();
};

// 添加字典
const handleAdd = () => {
  isEdit.value = false;
  Object.assign(form, {
    type: "paper_name",
    label: "",
    value: "",
    sort: 0,
    status: "active",
    remark: "",
  });
  dialogVisible.value = true;
};

// 编辑字典
const handleEdit = (row: Dictionary) => {
  isEdit.value = true;
  currentId.value = row.id;
  Object.assign(form, {
    type: row.type,
    label: row.label,
    value: row.value,
    sort: row.sort,
    status: row.status,
    remark: row.remark || "",
  });
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true;

        if (isEdit.value) {
          await updateDictionary(currentId.value, form);
          ElMessage.success("更新成功");
        } else {
          await createDictionary(form);
          ElMessage.success("添加成功");
        }

        dialogVisible.value = false;
        loadDictionaries();
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || "操作失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 删除字典
const handleDelete = async (row: Dictionary) => {
  try {
    await ElMessageBox.confirm(`确定要删除字典项"${row.label}"吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteDictionary(row.id);
    ElMessage.success("删除成功");
    loadDictionaries();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除字典失败:", error);
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个字典项吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await batchDeleteDictionaries(selectedIds.value);
    ElMessage.success("批量删除成功");
    selectedIds.value = [];
    loadDictionaries();
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
    }
  }
};

// 选择变化
const handleSelectionChange = (selection: Dictionary[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 获取类型名称
const getTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    paper_name: "试卷名称",
  };
  return typeMap[type] || type;
};

// 初始化
loadDictionaries();
</script>

<style scoped lang="scss">
.dictionary-page {
  .search-card,
  .action-card {
    margin-bottom: 20px;
  }
}
</style>
