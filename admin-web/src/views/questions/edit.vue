<template>
  <div class="question-edit">
    <el-card v-loading="pageLoading">
      <template #header>
        <div class="card-header">
          <span>编辑题目</span>
          <el-button type="text" @click="goBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="题目标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入题目标题" />
        </el-form-item>

        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入题目内容"
          />
        </el-form-item>

        <el-form-item label="题目分类" prop="questionCategory">
          <el-select
            v-model="form.questionCategory"
            placeholder="请选择题目分类"
            @change="handleCategoryChange"
          >
            <el-option label="客观题" value="objective" />
            <el-option label="主观题" value="subjective" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="form.questionCategory === 'objective'"
          label="题目类型"
          prop="type"
        >
          <el-select v-model="form.type" placeholder="请选择题目类型">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="填空题" value="fill" />
          </el-select>
        </el-form-item>

        <el-form-item label="试题类型">
          <el-select
            v-model="form.examType"
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
            v-model="form.paperName"
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

        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选项" prop="options">
          <div
            v-for="(option, index) in form.options"
            :key="index"
            style="margin-bottom: 10px"
          >
            <el-input
              v-model="form.options[index]"
              :placeholder="
                form.questionCategory === 'subjective'
                  ? `选项 ${index + 1}`
                  : `选项 ${String.fromCharCode(65 + index)}`
              "
              :disabled="form.questionCategory === 'subjective'"
            >
              <template v-if="form.questionCategory === 'objective'" #append>
                <el-button
                  @click="removeOption(index)"
                  :disabled="form.options.length <= 2"
                  >删除</el-button
                >
              </template>
            </el-input>
          </div>
          <!-- <el-button
            v-if="form.questionCategory === 'objective'"
            @click="addOption"
            type="primary"
            plain
            >添加选项</el-button
          > -->
        </el-form-item>

        <el-form-item
          :label="
            form.questionCategory === 'objective' ? '正确答案' : '参考答案'
          "
          prop="answer"
        >
          <el-input
            v-model="form.answer"
            :type="form.questionCategory === 'subjective' ? 'textarea' : 'text'"
            :rows="form.questionCategory === 'subjective' ? 3 : undefined"
            :placeholder="
              form.questionCategory === 'objective'
                ? '请输入正确答案，如：A 或 AB'
                : '请输入参考答案或解答思路（主观题）'
            "
          />
        </el-form-item>

        <el-form-item label="答案解析" prop="explanation">
          <el-input
            v-model="form.explanation"
            type="textarea"
            :rows="3"
            placeholder="请输入答案解析"
          />
        </el-form-item>

        <el-form-item label="视频讲解">
          <div v-if="!form.videoUrl">
            <el-upload
              class="upload-demo"
              drag
              :action="uploadUrl"
              :headers="uploadHeaders"
              :on-success="handleVideoSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeVideoUpload"
              accept="video/*"
              :limit="1"
              :auto-upload="true"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                拖拽视频到此处或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 mp4/avi/mov 格式，文件大小不超过 200MB
                </div>
              </template>
            </el-upload>
          </div>
          <div v-else class="video-preview">
            <video
              :src="form.videoUrl"
              controls
              style="max-width: 100%; height: auto; border-radius: 4px"
            >
              您的浏览器不支持视频播放
            </video>
            <el-button
              type="danger"
              size="small"
              @click="removeVideo"
              style="margin-top: 10px"
            >
              删除视频
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading"
            >保存</el-button
          >
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadProps,
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { getQuestion, updateQuestion } from "@/api/questions";
import { getDictionaryByType } from "@/api/dictionary";
import { getToken } from "@/utils/auth";

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);
const pageLoading = ref(false);

// 分类选项（与题目管理页面保持一致）
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

const uploadUrl = computed(
  () => `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}/upload/video`
);
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${getToken()}`,
}));

// 试卷名称列表
const paperNameList = ref<Array<{ label: string; value: string }>>([]);

const form = reactive({
  title: "",
  content: "",
  type: "single",
  questionCategory: "objective",
  examType: "",
  paperName: "",
  difficulty: "medium",
  category: "",
  options: ["", "", "", ""],
  answer: "",
  explanation: "",
  videoUrl: "",
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

const rules: FormRules = {
  title: [{ required: true, message: "请输入题目标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入题目内容", trigger: "blur" }],
  type: [{ required: true, message: "请选择题目类型", trigger: "change" }],
  questionCategory: [
    { required: true, message: "请选择题目分类", trigger: "change" },
  ],
  difficulty: [{ required: true, message: "请选择难度", trigger: "change" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  answer: [{ required: true, message: "请输入正确答案", trigger: "blur" }],
};

const loadQuestion = async () => {
  const id = route.params.id as string;
  pageLoading.value = true;
  try {
    const response = await getQuestion(Number(id));
    Object.assign(form, response.data);
  } catch (error) {
    ElMessage.error("加载失败");
    goBack();
  } finally {
    pageLoading.value = false;
  }
};

const addOption = () => {
  form.options.push("");
};

const removeOption = (index: number) => {
  if (form.options.length > 2) {
    form.options.splice(index, 1);
  }
};

const beforeVideoUpload: UploadProps["beforeUpload"] = (file) => {
  const isVideo = file.type.startsWith("video/");
  const isLt200M = file.size / 1024 / 1024 < 200;

  if (!isVideo) {
    ElMessage.error("只能上传视频文件!");
    return false;
  }
  if (!isLt200M) {
    ElMessage.error("视频大小不能超过 200MB!");
    return false;
  }
  return true;
};

const handleVideoSuccess = (response: any) => {
  if (response.code === 200) {
    form.videoUrl = response.data.url;
    ElMessage.success("视频上传成功");
  } else {
    ElMessage.error(response.message || "视频上传失败");
  }
};

const handleUploadError = () => {
  ElMessage.error("视频上传失败");
};

const removeVideo = () => {
  form.videoUrl = "";
};

// 处理题目分类变化
const handleCategoryChange = (value: string) => {
  if (value === "subjective") {
    // 主观题：固定为"会"和"不会"两个选项，不需要题目类型和正确答案
    form.options = ["会", "不会"];
    form.type = "single";
    form.answer = "";
  } else {
    // 客观题：如果当前选项是["会", "不会"]，恢复为4个空选项
    if (
      form.options.length === 2 &&
      form.options[0] === "会" &&
      form.options[1] === "不会"
    ) {
      form.options = ["", "", "", ""];
    }
  }
};

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const id = route.params.id as string;
        await updateQuestion(Number(id), form);
        ElMessage.success("保存成功");
        router.push("/questions");
      } catch (error) {
        ElMessage.error("保存失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadPaperNames();
  loadQuestion();
});
</script>

<style scoped lang="scss">
.question-edit {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  // 表单样式
  .el-form {
    max-width: 600px;

    .el-input,
    .el-select {
      width: 100%;
    }

    .el-textarea {
      width: 100%;
    }
  }

  // 视频预览样式
  .video-preview {
    video {
      max-width: 100%;
      max-height: 400px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
