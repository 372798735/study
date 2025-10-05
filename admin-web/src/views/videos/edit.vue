<template>
  <div class="video-edit">
    <el-card v-loading="pageLoading">
      <template #header>
        <div class="card-header">
          <span>编辑视频</span>
          <el-button type="text" @click="goBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入视频标题" />
        </el-form-item>

        <el-form-item label="视频分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入分类" />
        </el-form-item>

        <el-form-item label="视频描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入视频描述"
          />
        </el-form-item>

        <el-form-item label="视频时长" prop="duration">
          <el-input v-model="form.duration" placeholder="格式：10:30" />
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
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { getVideoById, updateVideo } from "@/api/videos";

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);
const pageLoading = ref(false);

const form = reactive({
  title: "",
  category: "",
  description: "",
  duration: "",
});

const rules: FormRules = {
  title: [{ required: true, message: "请输入视频标题", trigger: "blur" }],
  category: [{ required: true, message: "请输入分类", trigger: "blur" }],
};

const loadVideo = async () => {
  const id = route.params.id as string;
  pageLoading.value = true;
  try {
    const data = await getVideoById(Number(id));
    Object.assign(form, data);
  } catch (error) {
    ElMessage.error("加载失败");
    goBack();
  } finally {
    pageLoading.value = false;
  }
};

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const id = route.params.id as string;
        await updateVideo(Number(id), form);
        ElMessage.success("保存成功");
        router.push("/videos");
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
  loadVideo();
});
</script>

<style scoped lang="scss">
.video-edit {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
