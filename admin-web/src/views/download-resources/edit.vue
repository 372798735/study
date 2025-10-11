<template>
  <div class="download-resource-edit">
    <el-card v-loading="pageLoading">
      <template #header>
        <div class="card-header">
          <span>编辑资源</span>
          <el-button type="text" @click="goBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="资源标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入资源标题" />
        </el-form-item>

        <el-form-item label="资源描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入资源描述"
          />
        </el-form-item>

        <el-form-item label="文件类型" prop="fileType">
          <el-radio-group v-model="form.fileType">
            <el-radio value="word">Word文档</el-radio>
            <el-radio value="pdf">PDF文档</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="文档文件" prop="fileUrl">
          <el-upload
            class="upload-demo"
            drag
            :action="documentUploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :accept="acceptFileType"
            :show-file-list="false"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                支持
                {{ form.fileType === "pdf" ? "PDF" : "Word (DOC/DOCX)" }}
                格式，文件大小不超过 50MB
              </div>
            </template>
          </el-upload>
          <div v-if="form.fileUrl" class="file-preview">
            <el-tag type="success">文件已上传：{{ form.fileName }}</el-tag>
            <div class="file-info">
              <span>大小：{{ formatFileSize(form.fileSize) }}</span>
            </div>
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
import {
  getDownloadResource,
  updateDownloadResource,
} from "@/api/download-resources";
import { getToken } from "@/utils/auth";

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);
const pageLoading = ref(false);

const documentUploadUrl = computed(() => "/api/v1/upload/document");
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${getToken()}`,
}));

const acceptFileType = computed(() => {
  return form.fileType === "pdf"
    ? ".pdf"
    : ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
});

const form = reactive({
  title: "",
  description: "",
  fileType: "word" as "word" | "pdf",
  fileUrl: "",
  fileName: "",
  fileSize: 0,
});

const rules: FormRules = {
  title: [{ required: true, message: "请输入资源标题", trigger: "blur" }],
  fileType: [{ required: true, message: "请选择文件类型", trigger: "change" }],
  fileUrl: [{ required: true, message: "请上传文档文件", trigger: "change" }],
};

const loadResource = async () => {
  const id = route.params.id as string;
  pageLoading.value = true;
  try {
    const response = await getDownloadResource(Number(id));
    const resource = response.data;
    form.title = resource.title;
    form.description = resource.description || "";
    form.fileType = resource.fileType;
    form.fileUrl = resource.fileUrl;
    form.fileName = resource.fileName;
    form.fileSize = resource.fileSize || 0;
  } catch (error) {
    ElMessage.error("加载失败");
    goBack();
  } finally {
    pageLoading.value = false;
  }
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const isCorrectType =
    form.fileType === "pdf"
      ? file.type === "application/pdf"
      : file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const isLt50M = file.size / 1024 / 1024 < 50;

  if (!isCorrectType) {
    ElMessage.error(
      `请上传${form.fileType === "pdf" ? "PDF" : "Word"}格式的文件!`
    );
    return false;
  }
  if (!isLt50M) {
    ElMessage.error("文档大小不能超过 50MB!");
    return false;
  }
  return true;
};

const handleUploadSuccess = (response: any) => {
  form.fileUrl = response.data.url;
  form.fileName = response.data.originalName;
  form.fileSize = response.data.size;
  ElMessage.success("文档上传成功");
};

const handleUploadError = () => {
  ElMessage.error("文档上传失败");
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const id = route.params.id as string;
        const resourceData = {
          title: form.title,
          description: form.description,
          fileType: form.fileType,
          fileUrl: form.fileUrl,
          fileName: form.fileName,
          fileSize: form.fileSize,
        };
        await updateDownloadResource(Number(id), resourceData);
        ElMessage.success("保存成功");
        router.push("/download-resources");
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
  loadResource();
});
</script>

<style scoped lang="scss">
.download-resource-edit {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-form {
    max-width: 600px;

    .el-input,
    .el-select,
    .el-radio-group {
      width: 100%;
    }

    .el-textarea {
      width: 100%;
    }
  }

  .file-preview {
    margin-top: 10px;

    .file-info {
      margin-top: 8px;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
