<template>
  <div class="questions-page">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入题目标题或内容"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择分类"
            clearable
          >
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            clearable
          >
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="填空题" value="fill" />
            <el-option label="简答题" value="essay" />
          </el-select>
        </el-form-item>

        <el-form-item label="题目分类">
          <el-select
            v-model="searchForm.questionCategory"
            placeholder="请选择题目分类"
            clearable
          >
            <el-option label="客观题" value="objective" />
            <el-option label="主观题" value="subjective" />
          </el-select>
        </el-form-item>

        <el-form-item label="试题类型">
          <el-select
            v-model="searchForm.examType"
            placeholder="请选择试题类型"
            clearable
          >
            <el-option label="真题" value="real" />
            <el-option label="模拟题" value="mock" />
            <el-option label="专题" value="special" />
          </el-select>
        </el-form-item>

        <el-form-item label="试卷名称">
          <el-select
            v-model="searchForm.paperName"
            placeholder="请选择试卷名称"
            clearable
            filterable
          >
            <el-option
              v-for="paper in paperNameList"
              :key="paper.value"
              :label="paper.label"
              :value="paper.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="难度">
          <el-select
            v-model="searchForm.difficulty"
            placeholder="请选择难度"
            clearable
          >
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
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
      <div class="action-bar">
        <div class="action-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加题目
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </div>

        <div class="action-right">
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 题目列表 -->
    <el-card>
      <el-table
        v-loading="loading"
        :data="questionList"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column
          prop="title"
          label="题目标题"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)" size="small">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="questionCategory" label="题目分类" width="110">
          <template #default="{ row }">
            <el-tag
              :type="getQuestionCategoryTagType(row.questionCategory)"
              size="small"
            >
              {{ getQuestionCategoryText(row.questionCategory) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="examType" label="试题类型" width="100">
          <template #default="{ row }">
            <el-tag
              v-if="row.examType"
              :type="getExamTypeTagType(row.examType)"
              size="small"
            >
              {{ getExamTypeText(row.examType) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="paperName"
          label="试卷名称"
          width="150"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ getPaperNameLabel(row.paperName) || "-" }}
          </template>
        </el-table-column>

        <el-table-column prop="category" label="学科" width="100" />

        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <el-tag :type="getDifficultyTagType(row.difficulty)" size="small">
              {{ getDifficultyText(row.difficulty) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

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

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
  getQuestions,
  deleteQuestion,
  batchDeleteQuestions,
} from "@/api/questions";
import { getDictionaryByType } from "@/api/dictionary";
import type { Question, QuestionListParams } from "@/types/question";
import { formatDate } from "@/utils/format";

const router = useRouter();

// 加载状态
const loading = ref(false);

// 试卷名称列表
const paperNameList = ref<Array<{ label: string; value: string }>>([]);

// 搜索表单
const searchForm = reactive({
  keyword: "",
  category: "",
  type: "",
  difficulty: "",
  questionCategory: "",
  examType: "",
  paperName: "",
});

// 加载试卷名称列表
const loadPaperNames = async () => {
  try {
    const response = await getDictionaryByType("paper_name");
    paperNameList.value = response.data;
  } catch (error) {
    console.error("加载试卷名称失败:", error);
  }
};

// 分类选项
const categories = ref([
  "数学",
  "语文",
  "英语",
  "物理",
  "化学",
  "生物",
  "历史",
  "地理",
]);

// 题目列表
const questionList = ref<Question[]>([]);

// 选中的题目ID
const selectedIds = ref<number[]>([]);

// 分页信息
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

// 获取题目列表
const loadQuestions = async () => {
  try {
    loading.value = true;

    // 只传递有值的参数
    const params: QuestionListParams = {
      page: pagination.page,
      limit: pagination.limit,
    };

    // 只添加非空的搜索条件
    if (searchForm.keyword) params.keyword = searchForm.keyword;
    if (searchForm.category) params.category = searchForm.category;
    if (searchForm.type) params.type = searchForm.type;
    if (searchForm.difficulty) params.difficulty = searchForm.difficulty;
    if (searchForm.questionCategory)
      params.questionCategory = searchForm.questionCategory;
    if (searchForm.examType) params.examType = searchForm.examType;
    if (searchForm.paperName) params.paperName = searchForm.paperName;

    const response = await getQuestions(params);
    questionList.value = response.data.list;
    pagination.total = response.data.total;
  } catch (error) {
    console.error("获取题目列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  loadQuestions();
};

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: "",
    category: "",
    type: "",
    difficulty: "",
    questionCategory: "",
    examType: "",
    paperName: "",
  });
  pagination.page = 1;
  loadQuestions();
};

// 刷新
const handleRefresh = () => {
  loadQuestions();
};

// 添加题目
const handleAdd = () => {
  router.push("/questions/add");
};

// 编辑题目
const handleEdit = (row: Question) => {
  router.push(`/questions/edit/${row.id}`);
};

// 删除题目
const handleDelete = async (row: Question) => {
  try {
    await ElMessageBox.confirm(`确定要删除题目"${row.title}"吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteQuestion(row.id);
    ElMessage.success("删除成功");
    loadQuestions();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除题目失败:", error);
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个题目吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await batchDeleteQuestions(selectedIds.value);
    ElMessage.success("批量删除成功");
    selectedIds.value = [];
    loadQuestions();
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
    }
  }
};

// 选择变化
const handleSelectionChange = (selection: Question[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.limit = size;
  pagination.page = 1;
  loadQuestions();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadQuestions();
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

// 获取题目分类标签类型
const getQuestionCategoryTagType = (questionCategory: string) => {
  const categoryMap: Record<string, string> = {
    objective: "primary",
    subjective: "success",
  };
  return categoryMap[questionCategory] || "info";
};

// 获取题目分类文本
const getQuestionCategoryText = (questionCategory: string) => {
  const categoryMap: Record<string, string> = {
    objective: "客观题",
    subjective: "主观题",
  };
  return categoryMap[questionCategory] || questionCategory;
};

// 获取试题类型标签类型
const getExamTypeTagType = (examType: string) => {
  const typeMap: Record<string, string> = {
    real: "danger",
    mock: "warning",
    special: "info",
  };
  return typeMap[examType] || "info";
};

// 获取试题类型文本
const getExamTypeText = (examType: string) => {
  const typeMap: Record<string, string> = {
    real: "真题",
    mock: "模拟题",
    special: "专题",
  };
  return typeMap[examType] || examType;
};

// 获取试卷名称显示文本
const getPaperNameLabel = (paperName?: string) => {
  if (!paperName) return "";
  const paper = paperNameList.value.find((p) => p.value === paperName);
  return paper?.label || paperName;
};

onMounted(() => {
  loadPaperNames();
  loadQuestions();
});
</script>

<style lang="scss" scoped>
.questions-page {
  .search-card {
    margin-bottom: 20px;

    // 搜索表单样式
    .el-form {
      .el-input {
        width: 220px;
      }

      .el-select {
        width: 160px;
      }
    }
  }

  .action-card {
    margin-bottom: 20px;

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .action-left {
        display: flex;
        gap: 12px;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
