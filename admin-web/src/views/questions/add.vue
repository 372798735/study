<template>
  <div class="question-add">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加题目</span>
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

        <el-form-item label="题目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题目类型">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
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
              :placeholder="`选项 ${String.fromCharCode(65 + index)}`"
            >
              <template #append>
                <el-button
                  @click="removeOption(index)"
                  :disabled="form.options.length <= 2"
                  >删除</el-button
                >
              </template>
            </el-input>
          </div>
          <el-button @click="addOption" type="primary" plain
            >添加选项</el-button
          >
        </el-form-item>

        <el-form-item label="正确答案" prop="answer">
          <el-input
            v-model="form.answer"
            placeholder="请输入正确答案，如：A 或 AB"
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
            >提交</el-button
          >
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadProps,
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { createQuestion } from "@/api/questions";
import { getToken } from "@/utils/auth";

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

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

const form = reactive({
  title: "",
  content: "",
  type: "single",
  difficulty: "medium",
  category: "数学",
  options: ["", "", "", ""],
  answer: "",
  explanation: "",
  videoUrl: "",
});

const rules: FormRules = {
  title: [{ required: true, message: "请输入题目标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入题目内容", trigger: "blur" }],
  type: [{ required: true, message: "请选择题目类型", trigger: "change" }],
  difficulty: [{ required: true, message: "请选择难度", trigger: "change" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  answer: [{ required: true, message: "请输入正确答案", trigger: "blur" }],
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

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await createQuestion(form);
        ElMessage.success("添加成功");
        router.push("/questions");
      } catch (error) {
        ElMessage.error("添加失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

const resetForm = () => {
  formRef.value?.resetFields();
  form.title = "";
  form.options = ["", "", "", ""];
  form.videoUrl = "";
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.question-add {
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
