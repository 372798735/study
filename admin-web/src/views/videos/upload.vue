<template>
  <div class="video-upload">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>上传视频</span>
          <el-button type="text" @click="goBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入视频标题" />
        </el-form-item>

        <el-form-item label="视频分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="视频描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入视频描述"
          />
        </el-form-item>

        <el-form-item label="视频文件" prop="videoUrl">
          <el-upload
            class="upload-demo"
            drag
            :action="videoUploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            accept="video/*"
            :show-file-list="false"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                支持 mp4/avi/mov 格式，文件大小不超过 500MB
              </div>
            </template>
          </el-upload>
          <div v-if="form.videoUrl" class="video-preview">
            <el-tag type="success">视频已上传</el-tag>
            <video
              :src="form.videoUrl"
              controls
              style="width: 100%; max-width: 500px; margin-top: 10px"
            ></video>
          </div>
        </el-form-item>

        <el-form-item label="封面图片" prop="coverUrl">
          <el-upload
            class="avatar-uploader"
            :action="imageUploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
            accept="image/*"
          >
            <img v-if="form.coverUrl" :src="form.coverUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
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
import { Plus, UploadFilled } from "@element-plus/icons-vue";
import { createVideo } from "@/api/videos";
import { getToken } from "@/utils/auth";

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

// 视频分类选项
const categories = ref([
  "三角函数",
  "数列",
  "圆锥曲线",
  "函数与导数",
  "空间向量与立体几何",
  "概率与统计",
]);

const videoUploadUrl = computed(() => "/api/v1/upload/video");
const imageUploadUrl = computed(() => "/api/v1/upload/image");
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${getToken()}`,
}));

const form = reactive({
  title: "",
  category: "三角函数",
  description: "",
  videoUrl: "",
  coverUrl: "",
});

const rules: FormRules = {
  title: [{ required: true, message: "请输入视频标题", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  videoUrl: [{ required: true, message: "请上传视频文件", trigger: "change" }],
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const isVideo = file.type.startsWith("video/");
  const isLt500M = file.size / 1024 / 1024 < 500;

  if (!isVideo) {
    ElMessage.error("只能上传视频文件!");
    return false;
  }
  if (!isLt500M) {
    ElMessage.error("视频大小不能超过 500MB!");
    return false;
  }
  return true;
};

const handleUploadSuccess = (response: any) => {
  form.videoUrl = response.data.url;
  ElMessage.success("视频上传成功");
};

const handleUploadError = () => {
  ElMessage.error("视频上传失败");
};

const beforeCoverUpload: UploadProps["beforeUpload"] = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return false;
  }
  return true;
};

const handleCoverSuccess = (response: any) => {
  form.coverUrl = response.data.url;
  ElMessage.success("封面上传成功");
};

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 映射字段名：videoUrl -> fileUrl, coverUrl -> thumbnailUrl
        const videoData = {
          title: form.title,
          category: form.category,
          description: form.description,
          fileUrl: form.videoUrl,
          thumbnailUrl: form.coverUrl,
        };
        await createVideo(videoData);
        ElMessage.success("上传成功");
        router.push("/videos");
      } catch (error) {
        ElMessage.error("上传失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

const resetForm = () => {
  formRef.value?.resetFields();
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.video-upload {
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

  .avatar-uploader {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: #409eff;
    }
  }
}
</style>
